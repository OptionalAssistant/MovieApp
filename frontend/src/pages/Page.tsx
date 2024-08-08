import { useParams } from "react-router-dom";
import MainPage from './Home';

export const Page: React.FC = () => {
    const { id } = useParams<string>(); // Use string here
  
    const numericId = id ? parseInt(id, 10) : NaN;

    return (
        <MainPage id={numericId}/>
    );
  };