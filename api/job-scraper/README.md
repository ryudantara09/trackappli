# Job Scraper Service

A Playwright-based microservice to scrape job descriptions from URLs. It uses `playwright-stealth` to bypass basic bot detection and attempts to extract structured data (JSON-LD) before falling back to visual scraping.

## Setup

1.  **Create Virtual Environment**
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Mac/Linux
    source venv/bin/activate
    ```

2.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Install Playwright Browsers**
    ```bash
    playwright install chromium
    ```

## Running

```bash
python server.py
```

The server will start on `http://localhost:5001`.

## Usage

**POST** `/scrape`

```json
{
  "url": "https://www.linkedin.com/jobs/view/..."
}
```

**Response:**

```json
{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote",
  "description": "Full job description text...",
  "source": "json-ld"
}
```
