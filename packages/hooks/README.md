# @intks/ihoku

A collection of useful React hooks built with TypeScript.

## Installation

```bash
npm install @intks/ihoku
# or
yarn add @intks/ihoku
# or
pnpm add @intks/ihoku
```

## Quick Example

```tsx
import { useDisclosure } from '@intks/ihoku'

function Example() {
  const { isOpen, toggle } = useDisclosure()
  return (
    <button onClick={toggle}>
      {isOpen ? 'Close' : 'Open'}
    </button>
  )
}
```

## Documentation

For detailed API documentation and examples, please visit: [ihoku Documentation](https://intks.github.io/ihoku/)

## Peer Dependencies

- `react >= 18`

## License

MIT
