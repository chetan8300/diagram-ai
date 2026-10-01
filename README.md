# DiagramAI

Describe a diagram, generate a validated graph with OpenRouter, and edit its nodes and connections on a tldraw canvas. ELK computes the layout in the browser.

## Run locally

Use Node.js 20.9+ and Yarn 4:

```bash
yarn install
cp .env.example .env.local
yarn dev
```

In `.env.local`, set `OPENROUTER_API_KEY` to your key and `OPENROUTER_MODEL` to an OpenRouter model that supports structured JSON output. The key stays on the server. Generation does not use a database.

Open [localhost:3000](http://localhost:3000), enter a description or choose an example, and select **Generate**. A successful generation replaces the current page as one undoable edit. Failures preserve the prompt and canvas. If you edit the canvas while a request runs, its response is discarded so those edits are kept.

Refinement, export, and local save are not connected yet.

## Checks

```bash
yarn test
yarn lint
yarn tsc --noEmit
```

The generation tests use the real AI SDK with mocked OpenRouter HTTP responses; they do not make paid API calls.
