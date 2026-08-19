"""Render and exercise the local operator console at the important widths."""

import os
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("AOC_URL", "http://127.0.0.1:4310")
WIDTHS = (375, 640, 1000, 1280, 1440)
RENDER_DIR = Path(".scratch/renders")


def assert_no_horizontal_overflow(page):
    overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    assert overflow <= 1, f"horizontal overflow at {page.viewport_size['width']}px: {overflow}px"


def assert_no_sibling_collisions(page):
    collisions = page.evaluate(
        """
        () => {
          const groups = [
            [...document.querySelectorAll('.metric-card')],
            [...document.querySelectorAll('.integration-card')],
            [...document.querySelectorAll('.decision-card')],
          ];
          const result = [];
          for (const group of groups) {
            for (let i = 0; i < group.length; i += 1) {
              for (let j = i + 1; j < group.length; j += 1) {
                const a = group[i].getBoundingClientRect();
                const b = group[j].getBoundingClientRect();
                if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
                  result.push(`${group[i].className} intersects ${group[j].className}`);
                }
              }
            }
          }
          return result;
        }
        """
    )
    assert not collisions, f"sibling collisions: {collisions}"


def assert_clean_surface(page, console_errors, page_errors, request_failures):
    assert page.locator("h1").count() == 1
    assert page.locator("img").count() == 0
    hrefs = page.locator("a").evaluate_all("anchors => anchors.map(anchor => anchor.href)")
    assert all(href and not href.endswith("#") for href in hrefs), f"invalid links: {hrefs}"
    assert not console_errors, f"console errors: {console_errors}"
    assert not page_errors, f"page errors: {page_errors}"
    assert not request_failures, f"failed requests: {request_failures}"


def wait_for_text(page, text):
    page.wait_for_function(
        "expected => document.querySelector('#run-detail').innerText.toLowerCase().includes(expected.toLowerCase())",
        arg=text,
    )


def run_interaction_path(page):
    page.locator("[data-action='refresh']").click()
    page.wait_for_function("document.querySelector('#feedback').innerText.startsWith('Refreshed at')")

    page.locator("[data-action='ingest']").click()
    page.wait_for_function("document.querySelector('#metric-runs').innerText === '1'")
    wait_for_text(page, "PAY-142")

    page.locator("[data-action='ingest']").click()
    page.wait_for_function("document.querySelector('#metric-runs').innerText === '2'")
    rows = page.locator("[data-select-run]")
    assert rows.count() == 2
    first_id = rows.nth(0).get_attribute("data-select-run")
    second_id = rows.nth(1).get_attribute("data-select-run")
    assert first_id != second_id
    rows.nth(0).click()
    page.wait_for_function(
        "expected => document.querySelector('[data-select-run].is-selected').dataset.selectRun === expected",
        arg=first_id,
    )

    page.locator("[data-run-action='approve']").click()
    wait_for_text(page, "Approved")
    page.locator("[data-run-action='execute']").click()
    wait_for_text(page, "Awaiting review")
    page.locator("[data-run-action='fail']").click()
    wait_for_text(page, "Failed")
    page.locator("[data-run-action='recover']").click()
    wait_for_text(page, "Recovered")
    page.locator("[data-run-action='execute']").click()
    wait_for_text(page, "Awaiting review")
    page.locator("[data-run-action='complete']").click()
    wait_for_text(page, "Completed")


def main():
    RENDER_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": WIDTHS[0], "height": 900})
        page.request.post(f"{BASE_URL}/api/demo/reset")

        console_errors = []
        page_errors = []
        request_failures = []
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on("requestfailed", lambda request: request_failures.append(f"{request.url}: {request.failure}"))

        for width in WIDTHS:
            page.set_viewport_size({"width": width, "height": 900})
            page.goto(BASE_URL, wait_until="networkidle")
            page.add_style_tag(content="* { transition: none !important; animation: none !important; }")
            assert_clean_surface(page, console_errors, page_errors, request_failures)
            assert_no_horizontal_overflow(page)
            assert_no_sibling_collisions(page)
            page.screenshot(path=str(RENDER_DIR / f"console-{width}.png"), full_page=True)

            if width == WIDTHS[0]:
                run_interaction_path(page)

        browser.close()
    print(f"browser checks passed at widths: {', '.join(map(str, WIDTHS))}")


if __name__ == "__main__":
    main()
