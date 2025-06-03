from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np

# Flask uygulamasını başlatıyoruz
app = Flask(__name__)
CORS(app)  # React Native gibi farklı kaynaklardan gelen istekleri kabul etmesi için CORS aktif

# Modeli yükle (uygun .keras dosyasını ver)
model = tf.keras.models.load_model("EfficientNetB0_20epoch_final30.keras")
'''from tensorflow.keras.models import load_model

model = load_model("EfficientNetB0_20epoch_final30.keras", compile=False) '''


# Eğer modelinizde sınıf etiketleri varsa, buraya listeleyin
labels = ["Eczema",
    "Warts",
    "Melanoma",
    "Atopic Dermatitis",
    "Basal Cell Carcinoma",
    "Melanocytic Nevi",
    "Benign Keratosis",
    "Psoriasis",
    "Seborrheic Keratoses",
    "Fungal Infections"]

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Görüntü yüklenmedi"}), 400

    # Yüklenen resmi aç
    file = request.files["image"]
    image = Image.open(file.stream).convert("RGB")

    # Modelin beklediği boyuta çevir (224x224 genelde EfficientNet için standart)
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0  # normalize (0-1 arası)
    img_array = np.expand_dims(img_array, axis=0)  # batch boyutu eklenir

    # Tahmin yap
    predictions = model.predict(img_array)[0]

    # En yüksek 3 sonucu al
    top3 = np.argsort(predictions)[::-1][:3]

    results = [
        {
            "label": labels[i] if i < len(labels) else f"class_{i}",
            "confidence": float(predictions[i])
        }
        for i in top3
    ]

    return jsonify({"result": results})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)

 
 
''' from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
from tensorflow.keras.applications.efficientnet_v2 import preprocess_input

# Flask uygulamasını başlatıyoruz
app = Flask(__name__)
CORS(app)  # React Native gibi farklı kaynaklardan gelen istekleri kabul etmesi için CORS aktif

# Modeli yükle (uygun .keras dosyasını ver)
model = tf.keras.models.load_model("EfficientNetB0_20epoch_final30.keras")

# Eğer modelinizde sınıf etiketleri varsa, buraya listeleyin
labels = ["Eczema", "Warts", "Melanoma", "Atopic Dermatitis", "Basal Cell Carcinoma", 
          "Melanocytic Nevi", "Benign Keratosis", "Psoriasis", "Seborrheic Keratoses", 
          "Fungal Infections"]

# Görselin doğru şekilde işlenmesi için yardımcı fonksiyon
def process_image(image):
    # Modelin beklediği boyuta çevir (224x224 genelde EfficientNet için standart)
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0  # normalize (0-1 arası)
    img_array = np.expand_dims(img_array, axis=0)  # batch boyutu eklenir
    img_array = preprocess_input(img_array)  # EfficientNet için özel ön işleme
    return img_array

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
       
     return jsonify({"error": "Görüntü yüklenmedi"}), 400

    file = request.files["image"]
    
    # Geçerli görsel formatını kontrol et
    try:
        image = Image.open(file.stream).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Geçersiz görsel formatı: {str(e)}"}), 400

    # Görseli işleyip modele gönder
    img_array = process_image(image)

    # Tahmin yap
    predictions = model.predict(img_array)[0]

    # En yüksek 3 sonucu al
    top3 = np.argsort(predictions)[::-1][:3]

    results = [
        {
            "label": labels[i] if i < len(labels) else f"class_{i}",
            "confidence": float(predictions[i])
        }
        for i in top3
    ]

    return jsonify({"result": results})


if __name__ == '__main__':
    # Dinamik port kullanımı
    app.run(host='0.0.0.0', port=5050, debug=True)  # Portu dinamik hale getirebilirsiniz
'''