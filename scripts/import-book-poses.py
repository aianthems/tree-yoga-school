import fitz,json,re,hashlib,sys
from pathlib import Path
if len(sys.argv) != 2: raise SystemExit('Usage: python scripts/import-book-poses.py BOOK.pdf')
book=Path(sys.argv[1]);doc=fitz.open(book);poses=[];current=None
for i in range(39,85):
 for block in doc[i].get_text('dict')['blocks']:
  spans=[s for line in block.get('lines',[]) for s in line['spans'] if s['size']>10]
  if not spans: continue
  text=' '.join(' '.join(s['text'].split()) for s in spans)
  if all('Bold' in s['font'] for s in spans):
   if text=='The Poses': continue
   slug=re.sub(r'[^a-z0-9]+','-',text.lower().replace('’s','').replace("'s",'')).strip('-')
   current={'title':text,'slug':slug,'pdfPage':i+1,'printedPage':i-4,'endPdfPage':i+1,'paragraphs':[]};poses.append(current)
  elif current:
   current['endPdfPage']=i+1
   if current['paragraphs'] and not re.search(r'[.!?…][”’"]?$',current['paragraphs'][-1]):current['paragraphs'][-1]+=' '+text
   else:current['paragraphs'].append(text)
assert len({p['slug'] for p in poses})==len(poses)
assert all(p['paragraphs'] for p in poses)
root=Path(__file__).resolve().parents[1];(root/'lib/book-pose-records.json').write_text(json.dumps({'poses':poses},ensure_ascii=False,indent=2)+'\n')
audit={'source':'https://media.aianthems.com/books/tree-yoga-school/tree-yoga-school-ebook.pdf','sourceSha256':hashlib.sha256(book.read_bytes()).hexdigest(),'pdfPages':[40,85],'printedPages':[35,80],'poseCount':len(poses),'headings':[p['title'] for p in poses],'method':'Every 13-point bold pose heading in The Poses section; body text extracted in reading order, page footers omitted, line wrapping normalized, continued paragraphs joined. Original names and wording retained.'}
(root/'scripts/fixtures/book-poses-source.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print('Extracted',len(poses),'poses');print('paragraphs',sum(len(p['paragraphs']) for p in poses))
