from flask import Flask, request, jsonify
from flask_cors import CORS
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
            fitz = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def clean_text(text):
    """Clean extracted text to remove problematic characters"""
    if not text:
        return ""

    replacements = {
        "\ue04c": "-",
        "\ue000": " ",
        "\ue001": " ",
        "\ue002": " ",
        "\u2022": "•",
        "\u2013": "-",
        "\u2014": "-",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u00a0": " ",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    text = re.sub(r"[\ue000-\uf8ff]", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = text.strip()

    return text


def remove_empty_lines(text):
    lines = text.splitlines()
    non_empty_lines = [line for line in lines if line.strip()]
    cleaned_text = "\n".join(non_empty_lines)
    return cleaned_text


def extract_text_with_fitz(pdf_bytes):
    """Extract content from a PDF as HTML and return cleaned text"""
    if fitz is None:
        raise ImportError("PyMuPDF (fitz) not available")

    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        full_html = ""
        for page in doc:
            full_html += page.get_text("html")

        doc.close()

        # Clean HTML
        full_html = re.sub(r"<img[^>]*>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"<span[^>]*>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"</span>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"style\s*=\s*([\"']).*?\1", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"<p\s*>&#x[0-9a-fA-F]+;</p>", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = re.sub(r"^\s*[\r\n]+", "", full_html, flags=re.IGNORECASE | re.DOTALL)
        full_html = remove_empty_lines(full_html)
        print("Full HTML:\n", full_html, "\n\n")
        return full_html

    except Exception as e:
        raise Exception(f"fitz extraction failed: {e}")


@app.route("/extract", methods=["POST"])
def extract_pdf():
    """Extract text from PDF"""
    print("\n\n\n PYTHON CALLED MICROSERVICE \n\n\n")
    try:
        data = request.get_json()

        if not data or "pdf" not in data:
            return jsonify({"success": False, "error": "Missing pdf field in request body"}), 400

        # Decode the base64 PDF content
        pdf_base64 = data["pdf"]
        pdf_bytes = base64.b64decode(pdf_base64)

        # Extract text from PDF
        extracted_text = extract_text_with_fitz(pdf_bytes)

        if not extracted_text or len(extracted_text.strip()) < 50:
            return jsonify({"success": False, "error": "Unable to extract sufficient text from PDF"}), 400

        # Clean the final text
        final_text = clean_text(extracted_text)

        return jsonify({"success": True, "text": final_text, "library": "PyMuPDF"})

    except Exception as e:
        return jsonify({"success": False, "error": f"PDF extraction failed: {str(e)}"}), 500


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "PDF Extraction Service", "library": "PyMuPDF" if fitz else "None"})


if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("PDF Extraction Microservice")
    print("=" * 50)
    print("Running on: http://localhost:5001")
    print("Endpoints:")
    print("  POST /extract - Extract text from PDF")
    print("  GET  /health  - Health check")
    print("=" * 50 + "\n")

    app.run(host="0.0.0.0", port=5001, debug=True)
