// Check if the browser supports Web Speech API
if ('webkitSpeechRecognition' in window) {
    // Set the parameters for speech recognition
    recognition.continuous = true;
    recognition.lang = 'en-US';

    // Add an event listener for the 'result' event
    recognition.addEventListener('result', function (event) {
        // Get the recognized speech as a string
        let speech = event.results[0][0].transcript;

        // Check if the recognized speech contains the specific word
        if (speech.toLowerCase().includes('gizmo')) {
            // Perform an action when the specific word is detected
            console.log('Detected "gizmo"');

            recognition.stop();

            if (!wave.classList.contains('wave-animate'))
                micIcon.click();
        }
    });

    // Add an event listener for the 'error' event
    recognition.addEventListener('error', function (event) {
        // Handle any errors that occur during speech recognition
        console.error('Speech recognition error:', event.error);

        recognition.stop();

        if (wave.classList.contains('wave-animate'))
            micIcon.click();

        setTimeout(()=> {
            // Start speech recognition
            recognition.start();
        }, 1000)
    });

    // Start speech recognition
    recognition.start();
} else {
    // The Web Speech API is not supported in this browser
    alert('Web Speech API is not supported');
}
