import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback to api/.env if not present in process.env
const envPath = path.join(__dirname, '../api/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
const scriptName = "neatlogs-hackathon";

let workerCode = fs.readFileSync(path.join(__dirname, "worker.js"), "utf8");
const frontendCode = fs.readFileSync(path.join(__dirname, "frontend.js"), "utf8");

// Inline getFrontendHtml cleanly to create a single self-contained ES module bundle
// Use function replacer to prevent $` or $' from corrupting template literals
const inlinedFrontend = frontendCode.replace('export function getFrontendHtml', 'function getFrontendHtml');
workerCode = workerCode.replace(
  'import { getFrontendHtml } from "./frontend.js";',
  () => inlinedFrontend
);

const metadata = {
  main_module: "worker.js",
  compatibility_date: "2026-10-11",
  bindings: [
    { type: "kv_namespace", name: "PROSPECTFORGE_KV", namespace_id: "c4ec2f17e6bc4e498675d50c4bfec3d8" },
    { type: "plain_text", name: "APP_ENV", text: "production" },
    { type: "plain_text", name: "NEATLOGS_ENDPOINT", text: "https://ingest.neatlogs.com" }
  ]
};

const boundary = `----WebKitFormBoundary${Date.now()}`;
const body = [
  `--${boundary}`,
  'Content-Disposition: form-data; name="metadata"',
  'Content-Type: application/json',
  '',
  JSON.stringify(metadata),
  `--${boundary}`,
  'Content-Disposition: form-data; name="worker.js"; filename="worker.js"',
  'Content-Type: application/javascript+module',
  '',
  workerCode.trim(),
  `--${boundary}--`,
  ''
].join("\r\n");

async function deploy() {
  if (!accountId || !apiToken) {
    throw new Error("Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN in environment or api/.env");
  }

  console.log(`Deploying full-stack worker ${scriptName} to Cloudflare account ${accountId}...`);
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`
    },
    body: body
  });

  const data = await res.json();
  if (data.success) {
    console.log("Deployment successful!");
    console.log(`Live Full-Stack URL: https://${scriptName}.p03490978.workers.dev`);
    console.log("Startup time:", data.result?.startup_time_ms, "ms");
  } else {
    console.error("Deployment failed:", JSON.stringify(data.errors, null, 2));
    process.exit(1);
  }
}

deploy().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
