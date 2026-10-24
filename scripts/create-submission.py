"""Build a compact submission PDF from real screenshots and recorded test output."""
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT.parent / 'Submission'
OUTPUT.mkdir(exist_ok=True)
REPOSITORY = 'https://github.com/dbaldsin/hw_lab_dbaldsin/tree/hw_lab7_Arbeit'


def add_text_page(document, heading, paragraphs):
    """Place wrapped paragraphs on a letter page with a consistent readable margin."""
    page = document.new_page(width=612, height=792)
    page.insert_text((44, 58), heading, fontsize=20, color=(0.05, 0.25, 0.5))
    y = 94
    for paragraph in paragraphs:
        remaining = page.insert_textbox(fitz.Rect(44, y, 568, y + 140), paragraph, fontsize=11, lineheight=1.45)
        if remaining < 0:
            raise ValueError('Submission paragraph does not fit.')
        # Count wrapped lines conservatively, then retain paragraph spacing.
        lines = sum(max(1, (len(line) + 84) // 85) for line in paragraph.splitlines())
        y += lines * 17 + 20
    return page


def build():
    """Create a cover, actual screenshot pages, and verbatim verification evidence."""
    document = fitz.open()
    page = add_text_page(document, 'Lab 07 - Arbeit Task Manager', [
        'Dion Baldsing | Andrew ID: dbaldsin\nPlatform: React Native (Expo SDK 58 + TypeScript)',
        'GitHub repository and required branch:\n' + REPOSITORY,
        'The app provides a real-time task list, task creation, editing, completion toggles, due dates and confirmed deletion. Data is stored in the tasks collection in Cloud Firestore. The model, shared provider and views are organized separately.',
        'Resource use: one Firestore snapshot subscription, a virtualized FlatList, no polling or analytics. Development commands use one Metro worker; Jest runs serially.',
        'Evidence below is captured from the actual React Native web preview. The web preview uses an ISO date text field; iOS and Android use their native date picker. Native bundle exports were checked, but native runtime was not verified.',
    ])
    page.insert_link({'kind': fitz.LINK_URI, 'from': fitz.Rect(44, 163, 568, 213), 'uri': REPOSITORY})
    for image in sorted((ROOT / 'screenshots').glob('*.jpg')):
        page = document.new_page(width=612, height=792)
        title = image.stem.replace('-', ' ').replace('_', ' ')
        page.insert_text((44, 44), title, fontsize=16, color=(0.05, 0.25, 0.5))
        page.insert_image(fitz.Rect(44, 65, 568, 745), filename=str(image), keep_proportion=True)
        page.insert_text((44, 770), 'Lab 07 | React Native | dbaldsin', fontsize=9, color=(0.4, 0.4, 0.4))
    text = (ROOT / 'evidence/model-tests.txt').read_text()
    add_text_page(document, 'Recorded verification results', [
        (ROOT / 'VERIFICATION.md').read_text().replace('# Verification record', '').strip(),
        'Actual Jest output:\n' + text.strip(),
    ])
    destination = OUTPUT / 'Lab07_dbaldsin_ReactNative.pdf'
    document.save(destination, garbage=4, deflate=True)
    document.close()
    print(destination)


if __name__ == '__main__':
    build()
