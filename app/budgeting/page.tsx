'use client'

import { useState, useEffect } from 'react'
import { CourseFlow } from '@/src/components/CourseFlow'
import { budgetingCourse, budgetingQuiz } from '@/src/lib/courses'
import { BudgetingDashboard } from '@/src/components/budgeting/BudgetingDashboard'
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner'

export default function BudgetingPage() {
  const [courseStatus, setCourseStatus] = useState<'loading' | 'needed' | 'done'>('loading')

  useEffect(() => {
    fetch('/api/courses/status?course=budgeting')
      .then(r => r.json())
      .then(data => setCourseStatus(data.completed ? 'done' : 'needed'))
      .catch(() => setCourseStatus('needed'))
  }, [])

  if (courseStatus === 'loading') return <LoadingSpinner className="min-h-[60vh]" />

  if (courseStatus === 'needed') {
    return (
      <CourseFlow
        courseId="budgeting"
        courseName="Budgeting"
        steps={budgetingCourse}
        quiz={budgetingQuiz}
        onComplete={() => setCourseStatus('done')}
      />
    )
  }

  return <BudgetingDashboard />
}
