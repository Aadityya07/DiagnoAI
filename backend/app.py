import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

# Import our robust pipeline
from ai_pipeline import analyze_xray, analyze_clinical_vitals, generate_clinical_insight, generate_audio_recommendation

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy, ready to receive data"})

@app.route('/api/analyze', methods=['POST'])
def analyze_patient_data():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
        
        file = request.files['image']
        image_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(image_path)

        vitals = request.form.to_dict()

        # Run the Analysis
        radiology_results = analyze_xray(image_path)
        clinical_results = analyze_clinical_vitals(vitals)
        insight = generate_clinical_insight(radiology_results, clinical_results)

        final_text = insight.get("insight_text")

        # --- THE MULTILINGUAL FIX ---
        # Translate to all 3 languages instantly so the frontend can swap them
        print("🌍 Translating insights to English, Hindi, and Marathi...")
        insights_multilingual = {
            "en": final_text,
            "hi": GoogleTranslator(source='en', target='hi').translate(final_text) if final_text else "",
            "mr": GoogleTranslator(source='en', target='mr').translate(final_text) if final_text else ""
        }

        return jsonify({
            "status": "success",
            "radiology_analysis": radiology_results,
            "clinical_analysis": clinical_results,
            "explainable_insight": insights_multilingual, # Now sending a dictionary!
            "confidence": insight.get("confidence"),
            "risk_level": insight.get("risk_level"),
            "audio_recommendation": None 
        }), 200

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# @app.route('/api/generate-audio', methods=['POST'])
# def generate_audio():
#     try:
#         data = request.json
#         text = data.get('text')
        
#         if not text:
#             return jsonify({"error": "No text provided"}), 400

#         audio_base64 = generate_audio_recommendation(text)
        
#         if audio_base64:
#             return jsonify({"status": "success", "audio_base64": audio_base64}), 200
#         else:
#             return jsonify({"error": "Failed to generate audio"}), 500
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@app.route('/api/generate-audio', methods=['POST'])
def generate_audio():
    try:
        data = request.json
        text = data.get('text')
        language = data.get('language', 'en') # Extract the language
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        # Pass the language to the generator
        audio_base64 = generate_audio_recommendation(text, language)
        
        if audio_base64:
            return jsonify({"status": "success", "audio_base64": audio_base64}), 200
        else:
            return jsonify({"error": "Failed to generate audio"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    print("🚀 Omni-Diagnostics AI Backend is running on port 5000...")
    app.run(debug=True, port=5000)