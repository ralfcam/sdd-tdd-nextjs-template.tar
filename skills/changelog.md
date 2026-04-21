---
description: Update CHANGELOG.md under Keep a Changelog when a feature is validated.
globs: ["CHANGELOG.md", "specs/features/**/*.md"]
---

# Skill: Update CHANGELOG

When a feature is validated (all scenarios PASSED), update CHANGELOG.md:

1. Add a new entry under `## [Unreleased]` (or the current version if releasing).
2. Format:
   ```markdown
   ### Added
   - Feature name: one-sentence description of what users can now do. (refs: specs/features/<feature>/)

   ### Changed
   - [if applicable]

   ### Fixed
   - [if applicable]
   ```
3. Keep entries concise — one line per feature or fix.
4. Never remove previous entries.
