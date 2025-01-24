import requests
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

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 28800})  # 8 hours
CORS(app)

@app.route('/api/news', methods=['GET'])
@cache.cached()
def get_news():
  #fetch_news_with_token_usage()
   try:
    response = requests.get('https://www.google.com', timeout=5)
    return {"status": "success", "code": response.status_code}
   except Exception as e:
    return {"status": "failure", "error": str(e)}

# Expose the Flask app for Vercel
app = app
# app.run(debug=True) 