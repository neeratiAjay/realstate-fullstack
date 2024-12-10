
import {useState} from "react"
import {useNavigate} from "react-router-dom"

// close eye icon 
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";

import"./index.css"

const Register = () => {
    const [name,setName] = useState("")
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)
    const [showError,setError] = useState(false)
    const [errMsg,setErrMsg] = useState("")

    const navigate = useNavigate()

    const submitUserData = async (event) =>{
        event.preventDefault()
        try{
        //const url = "http://localhost:4000/register" 
        const url = "https://realstate-fullstack.onrender.com/register"
        
        const options = {
            method:"POST",
            headers :{
                "Content-Type" :"application/json"
            },
            body:JSON.stringify({name,username,password})
        }

      if(name.length === 0 || name.trim(" ") === ""){
            alert("Enter valid name")
      }else if(username.length === 0 || username.trim(" ") === ""){
            alert("Enter Valid username")
        }else if(password.length === 0 || password.trim(" ") === ""){
            alert("Enter valid password")
        }else if (confirmPassword.length === 0 || confirmPassword.trim(" ") === ""){
            alert("Enter Valid confirm password")
        }else{
            if(password !== confirmPassword){
                setErrMsg("password and confirm password did not matched")
                setError(true)
            }else{
            const response = await fetch(url,options)
            const data = await response.json()
    
            if(response.ok === true){
               navigate("/login",{replace:true})
            }else{
             setErrMsg(data.error_msg)
             setError(true)
            }
            }
        }
    }catch(e){
        console.log(`Client Error ${e.message}`)
    }

    }

    const passwordType = showPassword ? "text" :"password"
    const confirmPasswordType = showConfirmPassword ? "text":"password"
  
  return (
    <div className = "login-bg-container">
    <div className = "login-container">
    <h1 className = "login-heading">Registration Form</h1>

    <form className = "form-container" onSubmit={submitUserData}>
        <label htmlFor="name">NAME</label>
        <input className="user-input" type = "text"
        value={name} onChange={(e)=>setName(e.target.value)} placeholder="name" id = "name" required/>
        <label htmlFor="userName">USERNAME</label>
        <input  className = "user-input" type = "text" placeholder="username"
        value={username} onChange={(e)=>setUsername(e.target.value)}
        id = "userName" required/>
        <label htmlFor="password">PASSWORD</label>
        <div className="password-container">
        <input type = {passwordType} placeholder="password" id ="password"
        value = {password} onChange={(e)=>setPassword(e.target.value)}
        className="password-input" required/>
        <button type = "button" className="eye-btn" onClick={()=>setShowPassword(!showPassword)}>
            {showPassword? <FaEyeSlash size = "20" color="#ffffff"/>:<FaEye size = "20" color="#ffffff"/>}
        </button>
        </div>

        <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
        <div className="password-container">
        <input type = {confirmPasswordType} placeholder="password" id ="confirm-password"
        value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
        className="password-input" required/>
        <button type = "button" className="eye-btn" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword? <FaEyeSlash size = "20" color="#ffffff"/>:<FaEye size = "20" color="#ffffff"/>}
        </button>
        </div>
        <button type = "submit" className = "submit-btn"> Submit</button>
        {showError && <p className="err-text">* {errMsg}</p>}
    </form>
    </div>

    </div>
  )
}

export default Register

/**
        <label htmlFor = "username">USERNAME</label>
        <input  type = "text" placeholder = "username" 
        value = {username} onChange={(e)=>setUsername(e.target.value)}
        id = "username" required/>
        <label  htmlFor = "password">PASSWORD</label>
        <input  type = "password" placeholder = "password" 
        value={password} onChange={(e)=>setPassword(e.target.value)}
        id = "password" required/>
        <button type = "submit" className = "submit-btn"> Submit</button>
        {showError && <p className="err-text">*{errMsg}<p/>}
 */