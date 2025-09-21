# Government Task Management Service

A modern, accessible task management application built for government teams. This application provides secure task management capabilities while meeting WCAG 2.1 AA accessibility standards and government security requirements.

## Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Task Management**: Create, edit, and track tasks with priority levels
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Accessibility**: WCAG 2.1 AA compliant interface
- **Testing**: Comprehensive test suite with Vitest and React Testing Library

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest, React Testing Library, jsdom
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── tasks/          # Task-specific components
│   └── ui/             # Base UI components (shadcn/ui)
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API and external service integrations
├── test/               # Test configuration and utilities
└── lib/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone clone https://github.com/Tek-Planet/hmcts-dev-test-frontend.git
cd hmcts-dev-test-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:ui` - Run tests with UI
- `npm run test:watch` - Run tests in watch mode

## Authentication Flow

The application uses a context-based authentication system:

1. Users register/login through secure forms
2. JWT tokens are stored in localStorage
3. Protected routes check authentication status
4. Token refresh is handled automatically
5. Logout clears all authentication data

## Task Management

Tasks include the following properties:
- Title and description
- Priority levels (Low, Medium, High, Urgent)
- Due dates
- Status tracking
- User assignment

## Design System

The application uses a semantic token-based design system:
- Consistent color palette defined in `index.css`
- Tailwind configuration in `tailwind.config.ts`
- Component variants using class-variance-authority
- Dark/light mode support

## Testing Strategy

- **Unit Tests**: Individual component testing
- **Integration Tests**: User flow testing
- **Accessibility Tests**: WCAG compliance verification
- **API Tests**: Service layer testing

Tests are located alongside components in `__tests__` directories.

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

## Security Considerations

- JWT token validation
- Protected API endpoints
- Input sanitization
- XSS prevention
- CSRF protection headers

## 🚀 Live Demo 
https://hmcts-dev-test-frontend.netlify.app/




