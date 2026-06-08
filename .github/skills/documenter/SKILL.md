---
name: documenter
description:
  "Documents source code using the Wynxx MCP Server. Use this skill whenever the user asks to document a file or code snippet. Generates documentation in Markdown in the project's docs/ directory."
tools:
  - wynxx/*
---

# Document Code with Wynxx

You must document the requested code using the Wynxx MCP Server.

## Prerequisites (execute BEFORE calling run_documenter)

1. **Authenticate**: Call `mcp_wynxx_authenticate` to ensure the session is active.
2. **Select LLM**: Call `mcp_wynxx_list_llms` to list available models.
   - Then, call `mcp_wynxx_set_llm` with the ID of an available model.
   - Preference: choose a GPT model (e.g., "GPT-5-chat") as it has better compatibility with the documentation prompts.
   - If no GPT is available, use Claude Sonnet.

## Instructions

1. Identify the file or code the user wants to document
2. Detect the programming language of the source code
3. Read the file content with `read_file`
4. Use the `mcp_wynxx_run_documenter` tool with the following parameters:
   - **IMPORTANT**: Use `fileContent` (file content) + `fileName` (file name) instead of `filePath`. The `filePath` parameter frequently fails with "CompletedWithErrors" when Wynxx cannot access the local file.
   - `sourceCodeLanguage`: detected language (e.g., "Java", "TypeScript", "Python", "C#")
   - `responseLanguage`: "en-US"
   - `audience`: "Software Engineer"
   - `autoDiscovery`: false (use `true` only if the project has a complete structure accessible by Wynxx; in most cases, `false` avoids errors)
5. **Verify the result**: If the returned status is `"CompletedWithErrors"` or `generatedDocumentation` is `null`:
   - Try switching the LLM with `mcp_wynxx_set_llm` to another available model
   - Try switching the prompt with `mcp_wynxx_set_doc_prompt` to `"DocumentCode_V5_Extended"` or `"DocumentCode_V5"`
   - Repeat the call to `mcp_wynxx_run_documenter`
6. After receiving the generated documentation, save the result in a Markdown file in the `docs/` directory
   - Use the original file name as a base: e.g., `UserService.java` -> `docs/UserService.md`
   - If it's a folder, create corresponding subdirectories in `docs/`
7. If there is mermaid, validate the syntax and, if necessary, fix the diagram to ensure it renders correctly in Markdown. Wynxx sometimes generates mermaid syntax with small errors that prevent rendering.
8. Inform the user where the documentation was saved

## Troubleshooting

| Problem | Likely cause | Solution |
|---------|--------------|----------|
| "No LLM selected" | LLM was not configured | Call `list_llms` and then `set_llm` |
| "CompletedWithErrors" with 0 tokens | Incompatible LLM or prompt | Switch LLM (prefer GPT) and/or switch prompt |
| `filePath` doesn't work | Wynxx cannot access the local path | Use `fileContent` + `fileName` instead of `filePath` |
| `autoDiscovery` fails | Incomplete or inaccessible project structure | Use `autoDiscovery: false` |
