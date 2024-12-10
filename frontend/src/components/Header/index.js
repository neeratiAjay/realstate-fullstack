
import {Link} from "react-router-dom"
import Popup from "reactjs-popup"
import Cookies from "js-cookie"
import {useNavigate} from "react-router-dom"

import "./index.css"

const Header = () => {
    const navigate = useNavigate()
    
    const logoutHandler = ()=>{
        Cookies.remove("jwt_token")
        navigate("/")
    }

  return (
    <div className="header-container">
        <Link className="link" to ="/">Home</Link>
        
        <Popup modal  trigger={
       <button className="logout-btn" type ="button">Logout</button>}
        position="bottom left">
        {close => (
        <>
        <div className="popup-container">
        <div className="flex-column-container">
        <p className="popup-text">Are you sure you want to Logout?</p>
        <div className="popup-btn-container">
        <button type="button" className="close-btn" onClick={() => close()} >
        Cancel
        </button>
        <button className="confirm-btn" onClick={()=>{logoutHandler()
            close()}}>Confirm</button>
        </div>
        </div>
        </div>
        
        </>
        )}
        </Popup>
        </div>
  )
}

export default Header