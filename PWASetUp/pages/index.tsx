import Page from '@/components/page'
import Section from '@/components/section'

const Index = () => (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold text-zinc-800 dark:text-zinc-200'>
				Record AND GET SHOCKED
			</h2>

			<div className='mt-2'>
				<button onClick={getLocalStream}>get microphone access</button>
				<button >starts the recording</button>
			</div>
		</Section>
	</Page>
)

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
