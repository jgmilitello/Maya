'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

export interface CourseStep {
  title: string
  content: string
  icon: string
  fun?: string
}

interface CourseFlowProps {
  courseId: string
  courseName: string
  steps: CourseStep[]
  onComplete: () => void
}

export function CourseFlow({ courseId, courseName, steps, onComplete }: CourseFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState(false)

  const isLast = currentStep === steps.length - 1
  const step = steps[currentStep]

  async function handleComplete() {
    setCompleting(true)
    try {
      await fetch('/api/courses/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: courseId }),
      })
    } catch (e) {
      console.error('Failed to save course completion', e)
    }
    setCompleting(false)
    setDone(true)
    setTimeout(() => onComplete(), 1800)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-black text-gray-800 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
          You're ready!
        </h2>
        <p className="text-gray-500 text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Loading your {courseName} dashboard...
        </p>
        <div className="mt-6 flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-sm font-semibold mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          📚 {courseName} Course
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Before you dive in...
        </h1>
        <p className="text-gray-500 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          A quick {steps.length}-step guide, just for you
        </p>
      </div>

      {/* Progress hearts */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className="relative">
            {i < steps.length - 1 && i < currentStep ? (
              <CheckCircle2 size={24} className="text-pink-500" />
            ) : (
              <span
                className={`text-2xl transition-all duration-300 ${i === currentStep ? 'scale-125' : i < currentStep ? 'opacity-80' : 'opacity-30'}`}
              >
                {i < currentStep ? '♥' : i === currentStep ? '♥' : '♡'}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Step {currentStep + 1} of {steps.length}
      </p>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-pink-50 p-8 mb-6">
        {/* Icon */}
        <div className="text-6xl text-center mb-6">{step.icon}</div>

        {/* Content */}
        <h2 className="text-2xl font-black text-gray-800 text-center mb-4" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {step.title}
        </h2>
        <p className="text-gray-600 leading-relaxed text-center text-base" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {step.content}
        </p>
        {step.fun && (
          <div className="mt-5 p-4 rounded-2xl bg-pink-50 border border-pink-100">
            <p className="text-pink-700 text-sm text-center font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              💡 {step.fun}
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-gray-500 font-semibold border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        {isLast ? (
          <button
            onClick={handleComplete}
            disabled={completing}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            {completing ? 'Saving...' : "Let's go! 🎉"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
