import { useState,useEffect } from "react";
import {signOut} from '../../actions'
import {connect} from "react-redux";
import axios from 'axios'
import io from "socket.io-client"
const socket = io('https://procback.herokuapp.com')
const deleteAlerts=(id)=>{
    if(id){
        const data= {_id:id}
        console.log(data)
        axios.post('https://procback.herokuapp.com/deletelist',data)
        .then(res=>{console.log(res)})
        .catch(e=>{
            console.log(e)
        })
    }
   
}
const PastAlerts = (props)=>{
    const [pastalerts,setPastalerts] =useState([])
    useEffect(()=>{
        console.log('p')
     
        const email ={email:props.email}
        axios.post('https://procback.herokuapp.com/alertlist',email)
        .then(res=>{
            
            setPastalerts(res.data)
            
        })
       
    },[])
    
        
       const li= pastalerts.map((alert, index)=>{
        return(
          <div key={index}><i className="fas fa-bell"></i>Alert!! on :<span>{alert}</span></div>
        )
        })
    if(pastalerts.length!==0){
        return(<div>
            {li}
        </div>)
    }else{
        return<div>No missed alerts</div>
    }
  
   
        
}
const CurrAlerts =(props)=>{
    const [curalerts,setCuralerts] =useState([])
    
    useEffect(() => {
      
   
         socket.on('message', payload => {
            const codes = props.pincodes
            codes.map(code=>{
                if(code===payload.pincode) {
                setCuralerts([...curalerts, payload]) 
                
                } 
            })
          
          
        })
        deleteAlerts(props.id); 
      
    },[curalerts])
    return(<div>
        
        {curalerts.map((alert, index)=>{
    return(
      <h3 key={index}><i className="fas fa-bell"></i>Alert on : <span>{alert.time}</span></h3>
    )
    })}

    </div>)
}
const Server = (props)=>{
  
  useEffect(() => {
      if(!props.auth.isAuthenticated){
          props.history.push('/login')
      }
     
  })  
  const logout =()=>{
         props.signOut(props.history)
      
  }
    return(
        <div>
            <div className='row heade flex_around'>
          <div className='one'>
            Scavenger Hunt
            </div>
            <div className='two'>
            <button onClick={()=>logout()}>logout</button> 
            </div>
          </div>
        
            <div className='row flex top'>
            <i className="fas fa-check-circle"></i> This panel is for {props.auth.user.BranchIncharge}
            </div>
            <div className='row alerts'>
                <div className='col span-1-of-2 past'>
                    <div className='past '>
                    <div className='headal flex flex_down'>Missed Alerts</div>
                    <div className='partal'><PastAlerts email ={props.auth.user.email}/></div>
                    
                    </div > 
                </div>
                   
                <div className='col span-1-of-2 '>
                    <div className='curr '>
                    <div className='headal flex flex_down'>Current alerts</div>
                    <div className='partal '>
                        <CurrAlerts id={props.auth.user._id} pincodes={props.auth.user.pincodes} />
                    </div>
                  
                    </div>
                </div>
                   
            </div>
        
        
           
        </div>)
}
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps,{signOut})(Server);