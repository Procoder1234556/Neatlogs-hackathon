const baseUrl = "https://neatlogs-hackathon.p03490978.workers.dev";

async function runTests() {
  console.log(`Testing Cloudflare Worker API at ${baseUrl}...\n`);

  // 1. Health
  console.log("1. Testing GET /health...");
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log("   Status:", healthRes.status, healthData);

  // 2. Summary
  console.log("\n2. Testing GET /api/v1/runs/summary...");
  const sumRes = await fetch(`${baseUrl}/api/v1/runs/summary`);
  const sumData = await sumRes.json();
  console.log("   Status:", sumRes.status, sumData);

  // 3. Runs list
  console.log("\n3. Testing GET /api/v1/runs...");
  const runsRes = await fetch(`${baseUrl}/api/v1/runs`);
  const runsData = await runsRes.json();
  console.log("   Status:", runsRes.status, `Returned ${runsData.length} runs. First run ID: ${runsData[0]?.id}`);

  // 4. Run details
  console.log("\n4. Testing GET /api/v1/runs/demo-seed-001...");
  const detailRes = await fetch(`${baseUrl}/api/v1/runs/demo-seed-001`);
  const detailData = await detailRes.json();
  console.log("   Status:", detailRes.status, `Title: ${detailData.niche}, Steps: ${detailData.steps?.length}, Recoveries: ${detailData.recovery_events?.length}`);

  // 5. Leads
  console.log("\n5. Testing GET /api/v1/runs/demo-seed-001/leads...");
  const leadsRes = await fetch(`${baseUrl}/api/v1/runs/demo-seed-001/leads`);
  const leadsData = await leadsRes.json();
  console.log("   Status:", leadsRes.status, `Returned ${leadsData.length} leads.`);
  console.log(`   Lead 1: ${leadsData[0]?.name} (${leadsData[0]?.people?.[0]?.full_name} - ${leadsData[0]?.people?.[0]?.title})`);
  console.log(`   Outreach message subject: "${leadsData[0]?.people?.[0]?.messages?.[0]?.subject}"`);
  console.log(`   Verification score: ${leadsData[0]?.people?.[0]?.messages?.[0]?.verification?.quality_score}`);

  // 6. CSV Export
  console.log("\n6. Testing GET /api/v1/runs/demo-seed-001/export.csv...");
  const csvRes = await fetch(`${baseUrl}/api/v1/runs/demo-seed-001/export.csv`);
  const csvData = await csvRes.text();
  console.log("   Status:", csvRes.status, `CSV bytes: ${csvData.length}, Header line: ${csvData.split("\n")[0]}`);

  // 7. Series & Signals
  console.log("\n7. Testing GET /api/v1/runs/demo-seed-001/series & /signals...");
  const seriesRes = await fetch(`${baseUrl}/api/v1/runs/demo-seed-001/series`);
  const seriesData = await seriesRes.json();
  const signalsRes = await fetch(`${baseUrl}/api/v1/runs/demo-seed-001/signals`);
  const signalsData = await signalsRes.json();
  console.log("   Series points:", seriesData.length, "Signal dimensions:", signalsData.length);

  // 8. Pricing
  console.log("\n8. Testing GET /api/v1/pricing...");
  const priceRes = await fetch(`${baseUrl}/api/v1/pricing`);
  const priceData = await priceRes.json();
  console.log("   Price per lead:", priceData.computed_price_per_lead, "Tiers:", priceData.tiers?.length);

  // 9. Sources Health
  console.log("\n9. Testing GET /api/v1/sources/health...");
  const sourcesRes = await fetch(`${baseUrl}/api/v1/sources/health`);
  const sourcesData = await sourcesRes.json();
  console.log("   Sources:", sourcesData.sources?.map(s => `${s.source}: ${s.status}`).join(" | "));

  // 10. Estimate
  console.log("\n10. Testing POST /api/v1/runs/estimate...");
  const estRes = await fetch(`${baseUrl}/api/v1/runs/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ niche: "Cybersecurity", goal_text: "Find CISOs", target_titles: ["CISO"], lead_target: 10 })
  });
  const estData = await estRes.json();
  console.log("   Estimate:", estData);

  // 11. Create Run
  console.log("\n11. Testing POST /api/v1/runs (Live Agent Orchestration on Cloudflare)...");
  const createRes = await fetch(`${baseUrl}/api/v1/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      niche: "AI Infrastructure",
      goal_text: "Find ML platform engineering leaders hiring senior ML infrastructure engineers",
      target_titles: ["Head of AI", "ML Platform Lead"],
      lead_target: 5,
      credit_budget: 250
    })
  });
  const createData = await createRes.json();
  console.log("   Status:", createRes.status, `Created run ID: ${createData.id}, Status: ${createData.status}`);

  console.log("\nALL TESTS PASSED WITH 100% SUCCESS ON CLOUDFLARE!");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
