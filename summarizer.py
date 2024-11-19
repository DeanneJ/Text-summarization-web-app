import spacy
from spacy.lang.en.stop_words import STOP_WORDS
import string
from heapq import nlargest
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from rake_nltk import Rake
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import nltk
import numpy as np

# Download necessary NLTK resources if not already available
nltk.download('punkt')
nltk.download('stopwords')

# Load spaCy English model
nlp = spacy.load("en_core_web_sm")

# Load BERT model for sentence embeddings
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# Define stop words and punctuation
stopwords = list(STOP_WORDS)
punctuation = string.punctuation + "\n"

def word_frequency(doc):
    """Calculate word frequency in a document."""
    word_counts = Counter()
    for word in doc:
        if word.text.lower() not in stopwords and word.text.lower() not in punctuation:
            word_counts[word.text.lower()] += 1
    return word_counts

def sentence_score(sentence_tokens, word_frequencies):
    """Score sentences based on word frequencies."""
    scores = {}
    for sent in sentence_tokens:
        score = 0
        for word in sent:
            if word.text.lower() in word_frequencies:
                score += word_frequencies[word.text.lower()]
        scores[sent.text] = score
    return scores

def lexrank(sentences, threshold=0.1):
    """Implement LexRank for sentence ranking."""
    similarity_matrix = np.zeros((len(sentences), len(sentences)))
    embeddings = bert_model.encode(sentences)
    
    for i in range(len(sentences)):
        for j in range(i, len(sentences)):
            if i == j:  # Similarity with itself is 1
                similarity_matrix[i][j] = 1.0
            else:
                similarity = cosine_similarity([embeddings[i]], [embeddings[j]])[0, 0]
                if similarity >= threshold:
                    similarity_matrix[i][j] = similarity
                    similarity_matrix[j][i] = similarity
    
    degree = similarity_matrix.sum(axis=1)
    lexrank_scores = degree / degree.max()  # Normalize by max degree

    lexrank_dict = {sentences[i]: lexrank_scores[i] for i in range(len(sentences))}
    return lexrank_dict

def tfidf_ranking(sentences):
    """TF-IDF-based ranking of sentences."""
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(sentences)
    scores = np.asarray((vectors * vectors.T).sum(axis=1)).flatten()
    tfidf_dict = {sentences[i]: scores[i] for i in range(len(sentences))}
    return tfidf_dict

def extract_keywords(text, num_keywords=10):
    """Keyword extraction using RAKE."""
    rake = Rake()
    rake.extract_keywords_from_text(text)
    keywords = rake.get_ranked_phrases()[:num_keywords]  # Extract top-n keywords
    return keywords

def generate_heading(keywords, summary):
    """Generate a suitable heading based on keywords and summary."""
    keyword_str = ' '.join(keywords)
    # summary_str = " ".join(summary)
    heading = f"{keyword_str[:50]}"  # Refined heading
    return heading

def bert_similarity(sentences):
    """Calculate BERT-based similarity scores for sentences."""
    embeddings = bert_model.encode(sentences)
    similarity_matrix = cosine_similarity(embeddings)
    scores = similarity_matrix.mean(axis=1)  # Average similarity score for each sentence
    bert_dict = {sentences[i]: scores[i] for i in range(len(sentences))}
    return bert_dict

def summarize(text, num_sentences=3):
    """Generate a summary for the given text."""
    # Preprocess and tokenize text with spaCy
    doc = nlp(text)
    word_frequencies = word_frequency(doc)
    
    # Create sentence objects and their text representation
    sentence_objects = list(doc.sents)  # List of spaCy sentence objects
    sentence_tokens = [sent.text for sent in sentence_objects]

    # Score sentences based on word frequencies
    frequency_scores = sentence_score(sentence_objects, word_frequencies)

    # Rank sentences using LexRank
    lexrank_scores = lexrank(sentence_tokens)

    # Rank sentences using TF-IDF
    tfidf_scores = tfidf_ranking(sentence_tokens)

    # Rank sentences using BERT similarity scores
    bert_scores = bert_similarity(sentence_tokens)

    # Combine scores from LexRank, TF-IDF, and BERT similarity
    combined_scores = defaultdict(float)
    for sentence in sentence_tokens:
        combined_scores[sentence] = (frequency_scores.get(sentence_objects[sentence_tokens.index(sentence)], 0) +
                                     lexrank_scores.get(sentence, 0) +
                                     tfidf_scores.get(sentence, 0) +
                                     bert_scores.get(sentence, 0))

    # Select top sentences based on combined scores
    summary_sentences = nlargest(num_sentences, combined_scores, key=combined_scores.get)

    # Extract keywords from the text
    keywords = extract_keywords(text)

    # Generate a heading based on the keywords and summary
    heading = generate_heading(keywords, summary_sentences)

    # Calculate word counts for original text and summary
    original_word_count = len(text.split())
    summary_word_count = len(" ".join(summary_sentences).split())

    return heading, " ".join(summary_sentences), original_word_count, summary_word_count