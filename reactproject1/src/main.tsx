import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//import ResultTable from './components/ResultTable.tsx'
//import DisplayDetailComponent from './components/ShowDetailComponent.tsx'
//import SearchBar from './components/SearchBar.tsx'
import MainComponent from './components/MainComponent.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<MainComponent />} />
            </Routes>
        </Router>
        
  </React.StrictMode>,
)
