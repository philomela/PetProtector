import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Questionnaire from './pages/Questionnaire/Questionnaire'
import Login from './pages/Login/Login'

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/questionnaire" element={<Questionnaire/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Router>
    );
};

export default App
