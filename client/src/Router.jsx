import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import App from "./App"
import Home from "./home"

export default function TopRouter(){
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/chat' element={<App />} />
            </Routes>
        </Router>
    )
}