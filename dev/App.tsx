import useDisclosure from '../src/hooks/useDisclosure'

const App = () => {
  const { isOpen, open, close, toggle } = useDisclosure()

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>i-hooks Library Development Playground</h1>

      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>useDisclosure Hook</h2>
        <p>State: {isOpen ? 'Open' : 'Closed'}</p>
        <button onClick={toggle}>Toggle</button>
        <button onClick={open}>Open</button>
        <button onClick={close}>Close</button>
      </section>
    </div>
  )
}

export default App
