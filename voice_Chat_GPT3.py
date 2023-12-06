import openai
import speech_recognition as sr  # audio to text
from gtts import gTTS
from flask import Flask, jsonify, request, render_template
from talk_to_speech import _TTS
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

api_key = config['openai']['api_key']

print(api_key)
#
# Set your GPT key
openai.api_key = api_key

app = Flask(__name__, template_folder='templates')


@app.route('/')
def index():
    return render_template('index.html')


def transcribe_audio_to_text(filename):
    recognizer = sr.Recognizer()
    with sr.AudioFile(filename) as source:
        audio = recognizer.record(source)
    try:
        print('here3')
        return recognizer.recognize_google(audio)
    except Exception as e:
        print(e)
        print('Skipping... unknown error')
        raise e


def generate_response(prompt):
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=4000,
        n=1, stop=None, temperature=0.5
    )
    return response["choices"][0]["text"]


def speak_text(text):
    _tts = _TTS()
    _tts.start(text)
    return _tts


@app.route('/process', methods=['POST'])
def process():
    input_value = request.json['input_value']

    try:
        while True:
            if input_value == "record":
                try:
                    print("here1")
                    # Record audio
                    filename = "input.wav"  # ./static/audio/

                    _tts_obj = speak_text("Speak your question?")
                    del _tts_obj

                    with sr.Microphone(device_index=1) as _source:
                        print("here2")
                        recognizer = sr.Recognizer()
                        recognizer.pause_threshold = 1
                        recognizer.adjust_for_ambient_noise(_source, duration=1)
                        audio = recognizer.listen(_source, phrase_time_limit=None, timeout=None)

                        with open(filename, "wb") as f:
                            f.write(audio.get_wav_data())

                        # Transcribe to text
                        text = transcribe_audio_to_text(filename)
                        if text:
                            _tts_obj = speak_text(text)
                            del _tts_obj

                            input_value = ""
                            print(f"You said: {text}")
                            return jsonify({'transcribed': text})

                except sr.UnknownValueError:
                    _tts_obj = speak_text("Sorry, I did not understand what you said. Please try again.")
                    del _tts_obj

                except sr.RequestError as e:
                    _tts_obj = speak_text(
                        "Sorry, I could not process your request. Please check your internet connection.")
                    del _tts_obj
                    print("An error occurred: {}".format(e))

                except Exception as e:
                    _tts = _TTS()
                    _tts.start("Sorry, I could not recognize your voice. Please try again later.")
                    del _tts
                    input_value = ""
                    print("An error occured: {}".format(e))

            if "response" in input_value:
                try:
                    input_value = request.json['input_value']
                    print(f"You said: {input_value}")
                    input_value = input_value.replace("response ", "")
                    print(f"You said: {input_value}")
                    # Generate response using GPY-3
                    response = generate_response(input_value)
                    print(f"GPT-3 says: {response}")

                    # Record audio with gtts for video
                    tts = gTTS(text=response, lang='en')
                    tts.save("sample.mp3")  # ./static/audio/

                    # Read response using text-to-speech
                    _tts = _TTS()
                    _tts.start(response)
                    del _tts

                    input_value = ""
                    return jsonify({'GPT3': response})

                except sr.UnknownValueError:
                    _tts_obj = speak_text("Sorry, I did not understand what you said. Please try again.")
                    del _tts_obj

                except sr.RequestError as e:
                    _tts_obj = speak_text(
                        "Sorry, I could not process your request. Please check your internet connection.")
                    del _tts_obj
                    print("An error occurred: {}".format(e))

    except Exception as e:
        _tts = _TTS()
        _tts.start("Sorry, I could not discern your voice. Please try again after a few seconds.")
        del _tts
        input_value = ""
        print("An error occured: {}".format(e))


if __name__ == '__main__':
    app.run(debug=True)
