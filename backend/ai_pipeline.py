from gtts import gTTS
import io
import os
import requests
import time
import base64
import json
from PIL import Image
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()

# --- API KEYS ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY") 

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# --- 1. GEMINI VISION API (Upgraded to Multi-Disease) ---
def analyze_xray(image_path):
    print("🔍 Sending X-Ray to Gemini Vision API...")
    
    if not GEMINI_API_KEY:
        return {"Pneumonia": 0, "Lung_Cancer": 0, "Tuberculosis": 0, "Normal": 100}

    try:
        model = genai.GenerativeModel("models/gemini-3-flash-preview")
        img = Image.open(image_path).convert('RGB')
        
        # UPGRADED PROMPT: Now detects 4 classes!
        vision_prompt = """
        You are an expert AI radiologist. Analyze this chest X-ray image. 
        Return ONLY a raw JSON object with exactly four keys: "Pneumonia", "Lung_Cancer", "Tuberculosis", and "Normal". 
        The values must be integer probabilities (0 to 100) that add up to exactly 100. 
        Do not include markdown blocks or text. 
        Example: {"Pneumonia": 10, "Lung_Cancer": 80, "Tuberculosis": 0, "Normal": 10}
        """
        
        response = model.generate_content([vision_prompt, img])
        result_text = response.text.strip()
        
        if result_text.startswith("```json"):
            result_text = result_text.replace("```json", "").replace("```", "").strip()
        elif result_text.startswith("```"):
            result_text = result_text.replace("```", "").strip()
            
        cleaned_results = json.loads(result_text)
        
        # Ensure all values are integers to prevent the 1.5 vs 2% mismatch
        return {k: int(round(float(v))) for k, v in cleaned_results.items()}
        
    except Exception as e:
        print(f"⚠️ Gemini API Error: {str(e)}")
        return {"Pneumonia": 0, "Lung_Cancer": 0, "Tuberculosis": 0, "Normal": 100}


# --- 2. PROBABILISTIC CLINICAL ENGINE (Simulated ML) ---
def analyze_clinical_vitals(vitals):
    # Extract values
    age = int(vitals.get("age", 0))
    pack_years = int(vitals.get("smoking_history", 0)) 
    o2_saturation = int(vitals.get("o2_saturation", 98))
    heart_rate = int(vitals.get("heart_rate", 75))
    fasting_glucose = float(vitals.get("fasting_glucose", 90))
    hba1c = float(vitals.get("hba1c", 5.0))
    genomic_risk = vitals.get("genomic_risk", "Low").title() 
    weight_loss = vitals.get("weight_loss", "no").lower() == "yes"
    cough_duration = int(vitals.get("cough_duration", 0)) 

    notes = []

    # --- DYNAMIC RISK SCORING ALGORITHM (0-100%) ---
    # Instead of hardcoded "High/Low", we build a percentage based on feature weights

    # 1. Cancer Risk Calculation
    cancer_risk = (age * 0.3) + (pack_years * 2.5)
    if genomic_risk == "High": cancer_risk += 35
    if weight_loss: cancer_risk += 15
    if cancer_risk > 40: notes.append("Patient profile shows statistically elevated oncology risk factors.")

    # 2. TB Risk Calculation
    tb_risk = 5
    if weight_loss: tb_risk += 40
    if cough_duration > 14: tb_risk += 35
    if tb_risk > 50: notes.append("Constitutional symptoms strongly correlate with Tuberculosis profiles.")

    # 3. Diabetes Risk Calculation
    diabetes_risk = 5
    if fasting_glucose > 100: diabetes_risk += ((fasting_glucose - 100) * 1.5)
    if hba1c > 5.7: diabetes_risk += ((hba1c - 5.7) * 20)
    if diabetes_risk > 60: notes.append("Metabolic panels indicate severe glycemic dysregulation.")

    # 4. Asthma / COPD Calculation
    asthma_risk = 10
    if pack_years > 5: asthma_risk += 20
    if cough_duration > 7: asthma_risk += 15
    if heart_rate > 90: asthma_risk += 15
    if o2_saturation < 95: asthma_risk += ((95 - o2_saturation) * 5)

    # 5. Pneumonia Clinical Base Risk
    pneumonia_risk = 5
    if cough_duration > 3: pneumonia_risk += 15
    if o2_saturation < 94: pneumonia_risk += ((94 - o2_saturation) * 8)
    if heart_rate > 100: pneumonia_risk += 15

    # Cap all risks at a maximum of 95% to account for clinical uncertainty
    return {
        "Cancer_Risk": min(int(cancer_risk), 95),
        "TB_Risk": min(int(tb_risk), 95),
        "Diabetes_Risk": min(int(diabetes_risk), 95),
        "Asthma_Risk": min(int(asthma_risk), 95),
        "Pneumonia_Risk": min(int(pneumonia_risk), 95),
        "Clinical_Notes": notes if notes else ["Vitals are within standard baseline parameters."]
    }


