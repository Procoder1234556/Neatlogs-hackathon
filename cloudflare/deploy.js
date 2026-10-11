import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const apiToken = process.env.CLOUDFLARE_API_TOKEN || "";
const scriptName = "neatlogs-hackathon";

const workerCode = fs.readFileSync(path.join(__dirname, "worker.js"), "utf8");

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
  console.log(`Deploying worker ${scriptName} to Cloudflare account ${accountId}...`);
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
    console.log(`Live URL: https://${scriptName}.p03490978.workers.dev`);
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
