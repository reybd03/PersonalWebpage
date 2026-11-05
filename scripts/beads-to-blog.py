#!/usr/bin/env python3
"""
beads-to-blog.py
----------------
Generates Jekyll blog posts from closed beads issues for the weekly update.
Each post includes an explicit "Why this task / decision was made" section.

Source:  ~/dev/devlopment/.beads/issues.jsonl
Output:  _posts/<date>-<issue-id>-<slug>.md
"""

import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BEADS_JSONL = Path.home() / "dev/devlopment/.beads/issues.jsonl"
POSTS_DIR = Path("_posts")
DAYS_BACK = 7


def slugify(text: str) -> str:
    """Convert a title into a URL-safe slug."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def read_issues(path: Path):
    """Read JSONL beads issues file, skipping malformed lines."""
    issues = []
    if not path.exists():
        print(f"[WARN] {path} not found")
        return issues
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                issues.append(json.loads(line))
            except json.JSONDecodeError:
                print(f"[WARN] Skipping malformed line: {line[:80]}")
    return issues


def is_recently_closed(issue: dict, days: int) -> bool:
    """Return True if issue is closed and closed within the last N days."""
    if issue.get("status") != "closed":
        return False
    closed_at = issue.get("closed_at")
    if not closed_at:
        return False
    try:
        closed_dt = datetime.fromisoformat(closed_at.replace("Z", "+00:00"))
    except ValueError:
        return False
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    return closed_dt >= cutoff


def extract_why(issue: dict) -> str:
    """
    Build the 'Why this task / decision was made' narrative.

    Preference order:
    1. Explicit 'rationale' field on the issue (best practice).
    2. Derived from 'description' (problem/context) + 'close_reason' (resolution).
    """
    rationale = (issue.get("rationale") or "").strip()
    if rationale:
        return rationale

    description = (issue.get("description") or "").strip()
    close_reason = (issue.get("close_reason") or "").strip()

    parts = []
    if description:
        parts.append(f"Problem/context: {description}")
    if close_reason:
        parts.append(f"Resolution: {close_reason}")
    return " ".join(parts) if parts else "No rationale recorded."


def generate_post(issue: dict) -> Path:
    """Generate a single Jekyll post file from a beads issue and return its path."""
    issue_id = issue["id"]
    title = issue.get("title", issue_id)
    closed_at = issue.get("closed_at", datetime.now(timezone.utc).isoformat())

    try:
        post_date = datetime.fromisoformat(closed_at.replace("Z", "+00:00")).strftime("%Y-%m-%d")
    except ValueError:
        post_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    slug = f"{post_date}-{slugify(issue_id)}-{slugify(title)[:40]}"
    filename = POSTS_DIR / f"{slug}.md"

    why = extract_why(issue)
    description = issue.get("description", "")

    content = f"""---
layout: post
title: "{title}"
date: {post_date}
categories: [weekly-update, engineering]
tags: [beads, decision-rationale, "{issue_id}"]
issue_id: {issue_id}
---

# {title}

**Issue ID:** `{issue_id}`  
**Closed:** {post_date}

## What Was Done

{issue.get('close_reason', 'No close reason recorded.')}

## Why This Task / Decision Was Made

{why}

## Key Takeaway

This work was driven by the need to {description[:120]}...
"""

    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    filename.write_text(content, encoding="utf-8")
    return filename


def main():
    issues = read_issues(BEADS_JSONL)
    recent = [i for i in issues if is_recently_closed(i, DAYS_BACK)]

    if not recent:
        print(f"No recently closed issues found in the last {DAYS_BACK} days.")
        return

    print(f"Found {len(recent)} closed issue(s) in the last {DAYS_BACK} days.")
    for issue in recent:
        path = generate_post(issue)
        print(f"  -> {path}")


if __name__ == "__main__":
    main()
