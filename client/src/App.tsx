import LandingPage from './pages/LandingPage';
import './assets/styles.css'; 
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Layout pageTitle="My page title" pageLayoutContent={<LoginPage />} />} />
        <Route path="/" element={<Layout pageTitle="My page title" pageLayoutContent={<LandingPage />} />} />
      </Routes>
    </>
  )
}

export default App;