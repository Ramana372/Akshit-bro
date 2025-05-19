import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Pages/Home';
import About from './Components/Pages/About';
import Places from './Components/Pages/Places';
import ExpertHistory from './Components/Pages/ExpertHistory';
import LoginRegister from './Components/Pages/LoginRegister';
import PlaceDetail from './Components/Pages/PlaceDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlaceDetail />} />
          <Route path="/expert" element={<ExpertHistory />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
