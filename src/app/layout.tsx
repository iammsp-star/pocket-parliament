import type { Metadata } from 'next'
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Pocket Parliament — Political Macroeconomics Simulation',
  description:
    'Take charge of a nation as Prime Minister. Balance budgets, manage factions, build soft power, and compete on the global stage in this high-stakes political simulator.',
  keywords: ['political simulation', 'economics game', 'strategy', 'prime minister'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-slate-950 text-white antialiased overflow-hidden">{children}</body>
    </html>
  )
}
