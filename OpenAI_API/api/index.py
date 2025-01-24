import sys
import os

# Add the `api` folder to the module search path
sys.path.append(os.path.dirname(__file__))

import logging
from flask import Flask, jsonify
from flask_cors import CORS
from finance_agent import fetch_news_with_token_usage

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)

CORS(app)

@app.route('/api', methods=['GET'])
def home():
  fetch_news_with_token_usage()
  return jsonify({"message": "Success!"})

# Expose the Flask app for Vercel
app = app
# app.run(debug=True)