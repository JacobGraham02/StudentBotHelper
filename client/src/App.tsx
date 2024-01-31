import LandingPage from './pages/LandingPage';
import './assets/styles.css'; 
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Layout pageTitle="My page title" pageLayoutContent={<LandingPage/>}></Layout>
  )
}

export default App;
