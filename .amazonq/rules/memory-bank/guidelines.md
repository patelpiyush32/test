# Development Guidelines & Patterns

## Code Quality Standards

### TypeScript Usage
- Strict typing throughout all components
- Type definitions for props using `type` keyword (not `interface`)
- Explicit return types for functions
- Type imports from Supabase: `import { User, Session } from '@supabase/supabase-js'`
- Custom types for component props: `type ComponentNameProps = { prop: type }`

### Component Structure
- Functional components with hooks (React 18.3.1)
- Props destructured in function signature
- State management with `useState` hook
- Side effects with `useEffect` hook
- Default exports for components

### Naming Conventions
- Components: PascalCase (e.g., `HotelWebsite`, `OnboardingWizard`)
- Files: Match component name (e.g., `HotelWebsite.tsx`)
- Props types: `ComponentNameProps` suffix
- State variables: camelCase (e.g., `currentStep`, `formData`)
- Event handlers: `handle` prefix (e.g., `handleNext`, `handleFinish`)
- Async functions: descriptive names (e.g., `loadHotelData`, `checkUserHotel`)

## Semantic Patterns

### State Management Pattern
```typescript
const [formData, setFormData] = useState({
  name: '',
  address: '',
  city: '',
  // ... other fields
});

const updateFormData = (data: Partial<typeof formData>) => {
  setFormData({ ...formData, ...data });
};
```

### Data Loading Pattern
```typescript
useEffect(() => {
  loadData();
}, [dependency]);

const loadData = async () => {
  const { data } = await supabase
    .from('table')
    .select('*')
    .eq('column', value);
  
  if (data) {
    setState(data);
  }
};
```

### Conditional Rendering Pattern
- Use ternary operators for simple conditions
- Use early returns for loading/error states
- Render null or placeholder UI during loading

### Form Validation Pattern
```typescript
const canProceed = () => {
  switch (currentStep) {
    case 1:
      return formData.name && formData.address && formData.city;
    default:
      return false;
  }
};
```

### Modal/Dialog Pattern
- Use fixed positioning with `fixed inset-0`
- Overlay with `bg-black bg-opacity-50`
- Close button with `✕` character
- State-driven visibility with boolean flag

## Styling Patterns

### Tailwind CSS Conventions
- Utility-first approach throughout
- Responsive design with `md:` and `lg:` breakpoints
- Color scheme: Blue primary (`blue-600`), Green success, Yellow warning
- Spacing: Consistent use of `px-4`, `py-3`, `mb-4`, `mt-1` patterns
- Rounded corners: `rounded-lg` for inputs, `rounded-xl` for cards
- Shadows: `shadow-sm` for cards, `shadow-lg` for modals
- Borders: `border border-gray-200` for subtle separation

### Component Styling Examples
- **Cards**: `bg-white rounded-xl shadow-sm p-6 border border-gray-200`
- **Buttons**: `px-6 py-3 rounded-lg hover:bg-opacity-90 transition`
- **Inputs**: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600`
- **Sections**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`

## Supabase Integration Patterns

### Client Setup
- Centralized in `lib/supabase.ts`
- Exports `supabase` client instance
- Type definitions for database tables

### Query Patterns
```typescript
// Single record
.select('*').eq('id', id).single()

// Multiple records with filtering
.select('*').eq('column', value).order('created_at', { ascending: false })

// Maybe single (no error if not found)
.select('*').eq('slug', slug).maybeSingle()

// With limit
.select('*').limit(10)
```

### Error Handling
- Destructure `error` from response
- Check for errors with `if (error) throw error`
- Use try-catch for async operations
- Alert user on failure with `alert()` message

## Authentication Patterns

### Context API Usage
- `AuthProvider` wraps application
- `useAuth()` hook provides user, session, loading state
- Auth methods: `signUp`, `signIn`, `signOut`
- Loading state checked before rendering protected content

### Protected Routes
- Check `user` existence before rendering
- Check `hasHotel` status for dashboard access
- Redirect to appropriate page based on auth state

## Component Organization

### Multi-Step Wizard Pattern
- Parent component manages step state
- Child components receive data and onChange callback
- Validation logic in parent (`canProceed` function)
- Progress indicator showing completed steps
- Back/Next/Finish buttons with disabled states

### Dashboard Pattern
- Layout component wraps content
- Overview component displays stats and recent data
- Stats calculated from fetched data
- Quick tips section for user guidance

## Common Idioms

### Conditional Classes
```typescript
className={`base-classes ${condition ? 'active-classes' : 'inactive-classes'}`}
```

### Icon Mapping
```typescript
const amenityIcons: Record<string, typeof Wifi> = {
  'WiFi': Wifi,
  'Breakfast': Coffee,
  'Parking': Car
};
```

### Array Mapping with Limits
```typescript
{items.slice(0, 5).map((item) => (...))}
```

### Date Formatting
```typescript
new Date(dateString).toLocaleDateString()
new Date().toISOString().split('T')[0]
```

### Slug Generation
```typescript
const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
```

## Performance Considerations

- Lazy load images with proper alt text
- Use `maybeSingle()` instead of `single()` when record might not exist
- Limit query results with `.limit()`
- Optimize re-renders with proper dependency arrays
- Use `transition` class for smooth UI changes

## Accessibility Standards

- All images have descriptive `alt` text
- Form labels associated with inputs
- Buttons have clear, descriptive text
- Color not sole indicator (use icons + text)
- Proper heading hierarchy (h1, h2, h3)
- Focus states on interactive elements
