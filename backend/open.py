import openai
from metaphor_python import Metaphor
import os

openai.api_key = os.environ.get('OPENAI_API_KEY')
metaphor = Metaphor(os.environ.get('METAPHOR_API_KEY'))

def get_composed_emotion(emotion_percent_pairs):

    emotion_strings = [f"{pair['percentage']}% {pair['emotion']}" for pair in emotion_percent_pairs]
    print(emotion_strings)

    USER_QUESTION = f"Give me an emotion that represents the mixture of {', '.join(emotion_strings)}.IF the emotions are colors, convert the colors to their respective emotions and then give one final emotion"
    SYSTEM_MESSAGE = "You are a helpful psychologist assistant. Respond with a single word that best describes the result of the given emotions and percentages."
    
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_MESSAGE},
            {"role": "user", "content": USER_QUESTION},
        ],
    )
    query = completion.choices[0].message.content.strip()
    prompt_for_met = f"Find songs on soundcloud that represent this emotion: {query}"
    print(query)
    search_response = metaphor.search(prompt_for_met, use_autoprompt = True, num_results = 5)
    songs_list = []
    for result in search_response.results:
        song_dict = {
            'url': result.url,
            'title': result.title,
        }
        songs_list.append(song_dict)
    print(search_response)

    return songs_list



    
if __name__ == '__main__':

    songs = get_composed_emotion([
    {"emotion": "black", "percentage": 50},
    {"emotion": "green", "percentage": 30},
    {"emotion": "#ff5633", "percentage": 20},
    # ... add as many as you want
    ])
    print(songs)

