# AI Setup — opencode Architecture Guide

How this machine's opencode AI is configured (models, skills, plugins, MCP,
instructions), and how to replicate the structure in a new project.

Most of the setup is **global** (`~/.config/opencode/`) and automatically
applies to every project. Per-project work is small and covered by the
bootstrap checklist at the end.

---

## 1. Config layering

opencode deep-merges config from global scope into project scope. Project
values override global values.

| Scope | Location | Purpose |
|---|---|---|
| Global config | `~/.config/opencode/opencode.json` + `opencode.jsonc` | Providers, models, MCP, plugins, default model — shared by all projects |
| Global instructions | `~/.config/opencode/AGENTS.md` | Developer playbook injected into every session |
| Global TUI | `~/.config/opencode/tui.json` | Theme, keybinds, sounds |
| Project instructions | `<project>/AGENTS.md` | Project-specific conventions |
| Project config (optional) | `./opencode.json` or `.opencode/opencode.json` | Model / permission / instruction overrides for one repo |
| Project skills (optional) | `.opencode/skills/<name>/SKILL.md` | Skills that should NOT leak to other projects |

**This repo (`worship`) intentionally has no project `opencode.json`** — it
inherits everything global and only adds a project `AGENTS.md` plus scratch
directories (`.memory/`, `.superpowers/`, `.playwright-cli/`).

Both `opencode.json` and `opencode.jsonc` exist in `~/.config/opencode/` and
are merged together (verified: `opencode debug config` shows keys from both).
Files named `opencode-backup.jsonc`, `opencode (Copy).jsonc`, etc. are inert —
opencode only loads the canonical names.

Every `opencode.json(c)` should declare:

```json
{ "$schema": "https://opencode.ai/config.json" }
```

Config is loaded once at startup — **restart opencode after any config edit**.

---

## 2. Models & providers

### Active default

```json
"model": "magnitude/gemma-4-e4b-it-qat:gguf:q4"
```

### Provider pattern

Custom providers point opencode at any OpenAI- or Anthropic-compatible
endpoint. Shape:

```json
{
  "provider": {
    "my-provider": {
      "npm": "@ai-sdk/openai-compatible",        // or "@ai-sdk/anthropic"
      "name": "Human Readable Name",
      "options": {
        "baseURL": "http://127.0.0.1:10100/inference/v1",
        "apiKey": "{env:MY_API_KEY}"
      },
      "models": {
        "model-id": {
          "name": "Model Display Name",
          "limit": { "context": 64000, "output": 32768 },
          "modalities": { "input": ["text", "image"], "output": ["text"] },
          "reasoning": true,
          "variants": {
            "high": { "reasoningEffort": "high" }
          }
        }
      }
    }
  }
}
```

- Model IDs always carry the provider prefix when referenced: `provider/model-id`.
- `variants` are selectable effort/thinking presets (e.g. `low`/`medium`/`high`/`max`
  thinking budgets for Anthropic-style `thinkingConfig`, or `reasoningEffort`
  for OpenAI-style).

### Providers configured on this machine

| Provider | Endpoint | Models |
|---|---|---|
| `magnitude` | local `127.0.0.1:10100` (Magnitude local inference, OpenAI-compatible) | `gemma-4-e4b-it-qat:gguf:q4` (64k ctx, text+image, variants `off`/`high`) |
| `antigravity-manager` | local `localhost:8045` (Anthropic-compatible proxy) | `claude-sonnet-4-6`, `claude-sonnet-4-6-thinking` (budgets 8k–32k), `claude-opus-4-6-thinking`, `gemini-2.5-pro`, `gemini-2.5-flash`, `gemini-3.1-pro`, `gemini-3-pro-image`, `gemini-3.7-flash-tiered`, `gpt-oss-120b-medium` |

For a new project needing a different model, either switch at runtime
(model picker) or set a project-level `opencode.json` with `"model"`.

---

## 3. Skills

Skills are markdown instructions the model auto-invokes when its `description`
matches the task. Loader scans `**/SKILL.md` in these locations:

| Location | Count (approx.) | Notes |
|---|---|---|
| `~/.config/opencode/skills/` | 302 | Primary home — GDPR/privacy pack, custom skills (`soccer-analyst`, `taste-skill`, `web-push-notifications`, …) |
| `~/.agents/skills/` | 318 | Adds dev skills (`academic-paper`, `docx`, `playwright-cli`, `nextjs-*`, `better-auth-*`, …) |
| `~/.claude/skills/` | 313 | Claude Code-compatible mirror (auto-loaded external scan) |
| Plugin-injected (`skills.paths`) | 14 | superpowers process skills |

### SKILL.md format

```
.opencode/skills/my-skill/SKILL.md
```

```markdown
---
name: my-skill
description: One sentence covering what this skill does AND when to trigger it.
  Front-load literal keywords/filenames the user is likely to say.
  Use ONLY when ... if it should stay quiet on adjacent topics.
---

# My Skill

(instructions, examples, references)
```

- `name`: required, lowercase-hyphenated, ≤64 chars, matches folder name.
- `description`: effectively required — skills without one are never surfaced
  to the model. Write it in third person ("Use when...").
- Register non-default locations via `"skills": { "paths": [...], "urls": [...] }`
  in config.

**Global vs project skills**: put anything reusable in
`~/.config/opencode/skills/`; use `.opencode/skills/` only for rules that are
meaningful inside one repo.

---

## 4. Plugins