# --- 3. HYBRID FUSION ENGINE (Mistral LLM + Fallback) ---
def generate_clinical_insight(radiology_results, clinical_results):
    print("🧠 Attempting Multimodal Fusion via Ollama (Mistral)...")
    prompt = f"""You are an expert AI diagnostic assistant. I am providing you with two data points for a patient:
1. Radiology (X-Ray Output): {radiology_results}
2. Clinical Vitals & EHR: {clinical_results}

Task: Provide a clinical insight. 
IMPORTANT FORMATTING RULES:
- Do NOT use markdown asterisks (**) or hashes (#).
- Use HTML <b> tags to bold the names of diseases (e.g. <b>Lung Cancer</b>).
- Keep it to 3 short, punchy paragraphs.
- End with one clear Preventive Action."""

    try:
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "mistral", "prompt": prompt, "stream": False
        }, timeout=60) 
        
        if response.status_code == 200:
            print("✅ Mistral Fusion Successful!")
            mistral_text = response.json()['response']
            confidence = max(radiology_results.values()) if radiology_results and not radiology_results.get("error") else 0
            risk_level = "LOW" if "Normal respiratory function" in mistral_text else "HIGH"
            return {"insight_text": mistral_text, "confidence": confidence, "risk_level": risk_level}
        else:
            print(f"⚠️ Mistral returned {response.status_code}. Triggering Fallback...")
    except Exception as e:
        print(f"⚠️ Mistral Connection Failed ({str(e)}). Triggering Fallback...")

    # THE SILENT FALLBACK 
    print("🛡️ Fallback Engine Activated: Generating deterministic clinical insight.")
    high_risks = []
    if clinical_results.get("Cancer_Risk") == "High": high_risks.append("Lung Cancer")
    if clinical_results.get("TB_Risk") == "High": high_risks.append("Tuberculosis")
    if clinical_results.get("Diabetes_Risk") == "High": high_risks.append("Diabetes Type 2")
    if clinical_results.get("Asthma_Risk") == "High": high_risks.append("Asthma/COPD")
    if radiology_results.get("Pneumonia", 0) > 70 or clinical_results.get("Pneumonia_Risk") == "High": high_risks.append("Acute Pneumonia")

    primary_diagnosis = f"Elevated risk detected for: {', '.join(high_risks)}." if high_risks else "Normal health parameters."

    insight_bullets = []
    pneumonia_prob = radiology_results.get('Pneumonia', 0)
    if pneumonia_prob > 50: insight_bullets.append(f"Radiological Assessment: Infection opacity detected ({pneumonia_prob}%).")
    
    if clinical_results.get("Clinical_Notes"):
        insight_bullets.append(f"Multimodal Synthesis: {' '.join(clinical_results['Clinical_Notes'])}")

    if "Diabetes Type 2" in high_risks: insight_bullets.append("Preventive Action: Start continuous glucose monitoring and consult endocrinologist.")
    if "Asthma/COPD" in high_risks: insight_bullets.append("Preventive Action: Prescribe bronchodilator inhaler and monitor wearable HR/O2 trends.")
    if "Lung Cancer" in high_risks: insight_bullets.append("Preventive Action: Immediate referral for Low-Dose CT (LDCT) scan.")
    if "Tuberculosis" in high_risks: insight_bullets.append("Preventive Action: Isolate patient, initiate sputum AFB smear/culture.")
    if "Acute Pneumonia" in high_risks: insight_bullets.append("Preventive Action: Administer supplemental oxygen and consider broad-spectrum antibiotics.")
    
    if not high_risks: insight_bullets.append("Preventive Action: Maintain routine annual check-ups.")

    final_text = f"Primary Multimodal Diagnosis: {primary_diagnosis}\n\nExplainable Insights:\n"
    for bullet in insight_bullets: final_text += f"• {bullet}\n"

    confidence = max(radiology_results.values()) if radiology_results and not radiology_results.get("error") else 0
    risk_level = "HIGH" if high_risks else "LOW"
    return {"insight_text": final_text, "confidence": confidence, "risk_level": risk_level}

