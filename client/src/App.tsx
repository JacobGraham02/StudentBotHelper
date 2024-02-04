import LandingPage from './pages/LandingPage';
import './assets/styles.css'; 
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CommandsPageContent from './components/Commands/CommandsPageContent';
import LogsPageContent from './components/LogFiles/LogsPageContent';
import ConfigurationsPageContent from './components/Configurations/ConfigurationsPageContent';

function App({ userLoggedIn }: { userLoggedIn: boolean}) {
  return (
    <>
      <Header isUserLoggedIn={userLoggedIn}/>
        <Routes>
          <Route path="/login" element={<Layout pageTitle="My page title" pageLayoutContent={<LoginPage />} />} />
          <Route path="/" element={<Layout pageTitle="Welcome to Student Bot Helper!" pageLayoutContent={<LandingPage isUserLoggedIn={userLoggedIn}/>} />} />
          <Route path="/commands" element={<Layout pageTitle="Bot commands" pageLayoutContent={<CommandsPageContent isUserLoggedIn={userLoggedIn}/>}/>}/>
          <Route path="/logfiles" element={<Layout pageTitle="Bot log files" pageLayoutContent={<LogsPageContent isUserLoggedIn={userLoggedIn}/>}/>}/>
          <Route path="/configurations" element={<Layout pageTitle="Bot configuration options" pageLayoutContent={<ConfigurationsPageContent isUserLoggedIn={userLoggedIn}/>}/>}/>
        </Routes>
      <Footer/>
    </>
  )
}

export default App;