'use client'

import { useState, useEffect } from 'react'
import { CourseFlow } from '@/src/components/CourseFlow'
import { bondsCourse, bondsQuiz } from '@/src/lib/courses'
import { BondsDashboard } from '@/src/components/bonds/BondsDashboard'
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner'

export default function BondsPage() {
  const [courseStatus, setCourseStatus] = useState<'loading' | 'needed' | 'done'>('loading')

  useEffect(() => {
    fetch('/api/courses/status?course=bonds')
      .then(r => r.json())
      .then(data => setCourseStatus(data.completed ? 'done' : 'needed'))
      .catch(() => setCourseStatus('needed'))
  }, [])

  if (courseStatus === 'loading') return <LoadingSpinner className="min-h-[60vh]" />

  if (courseStatus === 'needed') {
    return (
      <CourseFlow
        courseId="bonds"
        courseName="Bonds"
        steps={bondsCourse}
        quiz={bondsQuiz}
        onComplete={() => setCourseStatus('done')}
      />
    )
  }

  return <BondsDashboard />
}
