import { useEffect } from "react";
import { BrowserRouter, useNavigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { ThemeProvider, useTheme } from "./context/themeContext";
import AuthProvider, { useSession } from "./context/authContext";

function AppWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

function App() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  //pega os dados da sessao se ta ligado ou não , e os dados do user
  const {session} = useSession()
  useEffect(() => {
    if(!session){
      navigate("/login");
    }else{
      navigate("/home");
    }
  }, [session]);

  return (
    <>
      <main data-theme={theme}>
        <Routes>
          <Route path="/login" element={<LoginPage  />} />
          <Route path="/home" element={<HomePage  />} />
        </Routes>
      </main>

      <ToastContainer />
    </>
  );
}

export default AppWrapper;