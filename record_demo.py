"""record_demo.py
Records a full demo video of the ATHENA 3D dashboard.
Run: uvx --with playwright python record_demo.py
"""

import time
from pathlib import Path
from playwright.sync_api import sync_playwright

OUTPUT_DIR = Path(__file__).parent / "demo_output"
OUTPUT_DIR.mkdir(exist_ok=True)

GOAL = "Build a Python hello world function with unit tests"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,  # visible window for recording
            args=["--enable-webgl", "--use-gl=desktop"],
        )

        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir=str(OUTPUT_DIR),
            record_video_size={"width": 1440, "height": 900},
        )

        page = context.new_page()

        # ── 1. Load dashboard ──────────────────────────────────────────────
        print("→ Opening ATHENA dashboard...")
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")
        time.sleep(3)  # let 3D scene fully render

        page.screenshot(path=str(OUTPUT_DIR / "01_idle.png"))
        print("  Screenshot: 01_idle.png")

        # ── 2. Type goal in chat ───────────────────────────────────────────
        print(f"→ Sending goal: {GOAL}")
        chat_input = page.locator("input[placeholder*='directive']").first
        chat_input.click()
        chat_input.fill(GOAL)
        time.sleep(0.5)

        # ── 3. Submit ──────────────────────────────────────────────────────
        send_btn = page.locator("button[type='submit']").first
        send_btn.click()
        print("  Goal submitted — watching agents animate...")

        # ── 4. Capture mid-swarm (agents working) ─────────────────────────
        time.sleep(6)
        page.screenshot(path=str(OUTPUT_DIR / "02_swarm_running.png"))
        print("  Screenshot: 02_swarm_running.png")

        # ── 5. Wait for completion ─────────────────────────────────────────
        time.sleep(12)
        page.screenshot(path=str(OUTPUT_DIR / "03_completed.png"))
        print("  Screenshot: 03_completed.png")

        # ── 6. Scroll down to show logs + artifacts ────────────────────────
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(2)
        page.screenshot(path=str(OUTPUT_DIR / "04_results.png"))
        print("  Screenshot: 04_results.png")

        # ── 7. Close — video is saved on context close ─────────────────────
        context.close()
        browser.close()

        # Rename video to demo.mp4
        videos = list(OUTPUT_DIR.glob("*.webm"))
        if videos:
            dest = Path(__file__).parent / "demo.webm"
            videos[0].rename(dest)
            print(f"\n✅ Video saved: {dest}")
            print(f"   Screenshots: {OUTPUT_DIR}")
        else:
            print("\n⚠ No video file found in output dir")

if __name__ == "__main__":
    run()
