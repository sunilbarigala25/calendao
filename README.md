# Dinika (c a l e n d a o)

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![React Native](https://img.shields.io/badge/React_Native-v0.74-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Dinika** (meaning "Moment" or "Focus" in Malagasy, often associated with attention to detail) is a high-fidelity, emotionally resonant calendar application. It follows Google's **Anti-Gravity** UX principles to create a weightless, breathable, and Pinterest-inspired planning experience.

---

## 🌟 Key Features

### 1. Human-First Experience
- **Waitless Navigation**: Fluid transitions between Today, Week, and Month views.
- **Warm Welcomes**: Personalized greeting headers that change with the time of day.
- **Pinterest-Style Cards**: Vertical, breathable item cards with soft entry animations.

### 2. Intelligent Architecture
- **Dynamic Icon Hierarchy**: Day cards automatically prioritize the most frequent item types (Events vs. Tasks).
- **Auto-Centering Week**: Horizontal week view that automatically glides to keep the selected date at the center of the viewport.
- **Translucent UI**: A beautiful frosted-glass bottom navigation bar using hardware-accelerated blur.

### 3. Dual-Theme Engine
- **Material You (M3)**: Native Android 14 design language with adaptive color palettes.
- **Apple Glass**: High-transparency iOS-inspired glassmorphism for a premium feel.

---

## 📸 Guided Tour

| Today View | Week Navigation | Month Grid |
| :---: | :---: | :---: |
| ![Today](https://via.placeholder.com/200x400?text=Human+First+Greeting) | ![Week](https://via.placeholder.com/200x400?text=Centered+Week+Blocks) | ![Month](https://via.placeholder.com/200x400?text=Pastel+Month+Cards) |

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (SDK 54)
- **Language**: TypeScript (Strict Mode)
- **Database/Auth**: Firebase Firestore & Auth
- **Style Engine**: Vanilla CSS-in-JS (Performance-First)
- **Animations**: React Native Animated API & Reanimated
- **Blur Effects**: `expo-blur`

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Expo Go app on your physical device

### Installation
1. **Clone & Enter**
   ```bash
   git clone https://github.com/sunilbarigala25/calendao.git
   cd calendao
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npx expo start
   ```

---

## 📁 System Architecture

```text
src/
├── components/       # Atomic UI & Specialized Modules (FAB, Pill Nav)
├── contexts/         # State Orchestration (Auth, Calendar Data)
├── theme/            # Cross-Platform Design Tokens (M3 & Glass)
├── screens/          # Primary Navigation Nodes (Today, Detail Views)
└── utils/            # Perceptive Date Logic & Contrast Engines
```

---

## 🤝 Contributing
We welcome contributions that align with the **Anti-Gravity** philosophy. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for a more breathable future.**