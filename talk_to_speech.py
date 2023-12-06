import pyttsx3


class _TTS:
    engine = None
    rate = None

    def __init__(self):
        self.engine = pyttsx3.init()

    # initialize the text to speech
    def start(self, text_):
        self.engine.say(text_)
        self.engine.runAndWait()
