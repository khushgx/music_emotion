from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from open import get_composed_emotion

from PIL import Image
import io, base64
import webcolors

def rgb_to_name_with_fallback(rgb_tuple):
    try:
        hex_value = "#{:02x}{:02x}{:02x}".format(rgb_tuple[0], rgb_tuple[1], rgb_tuple[2])
        return webcolors.hex_to_name(hex_value)
    except ValueError:
        return hex_value

def get_dominant_colors(image_data, top_colors=5):
    image = Image.open(io.BytesIO(base64.b64decode(image_data.split(',')[1])))
    image = image.resize((25, 25)) 
    result = image.convert('RGB').getcolors(625)
    sorted_colors = sorted(result, key=lambda x: x[0], reverse=True)
    dominant_colors = sorted_colors[:top_colors]
    print("These are the dominant colors" ,dominant_colors)
    return [(rgb_to_name_with_fallback(item[1]), item[0]) for item in dominant_colors if item[0] > 1]


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Emotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    value = db.Column(db.Integer, nullable=False)

@app.route('/')
def home():
    print("hi")
    return "Hello, this is the backend server!"

@app.route('/save_emotions', methods=['POST'])
def save_emotions():
    print("save_emotions endpoint was hit!")
    emotions_data = request.json
    
    for emotion_data in emotions_data:
        emotion = Emotion(name=emotion_data['name'], value=emotion_data['value'])
        db.session.add(emotion)

    db.session.commit()
    response = jsonify({"message": "saved da emotions!"})
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response, 200

@app.route('/get_playlist', methods=['GET'])
def get_playlist():

    all_emotions = Emotion.query.all()
    
    emotion_percent_pairs = [{"emotion": emotion.name, "percentage": emotion.value} for emotion in all_emotions]

    songs = get_composed_emotion(emotion_percent_pairs)
    response = jsonify(songs)
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response

@app.route('/save_moodboard_image', methods=['POST'])
def save_moodboard_image():
    image_data = request.json['image']
    dominant_colors = get_dominant_colors(image_data)

    total_pixels = sum([color[1] for color in dominant_colors])
    for color_name, pixel_count in dominant_colors:
        percentage = (pixel_count / total_pixels) * 100
        emotion = Emotion(name=color_name, value=percentage)
        db.session.add(emotion)
    
    db.session.commit()
    response = jsonify({"message": "saved mood board colors as emotions!"})
    response.headers.set("Access-Control-Allow-Origin", "*")
    return response, 200


    


if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
    app.run(debug=True)
