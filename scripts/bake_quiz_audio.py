#!/usr/bin/env python3
"""Bake Daily News quiz mp3s with the locked Quiz Fish voice (not browser TTS)."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
QUIZ_VOICE = "02dd00b374cb4750b856c7394938d222"  # bank: Quiz
EMOTION = "[friendly teacher, warm and clear]"
LETTERS = "ABCDEFGHIJ"
MODEL = "s2.1-pro-free"


def fish_key() -> str:
    k = os.environ.get("FISH_API_KEY", "").strip()
    if k:
        return k
    env = Path.home() / ".hermes" / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("FISH_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("FISH_API_KEY missing")


def tts(text: str, out: Path, key: str) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and out.stat().st_size > 2000:
        print("skip", out.name)
        return
    body = {
        "text": f"{EMOTION} {text.strip()}",
        "reference_id": QUIZ_VOICE,
        "prosody": {"speed": 1.0, "volume": 0, "normalize_loudness": True},
        "format": "mp3",
        "sample_rate": 44100,
        "mp3_bitrate": 128,
        "latency": "normal",
        "normalize": True,
    }
    r = requests.post(
        "https://api.fish.audio/v1/tts",
        json=body,
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "model": MODEL,
        },
        timeout=120,
    )
    if r.status_code == 402:
        raise SystemExit("Fish wants money — stopping")
    r.raise_for_status()
    if len(r.content) < 500:
        raise SystemExit(f"tiny audio for {out}")
    out.write_bytes(r.content)
    print("ok", out.relative_to(ROOT), len(r.content))


def bake_day(day: str, key: str) -> None:
    data = json.loads((ROOT / "quizzes" / f"{day}.json").read_text(encoding="utf-8"))
    dest = ROOT / "audio" / day
    dest.mkdir(parents=True, exist_ok=True)
    for qi, q in enumerate(data["questions"]):
        tts(q["prompt"], dest / f"q{qi}.mp3", key)
        for ci, choice in enumerate(q["choices"]):
            tts(f"{LETTERS[ci]}. {choice}", dest / f"q{qi}c{ci}.mp3", key)
    n = len(list(dest.glob("*.mp3")))
    print(f"DAY {day} mp3={n}")


def main() -> None:
    days = sys.argv[1:] or ["2026-09-21"]
    key = fish_key()
    for day in days:
        bake_day(day, key)


if __name__ == "__main__":
    main()
