from flask import Flask, request, jsonify
import os
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools

app = Flask(__name__)

# Load API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
  raise ValueError("OpenAI API key is not set in environment variables.")

# Configure YFinanceTools
yfinance_tools = YFinanceTools(
  stock_price=False,
  analyst_recommendations=False,
  company_info=False,
  company_news=True
)

# Configure the agent
finance_agent = Agent(
  name="Breaking News Agent",
  model=OpenAIChat(id="gpt-4o-mini", api_key=OPENAI_API_KEY),
  tools=[yfinance_tools],
  instructions=[
    "Summarize the top 10 market news as JSON with 'headline', 'summary', and 'source' as URL to the source news."
  ],
  show_tool_calls=True,
  markdown=False
)

@app.route('/news', methods=['GET'])
def fetch_news():
  response = finance_agent.run("Give top 10 market news as JSON")
  return response.content

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=8080)
