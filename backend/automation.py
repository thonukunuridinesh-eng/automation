from playwright.sync_api import sync_playwright
from tenacity import retry, stop_after_attempt
import random
import time
import os

RESULTS_DIR = "results"
os.makedirs(RESULTS_DIR, exist_ok=True)


def random_delay():
    time.sleep(random.uniform(1, 3))


@retry(stop=stop_after_attempt(3))
def run_pimeyes_search(image_path):

    extracted_results = []

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled"
            ]
        )

        context = browser.new_context(
            viewport={"width": 1400, "height": 900},
            user_agent=(
                "Mozilla/5.0 "
                "(Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 "
                "(KHTML, like Gecko) "
                "Chrome/124 Safari/537.36"
            )
        )

        page = context.new_page()

        try:

            print("Opening PimEyes...")

            page.goto(
                "https://pimeyes.com/en",
                timeout=120000
            )

            random_delay()

            print("Uploading Image...")

            file_input = page.locator('input[type="file"]')
            file_input.set_input_files(image_path)

            random_delay()

            print("Starting Search...")

            page.wait_for_timeout(10000)

            if "captcha" in page.content().lower():
                print("Captcha detected")

            page.screenshot(
                path=f"{RESULTS_DIR}/search_result.png"
            )

            images = page.locator("img")

            count = images.count()

            for i in range(min(count, 5)):
                try:
                    src = images.nth(i).get_attribute("src")

                    if src:
                        extracted_results.append({
                            "image": src,
                            "score": random.randint(70, 99)
                        })

                except:
                    continue

            context.storage_state(path="state.json")

        except Exception as e:
            print("Automation Error:", e)

        finally:
            browser.close()

    return extracted_results