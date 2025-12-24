# Create Component Command

Create a new component for the MetaMask Design System.

## Usage

```
/create-component ComponentName [category]
```

## Steps

1. **Check if component exists** in `lib/components.tsx`
2. **Add component function** following the pattern:
   - Use `useColors()` hook
   - Use design tokens for all styling
   - Provide default props
   - Add TypeScript types
3. **Add to componentRegistry** with:
   - name, slug, description
   - category
   - component reference
   - defaultProps
   - props array
4. **Update component-registry.json** with component details

## Template

```tsx
export function NewComponent({
  prop1 = "default",
  variant = "default",
}: {
  prop1?: string;
  variant?: "default" | "primary";
}) {
  const c = useColors();
  
  return (
    <div style={{
      padding: spacing[4],
      borderRadius: radius.lg,
      backgroundColor: c.background.section,
    }}>
      <span style={{
        color: c.text.default,
        fontSize: typography.fontSize.base,
      }}>
        {prop1}
      </span>
    </div>
  );
}
```

## Categories

- Navigation
- Headers
- Content
- Actions
- Feedback
- Inputs
- Data Display
- Overlays

