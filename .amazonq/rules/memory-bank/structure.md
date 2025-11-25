# Project Structure

## Directory Organization

```
src/
├── components/          # React UI components
│   ├── dashboard/       # Dashboard-related components
│   │   ├── DashboardLayout.tsx
│   │   └── DashboardOverview.tsx
│   ├── onboarding/      # Multi-step onboarding wizard
│   │   ├── Step1BasicInfo.tsx
│   │   ├── Step2Photos.tsx
│   │   ├── Step3Rooms.tsx
│   │   ├── Step4Payment.tsx
│   │   └── Step5Template.tsx
│   ├── AuthPage.tsx
│   ├── HotelDashboard.tsx
│   ├── HotelWebsite.tsx
│   ├── LandingPage.tsx
│   ├── OnboardingWizard.tsx
│   └── SuccessPage.tsx
├── contexts/            # React Context for state management
│   └── AuthContext.tsx
├── lib/                 # Utility libraries
│   └── supabase.ts      # Supabase client configuration
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── index.css            # Global styles
└── vite-env.d.ts        # Vite environment types

supabase/
└── migrations/          # Database migrations
    └── 20251124052613_create_hotel_saas_schema.sql

Configuration Files:
├── vite.config.ts       # Vite build configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## Core Components

### Authentication
- **AuthContext.tsx**: Manages user authentication state and session
- **AuthPage.tsx**: Login/authentication interface

### Onboarding Flow
- **OnboardingWizard.tsx**: Main wizard orchestrator
- **Step1BasicInfo.tsx**: Hotel basic information
- **Step2Photos.tsx**: Photo uploads
- **Step3Rooms.tsx**: Room configuration
- **Step4Payment.tsx**: Payment setup
- **Step5Template.tsx**: Website template selection

### Dashboard
- **DashboardLayout.tsx**: Dashboard layout structure
- **DashboardOverview.tsx**: Dashboard overview and analytics

### Public Pages
- **LandingPage.tsx**: Marketing landing page
- **HotelWebsite.tsx**: Public hotel website
- **SuccessPage.tsx**: Onboarding completion page

## Architectural Patterns
- Component-based architecture with React
- Context API for state management
- Supabase for backend and database
- Tailwind CSS for styling
- TypeScript for type safety
