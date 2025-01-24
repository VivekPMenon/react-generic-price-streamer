from flask import Flask, request, jsonify
from openai import OpenAI
from news import fetch_market_news

client = OpenAI()

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
      return jsonify({'error': 'message is required'}), 400
    
    # fetch_market_news()
    # return 'success'
    
    try: 
      completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": "Just telling you hello"
                }
            ]
      )
        # Extract token usage information
      usage = completion.get('usage', {})
      prompt_tokens = usage.get('prompt_tokens', 0)
      completion_tokens = usage.get('completion_tokens', 0)
      total_tokens = usage.get('total_tokens', 0)

      print(f"Prompt tokens: {prompt_tokens}")
      print(f"Completion tokens: {completion_tokens}")
      print(f"Total tokens: {total_tokens}")
        
      return jsonify({'reply': completion.choices[0].message})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
  app.run(debug=True)
