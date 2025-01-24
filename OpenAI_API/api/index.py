from flask import Flask, jsonify
from flask_cors import CORS
from finance_agent import fetch_news_with_token_usage

app = Flask(__name__)

CORS(app)

@app.route('/api', methods=['GET'])
def home():
  fetch_news_with_token_usage()
  return jsonify({"message": "Success!"})

# Expose the Flask app for Vercel
app = app
