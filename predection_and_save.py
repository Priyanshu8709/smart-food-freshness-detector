import tensorflow as tf # type: ignore
from tensorflow.keras.preprocessing import image # type: ignore
import numpy as np # type: ignore
import os

# Load the trained model
model = tf.keras.models.load_model("freshness_model.h5")

# Image path (you can change this to your test image)
image_path = "test.jpg"

# Load and preprocess image
img = image.load_img(image_path, target_size=(128, 128))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0) / 255.0

# Make prediction
prediction = model.predict(img_array)[0][0]
label = "Fresh" if prediction > 0.5 else "Stale"
confidence = prediction if prediction > 0.5 else 1 - prediction
confidence = round(confidence * 100, 2)

# Save result to result.txt
with open("result.txt", "w") as f:
    f.write(f"Prediction: {label}\n")
    f.write(f"Confidence: {confidence}%\n")

print("Prediction complete. Check result.txt")