# DocFresh PRD

Status: in-progress

## Summary

DocFresh checks whether project documentation still matches the repository it describes. It compares README examples, documented scripts, file references, badges, and package metadata against the local checkout and produces a tight report.

## Problem

README drift makes developer tools feel abandoned. Agents also trust docs heavily, so stale commands or missing files can waste time or cause wrong actions.

## Users

- OSS maintainers who want a lightweight docs freshness gate.
- Developers preparing a release.
- Coding agents validating generated docs before publishing.

## MVP

- Scan markdown files for command blocks, file references, package script mentions, and local links.
- Verify package scripts and referenced files exist.
- Optionally run safe commands marked with a `docfresh: smoke` comment.
- Output text and JSON reports with actionable fixes.
- Fixture-backed tests for stale commands, missing files, and valid docs.

## Non-goals

- General grammar or style linting.
- Running arbitrary undocumented commands by default.
- Hosted link checking.

## Source Attribution

Inspired by markdown link checkers, README smoke tests, and docs-as-tests practices. Reframed for local developer-tool repos and agent-generated documentation.

