import LandingPage from './pages/LandingPage';
import './assets/styles.css'; 
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

function App({ userLoggedIn }: { userLoggedIn: boolean}) {
  return (
    <>
      <Header isUserLoggedIn={userLoggedIn}/>
        <Routes>
          <Route path="/login" element={<Layout pageTitle="My page title" pageLayoutContent={<LoginPage />} />} />
          <Route path="/" element={<Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<LandingPage isUserLoggedIn={userLoggedIn}/>} />} />
        </Routes>
      <Footer/>
    </>
  )
}

export default App;