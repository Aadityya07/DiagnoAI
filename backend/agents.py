import base64
import requests
import json
import os
import fitz  # PyMuPDF for handling PDFs
import easyocr # NEW: Dedicated Deep Learning OCR Engine
from PIL import Image, ImageStat

# Initialize the OCR Engine globally so it's lightning fast after the first boot
print("⏳ Initializing EasyOCR Neural Network...")
try:
    ocr_reader = easyocr.Reader(['en'], gpu=False) 
except Exception as e:
    print(f"⚠️ EasyOCR init failed: {e}")
    ocr_reader = None



# --- AGENT 1: THE TRIAGE AGENT (Two-Phase Agentic Bouncer) ---
def triage_xray_agent(image_path):
    """
    Agentic Routing: Uses deterministic math to check for color first, 
    saving AI compute power and eliminating hallucinations.
    """
    print("🕵️ [Agent: Triage] Executing Two-Phase Security Scan...")
    
    try:
        # ==========================================
        # PHASE 1: DETERMINISTIC MATH (Color Check)
        # ==========================================
        img = Image.open(image_path).convert('RGB')
        stat = ImageStat.Stat(img)
        
        # Calculate the variance between Red, Green, and Blue channels.
        # Grayscale images have equal RGB values. Colorful images have high variance.
        color_variance = max(stat.mean) - min(stat.mean)
        
        if color_variance > 10: 
            # The math proves this image has color. Reject instantly.
            print(f"🚫 [Agent: Triage] Phase 1 Block: Color detected mathematically (Variance: {color_variance:.2f})")
            return {"is_valid": False, "reason": "Colorful image detected. Please upload a grayscale medical scan."}
        
        print("✅ [Agent: Triage] Phase 1 Pass: Image is grayscale.")

        # ==========================================
        # PHASE 2: PROBABILISTIC AI (Anatomy Check)
        # ==========================================
        with open(image_path, "rb") as img_file:
            base64_image = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Because we already mathematically proved there is no color, 
        # we can give LLaVA a remarkably simple, hallucination-free prompt.
        prompt = """
        Look at the shapes in this grayscale image. Is the MAIN SUBJECT internal human anatomy?

        - YES (is_valid: true): I clearly see internal medical structures like lungs, ribs, a spine, or a CT cross-section.
        - NO (is_valid: false): I see a regular photograph of a person, a face, an animal, a landscape, a normal object, or a page of text/document.

        Respond ONLY with a JSON object.
        {"is_valid": true/false, "reason": "Very short explanation"}
        """
        
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "llava", 
            "prompt": prompt,
            "images": [base64_image],
            "stream": False
        }, timeout=60)
        
        if response.status_code == 200:
            result_text = response.json().get('response', '').strip()
            
            # Clean JSON brackets
            start_idx = result_text.find('{')
            end_idx = result_text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                result_text = result_text[start_idx:end_idx+1]
                
            return json.loads(result_text)
        else:
            return {"is_valid": False, "reason": "Vision agent offline."}
            
    except Exception as e:
        print(f"⚠️ [Agent: Triage] Security Bypass: {str(e)}")
        return {"is_valid": False, "reason": "Internal verification error."}

# --- AGENT 2: THE MEDICAL EXTRACTION AGENT (Dedicated OCR + Mistral) ---
def extract_lab_report_agent(report_file_path):
    print("📄 [Agent: Data Extractor] Initiating Two-Step OCR Pipeline...")
    
    try:
        extracted_raw_text = ""
        is_pdf = report_file_path.lower().endswith('.pdf')
        
        # STEP 1: PURE OCR EXTRACTION
        if is_pdf:
            print("📄 Detected PDF. Attempting native text extraction...")
            pdf_document = fitz.open(report_file_path)
            extracted_raw_text = pdf_document[0].get_text("text").strip()
            
            # If native text fails (it's a scanned image PDF), use EasyOCR
            if len(extracted_raw_text) < 20 and ocr_reader:
                print("📸 Scanned PDF detected. Booting EasyOCR vision...")
                pix = pdf_document[0].get_pixmap(matrix=fitz.Matrix(3, 3), alpha=False)
                temp_img = "temp_ocr.png"
                pix.save(temp_img)
                text_list = ocr_reader.readtext(temp_img, detail=0)
                extracted_raw_text = " ".join(text_list)
                if os.path.exists(temp_img): os.remove(temp_img)
            pdf_document.close()
        else:
            # It's an image file, use EasyOCR directly
            if ocr_reader:
                print("📸 Image detected. Booting EasyOCR vision...")
                text_list = ocr_reader.readtext(report_file_path, detail=0)
                extracted_raw_text = " ".join(text_list)
        
        print(f"🔍 RAW TEXT GRABBED: {extracted_raw_text[:150]}...")
        
        # STEP 2: FEED PERFECT TEXT TO MISTRAL
        print("🧠 Passing text to Mistral for intelligent JSON parsing...")
        
        prompt = f"""
        You are a highly precise medical data extraction AI. Read the following raw OCR text from a lab report.
        Extract the values for the following 5 parameters. 
        
        RAW REPORT TEXT:
        {extracted_raw_text}
        
        CRITICAL SYNONYM MAPPING (You must recognize these variations):
        1. "age": Look for "Age", "Age/Sex:", "Years", or "Yrs".
        2. "heart_rate": Look for "Heart Rate", "Average Heart Rate", "Resting Heart Rate", or "Pulse".
        3. "o2_saturation": Look for "O2 Saturation", "Oxygen Saturation", "SpO2", or "Room Air".
        4. "fasting_glucose": Look for "Fasting Glucose", "Fasting Blood Sugar".
        5. "hba1c": Look for "HbA1c", "Glycated Hemoglobin".
        
        If a value is completely missing from the text, set it to null.
        Respond ONLY with a valid JSON dictionary using these EXACT keys. Do not include markdown formatting:
        {{"age": <int>, "heart_rate": <int>, "o2_saturation": <int>, "fasting_glucose": <float>, "hba1c": <float>}}
        """

        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "mistral", 
            "prompt": prompt, 
            "stream": False
        }, timeout=60)
        
        if response.status_code == 200:
            result_text = response.json().get('response', '').strip()
            print(f"🤖 RAW Mistral Output: {result_text}")
            
            start_idx = result_text.find('{')
            end_idx = result_text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                clean_json = result_text[start_idx:end_idx+1]
                parsed_data = json.loads(clean_json)
                print(f"✅ Successfully Extracted: {parsed_data}")
                return parsed_data
                
        return {"age": None, "heart_rate": None, "o2_saturation": None, "fasting_glucose": None, "hba1c": None}
            
    except Exception as e:
        print(f"⚠️ [Agent: Data Extractor] Error: {str(e)}")
        return {"age": None, "heart_rate": None, "o2_saturation": None, "fasting_glucose": None, "hba1c": None}