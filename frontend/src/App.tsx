import Header from './components/header';
import Container from 'react-bootstrap/Container';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import PassRecovery from './pages/PassRecovery';

function App() {
  return (  
    <Container>
          <Header /> 
          <Routes>
             <Route path="/auth/register" element={<Register/>}/>
             <Route path="/" element={<Home/>}/>
             <Route path='/reset-password'  element={<PassRecovery/>} />
          </Routes>
    </Container>  
  );
}

export default App;
