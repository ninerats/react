
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Button from './button.jsx'
import Banner from './banner.jsx'
import { useState } from 'react'



function App() {
  const [totalCount, setTotalCount] = useState(0);

  const incGlobal = () => setTotalCount(totalCount + 1)
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Banner text={"Total Button Clicks: " + totalCount}/>
        <div class="d-flex justify-content-center gap-3 mt-3">
        <Button onGlobalClick={incGlobal} />     
           <Button onGlobalClick={incGlobal}/>
           </div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
