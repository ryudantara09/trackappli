from http.server import BaseHTTPRequestHandler
import json
import base64
import io
import sys

try:
    import pdfplumber
    PDF_LIBRARY = 'pdfplumber'
except ImportError:
    try:
        import PyPDF2
        PDF_LIBRARY = 'PyPDF2'
    except ImportError:
        PDF_LIBRARY = None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for PDF text extraction"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            # Parse JSON request
            try:
                data = json.loads(body.decode('utf-8'))
            except json.JSONDecodeError:
                self.send_error_response(400, 'Invalid JSON in request body')
                return
            
            # Validate required fields
            if 'pdf' not in data:
                self.send_error_response(400, 'Missing required field: pdf')
                return
            
            # Decode base64 PDF
            try:
                pdf_bytes = base64.b64decode(data['pdf'])
            except Exception as e:
                self.send_error_response(400, f'Invalid base64 encoding: {str(e)}')
                return
            
            # Extract text from PDF
            try:
                extracted_text = self.extract_text_from_pdf(pdf_bytes)
            except Exception as e:
                self.send_error_response(500, f'PDF extraction failed: {str(e)}')
                return
            
            # Return success response
            self.send_json_response(200, {
                'success': True,
                'text': extracted_text,
                'library': PDF_LIBRARY
            })
            
        except Exception as e:
            self.send_error_response(500, f'Internal server error: {str(e)}')
    
    def extract_text_from_pdf(self, pdf_bytes):
        """Extract text from PDF bytes using available library"""
        if PDF_LIBRARY is None:
            raise Exception('No PDF library available (pdfplumber or PyPDF2 required)')
        
        pdf_file = io.BytesIO(pdf_bytes)
        extracted_text = []
        
        if PDF_LIBRARY == 'pdfplumber':
            # Use pdfplumber (preferred for better text extraction)
            try:
                with pdfplumber.open(pdf_file) as pdf:
                    if len(pdf.pages) == 0:
                        raise Exception('PDF has no pages')
                    
                    for page in pdf.pages:
                        text = page.extract_text()
                        if text:
                            extracted_text.append(text)
                    
                    if not extracted_text:
                        raise Exception('No text could be extracted from PDF (may be image-based)')
                    
                    return '\n\n'.join(extracted_text)
            except Exception as e:
                raise Exception(f'pdfplumber extraction failed: {str(e)}')
        
        elif PDF_LIBRARY == 'PyPDF2':
            # Fallback to PyPDF2
            try:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                if len(pdf_reader.pages) == 0:
                    raise Exception('PDF has no pages')
                
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text.append(text)
                
                if not extracted_text:
                    raise Exception('No text could be extracted from PDF (may be image-based)')
                
                return '\n\n'.join(extracted_text)
            except Exception as e:
                raise Exception(f'PyPDF2 extraction failed: {str(e)}')
    
    def send_json_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_json_response(status_code, {
            'success': False,
            'error': message
        })
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
