from sqlalchemy.orm import Session
from app.models.reports import Report
from app.models.color_pallete import ColorPalette

def save_report(db: Session, user_id: int, report_data: dict):
    report = Report(user_id=user_id, report_data=report_data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def save_color_palette(db: Session, user_id: int, palette_data: dict):
    palette = ColorPalette(user_id=user_id, palette=palette_data)
    db.add(palette)
    db.commit()
    db.refresh(palette)
    return palette
