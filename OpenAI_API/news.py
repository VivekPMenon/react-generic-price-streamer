import requests


def fetch_market_news():
  try:
    url = f"https://newsapi.org/v2/top-headlines"
    params = {
      "category": "business",
      "country": "us"  # US news
    }
    response = requests.get(url, params=params)
    response.raise_for_status()  # Raise an exception for HTTP errors
    news_data = response.json()
    
    # Extract relevant information from the news articles
    articles = news_data.get("articles", [])
    trending_news = [
      {
        "title": article.get("title"),
        "description": article.get("description"),
        "url": article.get("url"),
        "source": article.get("source", {}).get("name")
      }
      for article in articles
    ]
    return trending_news
  except Exception as e:
    return {"error": str(e)}