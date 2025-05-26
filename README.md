# Instagram Stories Clone

A modern web application that replicates the core functionality of Instagram Stories, built with React, TypeScript, and Vite. This project demonstrates the implementation of a smooth, interactive story viewing experience with gesture support.

## Features

- 📱 Mobile-first design with responsive layout
- 👆 Swipe gestures for story navigation
- ⚡ Smooth animations and transitions using Framer Motion
- 🎯 Type-safe development with TypeScript
- 🧪 End-to-end testing with Playwright
- 📦 Modern build tooling with Vite

## Tech Stack Choices

### Core Technologies

- **React 19**: Chosen for its robust ecosystem, efficient rendering with concurrent features, and widespread adoption. The latest version provides improved performance and new features.

- **TypeScript**: Ensures type safety and better developer experience with enhanced code intelligence and early error detection. Essential for maintaining a scalable codebase.

- **Vite**: Selected as the build tool for its exceptional development experience with instant server start and lightning-fast HMR (Hot Module Replacement). It's significantly faster than traditional bundlers.

### Key Dependencies

- **Framer Motion**: Powers smooth animations and transitions, providing a polished user experience that closely matches the native Instagram app.

- **React Swipeable**: Implements touch and swipe gestures, essential for the mobile-first story navigation experience.

### Development Tools

- **ESLint**: Ensures code quality and consistency across the project.
- **Playwright**: Provides reliable end-to-end testing capabilities with modern features and excellent debugging tools.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Testing

Run end-to-end tests with Playwright:
```bash
npx playwright test
```

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/types` - TypeScript type definitions
- `/public/data` - Story data
- `/tests` - End-to-end tests

## Performance Considerations

- Vite's build optimization ensures minimal bundle sizes
- React 19's concurrent features for improved rendering performance
- Type-safe code reduces runtime errors
- Efficient gesture handling with React Swipeable

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT license.