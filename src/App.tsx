import "./App.css";
import { Route, Routes } from "react-router-dom";
import ArticlePage from "./pages/articles/ArticlePage";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ArticlePage />} />
      </Routes>
    </>
  );
}

export default App;
