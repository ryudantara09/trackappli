import json
import base64
import sys
import re

# Try different import methods for PyMuPDF
try:
    import fitz
except ImportError:
    try:
        import pymupdf as fitz
    except ImportError:
        try:
            from pymupdf import fitz
        except ImportError:
            # For Vercel deployment, we'll handle this gracefully
            fitz = None


def clean_text(text):
    """Clean extracted text to remove problematic characters"""
    if not text:
        return ""

    # Replace problematic Unicode characters with similar ASCII equivalents
    replacements = {
        "\ue04c": "-",  # Replace private use character with dash
        "\ue000": " ",  # Replace private use character with space
        "\ue001": " ",
        "\ue002": " ",
        "\u2022": "•",  # Bullet point
        "\u2013": "-",  # En dash
        "\u2014": "-",  # Em dash
        "\u2019": "'",  # Right single quotation mark
        "\u201c": '"',  # Left double quotation mark
        "\u201d": '"',  # Right double quotation mark
        "\u00a0": " ",  # Non-breaking space
    }

    # Apply replacements
    for old, new in replacements.items():
        text = text.replace(old, new)

    # Remove any remaining private use characters (U+E000-U+F8FF)
    text = re.sub(r"[\ue000-\uf8ff]", " ", text)

    # Clean up whitespace
    text = re.sub(r"\s+", " ", text)  # Multiple spaces to single space
    text = text.strip()

    return text


def remove_empty_lines(text):
    lines = text.splitlines()
    # Filter out empty/whitespace-only lines using a list comprehension
    non_empty_lines = [line for line in lines if line.strip()]
    # Join the lines back into a single string with newlines
    cleaned_text = "\n".join(non_empty_lines)
    return cleaned_text


def extract_text_with_fitz(pdf_bytes):
    """Extract content from a PDF as HTML and return cleaned text"""
    if fitz is None:
        raise ImportError("PyMuPDF (fitz) not available")

    try:
        # Open PDF from bytes
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        full_html = ""
        for page in doc:
            full_html += page.get_text("html")

        doc.close()

        # Use regex to find and remove all <img> tags, ignoring case
        full_html = re.sub(r"<img[^>]*>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"<span[^>]*>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"</span>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"style\s*=\s*([\"']).*?\1", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(
            r"<p\s*>&#x[0-9a-fA-F]+;</p>",
            "",
            full_html,
            flags=re.IGNORECASE | re.DOTALL,
        )
        full_html = re.sub(r"^\s*[\r\n]+", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = remove_empty_lines(full_html)
        # print("\n\n\nPYTHON CALLED HERE!!!\n\n\n")

        return full_html

    except Exception as e:
        raise Exception(f"fitz extraction failed: {e}")


def process_pdf_extraction(request_body):
    """Process PDF extraction from request body"""
    print("DEBUG: Starting process_pdf_extraction")
    try:
        # Extract the base64-encoded PDF content
        pdf_base64 = request_body.get("pdf")

        if not pdf_base64:
            print("DEBUG: Missing pdf field")
            return {"success": False, "error": "Missing pdf field in request body"}

        # Decode the base64 PDF content
        try:
            pdf_bytes = base64.b64decode(pdf_base64)
            print(f"DEBUG: Decoded PDF bytes: {len(pdf_bytes)}")
        except Exception as e:
            print(f"DEBUG: Base64 decode error: {e}")
            return {"success": False, "error": f"Invalid base64 PDF data: {str(e)}"}

        # Extract text from PDF
        print("DEBUG: Calling extract_text_with_fitz")
        extracted_text = extract_text_with_fitz(pdf_bytes)
        print(f"DEBUG: Extracted text length: {len(extracted_text) if extracted_text else 0}")

        if not extracted_text or len(extracted_text.strip()) < 50:
            print("DEBUG: Insufficient text")
            return {"success": False, "error": "Unable to extract sufficient text from PDF"}

        # Clean the final text
        final_text = clean_text(extracted_text)
        print("DEBUG: Text cleaned")

        return {"success": True, "text": final_text, "library": "PyMuPDF"}

    except Exception as e:
        print(f"DEBUG: Exception in process_pdf_extraction: {e}")
        import traceback

        traceback.print_exc()
        return {"success": False, "error": f"PDF extraction failed: {str(e)}"}


# For running as a standalone script (called from Node.js)
if __name__ == "__main__":
    try:
        # Read JSON from stdin
        input_data = sys.stdin.read()
        request_body = json.loads(input_data)

        # Process the request
        result = process_pdf_extraction(request_body)

        # Output JSON result to stdout
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        error_result = {"success": False, "error": f"Script execution failed: {str(e)}"}
        print(json.dumps(error_result))
        sys.exit(1)


# For Vercel serverless function
class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            request_body = json.loads(post_data)

            # Process the request
            result = process_pdf_extraction(request_body)

            # Send response
            status_code = 200 if result.get("success") else 400
            self.send_response(status_code)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode("utf-8"))

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"success": False, "error": f"Request handling failed: {str(e)}"}
            self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
