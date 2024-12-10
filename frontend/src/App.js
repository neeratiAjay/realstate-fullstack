import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import Home from "./components/Home"
import ProtectedRoute from "./components/protectedRoute"
import Customer from "./components/Customer"
import Header from "./components/Header"

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/register" element = {<Register/>}/>
     <Route path = "/" element = {<ProtectedRoute> <Home/> </ProtectedRoute>}/>
     <Route path = "/customer" element = {<ProtectedRoute> <Customer/> </ProtectedRoute>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App