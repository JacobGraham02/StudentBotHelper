import LandingPage from './pages/LandingPage';
import './assets/styles.css'; 
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/login" element={<Layout pageTitle="My page title" pageLayoutContent={<LoginPage />} />} />
        <Route path="/" element={<Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<LandingPage />} />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App;