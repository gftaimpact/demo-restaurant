---
name: testes-unitarios
description: "Generates unit tests using the Wynxx MCP Server. Use this skill whenever the user asks to create unit tests for a file or class. Saves the tests in the tests/ directory."
tools:
  - wynxx/*
---

# Generate Unit Tests with Wynxx

You must generate unit tests for the requested code using the Wynxx MCP Server.

## Prerequisites (execute BEFORE calling run_tester)

1. **Authenticate**: Call `mcp_wynxx_authenticate` to ensure the session is active.
2. **Select LLM**: Call `mcp_wynxx_list_llms` to list available models.
   - Then, call `mcp_wynxx_set_llm` with the ID of an available model.
   - Preference: choose a GPT model (e.g., "GPT-5-chat") as it has better compatibility.
   - If no GPT is available, use Claude Sonnet.

## Instructions

1. Identify the file(s) the user wants to test
2. Detect the programming language and the appropriate testing framework:
   - Java -> JUnit 5
   - TypeScript/JavaScript -> Jest
   - Python -> pytest
   - C# -> xUnit
3. Read the file content(s) with `read_file`
4. Use the `mcp_wynxx_run_tester` tool with the following parameters:
   - `files`: array with the source files. **IMPORTANT**: Use `content` (file content) + `fileName` (file name) instead of `filePath`. The `filePath` parameter frequently fails with "CompletedWithErrors" when Wynxx cannot access the local file.
   - `testType`: "Unit"
   - `sourceCodeLanguage`: detected language
   - `testingFrameworks`: detected framework
   - `autoDiscovery`: false (use `true` only if the project has a complete structure accessible by Wynxx; in most cases, `false` avoids errors)
5. **Verify the result**: If the returned status is `"CompletedWithErrors"` or no tests were generated:
   - Try switching the LLM with `mcp_wynxx_set_llm` to another available model
   - Repeat the call to `mcp_wynxx_run_tester`
6. **Fix imports in the generated tests**: Wynxx may generate imports pointing to generic paths like `app.routes.docs`. Adjust to the actual module path in the project before saving.
7. **Fix attribute names**: Wynxx may generate attribute names without underscores (e.g., `ownerid` instead of `owner_id`). Adjust to the actual Python attribute names before saving.
8. Save each test file in the `tests/` directory
   - Maintain the folder structure corresponding to the source code
   - Use the language's naming convention:
     - Java: `UserServiceTest.java`
     - TypeScript: `userService.test.ts`
     - Python: `test_user_service.py`
     - C#: `UserServiceTests.cs`
9. Inform the user where the tests were saved and how to run them

## Troubleshooting

| Problem | Likely cause | Solution |
|---------|--------------|----------|
| "No LLM selected" | LLM was not configured | Call `list_llms` and then `set_llm` |
| "CompletedWithErrors" with 0 tokens | Incompatible LLM | Switch LLM (prefer GPT) |
| `filePath` doesn't work in `files` | Wynxx cannot access the local path | Use `content` + `fileName` instead of `filePath` |
| `autoDiscovery` fails | Incomplete or inaccessible project structure | Use `autoDiscovery: false` |
| Incorrect imports in tests | Wynxx doesn't know the actual project structure | Fix imports manually before saving |
| Attribute names without underscores | Wynxx removes underscores from Python names | Fix to actual names (e.g., `owner_id`) |
