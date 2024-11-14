import Page from '@/components/page'
import Section from '@/components/section'
import { Card, Spacer, CardBody, CardHeader, Divider, CardFooter } from '@nextui-org/react'
import CardStack from '@/components/card-stack'



const Statistics = () => (
	<Page>
		<h2 className='text-xl font-semibold'>Statistics</h2>
		<Section>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 '>
				<CardStack />
				<CardStack />
			</div>
			

		</Section>
	</Page>
)

export default Statistics
