import { EquationProvider } from "./lib/context/EquationContext"
import EquationBalancer from "./components/EquationBalancer"

function App() {
  return (
    <EquationProvider>
      <EquationBalancer />
    </EquationProvider>
  )
}

export default App
