import Home from "./home/home.jsx";
import Login from "./login/login.jsx";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { usercontext } from "./appcontext.jsx";
import Forgotpassword from "./resetpassword/resetpassword.jsx";
import Uploadpage from "./upload/upload.jsx";
import Analyse from "./analyse/analyse.jsx";

function App() {
  const { isauthenticated } = useContext(usercontext);

  if (!isauthenticated) {
    return (
      <div className="app-loader">
        <div className="app-loader__spinner">
          <div className="app-loader__glow"></div>
          <div className="app-loader__ring">
            <div className="app-loader__dot"></div>
          </div>
        </div>
        <span className="app-loader__brand">RESUME ANALYSER</span>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        theme="dark"
        stacked
        autoClose={1800}
        position="top-right"
        toastStyle={{
          background: "#0d1526",
          border: "1px solid rgba(37,99,235,0.25)",
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/uploaddoc" element={<Uploadpage />} />
          <Route path="/analysereport" element={<Analyse />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;