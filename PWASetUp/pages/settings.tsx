import Page from '@/components/page'
import Section from '@/components/section'

const Settings = () => (
	<Page>
		<Section>
			<h2 className='text-xl font-semibold'>setting</h2>

			<div className='mt-2'>
				<p className='text-zinc-600 dark:text-zinc-400'>
					&quot;oh this a setting&quot;
				</p>

				<br />

				<p className='text-sm text-zinc-600 dark:text-zinc-400'>
					<a href='https://twosentencestories.com/vision' className='underline'>
						setting
					</a>
					oh a setting
				</p>
			</div>
		</Section>
	</Page>
)

export default Settings;
