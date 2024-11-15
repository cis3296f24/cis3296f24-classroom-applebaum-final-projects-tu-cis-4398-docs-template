import React from 'react'
import Page from '../components/page'
import Section from '../components/section'
import { Card, CardBody, Spacer, CardHeader, Divider, CardFooter } from "@nextui-org/react"
import CardStack from '../components/card-stack'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Statistics = () => {
  const speechData = {
    totalWords: 1534,
    profanityCount: 12,
    fillerWordsCount: 85,
    averageWordsPerMinute: 130
  }

  return (
    <>
      <Page>
		<Section>
      	<div className="p-8 pt-20">
        	<h1 className="text-2xl font-bold mb-6">Statistics Dashboard</h1>
        
		<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
		<CardStack/> 
		<CardStack/>
		</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600">
            <CardBody>
              <div className="text-white">
                <p className="text-sm">Total Words</p>
                <h3 className="text-2xl font-bold">{speechData.totalWords}</h3>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-rose-500 to-rose-600">
            <CardBody>
              <div className="text-white">
                <p className="text-sm">Profanity Count</p>
                <h3 className="text-2xl font-bold">{speechData.profanityCount}</h3>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600">
            <CardBody>
              <div className="text-white">
                <p className="text-sm">Filler Words</p>
                <h3 className="text-2xl font-bold">{speechData.fillerWordsCount}</h3>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600">
            <CardBody>
              <div className="text-white">
                <p className="text-sm">Words/Minute</p>
                <h3 className="text-2xl font-bold">{speechData.averageWordsPerMinute}</h3>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
	  </Section>
    </Page>
    </>
  )
}

export default Statistics