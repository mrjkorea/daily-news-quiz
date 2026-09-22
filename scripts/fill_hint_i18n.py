#!/usr/bin/env python3
"""Fill 15-language wrong-answer explanations on every news quiz JSON.

Questions and choices stay English. Only hintI18n is translated.
English source = hintI18n.en or hintKo (already English in current files).
"""
from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.request
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
NEED = [c for c in LANGS if c != "en"]
MODEL = "deepseek-flash"
BATCH = 6


def load_key() -> str:
    try:
        key = subprocess.check_output(
            ["security", "find-generic-password", "-s", "deepseek_api", "-w"],
            text=True,
        ).strip()
        if key:
            return key
    except Exception:
        pass
    for p in (
        Path.home() / ".hermes" / "profiles" / "research" / ".env",
        Path.home() / ".hermes" / ".env",
    ):
        if not p.exists():
            continue
        for line in p.read_text().splitlines():
            if line.startswith("DEEPSEEK_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("no DEEPSEEK_API_KEY")


def english_hint(q: dict) -> str:
    raw = q.get("hintI18n")
    i18n = raw if isinstance(raw, dict) else {}
    return str(i18n.get("en") or q.get("hintKo") or "").strip()


def needs_fill(q: dict) -> bool:
    src = english_hint(q)
    if not src:
        return True
    raw = q.get("hintI18n")
    i18n = raw if isinstance(raw, dict) else {}
    for loc in LANGS:
        val = str(i18n.get(loc) or "").strip()
        if not val:
            return True
        if loc == "en" and val != src:
            return True
        if loc != "en" and val == src:
            return True
    return False


def chat(key: str, payload: list[dict], model: str) -> list[dict]:
    body = {
        "model": model,
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You translate short ESL quiz explanations for a missed "
                    "multiple-choice question. Questions stay English; you "
                    "only translate the explanation. Return ONLY JSON: "
                    '{"items":[{"id":1,"hintI18n":{locale:text}}]}. '
                    "Locales required: " + ",".join(NEED) + ". "
                    "Keep each explanation 1-2 easy sentences. Do not "
                    "translate into English. Korean must use Hangul. "
                    "Chinese must be Simplified. Match the given English sense."
                ),
            },
            {
                "role": "user",
                "content": json.dumps({"items": payload}, ensure_ascii=False),
            },
        ],
    }
    req = urllib.request.Request(
        "https://api.deepseek.com/chat/completions",
        data=json.dumps(body).encode(),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + key,
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = json.loads(r.read().decode())
    text = raw["choices"][0]["message"]["content"]
    data = json.loads(text)
    items = data.get("items") if isinstance(data, dict) else data
    if not isinstance(items, list):
        raise RuntimeError("bad json shape")
    return items


def merge(q: dict, got: dict) -> None:
    src = english_hint(q)
    i18n = dict(q.get("hintI18n") or {})
    i18n["en"] = src
    incoming = got.get("hintI18n") if isinstance(got.get("hintI18n"), dict) else got
    for loc in NEED:
        val = str((incoming or {}).get(loc) or "").strip()
        if not val or val == src:
            continue
        i18n[loc] = val
    q["hintI18n"] = i18n
    q["hintKo"] = src


def main() -> None:
    key = load_key()
    patterns = sys.argv[1:] or ["20*.json"]
    files: list[Path] = []
    for pat in patterns:
        files.extend(sorted(p for p in QUIZZES.glob(pat) if p.is_file()))
    # de-dupe preserve order
    seen: set[Path] = set()
    uniq: list[Path] = []
    for path in files:
        if path not in seen:
            seen.add(path)
            uniq.append(path)
    files = uniq
    todo: list[tuple[Path, dict, dict, int]] = []
    for path in files:
        doc = json.loads(path.read_text(encoding="utf-8"))
        for qi, q in enumerate(doc.get("questions") or []):
            if isinstance(q, dict) and needs_fill(q):
                todo.append((path, doc, q, qi))
    print("QUIZZES", len(files), "HINTS_NEED", len(todo), flush=True)
    models = [MODEL, "deepseek-chat"]
    done = 0
    i = 0
    while i < len(todo):
        chunk = todo[i : i + BATCH]
        payload = []
        for idx, (_path, _doc, q, qi) in enumerate(chunk):
            payload.append(
                {
                    "id": idx,
                    "prompt": q.get("prompt") or "",
                    "en": english_hint(q),
                }
            )
        got = None
        last = None
        for model in models:
            for attempt in range(3):
                try:
                    got = chat(key, payload, model)
                    break
                except Exception as e:
                    last = e
                    time.sleep(2 * (attempt + 1))
            if got is not None:
                break
        if got is None:
            raise SystemExit(f"translate failed: {last}")
        by_id = {}
        for item in got:
            if isinstance(item, dict) and "id" in item:
                by_id[int(item["id"])] = item
        touched: dict[Path, dict] = {}
        for idx, (path, doc, q, _qi) in enumerate(chunk):
            item = by_id.get(idx)
            if not item:
                print("MISS", path.name, q.get("id"), flush=True)
                continue
            merge(q, item)
            if needs_fill(q):
                print("STILL_GAP", path.name, q.get("id"), flush=True)
            else:
                done += 1
            touched[path] = doc
        for path, doc in touched.items():
            path.write_text(
                json.dumps(doc, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        i += BATCH
        print("PROGRESS", min(i, len(todo)), "/", len(todo), "ok", done, flush=True)
        time.sleep(0.3)
    still = 0
    for path in files:
        doc = json.loads(path.read_text(encoding="utf-8"))
        for q in doc.get("questions") or []:
            if isinstance(q, dict) and needs_fill(q):
                still += 1
                print("GAP", path.name, q.get("id"), flush=True)
    print("FILL_HINT_I18N_DONE need_was", len(todo), "still", still, flush=True)
    if still:
        raise SystemExit(2)


if __name__ == "__main__":
    main()
