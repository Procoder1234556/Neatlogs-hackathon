#!/usr/bin/env python3
"""
ProspectForge Backend Availability & Health Probe

Verifies backend liveness (/health) and container readiness (/readyz)
on Render with cold-start awareness. Designed for external uptime
monitors, cron jobs, and CI/CD smoke testing.

Usage:
  python scripts/ping_health.py [--url https://prospectforge-backend.onrender.com]
"""
import sys
import os
import time
import argparse
import json
import urllib.request
import urllib.error

# ponytail: stdlib urllib only, zero external dependencies

def ping_endpoint(url: str, timeout_sec: float) -> tuple[int, float, dict | str]:
    start = time.perf_counter()
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "ProspectForge-HealthProbe/1.0", "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as resp:
            elapsed_ms = (time.perf_counter() - start) * 1000
            body = resp.read().decode("utf-8")
            try:
                data = json.loads(body)
            except Exception:
                data = body
            return resp.status, elapsed_ms, data
    except urllib.error.HTTPError as e:
        elapsed_ms = (time.perf_counter() - start) * 1000
        return e.code, elapsed_ms, str(e.reason)
    except Exception as e:
        elapsed_ms = (time.perf_counter() - start) * 1000
        return 0, elapsed_ms, str(e)


def check_with_cold_start_recovery(
    base_url: str,
    max_attempts: int = 5,
    timeout_sec: float = 25.0
) -> bool:
    base = base_url.rstrip("/")
    health_url = f"{base}/health"
    ready_url = f"{base}/readyz"

    print(f"[*] Probing ProspectForge backend: {health_url}")
    print(f"[*] Max attempts: {max_attempts} (timeout per attempt: {timeout_sec}s)")

    for attempt in range(1, max_attempts + 1):
        status, latency_ms, data = ping_endpoint(health_url, timeout_sec=timeout_sec)
        
        if status == 200:
            print(f"[+] Attempt {attempt}: HEALTHY ({latency_ms:.1f}ms)")
            if isinstance(data, dict):
                print(f"    Service: {data.get('service')} | Env: {data.get('environment')} | Status: {data.get('status')}")

            # Verify readiness
            r_status, r_latency, r_data = ping_endpoint(ready_url, timeout_sec=10.0)
            if r_status == 200:
                print(f"[+] Readiness check: READY ({r_latency:.1f}ms)")
            else:
                print(f"[-] Readiness check returned HTTP {r_status} ({r_latency:.1f}ms): {r_data}")
            return True

        # Render cold-start indicators: 502 Bad Gateway, 503, 504 Gateway Timeout, or connection timeout
        is_cold_start = status in (0, 502, 503, 504)
        status_label = f"HTTP {status}" if status > 0 else "Connection Timeout / Unreachable"
        
        if is_cold_start and attempt < max_attempts:
            backoff_sec = min(2 * attempt, 10)
            print(f"[-] Attempt {attempt}: {status_label} ({latency_ms:.1f}ms). Render container waking from sleep, retrying in {backoff_sec}s...")
            time.sleep(backoff_sec)
        else:
            print(f"[!] Attempt {attempt}: Failed with {status_label} ({latency_ms:.1f}ms): {data}")
            if attempt < max_attempts:
                time.sleep(2)

    print(f"[FAIL] Backend unreachable after {max_attempts} attempts.")
    return False


def main():
    parser = argparse.ArgumentParser(description="ProspectForge Health Probe")
    parser.add_argument(
        "--url",
        default=os.getenv("RENDER_SERVICE_URL") or os.getenv("HEALTH_URL") or "https://prospectforge-backend.onrender.com",
        help="Base service URL"
    )
    parser.add_argument("--attempts", type=int, default=4, help="Maximum probe attempts")
    parser.add_argument("--timeout", type=float, default=25.0, help="Socket timeout per attempt (seconds)")
    args = parser.parse_args()

    ok = check_with_cold_start_recovery(args.url, max_attempts=args.attempts, timeout_sec=args.timeout)
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
