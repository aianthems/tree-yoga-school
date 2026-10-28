"""Render the public historical transcription from reviewed non-personal fixture fields.

Requires reportlab. No source scan, owner/nominator columns, private directions,
contact details, or individual tree coordinates are read by this renderer.
"""
import csv
from collections import defaultdict
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle

pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold', italic='DejaVuSans', boldItalic='DejaVuSans-Bold')
ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/data/mississippi-champions-2000-transcription.pdf'
W, H = 792, 612
INK, GREEN, PALE = HexColor('#203b30'), HexColor('#345a43'), HexColor('#f0f4ed')
STYLE = ParagraphStyle('body', fontName='DejaVuSans', fontSize=12, leading=19, textColor=INK)
CELL = ParagraphStyle('cell', fontName='DejaVuSans', fontSize=7, leading=9, textColor=INK)


def text(c, content, x, top, width, style=STYLE):
    paragraph = Paragraph(content, style)
    _, height = paragraph.wrap(width, H)
    paragraph.drawOn(c, x, top-height)
    return top-height-16


def header(c, title, subtitle, page):
    c.setFillColor(GREEN)
    c.rect(0, H-12, W, 12, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont('DejaVuSans-Bold', 18)
    c.drawString(36, H-48, title)
    c.setFont('DejaVuSans', 9)
    c.drawString(36, H-66, subtitle)
    c.setFont('DejaVuSans', 8)
    c.drawString(36, 24, 'Tree Yoga School | Historical source transcription | Current tree status and access unverified')
    c.drawRightString(W-36, 24, str(page))


def main():
    grouped = defaultdict(list)
    for row in csv.DictReader((ROOT/'scripts/fixtures/mississippi-champions-2000.psv').open(), delimiter='|'):
        grouped[int(row['page'])].append(row)
    c = canvas.Canvas(str(DEST), pagesize=(W,H), invariant=1)
    c.setTitle('Mississippi champion trees - reviewed transcription of October 2000 register')
    c.setAuthor('Tree Yoga School')
    c.setSubject('Historical records from MFC Publication #35; not a current register or original scan')
    header(c, 'Mississippi champion trees', 'Reviewed historical transcription of MFC Publication #35, revised October 2000', 1)
    y=H-115
    for content in [
        '<b>This is a Tree Yoga School transcription, not the original scanned publication.</b>',
        'It reproduces species, measurements, published points, county and designation fields from the historical tables. Owner and nominator columns, photographs, personal contact information and private directions are omitted.',
        '<b>163 historical source rows</b> are transcribed from original PDF pages 3-10. The introduction reports 164 champions; no missing record has been invented. Two rows appear to repeat the same tree under different headings and remain cross-referenced in the map.',
        'Champion labels describe the October 2000 publication. Individual measurement dates are not supplied. Current survival, condition, champion standing, ownership and visiting access are unverified. County markers on the map are approximate areas, not tree locations.',
        'Prepared October 28, 2026 from the scan supplied by the Mississippi Forestry Commission coordinator on October 21, 2026. The reviewed transcription and import audit are versioned with the Tree Yoga School source code.'
    ]:
        y=text(c,content,36,y,W-72)
    c.showPage()
    header(c, 'Reading this historical transcription', 'Original source-page numbers are preserved: tables occupy pages 3-10 in this document.', 2)
    y=H-110
    for content in [
        '<b>Units:</b> circ. and crown use feet-inches (for example, 6-8 means 6 feet 8 inches). Height is in feet. Points are printed scores, retained unchanged. The map also converts circumference to inches and crown spread to decimal feet.',
        '<b>Designation:</b> unstarred rows are state champions in the historical register; * means state co-champion; ** means national champion; *** means national co-champion. These are dated source designations, not verified current titles.',
        '<b>Names:</b> common names combine printed row names with section headings. Botanical names retain the source spelling, including apparent errors. A row spelling is not a modern identification.',
        '<b>Source issues:</b> Rusty Blackhaw (page 3, row 11) and Rusty Viburnum (page 10, row 7) appear to duplicate one source tree. The Durand Oak printed score differs from its measurement total. Botanical-name anomalies and conflicting introductory/photo-caption measurements are explained in the map notes.',
        '<b>Selection:</b> cover, introduction, photographs, nomination instructions and the list of species without champions are not additional tree records. The 2024 national-register Roughleaf Dogwood in Tunica County is a separate source and is not included in these historical tables.',
        '<b>Publication schedule:</b> an updated state register was being prepared for after the start of 2027, according to the coordinator on October 21, 2026. No firm release date was given.'
    ]:
        y=text(c,content,36,y,W-72)
    c.showPage()
    widths=[22,152,196,57,57,37,52,69]
    for page in range(3,11):
        rows=grouped[page]
        header(c, f'Historical table - original source page {page}', f'October 2000 register | {len(rows)} source rows | Reviewed transcription; owner and nominator columns omitted', page)
        data=[['Mark','Common name','Botanical name as printed','Circ. ft-in','Crown ft-in','Ht. ft','Points','County']]
        for row in rows:
            values=[row['designation'],row['commonName'],row['scientificName'],row['circumferenceFtIn'],row['crownFtIn'],row['heightFt'],row['points'],row['county']]
            data.append([Paragraph(escape(value), CELL) for value in values])
        table=Table(data,colWidths=widths,repeatRows=1)
        table.setStyle(TableStyle([
            ('BACKGROUND',(0,0),(-1,0),GREEN),('TEXTCOLOR',(0,0),(-1,0),white),
            ('FONTNAME',(0,0),(-1,0),'DejaVuSans-Bold'),('FONTSIZE',(0,0),(-1,0),8),
            ('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),4),
            ('ROWBACKGROUNDS',(0,1),(-1,-1),[white,PALE]),('LINEBELOW',(0,0),(-1,0),0.5,GREEN),
        ]))
        _,height=table.wrap(W-72,H-120)
        assert height < H-120, (page,height)
        table.drawOn(c,36,H-85-height)
        c.showPage()
    c.save()
    print(DEST)


if __name__=='__main__':
    main()
