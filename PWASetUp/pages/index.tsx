import Page from '@/components/page'
import Section from '@/components/section'
import { Button } from '@nextui-org/react'
import { useEffect } from 'react'
import RingDevice from '@/components/Ring';


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
				<Button color = 'primary' id="start"> Start speaking </Button> 
				<Button color = 'primary' id="stop"> Stop speaking </Button>
        <br></br>
        <Button color = 'primary' onClick={vibrationPattern} > Vibrate</Button>
        <RingDevice/>
        <p id="output"></p>
        <p id="detectedWords"></p>
			</div>

		</Section>
	</Page>
)
}

function speechToText(): void {
	
  const output = document.getElementById('output') as HTMLElement | null;
  const startButton = document.getElementById('start') as HTMLButtonElement | null;
  const stopButton = document.getElementById('stop') as HTMLButtonElement | null;
  const detectedWordsOutput = document.getElementById('detectedWords') as HTMLElement | null;


  // Check if the SpeechRecognition API is available in the browser first 
  const SpeechRecognition = (window as any).speechRecognition || (window as any).webkitSpeechRecognition;

  //if not, then like alert
  if (!SpeechRecognition) {
    alert("Your browser does not support the SpeechRecognition API");
    return;
  }


  //recognizing english speech with results that are continuous and can be added to later??? maybe change this setting 
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.continuous = true; // Set to true if you want continuous recognition

  //wordbank
  const wordbank: string[] = [
    "ass",
    "bitch",
    "chink",
    "coon",
    "crazy",
    "crip",
    "cuck",
    "cunt",
    "dick",
    "douche",
    "douchebag",
    "dyke",
    "fag",
    "faggot",
    "fatass",
    "fuck",
    "gook",
    "gyp",
    "gypsy",
    "half-breed",
    "halfbreed",
    "homo",
    "hooker",
    "inbred",
    "idiot",
    "insane",
    "insanity",
    "lesbo",
    "negress",
    "negro",
    "nig",
    "nigga",
    "nigger",
    "pajeet",
    "prostitute",
    "pussie",
    "pussy",
    "retard",
    "shemale",
    "shit",
    "skank",
    "slut",
    "soyboy",
    "spade",
    "sperg",
    "spic",
    "tard",
    "tits",
    "tit",
    "titty",
    "trannie",
    "tranny",
    "twat",
    "whore",
    "wigger",
  ]


  //making a transcript of words - use this to check dictionary 
  recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
    if (output) {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
        
        output.innerText = transcript;

        const wordsInTranscript = transcript.toLowerCase().split(/\s+/);
        const lastWord = wordsInTranscript[wordsInTranscript.length - 1];
        console.log("lastWord");
        if (wordbank.includes(lastWord)) {
          vibrationPattern();
        }

      // Check if any word in the wordbank is present in the transcript
      const foundWords = wordbank.filter(word => transcript.toLowerCase().includes(word));
      if (detectedWordsOutput) {
        detectedWordsOutput.innerText = "Detected words: " + foundWords.join(', ');
      }

    }
  });

  //when you click, lets 
  recognition.addEventListener('start', () => {
    console.log('Speech recognition started');
	alert('started speech');
    if (startButton) {
      startButton.disabled = true;
    }
    if (stopButton) {
      stopButton.disabled = false;
    }
  });

  //alert
  recognition.addEventListener('end', () => {
	alert('ended speech');
    console.log('Speech recognition ended');
    if (startButton) {
      startButton.disabled = false;
    }
    if (stopButton) {
      stopButton.disabled = true;
    }
  });
//on click start voice recognition
  if (startButton) {
    startButton.addEventListener('click', () => {
      recognition.start();
    });
  }
//on click stop voice recognition
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
    alert("Poop This thing just vibrated and stuff yay!");
  }
}


export default Index