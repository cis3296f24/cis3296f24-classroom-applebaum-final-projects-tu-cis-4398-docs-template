import Page from '../components/page'
import Section from '../components/section'
import { Button } from '@nextui-org/react'
import RingDevice from '../components/Ring';
import db from '../database.js';
import MicCard from 'components/microphone-card';
import ModifyBannedText from 'components/modify-banned';
import React, {useState, useEffect} from 'react';

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

export let fullTranscriptGlobal: string = "";

const Index = () => {
  const [wordbank, setWordbank] = useState<string[]>([]);
  const [fillerWords, setFillerWords] = useState<string[]>([]);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null); // Interval ID
  const [isMicActive, setIsMicActive] = useState(false); 
  const [isBadWordDetected, setIsBadWordDetected] = useState(false);
  const [bannedWords, setBannedWords] = useState<string[]>([]);

  // Load word lists function
  const loadWordLists = async () => {
    try {
      const response = await fetch('wordbank.json');
      if (!response.ok) throw new Error(`Failed to fetch wordbank.json: ${response.statusText}`);
      const data = await response.json();
      setWordbank(data.curseWords || []);
      setFillerWords(data.fillerWords || []);
      console.log("Word lists loaded:", { wordbank, fillerWords });
    } catch (error) {
      console.error("Error loading word lists:", error);
    }
  };

  useEffect(() => {
    loadWordLists(); // Calls the function after component mounts
  }, []);

  const handleMicToggle = () => {
    setIsMicActive((prevState) => !prevState);
    if (!isMicActive) {
      startTimer();  // Start timer when mic is activated
    } else {
      stopTimer();   // Stop timer when mic is deactivated
    }
    speechToText(!isMicActive, handleBadWordDetected, wordbank, fillerWords, bannedWords); // Pass the new state to speechToText
  };

  const startTimer = () => {
    setTimer(0); // Reset the timer
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1); // Increment the timer every second
    }, 1000);
    setTimerInterval(interval); // Store the interval ID
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval); // Stop the timer when mic is turned off
      setTimerInterval(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${sec}`;
  };

  const handleBadWordDetected = () => {
    setIsBadWordDetected(true);
    setTimeout(() => setIsBadWordDetected(false), 1000); //reset after 1 sec
  };
    
  return (
    <Page>
      <div className='justify-center w-auto h-auto'>
        <h2 className = 'text-center font-semibold text-2xl'>SpeakSense</h2>
        <br></br>
        <h3 className = 'text-center font-normal text-3xl'>Bring Your Speech to Life</h3>
      </div>
      <Section>
        <div id="micbutton" className='justify-center items-center w-auto'>
          <MicCard isMicActive={isMicActive} isBadWordDetected = {isBadWordDetected} onToggleMic={handleMicToggle}/>
          <div className="text-center font-semibold text-3xl mt-4">
            <p>{formatTime(timer)}</p>
          </div>
        </div>
        <br></br>
        <div id="speech">
          <p id="output" className='text-center font-semibold text-2xl'></p>
          <p id="detectedWords"></p>
        </div>
        <div>
          <ModifyBannedText bannedWords={bannedWords} setBannedWords={setBannedWords}/>
        </div>
      </Section>
    </Page>
  );
};

let recognition: any = null;

function speechToText(isActive: boolean, handleBadWordDetected: () => void, wordbank: string[], fillerWords: string[], bannedWords: string[]): void {
  const output = document.getElementById('output') as HTMLElement | null;
  const detectedWordsOutput = document.getElementById('detectedWords') as HTMLElement | null;
  const fullTranscript = document.getElementById('fullTranscript') as HTMLElement | null;


  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support the SpeechRecognition API");
    return;
  }
  if (!recognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

  }
  
  let sessionWordCounts = new Map<string, number>();
  let detectedWordsList: string[] = [];

// Function to add or increment word count in the database
async function updateWordCount(word: string) {
  const wordEntry = await db.words.get({ word });
  
  if (wordEntry) {
    // If word already exists in database, increment count
    await db.words.update(wordEntry.id, { count: wordEntry.count + 1 });
    console.log(`Incremented count for "${word}" to ${wordEntry.count + 1}`);
  } else {
    // If word is new, add it to the database with count 1
    await db.words.add({ word, count: 1, timestamp: Date.now() });
    console.log(`Added "${word}" with count 1`);
  }
}


recognition.addEventListener('result', async (event: SpeechRecognitionEvent) => {
  const fullTranscript = Array.from(event.results) //full transcript
    .map(result => result[0].transcript)
    .join(' ')
    .toLowerCase();

    fullTranscriptGlobal = fullTranscript; // Assigning to global variable

  //get latest word 
  const currentWord = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
  // Display full transcript on the screen
  if (output) {
    output.innerText = currentWord;
  }

  const wordsInTranscript = fullTranscript.split(/\s+/);

  for (const word of wordsInTranscript) {
    const currentSessionCount = sessionWordCounts.get(word) || 0;
  
    // Count occurrences of the word in the current transcript
    const currentTranscriptCount = wordsInTranscript.filter(w => w === word).length;
  
    // If the word appears more times than it was previously counted, process it
    if (currentTranscriptCount > currentSessionCount) {
      sessionWordCounts.set(word, currentTranscriptCount);
      await updateWordCount(word); // Increment count for all words
  
      // Special handling for words in the wordbank
      if (wordbank.includes(word) || fillerWords.includes(word) || bannedWords.includes(word)) {
        vibrationPattern();
        detectedWordsList.push(`${word} (${currentTranscriptCount})`);
      }
      handleBadWordDetected(); //trigger bad word detected color
    }
  };

  if (detectedWordsOutput) {
    detectedWordsOutput.innerText = "Detected words: " + detectedWordsList.join(', ');
  }
});

  recognition.addEventListener('end', () => {
    console.log("SpeechRecognition stopped")
    console.log(fullTranscriptGlobal);
  });

  if (isActive) {
      recognition.start();
      console.log("SpeechRecognition Started. ");
    }else{
      recognition.stop();
      console.log("SpeechRecognition Stopped. ");
    };

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
  }
}

export default Index;