# # --- 4. ELEVENLABS AUDIO GENERATOR ---
# def generate_audio_recommendation(text):
#     """Generates multilingual voice suggestions using ElevenLabs."""
    
#     if not ELEVENLABS_API_KEY:
#         print("⚠️ ElevenLabs API Key missing!")
#         return None
        
#     print("🎙️ Generating Voice Recommendation via ElevenLabs...")
#     url = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL"
#     headers = {"Accept": "audio/mpeg", "Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_KEY}
    
#     # We will pass the full text, but let's cap it at 500 characters to save credits
#     short_text = text if len(text) < 500 else text[:500] + "..."

#     # eleven_multilingual_v2 automatically detects English, Hindi, etc.
#     data = {
#         "text": short_text, 
#         "model_id": "eleven_multilingual_v2", 
#         "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
#     }
    
#     try:
#         response = requests.post(url, json=data, headers=headers)
#         if response.status_code == 200:
#             audio_base64 = base64.b64encode(response.content).decode('utf-8')
#             print("✅ Audio Generated Successfully!")
#             return audio_base64
#         else:
#             print(f"⚠️ ElevenLabs Error: {response.text}")
#             return None
#     except Exception as e:
#         print(f"⚠️ ElevenLabs Exception: {str(e)}")
#         return None


# # --- 4. FREE AUDIO GENERATOR (gTTS) ---
# def generate_audio_recommendation(text):
#     """Generates multilingual voice suggestions using Google TTS (Free & Unlimited)."""
#     print("🎙️ Generating Voice Recommendation via gTTS...")
    
#     # Cap the text to save time during the demo
#     short_text = text if len(text) < 500 else text[:500] + "..."

#     try:
#         # Generate the audio in memory
#         tts = gTTS(text=short_text, lang='en') # You can change 'en' to 'hi' or 'mr' dynamically if you want!
#         fp = io.BytesIO()
#         tts.write_to_fp(fp)
#         fp.seek(0)
        
#         # Convert to base64 for the frontend
#         audio_base64 = base64.b64encode(fp.read()).decode('utf-8')
#         print("✅ Audio Generated Successfully!")
#         return audio_base64
#     except Exception as e:
#         print(f"⚠️ Audio Generation Exception: {str(e)}")
#         return None


# --- 4. SMART AUDIO GENERATOR (ElevenLabs with gTTS Fallback) ---
def generate_audio_recommendation(text, lang="en"):
    """Generates multilingual voice suggestions. Tries ElevenLabs, falls back to gTTS."""
    
    # Cap the text to save time/credits during the demo
    short_text = text if len(text) < 500 else text[:500] + "..."

    # ATTEMPT 1: ElevenLabs (Premium Voice)
    if ELEVENLABS_API_KEY:
        print("🎙️ Attempting Premium Voice Generation via ElevenLabs...")
        url = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL"
        headers = {"Accept": "audio/mpeg", "Content-Type": "application/json", "xi-api-key": ELEVENLABS_API_KEY}
        
        # eleven_multilingual_v2 automatically detects the language based on the text!
        data = {
            "text": short_text, 
            "model_id": "eleven_multilingual_v2", 
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        
        try:
            response = requests.post(url, json=data, headers=headers)
            if response.status_code == 200:
                audio_base64 = base64.b64encode(response.content).decode('utf-8')
                print("✅ ElevenLabs Audio Generated Successfully!")
                return audio_base64
            else:
                print(f"⚠️ ElevenLabs Blocked/Failed (Code: {response.status_code}). Initiating Fallback...")
        except Exception as e:
            print(f"⚠️ ElevenLabs Exception: {str(e)}. Initiating Fallback...")
    else:
        print("⚠️ No ElevenLabs API Key found. Initiating Fallback...")

    # ATTEMPT 2: gTTS (Free Fallback)
    print(f"🎙️ Generating Voice via gTTS Fallback (Language: {lang})...")
    try:
        tts = gTTS(text=short_text, lang=lang) 
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_base64 = base64.b64encode(fp.read()).decode('utf-8')
        print("✅ gTTS Audio Generated Successfully!")
        return audio_base64
    except Exception as e:
        print(f"⚠️ gTTS Generation Exception: {str(e)}")
        return None