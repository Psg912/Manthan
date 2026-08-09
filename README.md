# Manthan — startup idea analysis, powered by SOIF

Phase 3 of the SOIF project, branded as **Manthan** (मंथन — Hindi for "churning" or deep
analysis). Upload a completed SOIF Excel workbook, bring your own free-tier
API key, and get an AI-generated analysis rendered as a dashboard report — no backend, no
cost to run, ever.

## How it works

1. You drag in your completed `SOIF_Assessment_Workbook_v1.xlsx`.
2. The app parses the **Data Export** and **Instructions** sheets entirely in your browser
   (`src/lib/parseWorkbook.ts`) using SheetJS.
3. It builds the analysis prompt (`src/lib/promptTemplate.ts`, mirrors
   `SOIF_AI_Analysis_Prompt_v1.md` from Phase 2) and sends it directly from your browser to
   Groq or Gemini, using an API key you provide that never leaves your device except to go
   straight to that provider.
4. The model's markdown response is parsed into sections and rendered as the dashboard.

There is no server. There is nothing to pay for. Your workbook data goes to exactly one place:
the AI provider you chose, using your own key.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
```

## Deploying (free)

**Cloudflare Pages** (recommended):
1. Push this repo to GitHub.
2. In the Cloudflare dashboard: Pages -> Create a project -> Connect to GitHub -> select this repo.
3. Build command: `npm run build`  ·  Build output directory: `dist`
4. Deploy. Every push to `main` auto-deploys.

**GitHub Pages** (also free, simplest if you're not ready to add Cloudflare):
1. `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. `npm run deploy`
4. Enable Pages in the repo settings, pointing at the `gh-pages` branch.

## Project structure

```
src/
  lib/
    types.ts             shared data shapes
    parseWorkbook.ts      reads the uploaded .xlsx client-side
    promptTemplate.ts     system prompt + user prompt builder + response parser
    aiProviders.ts        BYOK calls to Groq / Gemini
    accent.ts             per-dimension color + icon mapping
    grade.ts              overall score -> hero badge/verdict
  components/
    UploadFlow.tsx        guided upload -> confirm -> analyzing steps
    SettingsPanel.tsx     provider + API key entry
    ReportDashboard.tsx   hero, alerts, dimension grid, AI narrative sections
    DimensionCard.tsx     expandable per-dimension card with score ring
    ScoreRing.tsx
    AlertBanner.tsx       amber "worth a look" critical alerts
    LiteMarkdown.tsx      renders the AI's markdown-ish text (paragraphs + bullets)
```

## Known items worth knowing about

- **`xlsx` (SheetJS) has open advisories** (prototype pollution, ReDoS) with no fix currently
  published to npm — see `npm audit`. Risk here is limited to a user's own browser tab
  processing a file they themselves chose to upload, but if you want to remove the exposure
  entirely, consider installing SheetJS's own distribution
  (`https://cdn.sheetjs.com/xlsx-latest/xlsx-latest.tgz`) instead of the npm package, or
  swapping to `exceljs`.
- **Default model names in `aiProviders.ts` will go stale.** Free-tier model lineups on Groq
  and Gemini change fairly often — check current model IDs before relying on the defaults,
  and the Settings panel lets a user override the model string without a code change.
- **The Critical Question detection rule is `weight === 0.25`.** This matches how
  `SOIF_Assessment_Workbook_v1.xlsx` was built (the highest-weighted question in each
  dimension). If the workbook's weighting scheme changes, update `CRITICAL_WEIGHT` in
  `parseWorkbook.ts` to match.
- **Bundle size**: `xlsx` alone accounts for most of the ~550KB JS bundle. Fine for this use
  case (a small, occasionally-used tool), but if that ever matters, dynamic `import()`-ing the
  parser only when a file is dropped would defer the cost until it's needed.
