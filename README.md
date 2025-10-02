# Task Management Application

A modern, full-stack task management application built with Next.js 14, TypeScript, and Tailwind CSS. Features a clean, responsive interface with drag-and-drop functionality, comprehensive testing, and a robust component library.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Drag & Drop**: Intuitive task management with @dnd-kit
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Dark/Light Mode**: Theme switching with next-themes
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: SWR for data fetching and caching
- **Component Library**: Comprehensive UI components using Radix UI
- **Testing**: Jest and React Testing Library for unit testing
- **Accessibility**: ARIA-compliant components and keyboard navigation
- **Performance**: Optimized with Next.js App Router and code splitting

## 📋 Tech Stack

### Core Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Geist

### UI Components

- **Component Library**: Radix UI primitives
- **Form Handling**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Dialogs**: Radix UI Dialog
- **Toasts**: Radix UI Toast + Sonner

### Development Tools

- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Next.js config
- **Type Checking**: TypeScript
- **Package Management**: npm/yarn/pnpm

## 🛠️ Local Setup Instructions

### Prerequisites

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **Package Manager**: npm (comes with Node.js), yarn, or pnpm
- **Git**: For version control

### Step-by-Step Installation

1. **Clone the Repository**

```bash
# Clone the project
git clone <your-repo-url>
cd task-management

# If you don't have a repo yet, you can start fresh
npx create-next-app@latest my-task-app --typescript --tailwind --app
```

2. **Install Dependencies**

```bash
# Using npm (recommended)
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:

```bash
# Create the environment file
touch .env.local
```

Add the following configuration to `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Add your backend API URL if different
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Optional: Analytics and other services
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

4. **Start Development Server**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Verifying Installation

After starting the dev server, you should see:

- ✅ No console errors
- ✅ Home page loads successfully
- ✅ Navigation works properly
- ✅ Theme switching functions
- ✅ All UI components render correctly

## 🔧 NEXT_PUBLIC_API_URL Configuration

### Development Setup

For local development, configure your API URL in `.env.local`:

```env
# Local development (default)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# If using a separate backend server
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# For external API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Environment-Specific Configurations

Create different environment files for different stages:

**`.env.development`** (for local development)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**`.env.production`** (for production)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**`.env.staging`** (for staging)

```env
NEXT_PUBLIC_API_URL=https://staging-api.yourdomain.com
```

### API Integration Examples

The application uses this environment variable in services:

```typescript
// services/taskApi.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const taskApi = {
  getAll: () => fetch(`${API_BASE_URL}/tasks`),
  create: (task: Task) =>
    fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
    }),
};
```

## 🎨 Design Choices & Assumptions

### Architecture Decisions

1. **Next.js App Router**

   - **Choice**: Used Next.js 14 App Router over Pages Router
   - **Reason**: Better performance, improved caching, and modern React patterns
   - **Assumption**: Target audience has modern browsers supporting App Router

2. **TypeScript First**

   - **Choice**: Full TypeScript implementation
   - **Reason**: Type safety, better IDE support, and reduced runtime errors
   - **Assumption**: Development team values type safety and modern development practices

3. **Tailwind CSS Utility Framework**

   - **Choice**: Tailwind over traditional CSS or CSS-in-JS
   - **Reason**: Rapid development, consistent design system, and smaller bundle sizes
   - **Assumption**: Team prefers utility-first approach and is comfortable with Tailwind syntax

4. **Radix UI Component Library**
   - **Choice**: Radix UI primitives over building from scratch
   - **Reason**: Accessibility out-of-the-box, customizable, and well-tested components
   - **Assumption**: Need for accessible, production-ready UI components

### State Management Strategy

1. **SWR for Server State**

   - **Choice**: SWR over Redux/Zustand for server data
   - **Reason**: Built-in caching, revalidation, and optimistic updates
   - **Assumption**: Most state comes from API calls, minimal client-side state

2. **React Context for Global State**
   - **Choice**: Context API for theme and global app state
   - **Reason**: Simple, built-in React solution for infrequently changing state
   - **Assumption**: Global state changes are rare (theme, user auth)

### Component Design Patterns

1. **Compound Components**

   - **Pattern**: Components like `<TaskList>` that include sub-components
   - **Reason**: Flexible API and better component composition
   - **Example**: `<TaskList>` includes `<TaskCard>`, `<Pagination>`

2. **Render Props for Flexibility**

   - **Pattern**: Components accept render functions for customization
   - **Reason**: Allows users to customize rendering without modifying source
   - **Example**: Custom task card rendering

3. **Controlled vs Uncontrolled**
   - **Pattern**: Most form components are controlled
   - **Reason**: Better integration with React Hook Form and validation
   - **Assumption**: Users prefer predictable form behavior

### Accessibility Considerations

1. **ARIA Labels & Roles**

   - All interactive elements have proper ARIA attributes
   - Screen reader announcements for dynamic content
   - Keyboard navigation support throughout

2. **Color Contrast**

   - WCAG 2.1 AA compliance for all color combinations
   - Theme variables ensure consistent contrast ratios
   - Focus indicators are clearly visible

3. **Responsive Design**
   - Mobile-first approach with progressive enhancement
   - Touch-friendly interactive elements (min 44px tap targets)
   - Readable font sizes across all breakpoints

### Performance Optimizations

1. **Code Splitting**

   - Dynamic imports for heavy components
   - Route-based code splitting with App Router
   - Component-level lazy loading

2. **Image Optimization**

   - Next.js Image component for automatic optimization
   - WebP format with fallbacks
   - Responsive images with srcset

3. **Bundle Size Management**
   - Tree shaking enabled
   - Dynamic imports for large libraries
   - Minimal runtime dependencies

### Testing Strategy

1. **Unit Tests**

   - Component behavior testing
   - Hook functionality verification
   - Utility function coverage

2. **Integration Tests**

   - API service testing
   - User flow simulation
   - Cross-component interaction

3. **Accessibility Tests**
   - Automated axe-core scanning
   - Keyboard navigation testing
   - Screen reader compatibility

## 🚨 Common Setup Issues

### Node Version Issues

```bash
# Check Node version
node --version

