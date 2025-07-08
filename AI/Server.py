import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from flask import Flask, request, jsonify
from PIL import Image
import io

app = Flask(__name__)

IMAGE_SIZE = (150, 150)
BATCH_SIZE = 32
EPOCHS = 40

BRAIN_TUMOR_CLASSES = ['glioma', 'meningioma', 'notumor', 'pituitary']
# LUNG_CANCER_CLASSES = ['benign', 'malignant', 'normal']
# SKIN_DISEASE_CLASSES = ['acne', 'eczema', 'melanoma', 'normal', 'psoriasis']
# TUBERCULOSIS_CLASSES = ['normal', 'tuberculosis']

brain_model_path = 'brain_tumor_model.h5'
if not os.path.exists(brain_model_path):
    raise FileNotFoundError(f'Brain tumor model file not found: {brain_model_path}')

brain_model = tf.keras.models.load_model(brain_model_path)
print('Brain tumor model loaded successfully!')

# lung_model_path = 'lung_cancer_model.h5'
# if not os.path.exists(lung_model_path):
#     raise FileNotFoundError(f'Lung cancer model file not found: {lung_model_path}')

# lung_model = tf.keras.models.load_model(lung_model_path)
# print('Lung cancer model loaded successfully!')

# skin_model_path = 'skin_disease_model.h5'
# if not os.path.exists(skin_model_path):
#     raise FileNotFoundError(f'Skin disease model file not found: {skin_model_path}')

skin_model = tf.keras.models.load_model(skin_model_path)
print('Skin disease model loaded successfully!')

# tb_model_path = 'chest_tuberculosis_model.h5'
# if not os.path.exists(tb_model_path):
#     raise FileNotFoundError(f'Tuberculosis model file not found: {tb_model_path}')

# tb_model = tf.keras.models.load_model(tb_model_path)
# print('Tuberculosis model loaded successfully!')

from flask_cors import CORS
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    scan_type = request.form.get('scanType')
    body_part = request.form.get('bodyPart')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        image_bytes = file.read()
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB')
        
        if scan_type and body_part:
            if scan_type.lower() == 'mri' and body_part.lower() == 'brain':
                target_size = (150, 150)
                model = brain_model
                classes = BRAIN_TUMOR_CLASSES
            # elif scan_type.lower() == 'ct' and body_part.lower() == 'lung':
            #     target_size = (224, 224)
            #     model = lung_model
            #     classes = LUNG_CANCER_CLASSES
            # elif scan_type.lower() == 'xray' and body_part.lower() == 'chest':
            #     target_size = (150, 150)
            #     model = tb_model
            #     classes = TUBERCULOSIS_CLASSES
            else:
                return jsonify({'error': 'Unsupported scan type or body part combination'}), 400
        else:
            target_size = (224, 224)
            model = skin_model
            classes = SKIN_DISEASE_CLASSES
            
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = img_array.astype('float32') / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = model.predict(img_array)
        predicted_class = classes[np.argmax(prediction[0])]
        confidence = float(np.max(prediction[0]))

        return jsonify({
            'status': 'success',
            'class': predicted_class,
            'confidence': confidence
        })
 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)