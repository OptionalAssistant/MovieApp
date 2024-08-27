import Container from "react-bootstrap/Container";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AddCategory from "./pages/AddCategory";
import AddMovie from './pages/AddMovie';
import Categorie from "./pages/Categories";
import FullMovie from "./pages/FullMovie";
import { MainPage } from "./pages/Home";
import NewMovies from "./pages/NewMovies";
import NumericPage from "./pages/NumericPage";
import PassRecovery from "./pages/PassRecovery";
import PopularMovies from "./pages/PopularMovies";
import Register from "./pages/Register";
import Search from "./pages/Search";
import { useFetchAuthMeQuery } from "./redux/query";
import BestMovies from "./pages/BestMovies";
function App() {



   useFetchAuthMeQuery();

  return (
    <Container>
      <Header />
      {<Routes>
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
        <Route path="/new-movies/:id" element={<NewMovies />} />  
        <Route path="/popular/:id" element={<PopularMovies />} />  
        <Route path="/most-likes/:id" element={<BestMovies />} />  
      </Routes> }
    </Container>
  );
}

export default App;
