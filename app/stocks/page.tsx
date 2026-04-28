'use client'

import { useState, useEffect } from 'react'
import { CourseFlow } from '@/src/components/CourseFlow'
import { stocksCourse, stocksQuiz } from '@/src/lib/courses'
import { StockDashboard } from '@/src/components/stocks/StockDashboard'
import { BookOpen, X } from 'lucide-react'

export default function StocksPage() {
  const [courseStatus, setCourseStatus] = useState<'loading' | 'needed' | 'done'>('loading')
  const [showLesson, setShowLesson] = useState(false)

  useEffect(() => {
    fetch('/api/courses/status?course=stocks')
      .then(r => r.json())
      .then(data => setCourseStatus(data.completed ? 'done' : 'needed'))
      .catch(() => setCourseStatus('needed'))
  }, [])

  if (courseStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  // Show lesson inline when re-opening it
  if (showLesson) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setShowLesson(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-50 transition-colors"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <X size={14} /> Close lesson
          </button>
        </div>
        <CourseFlow
          courseId="stocks"
          courseName="Stocks"
          steps={stocksCourse}
          quiz={stocksQuiz}
          onComplete={() => { setCourseStatus('done'); setShowLesson(false) }}
        />
      </div>
    )
  }

  // First time — course not yet completed
  if (courseStatus === 'needed') {
    return (
      <CourseFlow
        courseId="stocks"
        courseName="Stocks"
        steps={stocksCourse}
        quiz={stocksQuiz}
        onComplete={() => setCourseStatus('done')}
      />
    )
  }

  // Course done — show dashboard with "Review lesson" button always available
  return (
    <div className="space-y-4">
      {/* Always-visible lesson button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowLesson(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 text-purple-600 text-sm font-semibold hover:bg-purple-50 transition-colors"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <BookOpen size={14} />
          Review lesson
        </button>
      </div>
      <StockDashboard />
    </div>
  )
}
