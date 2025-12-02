/**
 * LlamaParse Client
 * 
 * Provides PDF parsing capabilities using LlamaParse API
 */

/**
 * Parse PDF using LlamaParse API (v2 multipart endpoint)
 * 
 * @param pdfBuffer - PDF file as Buffer
 * @returns Extracted text from PDF
 */
export async function parsePDFWithLlamaParse(
    pdfBuffer: Buffer
): Promise<string> {
    const apiKey = process.env.LLAMAPARSE_API_KEY;

    if (!apiKey) {
        throw new Error('LLAMAPARSE_API_KEY environment variable is not set');
    }

    try {
        // Create form data with the PDF
        const formData = new FormData();
        const uint8Array = new Uint8Array(pdfBuffer);
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        formData.append('file', blob, 'document.pdf');

        console.log('Uploading PDF to LlamaParse v2 multipart endpoint...');

        // Call LlamaParse v2 multipart upload API
        const response = await fetch('https://api.cloud.llamaindex.ai/api/v1/parsing/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('LlamaParse upload failed:', response.status, errorText);
            throw new Error(
                `LlamaParse API failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();
        console.log('LlamaParse response:', data);

        // V2 API returns the parsed content directly or a job ID
        if (data.markdown) {
            // Direct response with markdown
            console.log(`Successfully extracted ${data.markdown.length} characters`);
            return data.markdown;
        }

        if (data.id) {
            // Job-based response - poll for results
            return await pollForResults(data.id, apiKey);
        }

        throw new Error('Unexpected response format from LlamaParse');
    } catch (error) {
        console.error('LlamaParse error:', error);
        throw error;
    }
}

/**
 * Poll for LlamaParse job results
 */
async function pollForResults(jobId: string, apiKey: string): Promise<string> {
    console.log('Polling for results, job ID:', jobId);

    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait

    while (attempts < maxAttempts) {
        const statusResponse = await fetch(
            `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json',
                },
            }
        );

        if (statusResponse.ok) {
            const result = await statusResponse.json();
            console.log(`Attempt ${attempts + 1}: Status = ${result.status || 'unknown'}`);

            if (result.status === 'SUCCESS' || result.markdown) {
                const extractedText = result.markdown || '';

                if (!extractedText || extractedText.trim().length === 0) {
                    console.error('Empty text in result:', result);
                    throw new Error('No text extracted from PDF');
                }

                console.log(`Successfully extracted ${extractedText.length} characters`);
                return extractedText;
            }

            if (result.status === 'ERROR') {
                console.error('LlamaParse job failed:', result);
                throw new Error(`LlamaParse job failed: ${JSON.stringify(result)}`);
            }
        } else {
            console.log(`Attempt ${attempts + 1}: HTTP ${statusResponse.status}`);
        }

        // Wait 1 second before next attempt
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
    }

    throw new Error(`LlamaParse parsing timed out after ${maxAttempts} seconds`);
}
