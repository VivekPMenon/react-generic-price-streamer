import json
import re

def parse_json_text(response_content):
    try:
      # Use regex to extract the first JSON-like structure in the response
      json_match = re.search(r'\{.*\}', response_content, re.DOTALL)
        
      if json_match:
        json_string = json_match.group()
        return json.loads(json_string)
      else:
        raise ValueError("No JSON object found in the response.")
          
    except json.JSONDecodeError as e:
      print(f"Error decoding JSON: {e}")
    return None