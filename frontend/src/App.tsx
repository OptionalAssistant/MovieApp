import Container from "react-bootstrap/Container";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Categorie from "./pages/Categories";
import FullMovie from "./pages/FullMovie";
import { MainPage } from "./pages/Home";
import NumericPage from "./pages/NumericPage";
import PassRecovery from "./pages/PassRecovery";
import Register from "./pages/Register";
import Search from "./pages/Search";
import { fetchAuthMe } from "./redux/slices/auth";
import { useAppDispatch } from "./redux/store";
import AddMovie from './pages/AddMovie';
import AddCategory from "./pages/AddCategory";


function App() {

  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(fetchAuthMe());
  },[]);


  return (
    <Container>
      <Header />
      <Routes>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/reset-password" element={<PassRecovery />} />
        <Route path="/pages/:id" element={<NumericPage />} />
        <Route path="/movies/:id" element={<FullMovie />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories/:idCategory/page/:id" element={<Categorie />} />
        <Route path="/admin-panel/add/" element={<AddMovie />} />
        <Route path="/admin-panel/add/:id/edit" element={<AddMovie />} />
        <Route path="/admin-panel/category/add" element={<AddCategory />} />  
      </Routes>
    </Container>
  );
}

export default App;
