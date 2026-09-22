#!/usr/bin/env python3
"""Fail if any quiz is missing 15-language explanations."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUIZZES = ROOT / "quizzes"
LANGS = [
    "en",
    "ko",
    "zh-Hans",
    "ja",
    "es",
    "hi",
    "de",
    "vi",
    "pt-BR",
    "id",
    "fr",
    "ar",
    "tr",
    "it",
    "pl",
]


def main() -> None:
    files = sorted(p for p in QUIZZES.glob("20*.json") if p.is_file())
    gaps = 0
    for path in files:
        doc = json.loads(path.read_text(encoding="utf-8"))
        for q in doc.get("questions") or []:
            i18n = q.get("hintI18n") if isinstance(q.get("hintI18n"), dict) else {}
            en = str(i18n.get("en") or q.get("hintKo") or "").strip()
            if not en:
                print("NO_EN", path.name, q.get("id"))
                gaps += 1
                continue
            for loc in LANGS:
                val = str(i18n.get(loc) or "").strip()
                if not val:
                    print("MISSING", path.name, q.get("id"), loc)
                    gaps += 1
                elif loc != "en" and val == en:
                    print("ENGLISH_LEAK", path.name, q.get("id"), loc)
                    gaps += 1
    if gaps:
        print(f"QUIZ_I18N_FAIL gaps={gaps} files={len(files)}")
        raise SystemExit(2)
    print(f"QUIZ_I18N_OK files={len(files)} langs={len(LANGS)}")


if __name__ == "__main__":
    main()
