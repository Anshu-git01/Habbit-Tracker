from flask import Flask, request, jsonify, send_from_directory
# from dotenv import load_dotenv
import google.generativeai as genai
import os

# load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')

genai.configure(api_key="AIzaSyDA4LSeO-BaYba1v_Uu9K2nyJ1Iny7BjpU")
model = genai.GenerativeModel("gemini-1.5-flash")
chat_session = model.start_chat(history=[
    {
        "role": "user",
        "parts": [
            "You are a smart and friendly AI assistant designed to help users track their habits. "
            "Your role is to assist with commands like 'create habit', 'log habit', 'remove habit', 'habit summary', 'suggest a habit', "
            "'check streak', 'set reminder', and 'motivate'. "
            "Always reply positively and concisely. If a user asks something unrelated to habit tracking, politely guide them back."
            "always reply with emojis like for creating habit,removing,summary etc and also give reply in friendly way"
            
        ]
    }
])


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    try:
        response = chat_session.send_message(user_input)
        return jsonify({"reply": response.text if response.text else "I'm here to support you through your exam stress!"})
    except Exception as e:
        return jsonify({"reply": f"Gemini API Error: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
