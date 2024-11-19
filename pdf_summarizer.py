import PyPDF2
import spacy
from summarizer import summarize
from PyPDF2 import PdfReader  # Update the import statement

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file using PyPDF2."""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfFileReader(file)
            # Iterate through each page in the PDF and extract text
            for page_num in range(reader.numPages):
                page = reader.getPage(page_num)
                text += page.extract_text() if page.extract_text() else ""
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

# def summarize_pdf(file_path):
#     """Extract text from a PDF and generate a summary."""
#     # Extract text from the PDF
#     text = extract_text_from_pdf(file_path)
    
#     if not text:
#         return None, None, 0, 0  # Return empty values if text extraction failed
    
#     # Generate summary for the extracted text using the summarize function
#     heading, summary, original_word_count, summary_word_count = summarize(text)
#     return heading, summary, original_word_count, summary_word_count


def summarize_pdf(file_path):
    try:
        # Open the PDF file
        with open(file_path, 'rb') as file:
            reader = PdfReader(file)  # Use PdfReader instead of PdfFileReader
            text = ""
            
            # Extract text from each page
            for page in reader.pages:
                text += page.extract_text() or ""  # Ensure to handle None values

        # Now you can proceed to summarize the extracted text
        heading, summary, original_word_count, summary_word_count = summarize(text)
        
        return heading, summary, original_word_count, summary_word_count

    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        raise  # Re-raise the exception to be handled by the Flask route
