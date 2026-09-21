#!/usr/bin/env python3
"""Fail-closed: a news quiz is NOT done without Fish Quiz-host mp3s.

Jay 21 Sep 2026: missing audio → iPhone speechSynthesis woman voice.
"""
from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MIN_BYTES = 2000
LIVE = "https://mrjkorea.github.io/daily-news-quiz"


def check_day(day: str, live: bool) -> list[str]:
    errs: list[str] = []
    qj = ROOT / "quizzes" / f"{day}.json"
    if not qj.exists():
        return [f"{day}: missing quizzes/{day}.json"]
    data = json.loads(qj.read_text(encoding="utf-8"))
    nq = len(data.get("questions") or [])
    dest = ROOT / "audio" / day
    if not dest.is_dir():
        return [f"{day}: missing audio/{day}/ (JSON without host audio = woman TTS)"]
    need = []
    for qi, q in enumerate(data["questions"]):
        need.append(f"q{qi}.mp3")
        for ci in range(len(q.get("choices") or [])):
            need.append(f"q{qi}c{ci}.mp3")
    for name in need:
        p = dest / name
        if not p.exists() or p.stat().st_size < MIN_BYTES:
            errs.append(f"{day}: bad/missing {name}")
    if live:
        url = f"{LIVE}/audio/{day}/q0.mp3"
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=20) as r:
                code = r.status
        except Exception as e:
            errs.append(f"{day}: live HEAD {url} failed ({e})")
        else:
            if code != 200:
                errs.append(f"{day}: live audio HTTP {code} {url}")
    print(f"OK {day} questions={nq} clips={len(need)}" if not errs else f"FAIL {day}")
    return errs


def main() -> None:
    args = sys.argv[1:]
    live = False
    if args and args[0] == "--live":
        live = True
        args = args[1:]
    if not args:
        sys.exit("usage: verify_quiz_host.py [--live] YYYY-MM-DD [YYYY-MM-DD...]")
    bad: list[str] = []
    for day in args:
        bad.extend(check_day(day, live=live))
    if bad:
        print("QUIZ_HOST_FAIL")
        print("\n".join(bad))
        sys.exit(1)
    print("QUIZ_HOST_OK")


if __name__ == "__main__":
    main()
