import Header from './components/header';
import Container from 'react-bootstrap/Container';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import Home from './pages/Home';
import PassRecovery from './pages/PassRecovery';
import {  useContext, useEffect } from 'react';
import Context from './context/context';
import axios from './axios'
function App() {

  const {dispatch,state} = useContext(Context);
 useEffect(()=>{
  axios.get("/auth/me")
  .then(data =>{
    console.log(data);
    dispatch({type: 'fullfilled',payload: data});
  })
  .catch(err =>{
    console.log("Err",err);
    dispatch({type: 'rejected',payload: null});
  });
 },[]);
 
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
