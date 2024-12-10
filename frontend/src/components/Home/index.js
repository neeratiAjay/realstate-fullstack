import {Component} from "react"
import Cookies from "js-cookie"
//import Popup from 'reactjs-popup'
import { FaSearch } from "react-icons/fa" 
import {Link} from "react-router-dom"

import CustomerDetails from "../CustomerDetails"

import "./index.css"

const apiStatusConstants = {
    initial :"INITIAL",
    success :"SUCCESS",
    failure :"FAILURE",
    inProgress :"IN_PROGRESS"
}




class Home extends Component{
    state = {customersData:[],apiStatus:apiStatusConstants.initial,searchInput:"",}
    
    getCustomersData = async()=>{
        this.setState({apiStatus :apiStatusConstants.inProgress})
        const {searchInput} = this.state 
        
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:4000/customer?search_q=${searchInput}`
        const options = {
            method:"GET",
            headers :{
                'content-Type':"application/json",
                authorization:`Bear ${jwtToken}`
            }
        }
        const response = await fetch(url,options)
        const data = await  response.json()
        if (response.ok === true){
            const formattedData = data.map(eachItem=>({
                id:eachItem.id,
                budget:eachItem.budget,
                customerName:eachItem.customer_name,
                date :eachItem.date_time,
                interestedProperty :eachItem.interested_property,
                location :eachItem.location,
                mobile:eachItem.mobile,
                moreInformation :eachItem.more_information,
                propertyType:eachItem.property_type,
                userId :eachItem.user_id
            }))
           this.setState({customersData:formattedData,apiStatus:apiStatusConstants.success})
        }else{
            this.setState({apiStatus:apiStatusConstants.failure})
        }
    }

    componentDidMount(){
        this.getCustomersData()
    }
    
    deleteCustomer = async(id)=>{
        const {customersData} = this.state
        const jwtToken = Cookies.get("jwt_token")
        const url = `http://localhost:4000/customer/${id}`
        const options ={
            method:"DELETE",
            headers:{
                'Content-Type':'application/json',
                authorization:`Bear ${jwtToken}`
            }
        }
        const response = await fetch(url,options)
        if(response.ok ===true){
           const filterData = customersData.filter(eachItem =>eachItem.id !== id)
           this.setState({customersData:filterData})
            alert("Customer Deleted Successfully")
        }else{
            alert("Something Went Wrong")
        }
    }

    updateDetails =(id,customerDetails)=>{
        const {customersData} = this.state 
        const{ name,
            mobile,
            budget,
            location,
            moreInformation,
            propertyType,
            propertyName,
            date} = customerDetails
       const updatedData = customersData.filter(eachItem =>{
        if(eachItem.id === id){
            return ({id,name,
                mobile,
                budget,
                location,
                moreInformation,
                propertyType,
                propertyName,
                date})
        }else{
            return eachItem
        }
       }) 
        this.setState({customersData:updatedData},this.getCustomersData)
        
    }
   

  changeSearchInput = event =>{
    this.setState({searchInput:event.target.value},this.getCustomersData)
  }


    render(){
        const {customersData,searchInput} = this.state 
        
        return (
            <div className="home-bg-container">
               <h1 className="home-customer-heading">Customers Response  Details</h1>
               <div className="search-flex-row-container">
                <div className="input-flex-row-container">
               <input type = "search" className="search-input" 
               value={searchInput} onChange={this.changeSearchInput}
               placeholder="Search Details"/>
               <button type="button" className="search-btn"onClick={this.getCustomersData}>
                <FaSearch size={25} />
               </button>
               </div>
               <Link to ="/customer">
               <button type = "button" className="add-user">Add New Customer</button>
               </Link>
               </div>
               <table>
                <thead>
                    <tr>
                        <th >ID</th>
                        <th >customer Name</th>
                        <th >Mobile</th>
                        <th >Property Type</th>
                        <th>Property Name</th>
                        <th >Budget</th>
                        <th >Location</th>
                        <th >Contacted Date</th>
                        <th >More Information</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                
                {customersData.map((eachRow,index)=><CustomerDetails key = {eachRow.id} 
                customer = {eachRow} indexId = {index+1} 
                updateHandler = {this.updateDetails}deleteHandler = {this.deleteCustomer}/>)}
                </tbody>
               </table>
            </div>
        )
    }
}
export default Home

