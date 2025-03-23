### EcoHabit - Track Your Sustainable Lifestyle

EcoHabit is a web application designed to help users track their eco-friendly actions, visualize their environmental impact, and build sustainable habits. The platform gamifies sustainability by rewarding users with points for eco-friendly actions, tracking streaks, and providing challenges to encourage consistent environmentally conscious behavior.

## 🌱 Features

- **Action Logging**: Track daily eco-friendly actions like recycling, using reusable bottles, biking instead of driving, etc.
- **Environmental Impact Dashboard**: Visualize your positive impact with metrics for carbon saved, water conserved, waste reduced, and more
- **Challenges & Quests**: Join weekly eco-challenges to earn bonus points and complete quests
- **Gamification**: Earn points, level up, maintain streaks, and unlock achievements
- **Community Features**: Leaderboards to compare your progress with friends and the global community
- **Data Visualization**: Interactive charts and graphs to track your progress over time
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Easy on the eyes, easy on your device's battery


## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand with persistence
- **Authentication**: Supabase Auth with email/password and magic link options
- **Database**: Supabase PostgreSQL (with offline-first capabilities)
- **Animations**: Framer Motion for smooth UI transitions
- **Data Visualization**: Recharts for beautiful, interactive charts
- **3D Visualization**: Three.js for the global impact view


## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (optional for full functionality)


### Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/ecohabit.git
cd ecohabit
```


2. Install dependencies:

```shellscript
npm install
# or
yarn install
```


3. Set up environment variables:

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials (if using Supabase)



4. Run the development server:

```shellscript
npm run dev
# or
yarn dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application


## 🌍 Offline-First Approach

EcoHabit is designed with an offline-first approach:

- Actions are stored locally first and synced to the cloud when online
- The app functions fully without an internet connection
- Automatic synchronization when connectivity is restored


## 📱 Progressive Web App

EcoHabit can be installed as a Progressive Web App (PWA) on mobile devices and desktops for a native-like experience.

## 🔒 Privacy

- User data is stored securely
- Environmental impact data is anonymized for community features
- Users have full control over their data sharing preferences


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Three.js](https://threejs.org/)
- [Zustand](https://github.com/pmndrs/zustand)

- Built with 💚 for a greener planet.
