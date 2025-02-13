import sys
import os
from flask_caching import Cache

sys.path.append(os.path.dirname(__file__))

import logging
from flask import Flask, jsonify
from flask_cors import CORS
from finance_agent import fetch_news_with_token_usage

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 28900})  # 8 hours
CORS(app)

cached_data = None

def init_cache():
  global cached_data 
  cached_data = fetch_news_with_token_usage()

init_cache()

@app.route('/api/news', methods=['GET'])
# @cache.cached()
def get_news():
  #fetch_news_with_token_usage()
  return cached_data if cached_data is not None else fetch_news_with_token_usage()

# Expose the Flask app for Vercel
app = app
# app.run(debug=True) 