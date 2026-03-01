export const projectDocs = `
# SweetSpot AI: Online Sugarcane Pol Measurement System

## 1. Problem Understanding
**The Sugar Extraction Process:**
Sugar mills crush sugarcane to extract juice, which is then clarified, boiled, and crystallized to produce sugar. The efficiency of this process depends heavily on the quality of the incoming cane.

**What is Pol?**
"Pol" refers to the polarization of sugar, which is a measure of the sucrose content in the cane. It is the single most critical metric for determining the quality of the cane and the payment to farmers.

**Why Real-Time?**
Currently, mills use sampling methods (core sampling) which are slow, destructive, and represent only a tiny fraction of the load. Real-time measurement allows for:
- **Process Optimization:** Adjusting milling settings instantly based on cane hardness and sugar content.
- **Fair Payment:** Paying farmers based on the actual quality of their entire delivery, not just a sample.
- **Feed Forward Control:** Predicting sugar recovery and managing factory throughput.

## 2. Solution Design
**Technology Stack:**
We utilize **Near-Infrared (NIR) Spectroscopy** combined with **Computer Vision**.
- **NIR Spectroscopy:** Light in the 700-2500nm range interacts with O-H and C-H bonds in sucrose. The absorption spectrum provides a "fingerprint" of the sugar content.
- **Computer Vision:** A camera analyzes cane cleanliness (trash/mud content) and physical dimensions to correct the NIR readings.
- **Edge AI:** A Jetson Nano processes the spectral data locally to output a Pol % value in milliseconds.

## 3. System Architecture
1.  **Sensing Layer:**
    *   Industrial NIR Spectrometer (900-1700nm range) mounted over the conveyor.
    *   High-speed RGB Camera for trash detection.
    *   Ultrasonic distance sensor (to trigger readings when cane is present).
2.  **Edge Processing:**
    *   NVIDIA Jetson Nano or Raspberry Pi 4.
    *   Runs the spectral analysis and ML inference.
3.  **Communication:**
    *   MQTT / Modbus TCP to send data to the Mill Control System (PLC/SCADA).
    *   WebSocket to the Web Dashboard.
4.  **Cloud/Server:**
    *   Stores historical data for long-term trend analysis and model retraining.

## 4. Hardware Components
*   **Spectrometer:** Micro-spectrometer (e.g., Hamamatsu or Ocean Insight) or a low-cost custom build using discrete photodiodes for specific sucrose wavelengths.
*   **Light Source:** Halogen tungsten lamp (broadband IR source).
*   **Compute:** NVIDIA Jetson Nano (for low latency ML).
*   **Enclosure:** IP66 rated stainless steel box with air purging (positive pressure) to keep dust out.
*   **Mounting:** Vibration-dampened frame over the main cane carrier.

## 5. Software Architecture
*   **Data Pipeline:**
    1.  Trigger: Distance sensor detects cane.
    2.  Acquisition: Spectrometer captures raw intensity data.
    3.  Preprocessing: Dark current subtraction, Standard Normal Variate (SNV) correction.
    4.  Inference: Pre-trained 1D-CNN or PLS Regression model predicts Pol %.
    5.  Output: Value sent via API/MQTT.
*   **Dashboard:** React-based real-time visualization (this application).

## 6. Machine Learning Model
*   **Dataset:** Calibrated using lab samples. We collect spectral scans of cane and match them with wet-chemistry lab results for Pol.
*   **Model Type:** Partial Least Squares Regression (PLS) is standard, but we use a **1D Convolutional Neural Network (CNN)** for better handling of non-linearities caused by cane variety variations.
*   **Features:** Raw spectral absorbance values at 128 specific wavelengths.
*   **Training:** Python (scikit-learn/TensorFlow).

## 7. Prototype Implementation
(See the "Simulation" tab in this application for the working logic).

## 8. Deployment in Sugar Mill
*   **Installation:** Non-contact installation 30cm above the conveyor belt.
*   **Calibration:** An "Auto-Cal" routine runs every hour using a built-in white reference tile.
*   **Maintenance:** Air purge system keeps the lens clean.

## 9. Industrial Robustness
*   **Dust:** Positive pressure air curtain prevents dust settling on the lens.
*   **Vibration:** Solid state spectrometer (no moving parts) and rubber shock mounts.
*   **Moisture:** Sealed IP66 enclosure with desiccant packs.

## 10. Innovation & Hackathon Edge
*   **Hybrid Sensor Fusion:** We don't just use NIR. We use a camera to detect *mud*. Mud interferes with NIR. Our AI detects mud and flags the reading as "Low Confidence" or applies a correction factor.
*   **Digital Twin:** We generate a real-time "quality map" of the cane yard based on incoming trucks.

## 11. Diagrams
(See the "Architecture" tab for visual diagrams).

## 12. Presentation Materials (Pitch Deck Outline)
1.  **Title:** SweetSpot AI - The Future of Sugar Milling.
2.  **Problem:** The "Blind Spot" in milling - we don't know what's entering the mill until it's too late.
3.  **Solution:** Real-time, non-contact AI sensor.
4.  **Tech:** NIR + Computer Vision.
5.  **Demo:** Video of the prototype.
6.  **Market:** 1000+ Sugar mills globally.
7.  **Business Model:** Hardware sales + SaaS analytics.
8.  **Competition:** Lab analysis (slow) vs. Competitors (expensive).
9.  **Team:** Expertise in AI & Agri-tech.
10. **Ask:** Seed funding for pilot deployment.

## 13. Hackathon Demo Plan
*   **The Setup:** Use this Web Dashboard.
*   **The "Physical" Part:** If you have a webcam, point it at different objects (Green object = Good Cane, Brown object = Muddy Cane) and have the dashboard react (using simple color detection code).
*   **The Data:** Show the live graphs moving.
*   **The "Alert":** Simulate a "Low Sugar" event and show how the system alerts the operator.

## 14. Sample Edge Code (Python)
Below is the core logic that would run on the Jetson Nano to process the spectral data.

\`\`\`python
import numpy as np
import time
import paho.mqtt.client as mqtt
from scipy.signal import savgol_filter
import tensorflow as tf

# Configuration
BROKER = "192.168.1.100"
TOPIC = "mill/cane/quality"
MODEL_PATH = "models/pol_predictor_v2.tflite"

# Load TFLite Model
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def preprocess_spectrum(raw_intensity):
    # 1. Dark Current Subtraction
    corrected = raw_intensity - dark_reference
    
    # 2. Standard Normal Variate (SNV)
    mean = np.mean(corrected)
    std = np.std(corrected)
    snv = (corrected - mean) / std
    
    # 3. Savitzky-Golay Filter (Smoothing)
    smoothed = savgol_filter(snv, window_length=11, polyorder=2)
    return smoothed

def predict_pol(spectrum):
    # Prepare input
    input_data = np.array([spectrum], dtype=np.float32)
    interpreter.set_tensor(input_details[0]['index'], input_data)
    
    # Run inference
    interpreter.invoke()
    
    # Get output
    pol_percentage = interpreter.get_tensor(output_details[0]['index'])[0][0]
    return pol_percentage

def main():
    client = mqtt.Client()
    client.connect(BROKER, 1883, 60)
    
    print("System Ready. Waiting for trigger...")
    
    while True:
        if distance_sensor.detect_cane():
            # Capture Data
            raw_data = spectrometer.capture()
            
            # Process
            processed_data = preprocess_spectrum(raw_data)
            pol = predict_pol(processed_data)
            
            # Publish
            payload = {
                "timestamp": time.time(),
                "pol": float(pol),
                "status": "OK" if pol > 12.0 else "LOW_SUGAR"
            }
            client.publish(TOPIC, str(payload))
            print(f"Published: {pol}%")
            
        time.sleep(0.1)

if __name__ == "__main__":
    main()
\`\`\`
`;
