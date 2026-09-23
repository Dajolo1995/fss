import FinanceProvider from './providers/FinanceProvider'
import RoutesApp from './routes'

const App = () => (
  <FinanceProvider>
    <RoutesApp />
  </FinanceProvider>
)

export default App
