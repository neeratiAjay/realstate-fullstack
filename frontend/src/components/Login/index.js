
import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import Cookies from "js-cookie"
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";

import "./index.css"

const Login = () => {
    const [username, setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [errMsg , setErrMsg] = useState("")
    const [showError,setError] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    
    const navigate = useNavigate()

    const passwordType = showPassword?"text":"password"

    const submitData =async (event) =>{
      event.preventDefault()
      //const url = "http://localhost:4000/login"
      const url = "https://realstate-fullstack.onrender.com/login"
      const options = {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json'},
        body: JSON.stringify({username,password}),
      }

      const response = await fetch(url,options)
      const data = await response.json()
    
      if (response.ok === true){
          const {jwt_token} = data 
          Cookies.set("jwt_token",jwt_token,{expires:30})
          navigate("/",{replace:true})
      }else{
         setError(true)
         setErrMsg(data.error_msg)
      }

    }

  return (
    <div className = "login-bg-container">
    <div className = "login-container">
    <h1 className = "login-heading">Login</h1>
    <form className = "form-container" onSubmit={submitData}>
        <label htmlFor = "username">USERNAME</label>
        <input  type = "text" placeholder = "username" 
        value = {username} onChange={(e)=>setUsername(e.target.value)}
        id = "username" required/>
       <label htmlFor="password">PASSWORD</label>
        <div className="password-container">
        <input type = {passwordType} placeholder="password" id ="password"
        value = {password} onChange={(e)=>setPassword(e.target.value)}
        className="password-input" required/>
        <button type = "button" className="eye-btn" onClick={()=>setShowPassword(!showPassword)}>
            {showPassword? <FaEyeSlash size = "20" color="#ffffff"/>:<FaEye size = "20" color="#ffffff"/>}
        </button>
        </div>
        <button type = "submit" className = "submit-btn"> Submit</button>
        {showError && <p className="err-text">* {errMsg}</p>}
        <p className="link">If you don,t have an account? <Link to = "/register" className="">Signup</Link></p>
    </form>
    </div>

    </div>
  )
}

export default Login