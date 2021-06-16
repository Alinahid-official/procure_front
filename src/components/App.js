import './App.css';
import './grid.css';
import {Provider} from 'react-redux';
import store from '../store';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Login from './login/login';
import Client from './clientSide';
import Server from './serverSide';
import {SIGN_IN,SIGN_OUT} from '../actions/types';
import jwt_decode from 'jwt-decode';
import superAdmin from './superAdmin';


if(localStorage.jwtToken) {
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch({
    type:SIGN_IN,
    payload:decoded.user
  });
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime) {
    store.dispatch({
      type: SIGN_OUT
    });
  }
}
function App() {
  return (
    <Provider store={store}>
        <BrowserRouter >
        <Switch>
         <Route path="/" exact component={Client}></Route>
         <Route path="/adminSuper"  component={superAdmin}></Route>
         <Route path="/admin"  component={Server}></Route>
         <Route path="/login"  component={Login}></Route>
         
       </Switch>
       </BrowserRouter>
    </Provider>

     
  );
}

export default App;
