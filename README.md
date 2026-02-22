# Pokédex App

A modern, high-performance Pokédex application built with **React Native** and **Expo**. This app demonstrates a robust architecture using feature-based modularity, infinite scrolling, and global state management.

## 🚀 Key Features

- **Infinite Scrolling Pokédex**: Seamlessly explore all Pokémon with optimized list rendering and infinite pagination powered by `@tanstack/react-query`.
- **Modern Navigation**: Implementation of `react-navigation` with a Root Stack and Bottom Tab navigation.
- **Global State Management**: Lightweight and fast state handling using `Zustand`.
- **Modular Architecture**: Organized by features (`src/features`) to ensure scalability and maintainability.
- **Type Safety**: Fully written in TypeScript for a better developer experience and reduced runtime errors.
- **REST API Integration**: Clean integration with the [PokéAPI](https://pokeapi.co/).

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query (TanStack)](https://tanstack.com/query/latest)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Language**: TypeScript

## 📁 Project Structure

```text
src/
├── app/                # Global configuration and providers
│   ├── navigation/     # Navigators (Root, Tabs)
│   └── providers/      # App-wide providers (QueryClient, SafeArea, etc.)
├── features/           # Feature-based modules
│   ├── pokedex/        # Pokedex list and details logic
│   ├── favorites/      # User favorites management
│   └── settings/       # User preferences and theme
├── shared/             # Shared components, hooks, and utilities
│   ├── store/          # Shared Zustand stores
│   └── ui/             # Reusable UI components
└── index.js            # Entry point
```

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pokedex-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 Development Workflow

The project follows a **Sprint-based** development approach. The first sprint focused on:
- Project structure setup.
- Navigation implementation.
- Pokedex infinite scroll list integration.
- API layer and error handling.

## 📄 License

This project is open-source and available under the MIT License.
