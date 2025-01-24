import os
from dotenv import load_dotenv
from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.yfinance import YFinanceTools

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
  raise ValueError("OpenAI API key is not set in environment variables.")

# Configure YFinanceTools for breaking market news
yfinance_tools = YFinanceTools(
  stock_price=False,
  analyst_recommendations=False,
  company_info=False,
  company_news=True
)

# Create the agent with the YFinanceTools configuration
finance_agent = Agent(
  name="Breaking News Agent",
  model=OpenAIChat(id="gpt-3.5-turbo", api_key=OPENAI_API_KEY),
  tools=[yfinance_tools],
  instructions=["Extract and summarize the top 10 breaking news stories in the market."],
  show_tool_calls=True,
  markdown=True,
)

# Function to fetch and display breaking news with token usage
def fetch_news_with_token_usage():
  # Run the agent and fetch the response
  response = finance_agent.run("What are the top 10 breaking news stories in the market?")

  # Extract token usage details
  if hasattr(response, "metrics"):
    usage = response.metrics
    print(f"Prompt tokens: {usage.get('prompt_tokens', 0)}")
    print(f"Completion tokens: {usage.get('completion_tokens', 0)}")
    print(f"Total tokens: {usage.get('total_tokens', 0)}")
  else:
    print("Token usage details are not available in the response.")

  # Print the actual response content
  finance_agent.print_response("What are the top 10 breaking news stories in the market?", stream=True)

# Call the function
# fetch_news_with_token_usage()
