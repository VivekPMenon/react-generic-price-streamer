import os
import json
from dotenv import load_dotenv
# from parse_json_text import parse_json_text
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
  raise ValueError("OpenAI API key is not set in environment variables.")

yfinance_tools = YFinanceTools(
  stock_price=False,
  analyst_recommendations=False,
  company_info=False,
  company_news=True
)

finance_agent = Agent(
  name="Breaking News Agent",
  model=OpenAIChat(id="gpt-3.5-turbo", api_key=OPENAI_API_KEY),
  tools=[yfinance_tools],
  instructions=[
    "Summarize the top 10 market news as JSON with 'headline', 'summary', and 'source'."
  ],  
  show_tool_calls=True,
  markdown=False
)

def fetch_news_with_token_usage():
  response = finance_agent.run("Give top 10 market news as JSON")

  if hasattr(response, "metrics"):
    usage = response.metrics
    print(f"Prompt tokens: {usage.get('prompt_tokens', 0)}")
    print(f"Completion tokens: {usage.get('completion_tokens', 0)}")
    print(f"Total tokens: {usage.get('total_tokens', 0)}")
  else:
    print("Token usage details are not available in the response.")

  # finance_agent.print_response("What are the top 10 breaking news stories in the market?", stream=True)
  if hasattr(response, "content"):
    try:
      return response.content
    except json.JSONDecodeError as e:
      raise ValueError(f"Failed to decode JSON response: {e}")
  else:
    return []

# Call the function
# fetch_news_with_token_usage()
