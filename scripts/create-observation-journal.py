"""Rebuild the handwritten journal. Requires reportlab; output is a site asset."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter

output = Path(__file__).resolve().parents[1] / 'public/printables/return-to-your-tree-journal.pdf'
output.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(output), pagesize=letter, invariant=1)
c.setTitle('Return to Your Tree - Observation Journal')
c.setAuthor('Tree Yoga School - Alex Julian')
ink, rule = HexColor('#173329'), HexColor('#b2bdb5')
c.setFillColor(ink)
def text(x,y,s,size=10,font='Helvetica'):
    c.setFont(font,size); c.drawString(x,y,s)
def line(y,x1=42,x2=570):
    c.setStrokeColor(rule); c.setLineWidth(.5); c.line(x1,y,x2,y)
text(42,750,'TREE YOGA SCHOOL  /  ONE TREE, FOUR VISITS',9)
text(42,718,'Return to your tree.',30,'Times-Roman')
text(42,695,'Observe first. Record what you see. Let a small note be enough.',10)
text(42,672,'My tree / species if known:'); line(669,175)
text(42,649,'General place / viewpoint:'); line(646,175)
for n in range(4):
    top=626-n*121
    line(top)
    text(42,top-18,f'Visit {n+1}',13,'Times-Roman')
    text(102,top-18,'Date / time:',9); line(top-21,155,330)
    text(350,top-18,'Weather:',9); line(top-21,400,570)
    text(42,top-37,'What I notice - buds, foliage, bark, fruits, ground, or wildlife:',9)
    line(top-53)
    text(42,top-70,'One change / one continuity / not sure:',9)
    line(top-86)
    text(42,top-103,'How I feel / one question for next time:',9)
    line(top-117)
c.setStrokeColor(rule); c.rect(42,66,528,60,fill=0,stroke=1)
text(50,111,'A detail to sketch / a possible next visit:',9)
text(42,47,'Use a permitted viewpoint. Leave the tree undisturbed. Keep private locations private.',8)
text(42,33,'treeyogaschool.com/return-to-your-tree',8)
c.showPage(); c.save()
print(output)
