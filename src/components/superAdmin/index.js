import { useEffect, useState } from "react";
import {connect} from 'react-redux'
import axios from 'axios'
import {signOut} from '../../actions'
import io from "socket.io-client"
import {Link} from 'react-router-dom'
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
      <Link className={classN}  onClick ={()=>toggle()} >
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
const Admins =()=>{
    const [admins, setAdmins]= useState(null)
    useEffect(() => {
        axios.get("https://procback.herokuapp.com/adminlist")
        .then(res=>{
            setAdmins(res.data)
        })
    },[])
 
    return(
        <div>
           
            <ul>
                {admins?
                     (admins.map(admin=>{
                        return <li key={admin._id}>
                            <Card user={admin} />
                            </li>
                    })):null
                
                   
                }
            </ul>
            
        </div>)
}
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
// const CurrAlerts =(props)=>{
//     const [curalerts,setCuralerts] =useState([])
//     const [didMount, setDidMount] = useState(false);

//     useEffect(() => {
//         setDidMount(true);
//          socket.on('message', payload => {
//             setCuralerts([...curalerts, payload]) 
//            })
//         deleteAlerts(props.id); 
//         return () => setDidMount(false);
//     },[curalerts])
//     return(<div>
//         current alerts
//         {curalerts.map((alert, index)=>{
//     return(
//       <h3 key={index}>searched{alert.pincode} <span>{alert.time}</span></h3>
//     )
//     })}

//     </div>)
// }
const CurrAlerts =(props)=>{
    const [curalerts,setCuralerts] =useState([])
 
    
    useEffect(() => {
      
   
        socket.on('message', payload => {
            setCuralerts([...curalerts, payload]) 
           })
        deleteAlerts(props.id); 
      
    },[curalerts])

    return(<div>
        
        {curalerts.map((alert, index)=>{
    return(
      <h3 key={index}><i className="fas fa-bell"></i>Alert on : {alert.time} at {alert.pincode}</h3>
    )
    })}

    </div>)
}
const PastAlerts = (props)=>{
    const [pastalerts,setPastalerts] =useState([])
    useEffect(()=>{
       
        const email ={email:props.email}
        axios.post('https://procback.herokuapp.com/alertlist',email)
        .then(res=>{
            console.log(res.data)
            setPastalerts(res.data)
            
        })
     
    },[])
    
        console.log(pastalerts)
       const li= pastalerts.map((alert, index)=>{
        return(
          <div key={index}><i className="fas fa-bell"></i>Alert!! on :{alert.time} at {alert.pincode}</div>
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
const SuperAdmin = (props)=>{
    useEffect(() => {
        if(!props.auth.isAuthenticated||!props.auth.user.admin){
            props.history.push('/login')
        }
    })
    const logout =()=>{
        props.signOut(props.history)
     
 }
    return(
        // <div>
          
           
        //     <PastAlerts email={props.auth.user.email}/>
        //     <CurrAlerts pincodes={props.auth.user.pincodes} id={props.auth.user._id}/>
        //     <Admins/>
        //     <button onClick={()=>props.signOut(props.history)}>logout</button>
        // </div>
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
            <i className="fas fa-check-circle"></i> Welcome Super Admin
            </div>
            <div className='row alerts'>
                <div className='col span-1-of-3 past'>
                    <div className='past '>
                    <div className='headal flex flex_down'>Missed Alerts</div>
                    <div className='partal'><PastAlerts email ={props.auth.user.email}/></div>
                    
                    </div > 
                </div>
                   
                <div className='col span-1-of-3 '>
                    <div className='curr '>
                    <div className='headal flex flex_down'>Current alerts</div>
                    <div className='partal '>
                        <CurrAlerts id={props.auth.user._id} pincodes={props.auth.user.pincodes} />
                    </div>
                  
                    </div>
                </div>
                <div className='col span-1-of-3 '>
                    <div className='admins'>
                    <div className='headal flex flex_down'>Admin list</div>
                    <div className='partal '>
                       <Admins/>
                    </div>
                  
                    </div>
                </div>
                   
            </div>
        
        
           
        </div>
        )
}

const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps,{signOut})(SuperAdmin);

// import { useState,useEffect,useRef } from "react";
// import {signOut} from '../../actions'
// import {connect} from "react-redux";
// import axios from 'axios'
// import io from "socket.io-client"
// const socket = io('http://localhost:4000')
// const deleteAlerts=(id)=>{
//     if(id){
//         const data= {_id:id}
//         console.log(data)
//         axios.post('http://localhost:4000/deletelist',data)
//         .then(res=>{console.log(res)})
//         .catch(e=>{
//             console.log(e)
//         })
//     }
   
// }
// const PastAlerts = (props)=>{
//     const [pastalerts,setPastalerts] =useState([])
//     useEffect(()=>{
//         console.log('p')
//         let unmounted = false;
//         const email ={email:props.email}
//         axios.post('http://localhost:4000/alertlist',email)
//         .then(res=>{
            
//             setPastalerts(res.data)
            
//         })
//         return () => { unmounted = true };
//     },[])
//     return(
//         <div>
//             {pastalerts.map((alert, index)=>{
//         return(
//           <h3 key={index}>searched <span>{alert}</span></h3>
//         )
//         })}
//         </div>
//     )
   
        
// }
// const CurrAlerts =(props)=>{
//     const [curalerts,setCuralerts] =useState([])
//     const [didMount, setDidMount] = useState(false);
//     const socketRef = useRef()
//     useEffect(() => {
//         console.log('c')
//         setDidMount(true);
//         socketRef.current = io.connect("http://localhost:4000")
//          socketRef.current.on('message', payload => {
//             const codes = props.pincodes
//             codes.map(code=>{
//                 if(code===payload.pincode) {
//                 setCuralerts([...curalerts, payload]) 
                
//                 } 
//             })
          
          
//         })
//         deleteAlerts(props.id); 
//         return () => setDidMount(false);
//     },[curalerts])
//     return(<div>
//         current alerts
//         {curalerts.map((alert, index)=>{
//     return(
//       <h3 key={index}>searched <span>{alert.time}</span></h3>
//     )
//     })}

//     </div>)
// }
// const SuperAdmin = (props)=>{
  
//   useEffect(() => {
//       if(!props.auth.isAuthenticated || !props.auth.user.admin){
//           props.history.push('/login')
//       }
     
//   })  
//   const logout =()=>{
//          props.signOut(props.history)
      
//   }
//     return(
//         <div>
//             {props.auth.user.email}
//         <div>
//             <Admins/>
//         past alerts
//         <PastAlerts email ={props.auth.user.email}/>
        
//         </div>   
//         <CurrAlerts id={props.auth.user._id} pincodes={props.auth.user.pincodes} />
//            <button class='btn' onClick={()=>logout()}>logout</button> 
//         </div>)
// }
// const mapStateToProps = state => ({
//     auth: state.auth,
// });
// export default connect(mapStateToProps,{signOut})(SuperAdmin);