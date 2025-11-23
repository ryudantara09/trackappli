import os
import json
import time
import random
import logging
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)


def get_stealth_context(p, browser):
    """
    Create a browser context with stealth settings to mimic a real user.
    """
    # Common user agent for Windows 10 Chrome
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    context = browser.new_context(
        user_agent=user_agent,
        viewport={"width": 1920, "height": 1080},
        locale="en-US",
        timezone_id="America/New_York",
        java_script_enabled=True,
    )

    # Apply stealth settings
    stealth_sync(context)

    return context


def clean_text(text):
    if not text:
        return ""
    # Remove multiple spaces and newlines
    return re.sub(r"\s+", " ", text).strip()


def extract_from_json_ld(page):
    """
    Attempt to find JobPosting structured data (JSON-LD).
    This is the most reliable method for LinkedIn/Indeed/Google Jobs.
    """
    try:
        # Find all JSON-LD scripts
        scripts = page.locator('script[type="application/ld+json"]').all()

        for script in scripts:
            try:
                content = script.inner_text()
                data = json.loads(content)

                # Check if it's a JobPosting
                if isinstance(data, dict) and data.get("@type") == "JobPosting":
                    logger.info("Found JobPosting JSON-LD")
                    return {
                        "title": data.get("title"),
                        "company": data.get("hiringOrganization", {}).get("name"),
                        "location": data.get("jobLocation", {}).get("address", {}).get("addressLocality"),
                        "description": clean_text(data.get("description")),
                        "datePosted": data.get("datePosted"),
                        "source": "json-ld",
                    }
            except:
                continue
    except Exception as e:
        logger.warning(f"JSON-LD extraction error: {e}")

    return None


def extract_job_content(page, url):
    """
    Main extraction logic with fallbacks.
    """
    domain = url.split("/")[2]
    logger.info(f"Extracting from domain: {domain}")

    # 1. Try JSON-LD first (Hidden structured data)
    data = extract_from_json_ld(page)
    if data and data.get("description"):
        return data

    # Initialize default structure
    content = {
        "title": page.title(),
        "company": "",
        "location": "",
        "description": "",
        "url": url,
        "source": "visual-scrape",
    }

    # 2. Domain Specific Visual Scraping
    try:
        if "linkedin.com" in domain:
            # Click "See more" if available to expand text
            try:
                page.locator('button[aria-label*="See more"]').click(timeout=2000)
            except:
                pass

            # Common LinkedIn selectors
            if not content["description"]:
                try:
                    content["description"] = page.locator(".description__text").first.inner_text()
                except:
                    pass
            if not content["title"]:
                try:
                    content["title"] = page.locator(".top-card-layout__title").first.inner_text()
                except:
                    pass

        elif "indeed.com" in domain:
            try:
                content["title"] = page.locator("h1").first.inner_text()
                content["description"] = page.locator("#jobDescriptionText").first.inner_text()
            except:
                pass

        elif "welcometothejungle.com" in domain:
            try:
                content["title"] = page.locator("h1").first.inner_text()
                # WTTJ usually puts content in a specific main section
                content["description"] = page.locator("main section").first.inner_text()
            except:
                pass

    except Exception as e:
        logger.warning(f"Visual selector failed: {e}")

    # 3. Universal Fallback (Brute force)
    if not content["description"] or len(content["description"]) < 50:
        logger.info("Using universal fallback")
        # Remove noise
        try:
            page.evaluate(
                """() => {
                const elements = document.querySelectorAll('nav, footer, header, script, style, iframe, noscript');
                elements.forEach(el => el.remove());
            }"""
            )

            # Get the largest block of text or just body
            content["description"] = page.locator("body").inner_text()
            content["description"] = clean_text(content["description"])
        except Exception as e:
            logger.warning(f"Universal fallback failed: {e}")

    return content


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/scrape", methods=["POST"])
def scrape():
    data = request.get_json()
    url = data.get("url")

    if not url:
        return jsonify({"error": "URL is required"}), 400

    logger.info(f"Received scrape request for: {url}")

    browser = None
    try:
        with sync_playwright() as p:
            # Launch browser (headless=True for server, False for debugging)
            browser = p.chromium.launch(headless=True)
            context = get_stealth_context(p, browser)
            page = context.new_page()

            # Navigate with generous timeout
            try:
                page.goto(url, timeout=30000, wait_until="domcontentloaded")
                # Random sleep to appear human
                time.sleep(random.uniform(2, 4))
            except Exception as e:
                return jsonify({"error": f"Navigation failed: {str(e)}"}), 500

            # Extract
            try:
                result = extract_job_content(page, url)
                return jsonify(result)
            except Exception as e:
                logger.error(f"Extraction failed: {e}")
                return jsonify({"error": f"Extraction failed: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"System error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if browser:
            try:
                browser.close()
            except:
                pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5002))
    app.run(host="0.0.0.0", port=port, debug=True)
