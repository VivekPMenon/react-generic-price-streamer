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

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 1})  # 8 hours
CORS(app)

@app.route('/api/news', methods=['GET'])
@cache.cached()
def get_news():
  #fetch_news_with_token_usage()
  from phi.tools.yfinance import YFinanceTools

    # Initialize the YFinanceTools
  yfinance_tools = YFinanceTools(
        stock_price=False,
        analyst_recommendations=False,
        company_info=False,
        company_news=True
    )
    
  try:
        # Replace with a test query
    result = yfinance_tools.get_company_news(symbol="AAPL", num_stories=1)
    return {"status": "success", "data": result}
  except Exception as e:
    return {"status": "failure", "error": str(e)}

# Expose the Flask app for Vercel
app = app
# app.run(debug=True) 