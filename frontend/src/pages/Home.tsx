import { useParams } from "react-router-dom";
import Page from "./Page";
import NumbericPage from "../pages/NumericPage";

export const MainPage: React.FC = () => {
  return (
    <>
      <h1>Main page</h1>
      <NumbericPage />
    </>
  );
};
