from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route('/api', methods=['GET'])
def home():
  return jsonify({"message": "Hello, Vercel!"})

# Expose the Flask app for Vercel
app = app
