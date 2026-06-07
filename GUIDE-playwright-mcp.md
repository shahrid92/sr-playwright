# Playwright MCP with Claude Code — Setup & Usage Guide

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) servers let Claude interact directly with tools and environments. The **Playwright MCP server** gives Claude browser automation capabilities — navigating pages, clicking, typing, taking snapshots, inspecting network requests, and more — all through natural language.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [VSCode (.vscode/settings.json)](#vscode-vscodesettingsjson)
  - [Claude Desktop App](#claude-desktop-app)
- [Verifying It Works](#verifying-it-works)
- [Available Tools & Usage Patterns](#available-tools--usage-patterns)
  - [Navigation & Exploration](#navigation--exploration)
  - [Form Interaction](#form-interaction)
  - [Content Extraction](#content-extraction)
  - [Network Debugging](#network-debugging)
  - [Advanced](#advanced)
- [Example Workflows](#example-workflows)
  - [1. Create a Test File from Scratch](#1-create-a-test-file-from-scratch)
  - [2. Debug a Failing Test](#2-debug-a-failing-test)
  - [3. Investigate Network Behavior](#3-investigate-network-behavior)
- [Common Pitfalls & Troubleshooting](#common-pitfalls--troubleshooting)
- [Tips for Effective Use](#tips-for-effective-use)

---

## Prerequisites

- **Node.js 18+** installed (`node --version`)
- **Claude Code** installed (as a CLI, IDE extension, or desktop app)
- A **Playwright project** with `package.json` (optional but recommended — the MCP server works standalone too)

---

## Installation

The Playwright MCP server is distributed as an npm package. No explicit install needed if using `npx` — it fetches on demand.

```bash
# Verify npx is available
npx --version

# The MCP server runs via:
npx @playwright/mcp@latest
```

That's it. The server starts on port **31000** by default and launches its own Chromium browser instance internally (separate from your project tests).

---

## Configuration

### VSCode (.vscode/settings.json)

Add this to `.vscode/settings.json` in your project root:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

For a headless browser (no visible window):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--headless"]
    }
  }
}
```

> **Tip:** Put this in your **project-level** `.vscode/settings.json` so it's shared via git. If you need it globally for all projects, add it to your user-level VSCode settings instead.

### Claude Desktop App

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

> **Note:** Claude Code CLI and Claude Desktop share the same core MCP infrastructure but use different config files. For **Claude Code CLI** the config lives in `.vscode/settings.json` (VSCode) or `~/Library/Application Support/Claude/claude_desktop_config.json` (Desktop).

---

## Verifying It Works

Once configured, ask Claude:

> "Navigate to https://example.com and tell me what you see"

If the MCP server is running correctly, Claude will use the `browser_navigate` and `browser_snapshot` tools to visit the page and return a structured accessibility snapshot.

You can also check the MCP connection status in:
- **VSCode:** Look for the MCP indicator in the status bar or Claude Code panel
- **Claude Desktop:** Terminal output shows `MCP server connected`

---

## Available Tools & Usage Patterns

### Navigation & Exploration

| Tool | Purpose | Typical Prompt |
|------|---------|---------------|
| `browser_navigate` | Go to a URL | "Go to the login page" |
| `browser_snapshot` | Get accessibility tree (structured page content) | "What's on this page?" |
| `browser_take_screenshot` | Visual screenshot (PNG/JPEG) | "Take a screenshot of the dashboard" |
| `browser_tabs` | List/open/close/select tabs | "Open a new tab" |
| `browser_wait_for` | Wait for text or time | "Wait for the results to load" |
| `browser_console_messages` | Get console logs | "Show me any console errors" |

**Key difference:** `browser_snapshot` returns an accessibility tree (interactive elements, text, roles), while `browser_take_screenshot` returns a visual image. Use **snapshots for interaction**, screenshots for visual verification.

### Form Interaction

| Tool | Purpose | Typical Prompt |
|------|---------|---------------|
| `browser_type` | Type into a text field | "Type 'admin' into the username field" |
| `browser_click` | Click an element | "Click the Login button" |
| `browser_select_option` | Choose from a dropdown | "Select 'ESS' from the role dropdown" |
| `browser_fill_form` | Fill multiple fields at once | "Fill in the login form with username Admin and password admin123" |
| `browser_hover` | Hover over an element | "Hover over the profile icon" |
| `browser_drag` | Drag and drop | "Drag the first item into the second" |

### Content Extraction

| Tool | Purpose | Typical Prompt |
|------|---------|---------------|
| `browser_evaluate` | Run JavaScript on the page | "Get the page title from the DOM" |
| `browser_network_requests` | List network requests | "Show me all API calls" |
| `browser_network_request` | Full details of one request | "Get the headers and body of request #3" |
| `browser_console_messages` | Console output | "Print any warnings in the console" |

### Network Debugging

| Tool | Purpose |
|------|---------|
| `browser_network_requests` | List all network requests since page load (use `filter` to narrow by URL pattern) |
| `browser_network_request` | Get full request/response headers and body for a specific request by index |
| `browser_console_messages` | Retrieve console.log, errors, warnings |

**Pattern for debugging:**
1. Navigate to the page
2. `browser_network_requests` — see what was fetched
3. `browser_network_request` with index — inspect specific API calls
4. `browser_console_messages level=error` — check for JS errors

### Advanced

| Action | Tool / Pattern |
|--------|---------------|
| Resize the browser | `browser_resize` |
| Press keyboard keys | `browser_press_key` (e.g. `Enter`, `Escape`, `Tab`) |
| Handle dialogs (alert/confirm/prompt) | `browser_handle_dialog` |
| Upload files | `browser_file_upload` |
| Drop files onto elements | `browser_drop` |
| Run custom Playwright code | `browser_run_code_unsafe` — runs any Playwright script in the server process |
| Navigate back | `browser_navigate_back` |

---

## Example Workflows

### 1. Create a Test File from Scratch

This is the workflow we used to create `tests/e2e/login.smoke.spec.ts`:

**Step 1 — Explore the page:**
```
Navigate to https://opensource-demo.orangehrmlive.com
Take a snapshot of the login page
```

Claude uses `browser_navigate` → `browser_snapshot` to see the accessibility tree.

**Step 2 — Understand interactions:**
```
Fill in the username with "Admin" and password with "wrongpass", then click Login
Wait for the error to appear
Take a snapshot to see the error message
```

Claude uses `browser_type` → `browser_click` → `browser_wait_for` → `browser_snapshot`.

**Step 3 — Test success path:**
```
Now clear the fields, enter valid credentials (Admin/admin123), and login
Take a snapshot of the dashboard
```

**Step 4 — Write the test:**
Claude synthesizes the findings into a Playwright test file using the same selectors it discovered
(e.g., `[name='username']`, `button[type='submit']`, `text='Invalid credentials'`).

### 2. Debug a Failing Test

```
I have a failing test at tests/e2e/login.smoke.spec.ts:96.
Navigate to the login page and walk through the steps manually.
```

Claude replays the test steps via MCP, and you can watch in real time. When something breaks,
inspect the snapshot, console errors, or network requests to find the issue.

### 3. Investigate Network Behavior

```
Go to https://opensource-demo.orangehrmlive.com
Login with Admin/admin123
Show me all network requests made during login
```

Claude uses `browser_network_requests` to list API calls, then `browser_network_request`
to inspect specific ones (auth endpoints, form submissions, etc.).

---

## Common Pitfalls & Troubleshooting

| Problem | Solution |
|---------|----------|
| **"MCP server not found"** | Ensure `npx @playwright/mcp@latest` runs without errors in your terminal first. May need `npm install -g @playwright/mcp`. |
| **Browser doesn't open** | The MCP server runs its own browser in headed mode by default. Add `--headless` to the args if you don't want a visible window. |
| **Selectors from MCP don't work in tests** | MCP uses Playwright internally, so the selectors it discovers (like `[name='username']`, `getByRole`, `getByText`) are the same ones your test uses. However, ref-style selectors (`[ref=e23]`) from snapshots are session-specific — always translate to semantic selectors in your test code. |
| **Test passes in MCP but fails in CI** | MCP runs interactively (slower). Tests may need explicit `waitFor`, longer timeouts, or different viewport size. |
| **Multiple elements match** | Use a more specific locator: `getByRole('heading', { name: 'Reset Password' })` instead of `getByText('Reset Password')`. |
| **Permission prompt every time** | Run `/fewer-permission-prompts` (Claude Code) to allowlist common MCP tools. |
| **Port already in use** | The MCP server uses port 31000 by default. Kill the existing process or configure a different port. |

### When to Use MCP vs. Running Tests Directly

| Use Case | Approach |
|----------|----------|
| Exploratory testing of a new page | **MCP** — fast, conversational, no test code needed |
| Debugging a flaky/failing test | **MCP** — watch what the browser actually does |
| Writing a new test file | **MCP to discover → then write the test** — best of both |
| Running tests regularly | **`npx playwright test`** — deterministic, CI-compatible |
| Checking visual appearance | **MCP screenshot** — quick visual check |

---

## Tips for Effective Use

1. **Start with `browser_navigate` + `browser_snapshot`** — Every interaction begins here. The snapshot is an accessibility tree, which tells Claude exactly what elements exist and their roles.

2. **Don't rely on `[ref=eXX]` selectors** — These are session-specific IDs from the accessibility snapshot. Always translate them to stable selectors (`name=`, `role=`, `text=`, CSS selectors) when writing test code.

3. **Use `browser_network_requests` for API-dependent tests** — Before writing assertions on page state, check what API responses look like.

4. **Pair MCP exploration with the Page Object Model** — After MCP discovers a page's structure, create/reuse page objects in your project so test code stays maintainable.

5. **Reset state between explorations** — Use `browser_navigate` to go back to a starting URL between different test scenarios.

6. **Check console errors early** — Run `browser_console_messages level=error` after navigating to catch JS errors that might affect your tests.
