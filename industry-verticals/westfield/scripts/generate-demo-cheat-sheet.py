"""Regenerate the three-page Kindle sheet from the presenter's collapsed summaries."""

import hashlib
import json
import subprocess
from html import escape
from pathlib import Path

import reportlab
from reportlab.lib.colors import black
from reportlab.lib.pagesizes import A5
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads(subprocess.check_output(['node', str(ROOT / 'scripts/demo-cheat-sheet.mjs'), 'export']))
FLOWS = {flow['code']: flow for flow in DATA['flows']}
if list(FLOWS) != ['B1'] + [f'P{i}' for i in range(1, 8)]:
    raise RuntimeError('Demo loops changed. Update the three-page grouping before regenerating the sheet.')
OUTPUT = ROOT / 'public/demo/westfield-demo-cheat-sheet.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
WIDTH, HEIGHT = A5
MARGIN = 23
BODY_SIZE = 12.1
LEADING = 14.2
FONT_DIR = Path(reportlab.__file__).parent / 'fonts'
for name, filename in [('CheatSheet', 'Vera.ttf'), ('CheatSheet-Bold', 'VeraBd.ttf'),
                       ('CheatSheet-Italic', 'VeraIt.ttf'), ('CheatSheet-BoldItalic', 'VeraBI.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily('CheatSheet', normal='CheatSheet', bold='CheatSheet-Bold',
                             italic='CheatSheet-Italic', boldItalic='CheatSheet-BoldItalic')


def plain(text):
    return (text.replace('\u2018', "'").replace('\u2019', "'")
            .replace('\u201c', '"').replace('\u201d', '"')
            .replace('\u2013', '-').replace('\u2014', '-')
            .replace('\u2011', '-').replace('\u2192', '>').replace('\u00b7', '/'))


def safe(text):
    return escape(plain(text))


PDF = canvas.Canvas(str(OUTPUT), pagesize=A5, pageCompression=1, invariant=1)
PDF.setTitle('Westfield live demo - Kindle cheat sheet')
PDF.setAuthor('Sitecore')
PDF.setCreator('Sitecore presenter guide')
PDF.setSubject('Collapsed presenter summaries and key cues. Source ' + DATA['sourceHash'][:12])
PDF.setKeywords('Westfield, presenter, Kindle, cheat sheet')
BOTTOMS = []


class Page:
    def __init__(self, number, title, subtitle=None):
        self.number = number
        self.y = HEIGHT - MARGIN
        self.write('WESTFIELD / LIVE DEMO', size=10.5, leading=12, bold=True, after=5)
        self.write(safe(title), size=19, leading=21, bold=True, after=5)
        if subtitle:
            self.write(safe(subtitle), size=10.7, leading=12.5, after=8)

    def write(self, text, size=BODY_SIZE, leading=LEADING, bold=False, after=3):
        style = ParagraphStyle('text', fontName='CheatSheet-Bold' if bold else 'CheatSheet', fontSize=size,
                               leading=leading, textColor=black, spaceBefore=0, spaceAfter=0,
                               allowWidows=0, allowOrphans=0)
        paragraph = Paragraph(text, style)
        _, height = paragraph.wrap(WIDTH - 2 * MARGIN, 10000)
        if self.y - height < MARGIN + 17:
            raise RuntimeError(f'Page {self.number} overflows by {MARGIN + 17 - (self.y - height):.1f} points. Shorten cues before reducing type.')
        paragraph.drawOn(PDF, MARGIN, self.y - height)
        self.y -= height + after

    def section(self, code, label, slide):
        self.y -= 3
        heading = (f'{safe(code)} / {safe(label)} <font size="10">(slide {slide})</font>'
                   if code.startswith(('P', 'B')) else f'Slides {slide} / {safe(label)}')
        self.write(heading, size=14,
                   leading=16, bold=True, after=3)

    def step(self, step):
        self.write(f'<b>{safe(step["id"])}</b>  {safe(step["title"])}', after=2)

    def cue(self, text):
        self.write(f'<i>{text}</i>', size=11.7, leading=13.8, after=4)

    def finish(self):
        BOTTOMS.append(round(self.y, 1))
        PDF.setLineWidth(0.5)
        PDF.line(MARGIN, MARGIN + 10, WIDTH - MARGIN, MARGIN + 10)
        PDF.setFont('CheatSheet', 9)
        PDF.drawString(MARGIN, MARGIN - 2, 'Presenter reference / full click paths and copy cards in /demo')
        PDF.drawRightString(WIDTH - MARGIN, MARGIN - 2, f'{self.number} / 3')
        PDF.showPage()


page = Page(1, 'Make the visit relevant')
page.section('B1', 'Brand guidance', 5)
for step in FLOWS['B1']['steps']:
    page.step(step)
page.cue('Brand Context: Westfield/task knowledge. Brand Kit: writing guidance. Copilot uses the site kit.')
for code, label, slide in [('P1', 'Familiar Home', 6), ('P2', 'Browsing interest', 7), ('P3', 'Campaign context', 8), ('P4', 'Known customer information', 9)]:
    page.section(code, label, slide)
    for step in FLOWS[code]['steps']:
        page.step(step)
    if code == 'P1':
        pass  # The standard hero is named in P4.3's web steps.
    elif code == 'P2':
        page.cue('Wait for each VIEW: 1 Auto + 2 Home. Home leads; the Home hero changes.')
    elif code == 'P3':
        pass  # The P3 summary already states the matching campaign outcome.
    elif code == 'P4':
        casey = safe(FLOWS[code]['copy']['Casey email and password'])
        jordan = safe(FLOWS[code]['copy']['Jordan email and password'])
        page.cue(f'{casey} / {jordan}. Email = password. False: paperless; true: coverage. Campaign first; affinity checks Home. Restore Original.')
page.finish()

page = Page(2, 'Create and publish useful advice', 'Slide 10 / P5 / 10 minutes')
copy = FLOWS['P5']['copy']
page.cue(f'<b>{safe(copy["Article page name"])}</b> / <b>{safe(copy["Article title"])}</b> / Topic: Home. Use web copy cards.')
for step in FLOWS['P5']['steps']:
    page.step(step)
    if step['id'] == 'P5.2.1':
        page.cue('Image: Family at home / HomePageHero (Westfield).')
    elif step['id'] == 'P5.3.1-ai':
        page.cue('Use the Westfield site kit. Review claims, then Keep optimized.')
    elif step['id'] == 'P5.3.1-add':
        page.cue(f'Section: <b>{safe(copy["New Section name"])}</b>. Picker: Section or Action. Reorder with Move up.')
    elif step['id'] == 'P5.4.1-approve':
        page.cue('Draft &gt; Awaiting approval &gt; Approved. Wait for publication.')
    elif step['id'] == 'P5.4.3':
        page.cue(f'Search: <b>{safe(copy["Article body search"])}</b>. Approved advice is live and discoverable.')
page.finish()

page = Page(3, 'Review and reuse content', 'Slides 11-18 / retain the final 10 minutes for questions')
page.section('11-13', 'Choose a useful measure', '11-13')
page.write('Recap interests, campaign context, and known facts. Website views and clicks differ from confirmed paperless enrollment. Ask which outcomes and websites Westfield wants to compare.', after=7)
page.section('P6', 'AI-search content review', 14)
for step in FLOWS['P6']['steps']:
    page.step(step)
page.cue('Separate Prospera Bank example: Cards / Description. Show live content &gt; Scroll to content. Review the suggestion in context. Leave Apply, Dismiss, and Publish unused.')
page.section('P7', 'Shared website and app content', 15)
for step in FLOWS['P7']['steps']:
    page.step(step)
page.cue('Article: "Property Insurance Claims Checklist: What To Do Before and After a Loss." Paste prepared headers/query into the built-in explorer and Execute Query. Match title, summary, and image. Reuse one approved item in a future mobile app.')
page.section('16-18', 'Westfield\'s next question', '16-18')
page.write('<b>Underwriting:</b> ask for one question, its state/insurance type, and trusted documents. Plan a separate product discussion.', after=6)
page.write('<b>Ask:</b> "Which Sitecore capability would you like to explore further?"', after=6)
page.write('<b>Questions:</b> keep minutes 50-60 for discussion. Capture the product question a follow-up should answer.', after=0)
page.finish()
PDF.save()

manifest = {
    'sourceHash': DATA['sourceHash'],
    'pdfHash': hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),
    'pages': 3,
    'summaryCount': sum(len(flow['steps']) for flow in DATA['flows']),
}
(ROOT / 'scripts/demo-cheat-sheet.manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Generated 3-page Kindle sheet with {manifest["summaryCount"]} current guide summaries. Page bottoms: {BOTTOMS}')
