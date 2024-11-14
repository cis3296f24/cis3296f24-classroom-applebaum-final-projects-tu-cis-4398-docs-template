import Page from '../components/page'
import Section from '../components/section'
const Help = () => (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold'>Help</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					HELP ME HELP ME
				</p>
			</div>
		</Section>

		<Section>
			<h3 className='font-medium'>Thanks to</h3>

			<ul className='list-disc space-y-2 px-6 py-2'>
				<li className='text-sm text-zinc-600 dark:text-zinc-400'>
					<a href='https://unsplash.com' className='underline'>
						help
					</a>{' '}
					for help 
				</li>

				<li className='text-sm text-zinc-600 dark:text-zinc-400'>
					for help
				</li>
			</ul>
		</Section>
	</Page>
)

export default Help
