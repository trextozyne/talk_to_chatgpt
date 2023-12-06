closeButton.addEventListener('click', () => {
    reset();
});

okButton.addEventListener('click', () => {

    if (process[0] === "response")
        inputValue = process[0] + ' ' + document.getElementsByTagName("textarea")[0].value;

    if (process[0] === "GPT3 Says") {
        reset();

        return;
    }

    const data = process.shift();
    process.push(data);

    dialogueBox.style.display = 'none'

    startChat();
});

cancelButton.addEventListener('click', () => {
    reset();
});