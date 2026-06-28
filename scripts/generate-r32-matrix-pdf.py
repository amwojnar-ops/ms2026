from __future__ import annotations

import re
import unicodedata
from datetime import datetime
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A3, landscape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / "Typy 1_16.txt"
CORE = ROOT / "hso-core.js"
OUTPUT = ROOT / "output" / "pdf" / "typy-1-16-zestawienie.pdf"

MATCHES = [
    ("M1", "RPA", "KAN"), ("M2", "BRA", "JPN"),
    ("M3", "GER", "PAR"), ("M4", "NED", "MAR"),
    ("M5", "WKS", "NOR"), ("M6", "FRA", "SWE"),
    ("M7", "MEX", "EC"), ("M8", "ENG", "COD"),
    ("M9", "BEL", "SEN"), ("M10", "USA", "BIH"),
    ("M11", "ESP", "AUT"), ("M12", "POR", "CRO"),
    ("M13", "SUI", "ALG"), ("M14", "AUS", "EGY"),
    ("M15", "ARG", "RZP"), ("M16", "COL", "GHA"),
]


def parse_text_file() -> dict[str, list[str]]:
    source = SOURCE.read_text(encoding="utf-8")
    blocks = re.findall(
        r"^GRACZ:\s*(.+?)\r?\nRUNDA:.*?\r?\n---\r?\n(.*?)(?=\r?\nGRACZ:|\Z)",
        source,
        flags=re.MULTILINE | re.DOTALL,
    )
    players: dict[str, list[str]] = {}
    for name, body in blocks:
        scores = re.findall(r"\|\s*(\d+-\d+)", body)
        name = name.strip()
        if len(scores) != 16:
            raise ValueError(f"{name}: znaleziono {len(scores)}/16 typów")
        if name in players:
            raise ValueError(f"Powtórzony gracz: {name}")
        players[name] = scores
    return players


def project_players() -> set[str]:
    source = CORE.read_text(encoding="utf-8")
    return set(re.findall(r"\{name:'([^']+)',champ:", source))


def core_r32_tips(name: str) -> list[str] | None:
    source = CORE.read_text(encoding="utf-8")
    block = re.search(rf"^\s*'{re.escape(name)}':\{{([^}}]+)\}}", source, flags=re.MULTILINE)
    if not block:
        return None
    scores = re.findall(r"'\d+':'(\d+-\d+)'", block.group(1))
    return scores if len(scores) == 16 else None


def sort_key(name: str) -> str:
    normalized = name.replace("Ł", "L").replace("ł", "l")
    return "".join(
        char for char in unicodedata.normalize("NFD", normalized)
        if unicodedata.category(char) != "Mn"
    ).casefold()


