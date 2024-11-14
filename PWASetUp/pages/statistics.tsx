import React from 'react'
import { Card, CardBody } from "@nextui-org/react"
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Speech Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600">
          <CardBody>
            <div className="text-white">
              <p className="text-sm">Total Words Today</p>
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
  )
}

export default Statistics