import Header from './components/header';
import Container from 'react-bootstrap/Container';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route } from 'react-router-dom';
import Register from './pages/Register';
import Page from './pages/Page';
import PassRecovery from './pages/PassRecovery';
import {  useContext, useEffect } from 'react';
import Context from './context/contextUser';
import axios from './axios'
import { UserData } from './types/typesRest';
import { MainPage } from './pages/Home';
import FullMovie from './pages/FullMovie';
import Search from './pages/Search';
import NumericPage from './pages/NumericPage';

function App() {

  const {dispatch,state} = useContext(Context);
 useEffect(()=>{
  axios.get<UserData>("/auth/me")
  .then(({data}) =>{
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
             <Route path="/" element={<MainPage/>}/>
             <Route path='/reset-password'  element={<PassRecovery/>} />
             <Route path="/pages/:id" element= {<NumericPage />}/>
             <Route path="/movies/:id" element={<FullMovie/>} />
             <Route path="/search" element={<Search/>}/>
          </Routes>
    </Container>  
  );
}

export default App;
