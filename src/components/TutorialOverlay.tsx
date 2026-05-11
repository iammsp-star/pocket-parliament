'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/store/gameStore'

const TUTORIAL_STEPS = [
  {
    title: 'The Swearing In',
    text: "Welcome, Prime Minister. You've taken the oath during a critical time for India. Let me give you a quick briefing before we begin.",
    position: 'center',
  },
  {
    title: 'National Dashboard',
    text: "Up here is your Budget and the Date. Each turn represents a fiscal quarter. Watch your daily cash flow carefully, and keep an eye on the Election countdown.",
    position: 'top',
  },
  {
    title: 'The Republic',
    text: "This is your domain. States will change color based on stability. Fund Intelligence to clear the Fog of War and reveal true metrics.",
    position: 'center-map',
  },
  {
    title: 'Cabinet & Policy',
    text: "These are your Ministries, Factions, and Laws. You must balance investments here, but remember: nothing passes without Lok Sabha approval.",
    position: 'left',
  },
  {
    title: 'The Mandate',
    text: "If Approval drops below 15% for too long, or you lose the 5-year election, you will be ousted. Good luck, Prime Minister.",
    position: 'center',
  },
]

export default function TutorialOverlay() {
  const { isTutorialActive, tutorialStep, setTutorialStep, completeTutorial } = useGameStore()
  const [mounted, setMounted] = useState(false)

  // Hydration fix & init
  useEffect(() => {
    setMounted(true)
    const hasCompleted = localStorage.getItem('tutorialCompleted') === 'true'
    if (hasCompleted && isTutorialActive) {
      completeTutorial()
    } else if (!hasCompleted && !isTutorialActive) {
      // Force tutorial active if not completed (e.g. initial load)
      useGameStore.setState({ isTutorialActive: true, tutorialStep: 0 })
    }
  }, [])

  if (!mounted || !isTutorialActive) return null

  const stepData = TUTORIAL_STEPS[tutorialStep]
  const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial()
    } else {
      setTutorialStep(tutorialStep + 1)
    }
  }

  // Positioning logic for the dialog box based on step
  const getDialogPosition = () => {
    switch (stepData.position) {
      case 'top':
        return 'top-32 left-1/2 -translate-x-1/2'
      case 'left':
        return 'top-1/2 left-[360px] -translate-y-1/2'
      case 'center-map':
      case 'center':
      default:
        return 'bottom-20 left-1/2 -translate-x-1/2'
    }
  }

  return (
    <div className="fixed inset-0 z-[60] pointer-events-auto flex">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
      />

      {/* Advisor Dialog Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tutorialStep}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`absolute ${getDialogPosition()} w-[400px] z-[70]`}
        >
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Glossy accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500" />
            
            <div className="flex gap-4">
              {/* Advisor Avatar */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-indigo-400 flex items-center justify-center overflow-hidden relative">
                  <span className="text-2xl">👨‍💼</span>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest leading-tight">Chief Cabinet<br/>Secretary</p>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{stepData.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed min-h-[80px]">
                  {stepData.text}
                </p>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-1">
                    {TUTORIAL_STEPS.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === tutorialStep ? 'bg-indigo-400' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-indigo-900/50"
                  >
                    {isLastStep ? 'Start Game' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
