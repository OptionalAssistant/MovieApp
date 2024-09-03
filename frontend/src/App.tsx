import Container from "react-bootstrap/Container";
import Header from "./components/header";

import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import AddCategory from "./pages/AddCategory";
import AddMovie from './pages/AddMovie';
import BestMovies from "./pages/BestMovies";
import Categorie from "./pages/Categories";
import DislikedMovies from "./pages/DislikedMovies";
import FullMovie from "./pages/FullMovie";
import { MainPage } from "./pages/Home";
import LikedMovies from "./pages/LikedMovies";
import NewMovies from "./pages/NewMovies";
import NotFoundPage from "./pages/NotFoundPage";
import NumericPage from "./pages/NumericPage";
import PassRecovery from "./pages/PassRecovery";
import PopularMovies from "./pages/PopularMovies";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Search from "./pages/Search";
import { useFetchAuthMeQuery } from "./redux/query";
import Persons from "./pages/PersonsPage";
import AddPerson from "./pages/AddPerson";
import FullPerson from "./pages/FullPerson";
import SearchPerson from './pages/SearchPerson';
function App() {



   useFetchAuthMeQuery();

  return (
    <Container className="container">
      <Header />
      {<Routes>
         <Route path="/auth/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/reset-password" element={<PassRecovery />} />
        <Route path="/pages/:id" element={<NumericPage />} />
        <Route path="/movies/:id" element={<FullMovie />} />
        <Route path="/search/main" element={<Search />} />
         <Route path="/search/actor" element={<SearchPerson/>} />
        <Route path="/categories/:idCategory/page/:id" element={<Categorie />} />
        <Route path="/admin-panel/add/" element={<AddMovie />} />
        <Route path="/admin-panel/add/:id/edit" element={<AddMovie />} />
        <Route path="/admin-panel/category/add" element={<AddCategory />} />  
        <Route path="/new-movies/:id" element={<NewMovies />} />  
        <Route path="/popular/:id" element={<PopularMovies />} />  
        <Route path="/most-likes/:id" element={<BestMovies />} />  
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/liked/:id" element={<LikedMovies />} />
        <Route path="/profile/disliked/:id" element={<DislikedMovies />} />
        <Route path="/admin-panel/person/add" element={<AddPerson />} />
        <Route path="/admin-panel/person/:id/edit" element={<AddPerson />} />
        <Route path="/persons" element={<Persons />} />
        <Route path="/persons/:id" element={<FullPerson />} />
      </Routes> }
    </Container>
   
  );
}


export default App;
