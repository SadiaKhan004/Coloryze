
import jsPDF from "jspdf";

// Enhanced helper function to clean report text
const cleanReportText = (text) => {
  return text
    .replace(/[Ø=ÜÊß¨¯¡ÞÍª'(]/g, "") // remove unwanted symbols
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/\t/g, " ")
    .replace(/\r/g, "")
    .replace(/\*+/g, "")
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    // Fix spaced out characters like "N a t u r a l" -> "Natural"
    .replace(/(\w)\s+(?=\w\s+\w)/g, '$1')
    .replace(/\s+/g, " ") // collapse multiple spaces into one
    .trim();
};

// Extract key-value pairs from the color profile
const parseColorProfile = (text) => {
  const profile = {};
  const profileSection = text.match(/Your Color Profile(.*?)Understanding Your Season/s);
  
  if (profileSection) {
    const content = profileSection[1];
    profile.monkLevel = content.match(/Monk Skin Tone Level:\s*([^\n]+)/)?.[1]?.trim();
    profile.toneGroup = content.match(/Tone Group:\s*([^\n]+)/)?.[1]?.trim();
    profile.undertone = content.match(/Undertone:\s*([^\n]+)/)?.[1]?.trim();
    profile.hair = content.match(/Hair:\s*([^\n]+)/)?.[1]?.trim();
    profile.eyes = content.match(/Eyes:\s*([^\n]+)/)?.[1]?.trim();
    profile.season = content.match(/Season:\s*([^\n]+)/)?.[1]?.trim();
  }
  
  return profile;
};

// Extract sections with better handling
const parseReportSections = (text) => {
  const sections = [
    {
      title: "Understanding Your Season",
      pattern: /Understanding Your Season(.*?)(?:Your Perfect Color Palette|$)/s
    },
    {
      title: "Your Perfect Color Palette",
      pattern: /Your Perfect Color Palette(.*?)(?:Colors to Approach with Caution|Styling|$)/s
    },
    {
      title: "Colors to Approach with Caution",
      pattern: /(?:with Caution|Colors to Approach with Caution)(.*?)(?:Styling & Makeup|$)/s
    },
    {
      title: "Styling & Makeup Guidance",
      pattern: /Styling & Makeup Guidance(.*?)(?:Smart Shopping|$)/s
    },
    {
      title: "Smart Shopping Tips",
      pattern: /Smart Shopping Tips(.*?)(?:Final Color|$)/s
    },
    {
      title: "Final Color Confidence",
      pattern: /Final Color Confidence(.*?)(?:Recommended Palette|$)/s
    }
  ];

  const parsedSections = [];
  
  sections.forEach(({ title, pattern }) => {
    const match = text.match(pattern);
    if (match && match[1]) {
      const content = cleanReportText(match[1]);
      if (content.length > 10) {
        parsedSections.push({ title, content });
      }
    }
  });

  return parsedSections;
};

export const downloadReportPdf = (final_report, recommended_palette, username) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;

  // --- Cover Page ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(0, 102, 204);
  doc.text("COLORYZE", pageWidth / 2, 180, { align: "center" });


  doc.setFont("helvetica", "italic");
  doc.setFontSize(18);
  doc.setTextColor(80, 80, 80);
  doc.text("Discover Your True Colors", pageWidth / 2, 220, { align: "center" });

  if (username) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text(`User: ${username}`, pageWidth / 2, 280, { align: "center" });
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(120, 120, 120);
  doc.text("Personalized Color Analysis Report", pageWidth / 2, 250, { align: "center" });
  

  // Decorative elements
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 150, 290, pageWidth / 2 + 150, 290);

  doc.addPage();

  let y = margin;

  // --- Color Profile Section ---
  const profile = parseColorProfile(final_report);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 204);
  doc.text("Your Color Profile", margin, y);
  y += 25;

  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 150, y);
  y += 20;

  // Profile details in a structured format
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  const profileItems = [
    { label: "Monk Skin Tone Level:", value: profile.monkLevel },
    { label: "Tone Group:", value: profile.toneGroup },
    { label: "Undertone:", value: profile.undertone },
    { label: "Hair:", value: profile.hair },
    { label: "Eyes:", value: profile.eyes },
    { label: "Season:", value: profile.season }
  ];

  profileItems.forEach((item) => {
    if (item.value) {
      doc.setFont("helvetica", "bold");
      doc.text(item.label, margin, y);
      doc.setFont("helvetica", "normal");
      doc.text(item.value, margin + 150, y);
      y += 18;
    }
  });

  y += 30;

  // --- Main Content Sections ---
  const sections = parseReportSections(final_report);

  sections.forEach((section) => {
    // Check if we need a new page
    if (y > pageHeight - 150) {
      doc.addPage();
      y = margin;
    }

    // Section header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.text(section.title, margin, y);
    y += 20;

    // Underline
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 5, margin + 120, y - 5);
    y += 10;

    // Section content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setLineHeightFactor(1.5);

    const contentLines = doc.splitTextToSize(section.content, contentWidth);

    contentLines.forEach((line) => {
      if (y > pageHeight - margin - 20) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 15;
    });

    y += 20; // Space between sections
  });

  // --- Recommended Palette ---
  if (recommended_palette?.main_colors?.length) {
    if (y > pageHeight - 250) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("Recommended Palette", margin, y);
    y += 25;

    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 150, y);
    y += 30;

    const boxSize = 35;
    const colorsPerRow = 4;
    const gap = 30;
    const totalRowWidth = colorsPerRow * boxSize + (colorsPerRow - 1) * gap;
    const startX = margin + (contentWidth - totalRowWidth) / 2;

    recommended_palette.main_colors.forEach((color, i) => {
      const col = i % colorsPerRow;
      const row = Math.floor(i / colorsPerRow);

      const x = startX + col * (boxSize + gap);
      const yPos = y + row * 70;

      // Check for new page
      if (yPos > pageHeight - margin - 80) {
        doc.addPage();
        y = margin + 30;
        const newRow = i % colorsPerRow === 0 ? 0 : row;
        yPos = y + newRow * 70;
      }

      // Draw color box with shadow effect
      doc.setFillColor(220, 220, 220);
      doc.rect(x + 2, yPos + 2, boxSize, boxSize, "F");
      
      doc.setFillColor(color.hex);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(x, yPos, boxSize, boxSize, "FD");

      // Color name
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      
      const colorName = (color.name || color.hex).substring(0, 15);
      const textWidth = doc.getTextWidth(colorName);
      doc.text(colorName, x + (boxSize - textWidth) / 2, yPos + boxSize + 15);
    });
  }

  // Save the PDF
  doc.save("Coloryze_Personalized_Color_Report.pdf");
};