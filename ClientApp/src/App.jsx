import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>
    );
};

export default App
