import { useState } from "react"
import axios from 'axios'
import io from "socket.io-client"
import {Link} from 'react-router-dom';
const socket = io('https://procback.herokuapp.com')
const Card =props =>{
  const [state,setState] = useState(false)
  const toggle =()=>{
    if(state)setState(false)
    else setState(true)
  }
  const classN = `${state? 'red' : 'blue'}` 
  return(
    <div>
    <div className='card_head'>{props.user.BranchName}
    <Link className={classN}  onClick ={()=>toggle()}>
      {state?<span >close</span>
      :<span>view</span>}</Link>
      </div>
    {
      state?(<div>
        Branch Incharge :{props.user.BranchIncharge}<br></br>
        City:{props.user.City}<br></br>
        Address:{props.user.Address}<br></br>
        Contact:{props.user.ContactNumber}<br></br>
      </div>):null
    }
    
  </div>
  )
  
}
const List =(props)=>{
    if(props.users==null){
        return <div className='wel'><i className="far fa-smile-beam"></i>Welcome to Beetle Nut Service....please enter pincode your pincode</div>;
    }else if(props.users.length===0){
      return <div className='nod'><i className="far fa-frown-open"></i>No donuts for you......<br></br>
      Sorry pincode in not serviceable yet
      </div>
    }
    else{
        const list= props.users.map(user=>{
            return(<li  key={user._id}>
              <Card user ={user}/>
              
            </li>
                
               )
        })
        return <ul>{list}</ul>
      }
        
   
}

const Header =()=>{
  const [pincode,setPincode] = useState('');
  const [users,setUsers] =useState(null)
  const  [error,seterror] =useState(false)
  const handleChange=(e)=>{
        e.preventDefault();
        setPincode(e.target.value)
  }
  const handleSubmit=(e)=>{
      e.preventDefault()
      if(pincode.length===6){
        const data ={pincode:pincode}
        axios.post('https://procback.herokuapp.com/servicelist',data)
        .then(res=>{setUsers(res.data)})
    const time =new Date().toLocaleTimeString('en-US', { hour12: true, 
        hour: "numeric", 
        minute: "numeric"});
    
    socket.emit('message',{time,pincode})
    setPincode('')
    seterror(false)
      }
      else {seterror(true)
          setPincode('')
      }
    
  }
 const placeholder=`${error?'invalid pincode':'search'}`
 const className=`${error?'errorer':''}`
 
    return(
        <div>
          <div className ='row heade flex_around'>
          <div className ='one'>
            Scavenger Hunt
            </div>
            <div className ='two'>
            <form >
            <input className={className} type="text" placeholder={placeholder} value={pincode} onChange={e=>handleChange(e)} required/>
            <button onClick={(e)=>handleSubmit(e)}>search</button>
            </form>
            </div>
          </div>
           <div className ='row'>
           <List users={users}/>
           </div>
            
           
          
        </div>)
}
export default Header;