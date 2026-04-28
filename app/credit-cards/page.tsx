'use client'

import { useState, useEffect } from 'react'
import { CourseFlow } from '@/src/components/CourseFlow'
import { creditCardsCourse, creditCardsQuiz } from '@/src/lib/courses'
import { CreditCardsDashboard } from '@/src/components/credit-cards/CreditCardsDashboard'

export default function CreditCardsPage() {
  const [courseStatus, setCourseStatus] = useState<'loading' | 'needed' | 'done'>('loading')

  useEffect(() => {
    fetch('/api/courses/status?course=credit-cards')
      .then(r => r.json())
      .then(data => setCourseStatus(data.completed ? 'done' : 'needed'))
      .catch(() => setCourseStatus('needed'))
  }, [])

  if (courseStatus === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (courseStatus === 'needed') {
    return (
      <CourseFlow
        courseId="credit-cards"
        courseName="Credit Cards"
        steps={creditCardsCourse}
        quiz={creditCardsQuiz}
        onComplete={() => setCourseStatus('done')}
      />
    )
  }

  return <CreditCardsDashboard />
}
