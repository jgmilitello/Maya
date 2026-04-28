'use client'

import { useState, useEffect } from 'react'
import { CourseFlow } from '@/src/components/CourseFlow'
import { creditCardsCourse, creditCardsQuiz } from '@/src/lib/courses'
import { CreditCardsDashboard } from '@/src/components/credit-cards/CreditCardsDashboard'
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner'

export default function CreditCardsPage() {
  const [courseStatus, setCourseStatus] = useState<'loading' | 'needed' | 'done'>('loading')

  useEffect(() => {
    fetch('/api/courses/status?course=credit-cards')
      .then(r => r.json())
      .then(data => setCourseStatus(data.completed ? 'done' : 'needed'))
      .catch(() => setCourseStatus('needed'))
  }, [])

  if (courseStatus === 'loading') return <LoadingSpinner className="min-h-[60vh]" />

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
