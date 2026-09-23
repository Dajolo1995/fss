import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from './libs/antd.tsx'
import { BrowserRouter } from './libs/reactRouter.ts'
import { antdTheme } from './theme/antdTheme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>

  </StrictMode>,
)
