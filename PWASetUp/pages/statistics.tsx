import React, { useState, useEffect } from 'react'
import Page from '../components/page'
import Section from '../components/section'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Divider,
  Button,
  Select,
  SelectItem,
  Progress,
  Chip,
} from "@nextui-org/react"
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
import db from '../database.js'

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

interface WordData {
  word: string;
  count: number;
  timestamp: number;
}

const Statistics = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [wordStats, setWordStats] = useState<WordData[]>([])
  const [profanityRate, setProfanityRate] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [speechPace, setSpeechPace] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [dailyProgress, setDailyProgress] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(5000) // Example goal

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const words = await db.words.toArray()
        setWordStats(words)
        calculateStats(words)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setIsLoading(false)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const calculateStats = (words: WordData[]) => {
    setTotalWords(words.length)
    // Calculate profanity rate
    const profanityWords = words.filter(w => wordbank.includes(w.word.toLowerCase()))
    setProfanityRate((profanityWords.length / words.length) * 100)
    // Calculate speech pace
    const timeSpan = Math.max(...words.map(w => w.timestamp)) - Math.min(...words.map(w => w.timestamp))
    setSpeechPace(Math.round((words.length / (timeSpan / 60000)) || 0))
    // Calculate daily progress
    const dailyWords = words.filter(w => w.timestamp > Date.now() - 86400000).length
    setDailyProgress((dailyWords / weeklyGoal) * 100)
  }

  // Real-time data for charts
  const speechData = {
    weeklyActivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Words Spoken',
        data: Array(7).fill(0).map(() => Math.floor(Math.random() * 500) + 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      }]
    },
    profanityTrend: {
      labels: ['Clean', 'Mild', 'Moderate', 'Severe'],
      datasets: [{
        data: [70, 15, 10, 5],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
      }]
    }
  }

  const exportStats = async () => {
    const data = {
      totalWords,
      profanityRate,
      speechPace,
      wordStats,
      date: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `speech-stats-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Page>
      <Section>
        <div className="p-8 pt-20">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Speech Analytics Dashboard</h1>
              <p className="text-zinc-500">Real-time speech analysis and statistics</p>
            </div>
            <div className="flex gap-4">
              <Select 
                defaultSelectedKeys={['week']}
                className="w-36"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <SelectItem key="day" value="day">Today</SelectItem>
                <SelectItem key="week" value="week">This Week</SelectItem>
                <SelectItem key="month" value="month">This Month</SelectItem>
              </Select>
              <Button color="primary" onClick={exportStats}>
                Export Data
              </Button>
            </div>
          </div>

          {/* Daily Progress */}
          <Card className="mb-6">
            <CardBody>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Daily Progress</span>
                  <Chip color="primary" variant="flat">
                    {Math.round(dailyProgress)}% of goal
                  </Chip>
                </div>
                <Progress 
                  value={dailyProgress} 
                  color={dailyProgress > 80 ? "success" : "primary"}
                  className="h-2"
                />
                <span className="text-xs text-zinc-500">
                  {Math.round(totalWords)} words of {weeklyGoal} weekly goal
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600">
              <CardBody>
                <div className="text-white">
                  <p className="text-sm">Total Words</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{totalWords}</h3>
                    <span className="text-xs mb-1">words spoken</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-rose-600">
              <CardBody>
                <div className="text-white">
                  <p className="text-sm">Profanity Rate</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{profanityRate.toFixed(1)}%</h3>
                    <span className="text-xs mb-1">of total speech</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600">
              <CardBody>
                <div className="text-white">
                  <p className="text-sm">Speech Pace</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{speechPace}</h3>
                    <span className="text-xs mb-1">words/minute</span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600">
              <CardBody>
                <div className="text-white">
                  <p className="text-sm">Clean Speech</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold">{(100 - profanityRate).toFixed(1)}%</h3>
                    <span className="text-xs mb-1">profanity-free</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">Speaking Activity</p>
                  <p className="text-small text-default-500">Words spoken over time</p>
                </div>
              </CardHeader>
              <Divider/>
              <CardBody>
                <Line 
                  data={speechData.weeklyActivity}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
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

            <Card>
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">Profanity Distribution</p>
                  <p className="text-small text-default-500">Severity levels</p>
                </div>
              </CardHeader>
              <Divider/>
              <CardBody>
                <Doughnut 
                  data={speechData.profanityTrend}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </CardBody>
            </Card>
          </div>

          {/* Word Analysis */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md">Word Analysis</p>
                <p className="text-small text-default-500">Most frequent words and patterns</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {wordStats
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((word, index) => (
                    <div key={index} className="flex justify-between p-3 bg-default-100 rounded-lg">
                      <span className="font-semibold">{word.word}</span>
                      <Chip size="sm" variant="flat">{word.count}x</Chip>
                    </div>
                  ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </Section>
    </Page>
  )
}

export default Statistics