def register_fonts() -> tuple[str, str]:
    regular = Path("C:/Windows/Fonts/arial.ttf")
    bold = Path("C:/Windows/Fonts/arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("MatrixRegular", str(regular)))
        pdfmetrics.registerFont(TTFont("MatrixBold", str(bold)))
        return "MatrixRegular", "MatrixBold"
    return "Helvetica", "Helvetica-Bold"


def generate(players: dict[str, list[str]]) -> None:
    expected = project_players()
    missing = sorted(expected - set(players), key=sort_key)
    for name in missing:
        scores = core_r32_tips(name)
        if scores:
            players[name] = scores

    missing = sorted(expected - set(players), key=sort_key)
    unknown = sorted(set(players) - expected, key=sort_key)
    if missing or unknown or len(players) != 24:
        raise ValueError(f"Niekompletny zestaw. Brakuje: {missing}; nieznani: {unknown}")

    regular, bold = register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    width, height = landscape(A3)
    page = canvas.Canvas(str(OUTPUT), pagesize=(width, height))
    page.setTitle("Typy 1/16 finału - zestawienie 24 graczy")
    page.setAuthor("Loża Ekspertów - MŚ 2026")

    navy = HexColor("#101A31")
    blue = HexColor("#1C315A")
    gold = HexColor("#E7B93F")
    line = HexColor("#CDD4E0")
    pale = HexColor("#F4F6FA")
    pale_blue = HexColor("#E9EEF7")
    muted = HexColor("#667085")
    white = HexColor("#FFFFFF")

    margin_x = 24
    top = height - 26
    page.setFillColor(navy)
    page.roundRect(margin_x, top - 42, width - 2 * margin_x, 42, 8, fill=1, stroke=0)
    page.setFillColor(gold)
    page.setFont(bold, 17)
    page.drawString(margin_x + 15, top - 20, "TYPY 1/16 FINAŁU")
    page.setFillColor(white)
    page.setFont(regular, 8)
    page.drawString(margin_x + 15, top - 33, "24 graczy · 16 meczów · wynik po 90 minutach")
    page.setFont(bold, 9)
    page.drawRightString(width - margin_x - 15, top - 25, "LOŻA EKSPERTÓW · MŚ 2026")

    table_top = top - 55
    footer_y = 24
    header_h = 55
    player_w = 105
    match_w = (width - 2 * margin_x - player_w) / 16
    row_h = (table_top - footer_y - header_h) / 24

    page.setFillColor(blue)
    page.rect(margin_x, table_top - header_h, player_w, header_h, fill=1, stroke=0)
    page.setFillColor(white)
    page.setFont(bold, 9)
    page.drawString(margin_x + 10, table_top - 32, "GRACZ")

    for index, (number, home, away) in enumerate(MATCHES):
        x = margin_x + player_w + index * match_w
        page.setFillColor(navy if index % 2 == 0 else blue)
        page.rect(x, table_top - header_h, match_w, header_h, fill=1, stroke=0)
        page.setFillColor(gold)
        page.setFont(bold, 7)
        page.drawCentredString(x + match_w / 2, table_top - 13, number)
        page.setFillColor(white)
        page.setFont(bold, 7.5)
        page.drawCentredString(x + match_w / 2, table_top - 29, home)
        page.setFont(regular, 6)
        page.drawCentredString(x + match_w / 2, table_top - 38, "vs")
        page.setFont(bold, 7.5)
        page.drawCentredString(x + match_w / 2, table_top - 49, away)

    ordered = sorted(players.items(), key=lambda item: sort_key(item[0]))
    for row_index, (name, scores) in enumerate(ordered):
        y = table_top - header_h - (row_index + 1) * row_h
        page.setFillColor(white if row_index % 2 == 0 else pale)
        page.rect(margin_x, y, width - 2 * margin_x, row_h, fill=1, stroke=0)
        page.setFillColor(pale_blue if row_index % 2 == 0 else white)
        page.rect(margin_x, y, player_w, row_h, fill=1, stroke=0)
        page.setFillColor(navy)
        page.setFont(bold, 8)
        page.drawString(margin_x + 8, y + row_h / 2 - 2.7, name)

        for col_index, result in enumerate(scores):
            x = margin_x + player_w + col_index * match_w
            page.setFillColor(navy)
            page.setFont(bold, 8)
            page.drawCentredString(x + match_w / 2, y + row_h / 2 - 2.7, result)

        page.setStrokeColor(line)
        page.setLineWidth(0.35)
        page.line(margin_x, y, width - margin_x, y)

    page.setStrokeColor(line)
    page.setLineWidth(0.5)
    for col in range(18):
        x = margin_x if col == 0 else margin_x + player_w + (col - 1) * match_w
        page.line(x, footer_y, x, table_top)
    page.line(width - margin_x, footer_y, width - margin_x, table_top)
    page.line(margin_x, table_top, width - margin_x, table_top)
    page.line(margin_x, footer_y, width - margin_x, footer_y)

    page.setFillColor(muted)
    page.setFont(regular, 7)
    page.drawString(margin_x, 11, "Zestawienie robocze · nieopublikowane")
    page.drawCentredString(width / 2, 11, f"Wygenerowano: {datetime.now().strftime('%d.%m.%Y %H:%M')}")
    page.drawRightString(width - margin_x, 11, "24 graczy · 384 typy")
    page.save()


if __name__ == "__main__":
    data = parse_text_file()
    generate(data)
    print(f"PDF={OUTPUT}")
    print(f"PLAYERS=24 MATCHES=16 CELLS=384")
