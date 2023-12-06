const micIcon = document.querySelector('.mic-icon');
const wave = document.querySelector('.wave');
let playStopIcon = document.querySelector('.play-stop-icon');
let label =  document.querySelector(".dialogue label");
let textarea =  document.querySelector(".dialogue textarea");
const dialogueBox = document.querySelector('.dialogue-box');
const closeButton = document.querySelector('.close');
const okButton = document.querySelector('.ok');
const cancelButton = document.querySelector('.cancel');

let start = true;
let inputValue = "";
let process = ["response", "GPT3 Says"];

// Create a new SpeechRecognition object
let recognition = new webkitSpeechRecognition();