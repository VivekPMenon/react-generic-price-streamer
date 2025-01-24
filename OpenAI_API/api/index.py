import sys
import os
from flask_caching import Cache

# Add the `api` folder to the module search path
sys.path.append(os.path.dirname(__file__))

import logging
from flask import Flask, jsonify
from flask_cors import CORS
from finance_agent import fetch_news_with_token_usage

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 28900})  # 8 hours
CORS(app)

@app.route('/api/news', methods=['GET'])
@cache.cached()
def get_news():
  #fetch_news_with_token_usage()
  return jsonify(fetch_news_with_token_usage())

# Expose the Flask app for Vercel
app = app
# app.run(debug=True) 