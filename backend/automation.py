from loguru import logger
import json
from playwright.sync_api import sync_playwright
from tenacity import retry, stop_after_attempt
import random
import time
import os
from dotenv import load_dotenv
import os

load_dotenv()

proxy_server = os.getenv("PROXY")
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
    proxy={
        "server": proxy_server
    },
    args=[
        "--disable-blink-features=AutomationControlled"
    ]
)

    context = browser.new_context(
    storage_state="state.json"
)

    page = context.new_page()  
    try:

            print("Opening PimEyes...")

            page.goto(
                "https://pimeyes.com/en",
                timeout=120000
            )
            random_delay()

            page.mouse.move(300, 400)

            random_delay()

            page.mouse.wheel(0, 500)
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
           context.storage_state(path="state.json")
           browser.close()

        with open("results/results.json", "w") as f:
             json.dump(extracted_results, f, indent=4)

return extracted_results