# If version < 18.0.0, update Node
# Using nvm (recommended)
nvm install 18
nvm use 18
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### Missing Environment Variables

```bash
# Check if .env.local exists
ls -la .env.local

# Create if missing
cp .env.example .env.local
# or
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local
```

### Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency warnings
npm install --legacy-peer-deps
```

## 📁 Project Structure

```
task-management/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── tasks/             # Task management pages
├── components/            # React components
│   ├── task/             # Task-specific components
│   ├── ui/               # Reusable UI components
│   └── theme-provider.tsx # Theme context provider
├── hooks/                # Custom React hooks
│   ├── use-task.ts       # Task management hooks
│   ├── use-tasks.ts      # Tasks data hooks
│   └── use-toast.ts      # Toast notification hooks
├── lib/                  # Utility functions
│   └── utils.ts          # General utilities
├── services/             # API services
│   └── taskApi.ts        # Task API calls
├── types/                # TypeScript type definitions
│   └── task.ts           # Task-related types
├── __tests__/            # Test files
│   ├── app/              # App-level tests
│   ├── components/       # Component tests
│   ├── hooks/            # Hook tests
│   └── services/         # Service tests
└── public/               # Static assets
```

## 🧪 Testing

The project includes comprehensive testing setup with Jest and React Testing Library.

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The application aims for high test coverage across:

- **Components**: UI components and business logic
- **Hooks**: Custom hook functionality
- **Services**: API integration
- **Pages**: Route-level functionality
- **Utils**: Utility functions

## 🎯 Key Components

### Task Management

- **TaskList**: Main task list with pagination
- **TaskCard**: Individual task display card
- **TaskForm**: Create/edit task form
- **TaskFilters**: Status and search filters
- **TaskPagination**: Page navigation

### UI Components

- **Button**: Customizable button variants
- **Input**: Form input with validation
- **Label**: Accessible form labels
- **Badge**: Status and category badges
- **Loading**: Loading states and spinners
- **Toast**: User notifications
- **Dialog**: Modal dialogs

### Layout Components

- **Navigation**: Responsive navigation bar
- **Theme Provider**: Dark/light mode switching

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single column layout, touch-friendly interactions
- **Tablet**: Two-column grid for task cards
- **Desktop**: Three-column grid with sidebar navigation

## 🎨 Theming

- **Light Mode**: Clean, professional design
- **Dark Mode**: Easy on the eyes for low-light environments
- **Customizable**: Easy to extend with additional themes

## 🔧 Configuration

### Tailwind CSS

Configured with custom colors, spacing, and component classes. See `tailwind.config.js` for customization options.

### Next.js Config

Optimized for performance with:

- Image optimization
- Font loading
- Analytics integration
- Security headers

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain accessibility standards
- Use conventional commits
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Radix UI](https://radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy coding!** 🎉