`"plugin"` is an **array** of npm specs, file paths/URLs, or `[name, options]`
tuples. Auto-discovered: any `*.ts`/`*.js` in `.opencode/plugin/`.

Active (global) plugins:

| Plugin | Spec | What it does |
|---|---|---|
| superpowers | `superpowers@git+https://github.com/obra/superpowers.git` | Process skills: brainstorming → writing-plans → TDD → systematic-debugging → verification-before-completion; injects the "using-superpowers" session instructions and its skills via `skills.paths` |
| claude-mem | `file:///home/tl-wr840n/.config/opencode/plugins/claude-mem.js` | Memory search (`claude-mem_search`) for past sessions/observations |

Plugin cache lives under `~/.cache/opencode/packages/`.

---

## 5. MCP servers

Configured in `opencode.jsonc` under `"mcp"`; every entry needs `type`
(`local`/`remote`) and, for local, a **command array**. Secrets use
`{env:VAR}` interpolation (not `${VAR}`).

Active servers:

| Name | Command | Notes |
|---|---|---|
| context7 | `npx -y @upstash/context7-mcp` | Library docs; `CONTEXT7_API_KEY` from env |
| filesystem | `npx -y @modelcontextprotocol/server-filesystem /home` | |
| chrome-devtools | `npx -y chrome-devtools-mcp@latest` | |
| memory | `npx -y @modelcontextprotocol/server-memory` | Knowledge graph |
| github | `npx -y @modelcontextprotocol/server-github` | `GITHUB_PAT` from env |
| git | `uvx mcp-server-git` | |
| sequential-thinking | `npx -y @modelcontextprotocol/server-sequential-thinking` | |
| gsap-master | `npx -y bruzethegreat-gsap-master-mcp-server@latest` | |
| shadcn | `npx -y shadcn@latest mcp` | |
| openaccountants | `~/.venv-openaccountants/bin/openaccountants-mcp` | Tax/accounting skills |
| markdownify | `node ~/markdownify-mcp/dist/index.js` | Doc → markdown conversion |
| powerpoint | venv python + `ppt_mcp_server.py` | |
| firecrawl | `npx -y firecrawl-mcp` | `FIRECRAWL_API_KEY` inline |

Disable an inherited server in project config with `"enabled": false`.

---

## 6. Instruction layering (AGENTS.md)

Sessions receive instructions from multiple files, in order of increasing
specificity:

1. `~/.config/opencode/AGENTS.md` — **global playbook** (stack defaults:
   Bun, latest Next.js App Router, Tailwind v4 + shadcn, Better Auth,
   API versioning under `app/api/v1/`, testing with `bun test`,
   conventional commits, Tailwind CSS-variable paren syntax, etc.).
   Mirrored at `~/AGENTS.md`, `~/CLAUDE.md`, `~/AGENT.md`, `~/.claude/CLAUDE.md`
   — edit the `~/.config/opencode` copy as source of truth and sync mirrors.
2. `<project>/AGENTS.md` — **project conventions** (for this repo: bun
   package manager, `cursor-pointer` on all interactive elements,
   `bun run lint` / `format` / `check` / `build` / `test`, plus the
   embedded Next.js docs index).

Precedence: user/direct instructions > AGENTS.md content > defaults.

Additional config-driven instructions: `"instructions": ["docs/style.md"]`
in `opencode.json` for extra files.

---

## 7. Per-project bootstrap checklist

When starting a new project:

1. **Create `AGENTS.md`** in the repo root with at least:
   - Package manager (bun commands)
   - Lint / typecheck / build / test commands (from `package.json` scripts)
   - Any hard UI/UX rules (e.g. `cursor-pointer` on clickable elements)
   - Repo-specific conventions
2. **Gitignore scratch dirs**: `.memory/`, `.superpowers/`, `.playwright-cli/`,
   `logs/`, `.playwright-cli/` console dumps.
3. **Skip project `opencode.json`** unless you need to override the default
   model, permissions, or instructions for this repo. If you add one:

   ```json
   {
     "$schema": "https://opencode.ai/config.json",
     "model": "provider/model-id",
     "instructions": ["AGENTS.md"],
     "permission": { "bash": { "git *": "allow", "*": "ask" } }
   }
   ```

4. **Skills**: reuse the global 300+; add `.opencode/skills/<name>/SKILL.md`
   only for repo-specific workflows.
5. **MCP/plugins/providers**: inherited globally — nothing to do.
6. **Verify** with the commands below.

---

## 8. Reference commands

```bash
opencode debug config     # resolved (merged) configuration — sanity check
opencode debug skill      # list every skill the model can see, with locations
opencode debug agent      # agent details
opencode models           # available models per provider
opencode mcp              # MCP server management
opencode providers        # provider credentials
```

Debugging escape hatches (broken config):

```bash
OPENCODE_DISABLE_PROJECT_CONFIG=1 opencode   # skip project opencode.json
OPENCODE_CONFIG_CONTENT='{"$schema":"https://opencode.ai/config.json"}' opencode
OPENCODE_PURE=1 opencode                     # skip external plugins
```

---

## 9. What "same structure in other projects" means in practice

| Layer | Carry-over |
|---|---|
| Providers, models, MCP, plugins, global skills, global AGENTS.md | Automatic — nothing to copy |
| Project `AGENTS.md` | Write a short new one per repo (checklist §7) |
| Project `opencode.json` | Only if model/permissions differ for that repo |
| Project skills | Only if workflow is repo-specific |
| Scratch dirs + gitignore | Recreate `.memory/` etc. per repo |
