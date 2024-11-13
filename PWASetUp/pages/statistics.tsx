import { FC } from 'react'
import Page from '../components/page'
import Section from '../components/section'
import { Card, CardBody } from "@nextui-org/react"
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
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

// Register ChartJS components
ChartJS.register(
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

const Statistics: FC = () => {
  // Mock data for your speech analytics
  const speechData = {
    totalWords: 1534,
    profanityCount: 12,
    fillerWordsCount: 85,
    averageWordsPerMinute: 130,
    weeklyActivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Words Spoken',
          data: [150, 230, 180, 340, 210, 290, 310],
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.3,
        }
      ]
    },
    wordCategories: {
      labels: ['Clean Speech', 'Profanity', 'Filler Words', 'Technical Terms'],
      datasets: [
        {
          label: 'Word Distribution',
          data: [75, 5, 15, 5],
          backgroundColor: [
            'rgba(52, 211, 153, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(59, 130, 246, 0.8)'
          ],
        }
      ]
    },
    buzzedWords: {
      labels: ['Profanity', 'Filler Words', 'Slurs', 'Other'],
      datasets: [
        {
          label: 'Times Buzzed',
          data: [45, 120, 5, 15],
          backgroundColor: 'rgba(244, 63, 94, 0.8)',
        }
      ]
    }
  }

  return (
    <Page title="Statistics">
      <Section>
        <h1 className="text-2xl font-bold mb-6">Speech Analytics Dashboard</h1>
        
        {/* Quick Stats Cards */}
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
              <Line 
                data={speechData.weeklyActivity}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Speech Composition</h3>
              <Doughnut 
                data={speechData.wordCategories}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </CardBody>
          </Card>

          <Card className="lg:col-span-2">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Buzzer Triggers</h3>
              <Bar 
                data={speechData.buzzedWords}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </CardBody>
          </Card>
        </div>
      </Section>
    </Page>
  )
}

export default Statistics