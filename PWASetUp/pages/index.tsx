import Page from '@/components/page'
import Section from '@/components/section'
import { useEffect } from 'react'

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

			<div className='mt-2'>
				<button onClick={getLocalStream}>get microphone access</button>
			</div>

			<div id="speech">
				<p id="output"></p>
				<button id="start"> -- Start speaking -- </button>
				<button id="stop"> -- Stop speaking -- </button>
			</div>

		</Section>
	</Page>
)
}

function speechToText(): void {
	
  const output = document.getElementById('output') as HTMLElement | null;
  const startButton = document.getElementById('start') as HTMLButtonElement | null;
  const stopButton = document.getElementById('stop') as HTMLButtonElement | null;

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

  //making a transcript of words - use this to check dictionary 
  recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
    if (output) {
      output.innerText = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
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

function getLocalStream(): void {
	navigator.mediaDevices
		.getUserMedia({ video: false, audio: true})
		.then((stream: MediaStream) => {
			(window as any).localStream = stream;
			const localAudio = document.getElementById('localAudio') as HTMLAudioElement;
			if (localAudio){
				(localAudio).srcObject = stream; 
				(localAudio).autoplay = true; 
			}
		})
		.catch ((err: Error) =>{
			console.error('You got an error:  ${err.message}');
		})
}

  
export default Index
