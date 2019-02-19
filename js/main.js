//init SpeechSynth API
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  //Loop through voices and create an option for each one
  voices.forEach(voice => {
    //create option element
    const option = document.createElement('option');
    //fill option with voices and language
    option.textContent = voice.name + '('+ voice.lang +')';

    //set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
}

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}


//Speech
const speak = () => {
  //check if busy
  if (synth.speaking) {
    console.error('Busy...');
    return;
  }
  if (textInput.value !== '') {
    //add background animation
    body.style.background = '#323232 url(img/voice.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = '10%';
    //Get speech text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    //Speech end
    speakText.onend = e => {
      console.log('Done...');
      body.style.background = '#323232';
    }
    //Speech error
    speakText.onerror = e => {
      console.error('Something went wrong');
    }

    //Select voices
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

    //Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    //Speech
    synth.speak(speakText);
  }
};

//Event listeners

//Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
})

//Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value)

//Pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

//Voice select change
voiceSelect.addEventListener('change', e => speak());
