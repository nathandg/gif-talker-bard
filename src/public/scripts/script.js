const transcriptionContainer = document.getElementById("footer");
// Load the Gif
const gifContainer = document.getElementById("imagecontainer");
const gif = document.getElementById("exampleimg");
const sup1 = new SuperGif({ gif });

const firstClick = () => {
  transcription.textContent = "Click here to speak !";
  gifContainer?.removeEventListener("click", firstClick);
  transcriptionContainer?.addEventListener("click", () => {
    startRecognition();
  });
}

sup1.load(() => {
  console.log("gif loaded");
  gifContainer?.addEventListener("click", () => {
    firstClick();
  });
});

//server IP
let serverUrl = window.location.origin;

// get transcription text
const transcription = document.getElementsByClassName("transcription")[0];

// ---------------------
// Playing TTS in sync
// ---------------------
const playSynchronized = async (answer) => {
  console.log("playSynchronized()");
  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis API not supported");
    return;
  }
  if (speechSynthesis.speaking) {
    return;
  }

  // Select UK male voice
  const voice = await new Promise((resolve) => {
    const waitUntilReady = () => {
      if (speechSynthesis.getVoices().length !== 0) {
        const voice = speechSynthesis
          .getVoices()
          .find((v) => v.name === "Google UK English Male");
        resolve(voice);
      } else {
        setTimeout(waitUntilReady, 100);
      }
    };
    waitUntilReady();
  });
  console.log("selected voice");

  const response = await getResponse(answer);
  const text = extractResponse(response);

  const speak = (msg) => {
    return new Promise((resolve, reject) => {
      msg.addEventListener("end", () => {
        resolve();
      });
      window.speechSynthesis.speak(msg);
    });
  };

  const proceessTextToSpeech = async () => {
    const substrings = text.match(/[^.?,!]+[.?,!]?/g);
    for (let i = 0; i < substrings.length; i++) {
      const str = substrings[i].trim();

      // Make sure there is something to say other than the deliminator
      const numpunc = (str.match(/[.?,!]/g) || []).length;
      if (str.length - numpunc > 0) {
        // Surprisingly decent approximation for multiple languages.

        // If you change the rate, you would have to adjust
        let speakingDurationEstimate = str.length * 50;

        const msg = new SpeechSynthesisUtterance();

        (function (dur) {
          msg.addEventListener("start", () => {
            sup1.play_for_duration(dur);
          });
        })(speakingDurationEstimate);

        msg.text = str;
        msg.voice = voice;

        await speak(msg);
      }
    }
  };

  await proceessTextToSpeech();

  firstClick();
};

let recognition;

// Check if the browser supports SpeechRecognition
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  // Create a new SpeechRecognition object
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  // Configure the API to recognize speech in English
  recognition.lang = "en-US";
} else {
  console.log("Speech recognition not supported");
}


const startRecognition = () => {
  console.log("startRecognition()");
  recognition.start();

  timeoutId = setTimeout(() => {
    recognition.stop();
    alert("No speech was detected. You may need to adjust your microphone.");
    firstClick();
  }, 5000);

  recognition.onstart = () => { 
    console.log("Speech recognition started");
    setTimeout(() => {
      transcription.textContent = "Listening...";
    }, 1000);
  };

  recognition.onresult = async (event) => {
    clearTimeout(timeoutId);
    const transcript = event.results[0][0].transcript;
    transcription.textContent = transcript + ' ? ';
    recognition.stop();
    await playSynchronized(transcript);
  };

  recognition.onerror = (event) => {
    alert("Erro in speech recognition, please enable microphone and use Chrome !");
  };
};

//get the response from the API
const getResponse = async (prompt) => {
  try {
    const response = await fetch(
      `${serverUrl}/talk/ask?prompt=${prompt}`
      );
      return await response.json();
  } catch (error) {
    return 'Sorry, this bard access is not working';
  }
};

//Reponse extraction
const extractResponse = (response) => {
  console.log(response);
  //verify if contains the response ('*')
  if (response.includes(':**')) {
    return response.split(':**')[1];
  } else if(response.includes('>')){
    return response.split('>')[1];
  } else if (response.includes('```')){
    const initialCut = response.split('```')[1];
    return initialCut.split('```')[0];
  }else if (response.includes(':')){
    return response.split(':')[1];
  }
  return response;
}
