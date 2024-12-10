import { useState } from 'react'
import { propertyTypes,properties } from '../Properties'
import Popup from 'reactjs-popup'
import Cookies from "js-cookie"
import { format } from 'date-fns'

import "./index.css"




const CustomerDetails = props => {
    const {customer,indexId,deleteHandler,updateHandler} = props 

    const {id,customerName,mobile,budget,moreInformation,
        location,propertyType,interestedProperty,date} = customer
    
    const[updatedName,setUpdateName] = useState(customerName)
    const[updatedBudget,setUpdateBudget] = useState(budget)
    const[updatedMobile,setUpdatedMobile] = useState(mobile)
    const[updatedLocation,setUpdateLocation] = useState(location)
    const[updatedMoreInformation,setUpdateMoreInformation] = useState(moreInformation)
    const[updatedPropertyType,setUpdatePropertyType] = useState(propertyType)
    const[updateProperty,setUpdateProperty] = useState(interestedProperty) 


    const updateDetails = async (event)=>{
        event.preventDefault()
        console.log("update Function Working")
        const date = format(new Date(),"dd-MM-yyy")
        const url =`http://localhost:4000/customer/${id}`

        const customerDetails = {
            name:updatedName,
            mobile:updatedMobile,
            budget:updatedBudget,
            location:updatedLocation,
            moreInformation:updatedMoreInformation,
            propertyType:updatedPropertyType,
            propertyName:updateProperty,
            date:date
        }

        const jwtToken = Cookies.get("jwt_token")
        const options = {
            method:"PUT",
            headers:{
                'Content-Type':"Application/json",
                authorization:`Bear ${jwtToken}`
            },
            body: JSON.stringify(customerDetails)
        
        }
      const response = await fetch(url,options)
      if(response.ok === true){
        alert("Customer Details Updated SuccessFully")
        updateHandler(id,customerDetails)
      }else{
        alert("Something Went Wrong Try again.")
      }
      
    }


    const onClickUpdate = ()=>this.setState({updatingId:id})

    const deleteItem = ()=>{
          deleteHandler(id)
    }
    
    return (
       <tr className="table-defination-row" key = {indexId}>
            <td>{indexId}</td>
            <td >{customerName}</td>
            <td >{mobile}</td>
            <td >{propertyType}</td>
            <td>{interestedProperty}</td>
            <td >{budget}</td>
            <td >{location}</td>
            <td >{date}</td>
            <td >{moreInformation}</td>
            <td>
        <Popup modal  trigger={
        <button type = "button" className="edit-btn" onClick={onClickUpdate}>Edit</button> }
         >
        {close => (
         <form className='customer-form-container' onSubmit={(event)=>{updateDetails(event)
          close()}}>
         <div className='flex-row'>
         <label className='label-text' htmlFor='name'>Name : </label>
         <input id = "name" type = "text" placeholder='name'
         value={updatedName} onChange={(e)=>setUpdateName(e.target.value)}
         className='customer-name-input' required/>
         </div>
         <div className='flex-row'>
         <label className='label-text' htmlFor='mobile'> Mobile : </label>
         <input id = "mobile" type = "text" placeholder='mobile'
         value={updatedMobile} onChange={(e)=>setUpdatedMobile(e.target.value)}
         className='customer-name-input' required/>
         
         </div>
         <div className='flex-row'>
           <label className='label-text' htmlFor='propertyType'>Property Type : </label>
         <select id = "propertyType" 
         value = {updatedPropertyType} onChange={(e)=>setUpdatePropertyType(e.target.value)}
         className='property-type-dropdown' required>
         <option className='property-type-option' id = "select">Select</option>
          {propertyTypes.map(eachItem =><option className='property-type-option' key = {eachItem.id} value={eachItem.displayText}>{eachItem.displayText}</option>)}
         </select>
         </div>
 
         <div className='flex-row'>
        <label className='label-text' htmlFor='propertyName'>Property Name : </label>
         <select id = "propertyName" 
         value={updateProperty} onChange={(e)=>setUpdateProperty(e.target.value)}
         className='property-type-dropdown' required>
           <option className='property-type-option' id = "select">Select</option>
          {properties.map(eachItem =><option className='property-type-option' key = {eachItem.id} value={eachItem.displayText}>{eachItem.displayText}</option>)}
         </select>
         </div>
         <div className='flex-row '>
         <label className='label-text label-margin-top' htmlFor='location'>Location : </label>
         <textarea rows= "3" cols = "35" 
         value={updatedLocation} onChange={(e)=>setUpdateLocation(e.target.value)}
         className='location-input' id = "location"/>
         </div>
 
         <div className='flex-row'>
         <label className='label-text' htmlFor='budget'> Budget : </label>
         <input id = "budget" type = "text" placeholder='Budget' 
         value={updatedBudget} onChange={(e)=>setUpdateBudget(e.target.value)}
         className='customer-name-input' required/>
         
         </div>
 
         <div className='flex-row '>
         <label className='label-text label-margin-top' htmlFor='moreInformation'>More Information : </label>
         <textarea rows= "3" cols = "35" 
         value={updatedMoreInformation} onChange={(e)=>setUpdateMoreInformation(e.target.value)}
         className='location-input' id = "moreInformation"/>
         </div>
         
         <div className="popup-btn-container self-center">
        <button type="button" className="close-btn" onClick={() => close()} >
        Cancel
        </button>
        <button type= "submit" className="confirm-btn">Confirm</button>
        </div>
         </form>
        )}
        </Popup>
            </td>
        
            <td>
            
        <Popup modal  trigger={
        <button type="button" className="delete-btn">Delete</button> }
        position="bottom left">
        {close => (
        <>
        <div className="popup-container">
        <div className="flex-column-container">
        <p className="popup-text">Are you sure you want to delete this customer's details?</p>
        <div className="popup-btn-container">
        <button type="button" className="close-btn" onClick={() => close()} >
        Cancel
        </button>
        <button className="confirm-btn" onClick={()=>{deleteItem() 
            close()}}>Confirm</button>
        </div>
        </div>
        </div>
        
        </>
        )}
        </Popup>
            </td>
        </tr>
       
        
    )
}

export default CustomerDetails