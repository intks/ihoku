# @intks/hooks

A collection of useful React hooks built with TypeScript.

## Installation

```bash
npm install @intks/hooks
# or
yarn add @intks/hooks
# or
pnpm add @intks/hooks
```

## Usage

### Import hooks

```typescript
// Import all hooks from the main entry
import { useDisclosure } from '@intks/hooks'

// Or import individual hooks
import { useDisclosure } from '@intks/hooks/useDisclosure'
```

## Hooks

### `useDisclosure`

A hook for managing a boolean state with open, close, and toggle functionality.

```typescript
import { useDisclosure } from '@intks/hooks'

const MyComponent = () => {
  const { isOpen, open, close, toggle } = useDisclosure()

  return (
    <div>
      <p>Modal is {isOpen ? 'open' : 'closed'}</p>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  )
}
```

#### API

- **Options:**
  - `isOpen` (optional): The initial boolean value. Defaults to `false`.
  - `onOpen` (optional): A callback function to be called when the modal is opened.
  - `onClose` (optional): A callback function to be called when the modal is closed.

- **Returns:**
  - `isOpen`: The current boolean value
  - `open()`: A function to open the modal
  - `close()`: A function to close the modal
  - `toggle()`: A function to toggle the modal

---

## Development

This project uses Vite for development and building.

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build the library
yarn build

# Lint the code
yarn lint

# Preview production build
yarn preview
```

## License

MIT
