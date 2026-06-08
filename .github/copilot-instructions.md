# Workshop TDC - Copilot Instructions

## MCP Server Wynxx

This project uses the **Wynxx** MCP Server to automate software engineering tasks.
The Wynxx server is configured in `.vscode/mcp.json` and should be used for:

- **Code documentation**: Use the `run_documenter` tools from Wynxx
- **Test generation**: Use the `run_tester` tool from Wynxx
- **Code Review**: Use the `run_full_review` tool from Wynxx for GitHub Pull Request reviews. The default repository is `julioarruda/restaurant` — when the user provides only a PR number, always use this repo without asking.
- **Backlogs and Work Items**: Use the `list_projects`, `list_backlogs`, `get_backlog`, `get_work_item` tools from Wynxx

## Project Conventions

- Generated documentation must be saved in the `docs/` directory
- Generated tests must be saved in the `tests/` directory
- Default language for documentation: **en-US**
- Default audience for documentation: **Software Engineer**
- Documentation format: **Markdown**
- Diagram format: **Mermaid**
