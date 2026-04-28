'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react'

export interface CourseStep {
  title: string
  content: string
  icon: string
  fun?: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface CourseFlowProps {
  courseId: string
  courseName: string
  steps: CourseStep[]
  quiz?: QuizQuestion[]
  onComplete: () => void
}

const PASS_THRESHOLD = 3 // out of 4

export function CourseFlow({ courseId, courseName, steps, quiz, onComplete }: CourseFlowProps) {
  const [phase, setPhase] = useState<'lesson' | 'quiz' | 'result' | 'done'>('lesson')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState(false)

  const isLast = currentStep === steps.length - 1
  const step = steps[currentStep]

  async function markComplete() {
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

  function handleLessonFinish() {
    if (quiz && quiz.length > 0) {
      setPhase('quiz')
    } else {
      markComplete()
      setPhase('done')
    }
  }

  function handleQuizSubmit() {
    setPhase('result')
  }

  const score = quiz ? quiz.filter((q, i) => answers[i] === q.correct).length : 0
  const passed = score >= PASS_THRESHOLD

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
        <div className="text-7xl mb-6 animate-bounce">🎉</div>
        <h2 className="text-3xl font-black text-gray-800 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
          You&apos;re ready!
        </h2>
        <p className="text-gray-500 text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Loading your {courseName} dashboard...
        </p>
        <div className="mt-6 flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    )
  }

  // ── Quiz results screen ──────────────────────────────────────────────────────
  if (phase === 'result' && quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
            {passed ? 'You passed!' : 'Almost there!'}
          </h2>
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-black mt-1 mb-2"
            style={{
              background: passed ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: 'white',
              fontFamily: 'Nunito, sans-serif',
            }}>
            {score} / {quiz.length} correct
          </div>
          <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {passed
              ? `Great work — you need ${PASS_THRESHOLD}/${quiz.length} to pass and you nailed it!`
              : `You need ${PASS_THRESHOLD}/${quiz.length} to pass. Review the answers below and try again!`}
          </p>
        </div>

        {/* Answer review */}
        <div className="space-y-4 mb-8">
          {quiz.map((q, i) => {
            const userAnswer = answers[i]
            const correct = q.correct
            const isCorrect = userAnswer === correct
            return (
              <div key={i} className={`rounded-2xl p-5 border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-3">
                  {isCorrect
                    ? <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    : <XCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="font-bold text-gray-800 text-sm mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>{q.question}</p>
                    {!isCorrect && (
                      <p className="text-xs text-red-600 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        You answered: <span className="font-semibold">{q.options[userAnswer] ?? 'No answer'}</span>
                      </p>
                    )}
                    <p className={`text-xs font-semibold ${isCorrect ? 'text-emerald-700' : 'text-gray-700'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      ✓ {q.options[correct]}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 italic" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      💡 {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {passed ? (
          <button
            onClick={markComplete}
            disabled={completing}
            className="w-full py-4 rounded-full text-white font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            {completing ? 'Saving...' : '🚀 Unlock my dashboard!'}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => { setPhase('lesson'); setCurrentStep(0) }}
              className="flex-1 py-3 rounded-full border-2 border-pink-300 text-pink-600 font-bold hover:bg-pink-50 transition-colors"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Re-read lesson
            </button>
            <button
              onClick={() => { setAnswers({}); setPhase('quiz') }}
              className="flex-1 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
            >
              Try again 💪
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────────
  if (phase === 'quiz' && quiz) {
    const allAnswered = quiz.every((_, i) => answers[i] !== undefined)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-sm font-semibold mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            🧠 {courseName} Quiz
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Quick knowledge check!
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Answer {PASS_THRESHOLD} out of {quiz.length} correctly to unlock your dashboard.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {quiz.map((q, qi) => (
            <div key={qi} className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50">
              <p className="font-bold text-gray-800 mb-4 text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-black mr-2" style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)' }}>
                  {qi + 1}
                </span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      answers[qi] === oi
                        ? 'border-pink-400 bg-pink-50 text-pink-700 font-semibold'
                        : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/50 text-gray-600'
                    }`}
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <span className="font-bold mr-2 text-gray-400">{['A', 'B', 'C', 'D'][oi]}.</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleQuizSubmit}
          disabled={!allAnswered}
          className="w-full py-4 rounded-full text-white font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
        >
          {allAnswered ? 'Submit answers ✨' : `Answer all ${quiz.length} questions to continue`}
        </button>
      </div>
    )
  }

  // ── Lesson screen ────────────────────────────────────────────────────────────
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
      <div className="flex items-center justify-center gap-2 mb-3">
        {steps.map((_, i) => (
          <div key={i} className="relative">
            {i < currentStep ? (
              <CheckCircle2 size={22} className="text-pink-500" />
            ) : (
              <span className={`text-2xl transition-all duration-300 ${i === currentStep ? 'scale-125' : 'opacity-30'}`}>
                {i <= currentStep ? '♥' : '♡'}
              </span>
            )}
          </div>
        ))}
        {quiz && quiz.length > 0 && (
          <>
            <div className="w-4 h-px bg-gray-200 mx-1" />
            <span className="text-xl opacity-30">🧠</span>
          </>
        )}
      </div>
      <p className="text-center text-xs text-gray-400 mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        Step {currentStep + 1} of {steps.length}{quiz && quiz.length > 0 ? ' · Quiz next' : ''}
      </p>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-pink-50 p-8 mb-6">
        <div className="text-6xl text-center mb-6">{step.icon}</div>
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

      {/* Nav buttons */}
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
            onClick={handleLessonFinish}
            className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', fontFamily: 'Nunito, sans-serif' }}
          >
            {quiz && quiz.length > 0 ? 'Take the quiz 🧠' : "Let's go! 🎉"}
            <ChevronRight size={18} />
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
