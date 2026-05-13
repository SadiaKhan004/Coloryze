
from fastapi import APIRouter, Request, HTTPException
import json
import asyncio

from app.ai.color_query_builder import build_color_queries
from app.ai.tools.parallel_search_tool import ParallelSearchTool
from app.ai.report_generator_agent import FinalAnswerTool

router = APIRouter()

# Initialize core tools - INCREASE TIMEOUT for batch processing
parallel_tool = ParallelSearchTool(max_results_per_query=2, scrape_timeout=40)  # Increased timeout
final_tool = FinalAnswerTool()


@router.post("/generate-report/")
async def generate_final_report(request: Request):
    """
    Full Coloryze pipeline:
    1. Build color-related queries
    2. Perform parallel web search + scraping concurrently
    3. Combine all text
    4. Generate final personalized report
    """
    try:
        data = await request.json()
        ai_result = data.get("ai_result", {})

        if not ai_result:
            raise HTTPException(status_code=400, detail="Missing AI result data.")

        print("\n🧠 Received ai_result:")
        print(ai_result)

        # Step 1: Build color queries
        queries = build_color_queries(ai_result)
        if not queries:
            raise HTTPException(status_code=400, detail="No valid color queries built.")

        print(f"\n🔍 Built {len(queries)} color queries.")
        for i, query in enumerate(queries, 1):
            print(f"  {i}. {query}")

        # Step 2: Run ALL searches in ONE concurrent batch 🚀
        print(f"\n🚀 Running ALL {len(queries)} searches in one concurrent batch...")
        
        # Pass ALL queries as a list to the parallel search tool
        search_result_str = await parallel_tool.forward(queries)
        
        try:
            search_result = json.loads(search_result_str)
        except Exception as e:
            print(f"❌ Failed to parse search result: {e}")
            raise HTTPException(status_code=500, detail="Search service error")

        # Check if we got any content
        if not search_result.get("combined_content"):
            print("❌ No content scraped from any query")
            raise HTTPException(status_code=404, detail="No text scraped from any query.")

        # Step 3: Use the combined content from ALL queries
        combined_corpus = search_result["combined_content"]
        successful_queries = search_result.get("successful_queries", [])
        total_sources = search_result.get("total_sources", 0)

        print(f"\n📚 Combined text length: {len(combined_corpus)} characters")
        print(f"✅ {len(successful_queries)}/{len(queries)} queries successful")
        print(f"🌐 {total_sources} total sources scraped")
        print("🧩 Generating final personalized report...\n")

        # Step 4: Generate final report
        final_output_str = final_tool.forward(scraped_text=combined_corpus, ai_result=ai_result)

        try:
            final_output = json.loads(final_output_str)
        except json.JSONDecodeError:
            print("❌ Failed to parse final output as JSON, using fallback")
            final_output = {
                "status": "error",
                "recommended_palette": {"main_colors": [], "neutrals": [], "metallics": []},
                "final_report": "Error generating report. Please try again."
            }

        # Step 5: Return final structured response
        final_report = final_output.get("final_report", "No report generated.")
        recommended_palette = final_output.get("recommended_palette", {})

        print("\n===============================")
        print(" FINAL COLORYZE REPORT PREVIEW")
        print("===============================")
        print(final_report[:800] if isinstance(final_report, str) else str(final_report)[:800])
        print("===============================\n")

        return {
            "status": "success",
            "recommended_palette": recommended_palette,
            "final_report": final_report,
            "successful_queries": len(successful_queries),
            "total_queries": len(queries),
            "total_sources": total_sources,
        }

    except Exception as e:
        print(f"🚨 Error in generate_final_report: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")