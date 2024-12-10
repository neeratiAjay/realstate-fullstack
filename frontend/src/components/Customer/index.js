
import {useState} from 'react'
import Cookies from "js-cookie"
import {format} from "date-fns"

import Header from '../Header'
import { propertyTypes,properties } from '../Properties'

import "./index.css"



const Customer = () => {
  const [name,setName] = useState("")
  const [mobile,setMobile] = useState("+91 ")
  const [budget,setBudget] = useState("")
  const [propertyType,setPropertyType] = useState("")
  const [propertyName,setPropertyName] = useState("")
  const [location,setLocation] = useState("")
  const [moreInformation,setMoreInformation] = useState("")
  const [showError,setError] = useState(false)
  const [errorMsg,setErrorMsg] = useState("")

  
  
  const submitCustomerDetails = async(e)=>{
    e.preventDefault()
    
    const formatDate = format(new Date(),"dd-MM-yyy")
    
    const jwtToken = Cookies.get("jwt_token")
    const customerDetails = {
      name,
      mobile,
      budget,
      propertyType,
      propertyName,
      location,
      moreInformation,
      date:formatDate,
    }
    //const url = "http://localhost:4000/customer"
    const url = "https://realstate-fullstack.onrender.com/customer"
    const options = {
      method :"POST",
      headers:{
        "Content-Type":"application/json",
        authorization :`Bear ${jwtToken}`
      },
      body:JSON.stringify(customerDetails)
    }

    const response = await fetch(url,options)
    if (response.ok === true){
      alert("Customer Details added successfully")
      setName("")
      setMobile("+91 ")
      setBudget("")
      setLocation("")
      setPropertyType("")
      setPropertyName("")
      setMoreInformation("")
    }else{
      const data = await response.json()
      setError(true)
      setErrorMsg(data.error_msg)
    }

  }

  return (
    <div className='customer-bg-container'>
      <Header/>
        <form className='customer-form-container' onSubmit={submitCustomerDetails}>
        <h1 className='customer-heading'>Enter Customer details</h1>
        <div className='flex-row'>
        <label className='label-text' htmlFor='name'>Name : </label>
        <input id = "name" type = "text" placeholder='name'
        value={name} onChange={(e)=>setName(e.target.value)}
        className='customer-name-input' required/>
        </div>
        <div className='flex-row'>
        <label className='label-text' htmlFor='mobile'> Mobile : </label>
        <input id = "mobile" type = "text" placeholder='mobile'
        value={mobile} onChange={(e)=>setMobile(e.target.value)}
        className='customer-name-input' required/>
        
        </div>
        <div className='flex-row'>
          <label className='label-text' htmlFor='propertyType'>Property Type : </label>
        <select id = "propertyType" 
        value = {propertyType} onChange={(e)=>setPropertyType(e.target.value)}
        className='property-type-dropdown' required>
          <option className='property-type-option' id = "select">Select</option>
         {propertyTypes.map(eachItem =><option className='property-type-option' key = {eachItem.id} value={eachItem.displayText}>{eachItem.displayText}</option>)}
        </select>
        </div>

        <div className='flex-row'>
          <label className='label-text' htmlFor='propertyName'>Property Name : </label>
        <select id = "propertyName" 
        value={propertyName} onChange={(e)=>setPropertyName(e.target.value)}
        className='property-type-dropdown' required>
          <option className='property-type-option' id = "select">Select</option>
         {properties.map(eachItem =><option className='property-type-option' key = {eachItem.id} value={eachItem.displayText}>{eachItem.displayText}</option>)}
        </select>
        </div>
        <div className='flex-row '>
        <label className='label-text label-margin-top' htmlFor='location'>Location : </label>
        <textarea rows= "3" cols = "35" 
        value={location} onChange={(e)=>setLocation(e.target.value)}
        className='location-input' id = "location"/>
        </div>

        <div className='flex-row'>
        <label className='label-text' htmlFor='budget'> Budget : </label>
        <input id = "budget" type = "text" placeholder='Budget' 
        value={budget} onChange={(e)=>setBudget(e.target.value)}
        className='customer-name-input' required/>
        
        </div>

        <div className='flex-row '>
        <label className='label-text label-margin-top' htmlFor='moreInformation'>More Information : </label>
        <textarea rows= "3" cols = "35" 
        value={moreInformation} onChange={(e)=>setMoreInformation(e.target.value)}
        className='location-input' id = "moreInformation"/>
        </div>
        <button type='submit'className='customer-submit-btn'>Submit</button>
        {showError && <p className='err-text'>* {errorMsg}</p>}
        </form>
    </div>
  )
}

export default Customer

/*
  console.log("name",name)
  console.log("mobile",mobile)
  console.log("budget",budget)
  console.log("propertyName",propertyName)
  console.log("propertyType",propertyType)
  console.log("location",location)
  console.log("moreInformation",moreInformation)
  */