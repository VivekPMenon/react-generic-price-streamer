from flask_caching import Cache
from flask import Flask, request, jsonify
import os
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools
from flask_cors import CORS

app = Flask(__name__)

cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 28900})  # 8 hours
CORS(app)

# Load API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
  raise ValueError("OpenAI API key is not set in environment variables.")

def execute_openai_api(command):
  yfinance_tools = YFinanceTools(
    stock_price=True,
    analyst_recommendations=False,
    company_info=True,
    company_news=True
  )

  finance_agent = Agent(
    name="Breaking News Agent",
    model=OpenAIChat(id="gpt-4o-mini", api_key=OPENAI_API_KEY),
    tools=[yfinance_tools],
    instructions=["do not include any images and always try to summarize"],
    # show_tool_calls=True,
    markdown=True
  )
  
  response = finance_agent.run(command)
  return response.content

@app.route('/news', methods=['GET'])
@cache.cached()
def fetch_news():
  market_news = execute_openai_api("Give me a summary of top 10 trending market news")
  earning_updates = execute_openai_api("Create small summary of the earning updates for top 10 companies listing the earning numbers, Revenue and 1 line market response to the earnings.")
  return {
    "market_news": market_news,
    "earning_updates": earning_updates
  }

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8080)