import Page from '../components/page';
import Section from '../components/section';
import { Button } from '@nextui-org/react';
import { useEffect } from 'react';
import RingDevice from '../components/Ring'

// Type definitions for Speech Recognition
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const Index = () => {
  useEffect(() => {
    speechToText();
  }, []);

  return (
    <Page>
      <Section>
        <h2 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
          Record AND GET SHOCKED
        </h2>

        <div id="speech">
          <Button color='primary' id="start"> Start speaking </Button>
          <Button color='primary' id="stop"> Stop speaking </Button>
          <br></br>
          <Button color='primary' onClick={vibrationPattern}> Vibrate</Button>
          <RingDevice />
          <p id="output"></p>
          <p id="detectedWords"></p>
        </div>
      </Section>
    </Page>
  );
};

function speechToText(): void {
  const output = document.getElementById('output') as HTMLElement | null;
  const startButton = document.getElementById('start') as HTMLButtonElement | null;
  const stopButton = document.getElementById('stop') as HTMLButtonElement | null;
  const detectedWordsOutput = document.getElementById('detectedWords') as HTMLElement | null;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support the SpeechRecognition API");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true;

  const wordbank: string[] = [
    "ass", "bitch", "chink", "coon", "crazy", "crip", "cuck", "cunt", "dick",
    "douche", "douchebag", "dyke", "fag", "faggot", "fatass", "fuck", "gook",
    "gyp", "gypsy", "half-breed", "halfbreed", "homo", "hooker", "inbred", "idiot",
    "insane", "insanity", "lesbo", "negress", "negro", "nig", "nigga", "nigger",
    "pajeet", "prostitute", "pussie", "pussy", "retard", "shemale", "shit", "skank",
    "slut", "soyboy", "spade", "sperg", "spic", "tard", "tits", "tit", "titty",
    "trannie", "tranny", "twat", "whore", "wigger"
  ];

  recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
    if (output) {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
        
      output.innerText = transcript;

      const wordsInTranscript = transcript.toLowerCase().split(/\s+/);
      const lastWord = wordsInTranscript[wordsInTranscript.length - 1];
      if (wordbank.includes(lastWord)) {
        vibrationPattern();
      }

      const foundWords = wordbank.filter(word => transcript.toLowerCase().includes(word));
      if (detectedWordsOutput) {
        detectedWordsOutput.innerText = "Detected words: " + foundWords.join(', ');
      }
    }
  });

  recognition.addEventListener('start', () => {
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
  });

  recognition.addEventListener('end', () => {
    if (startButton) startButton.disabled = false;
    if (stopButton) stopButton.disabled = true;
  });

  if (startButton) {
    startButton.addEventListener('click', () => {
      recognition.start();
    });
  }

  if (stopButton) {
    stopButton.addEventListener('click', () => {
      recognition.stop();
    });
  }
}

function vibrationPattern(): void {
  const patterns = [
    2000,
    [2000, 1000, 2000, 1000, 2000, 1000, 2000],
    [400, 200, 400, 200, 400, 200, 800, 200, 800, 200, 400, 200, 400, 200, 200, 200],
    [150, 50, 150, 50, 300, 100, 150, 50, 150, 50, 300, 100, 150, 50, 150, 50],
    [300, 200, 300, 200, 300, 400, 300, 200, 300, 200, 300, 400, 300, 200, 600, 200]
  ];

  if (!window.navigator.vibrate) {
    alert("Your device does not support the Vibration API. Try on an Android phone!");
  } else {
    window.navigator.vibrate(patterns[2]);
    alert("This thing just vibrated!");
  }
}

export default Index;
