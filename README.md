# 🏛️ Pocket Parliament

**[🌍 Play Pocket Parliament Live](https://iammsp-star.github.io/pocket-parliament/)**

> **A high-stakes, macro-economic political simulation game built for the web.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-8-black?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-black?style=for-the-badge&logo=tailwindcss&logoColor=38B2AC)
![Zustand](https://img.shields.io/badge/Zustand-State-black?style=for-the-badge)

Welcome to **Pocket Parliament**. You have just been elected Prime Minister of an underdog nation drowning in a debt crisis. Can you balance the budget, transition your labor force, and keep the public happy without getting ousted from office?

The game juxtaposes a colorful, vibrant low-poly 3D map against brutal, zero-sum strategic decision-making.

## 🌟 Key Features

* **Live 3D Map Environment:** Powered by React Three Fiber, your nation's physical environment reacts to your economic decisions. High pollution spawns smog; high tourism brings airplanes; high crime spawns graffiti.
* **The Zero-Sum Economy:** Balance a complex state budget. Need to fund education? You'll have to raise taxes, cut healthcare, or go further into debt.
* **Labor Demographics:** Transition your workforce from Primary (Agriculture) to Secondary (Industry) and Tertiary (Services/AI) to grow your GDP.
* **Crisis Management:** Respond to high-stakes political briefs via the Executive Decision engine.
* **Faction Approval:** There is no single "Approval Rating." Every choice angers or pleases specific factions: Wealthy Elites, the Working Class, Nationalists, and the Youth. Lose all your Political Capital, and you become a "Lame Duck," resulting in a Game Over.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Custom brutalist glass-morphism tokens
* **3D Rendering:** React Three Fiber (`@react-three/fiber`, `@react-three/drei`, `three.js`)
* **State Management:** Zustand
* **Animations:** Framer Motion
* **Data Visualization:** Recharts
* **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/iammsp-star/pocket-parliament.git
   cd pocket-parliament
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to start your term as Prime Minister.

## 🎮 How to Play

1. **Setup:** Enter your nation's name, choose your title, and select a flag emoji.
2. **Dashboard Overview:** Monitor your GDP, Debt/GDP ratio, and Political Capital closely using the top navigation bar.
3. **Analyze Data:** Use the sliding left sidebar to review charts regarding your Labor sectors, Economic trends, Social health (Education, Crime), and Faction happiness.
4. **Take Action:** When an urgent Brief arrives (indicated by the notification bell and pulse ring button), click **Review Next Brief**. Weigh the consequences of your choices and spend Political Capital wisely to enforce your decisions.
5. **Survive:** Hit `Next Turn` and watch your nation evolve. If your Political Capital hits zero, your government collapses.

---

*Good luck, Prime Minister. The nation is watching.*
