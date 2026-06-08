```skill
---
name: code-review
description: "Performs automated code review on a GitHub Pull Request using the Wynxx MCP Server. Use this skill whenever the user asks to review a PR, do a code review, or analyze a pull request. Supports GitHub PR URLs or PR numbers."
tools:
  - wynxx/*
---

# Code Review with Wynxx

You must perform an automated code review on the requested Pull Request using the Wynxx MCP Server.

## Prerequisites (execute BEFORE calling run_full_review)

1. **Authenticate**: Call `mcp_wynxx_authenticate` to ensure the session is active.

## Extracting PR Information

From the user's message, extract:
- **Repository**: in `owner/repo` format (e.g., from `https://github.com/julioarruda/restaurant/pull/1` extract `julioarruda/restaurant`)
- **PR number**: the numeric ID of the pull request (e.g., `1`)

If the user provides only the PR number (without a repository), use the repository of the current project configured in the workspace.

## Instructions

1. Call `mcp_wynxx_set_repo` with the repository in `owner/repo` format
2. Call `mcp_wynxx_run_full_review` with the PR number as `pullRequestId`
   - This tool authenticates, starts the review, and waits for completion automatically
3. Present the results to the user:
   - If `results` is empty (`[]`) and `totalItemCount` is `0`: inform that no issues were found — the code is compliant
   - If `results` contains items: list each finding with file, line, severity, and description
   - Always inform the duration and number of tokens used

## Alternative (manual flow)

If `run_full_review` is not available or fails, use the manual flow:
1. Call `mcp_wynxx_set_pull_request` with the PR number
2. Call `mcp_wynxx_start_review` with the PR number
3. Call `mcp_wynxx_monitor_job` with the returned `jobId` to wait for completion
4. Present the results as above

## Presenting Results

| Field | Description |
|-------|-------------|
| `status` | Final job status (`Completed`, `CompletedWithErrors`, etc.) |
| `totalItemCount` | Total number of issues found |
| `results` | List of findings (file, line, severity, message) |
| `duration` | Time taken to complete the review |
| `inputToken` / `outputToken` | LLM tokens consumed |

## Troubleshooting

| Problem | Likely cause | Solution |
|---------|--------------|----------|
| "No repository set" | `set_repo` was not called | Call `mcp_wynxx_set_repo` first |
| Review returns 0 results but fails | PR may be empty or already merged | Verify the PR status on GitHub |
| `run_full_review` times out | Large PR with many files | Increase `timeoutSeconds` (e.g., 600) |
| Authentication error | Session expired | Call `mcp_wynxx_authenticate` again |
```
