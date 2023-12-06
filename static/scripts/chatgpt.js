function reset() {
    process = ["response", "GPT3 Says"];
    getSvg = playStopIcon.innerHTML;
    textarea.disabled = true;
    textarea.value = "";
    dialogueBox.style.display = 'none';

    wave.classList.remove('wave-animate');

    // Start listen for gizmo or words again
    recognition.start();
}

window.onload = function() {
    textarea.disabled = true;
};

function startChat() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/process');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Parse the JSON response into a JavaScript object
            const response = JSON.parse(xhr.responseText);

            console.log(response);

            if ("GPT3" in response) {
                textarea.value = response["GPT3"];
                dialogueBox.style.display = 'flex'
            }

            if ("transcribed" in response) {
                console.log(response["transcribed"]);

                label.textContent = "You Said: "
                textarea.value = response["transcribed"];

                textarea.disabled = false;
                dialogueBox.style.display = 'flex'
            }
        } else {
            console.error('Request failed. Returned status of ' + xhr.status);
        }
    };

    const data = JSON.stringify({input_value: inputValue});
    inputValue = "";
    xhr.send(data);
}

document.addEventListener('DOMContentLoaded', function() {
    micIcon.addEventListener('click', function () {

        wave.classList.toggle('wave-animate');
        playStopIcon.style.visibility = 'visible';

        if (!wave.classList.contains('wave-animate')) {
            // displayLabel.innerHTML = "Hit the mic icon when ready !!!"

            playStopIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="25px" viewBox="0 0 1279.000000 1280.000000" preserveAspectRatio="xMidYMid meet">\n' +
                '        <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">\n' +
                '            <path d="M1357 12339 c-416 -44 -757 -337 -868 -745 -11 -44 -25 -83 -30 -88 -13 -14 -12 -10013 1 -10136 52 -492 418 -858 910 -910 131 -13 9919 -13 10050 0 492 52 858 418 910 910 13 131 13 9929 0 10060 -52 492 -418 858 -910 910 -117 12 -9947 11 -10063 -1z"/>\n' +
                '        </g>\n' +
                '    </svg>'

            reset();
        } else {
            // displayLabel.innerHTML = "Say 'gizmo' to start recording your question..."

            playStopIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="30px" viewBox="0 0 1280.000000 1280.000000" preserveAspectRatio="xMidYMid meet">\n' +
                '                <g transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">\n' +
                '                    <path d="M4610 6399 l0 -2881 43 25 c195 114 4144 2392 4494 2593 339 194 448 262 440 270 -7 7 -743 434 -1637 949 -894 516 -2001 1155 -2460 1420 -459 265 -845 487 -857 494 l-23 12 0 -2882z"/>\n' +
                '                </g>\n' +
                '            </svg>';

            inputValue = "record";

            startChat();
        }
    });

    // document.addEventListener('click', function(event) {
    //     // do something when a click event occurs on any element in the document
    //     console.log('Click event occurred:', event.target);
    // });

    // setTimeout(()=> {
    //     okButton.disabled = false
    //     cancelButton.disabled = false
    //     closeButton.disabled = false
    //     dialogueBox.style.display = 'none'
    // }, 3000)
})
