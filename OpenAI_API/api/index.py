from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api', methods=['GET'])
def home():
  return jsonify({"message": "Hello, Vercel!"})

# Expose the Flask app for Vercel
app = app
