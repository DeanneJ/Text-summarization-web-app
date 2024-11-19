from flask import Flask, request, jsonify
from flask_cors import CORS #allow your API to be accessed from different domains.
from werkzeug.utils import secure_filename
import os
from pdf_summarizer import summarize_pdf  # Import the new PDF summarizer
from summarizer import summarize  # Import your summarize function here

from helper import preprocessing, vectorizer, get_prediction

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Create a folder to store uploaded PDF files
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text = data.get('text', '')
    try:
        heading, summary, original_word_count, summary_word_count = summarize(text)
        return jsonify({
            'heading': heading,
            'summary': summary,
            'original_word_count': original_word_count,
            'summary_word_count': summary_word_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/feedback', methods=['POST'])
def analyze_feedback():
    result = ""
    data = request.get_json()
    feedback = data.get('feedback', '')
    if feedback:
        preprocessed_text = preprocessing(feedback)
        vectorized_text = vectorizer(preprocessed_text)
        prediction = get_prediction(vectorized_text)
        
        return jsonify({
            'message': 'Feedback received successfully!',
            'result': prediction
        })
    
    
    return jsonify({'error': 'No feedback provided'}), 400


# New route for PDF summarization
@app.route('/api/summarize-pdf', methods=['POST'])
def summarize_pdf_route():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)  # Save the uploaded PDF

        # Generate summary for the PDF
        try:
            heading, summary, original_word_count, summary_word_count = summarize_pdf(file_path)
            if heading and summary:
                return jsonify({
                    'heading': heading,
                    'summary': summary,
                    'original_word_count': original_word_count,
                    'summary_word_count': summary_word_count
                })
            else:
                return jsonify({'error': 'Failed to summarize PDF content'}), 500
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return jsonify({'error': 'Invalid file format. Please upload a PDF file.'}), 400





if __name__ == '__main__':
    app.run(port=5001)  # Use a different port to avoid conflict with the Node.js server
