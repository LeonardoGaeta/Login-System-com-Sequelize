import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import './App.css'

import { FormRegister } from "./components/register";
import { FormLogin } from "./components/login";
import { Home } from "./components/home";
import { PlainLayout } from "./components/PlainLayout";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PlainLayout />} >
        <Route path="login" element={<FormLogin />} />
        <Route path="register" element={<FormRegister />} />
      </Route>

      <Route path="/" element={<Home />} />
    </>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
