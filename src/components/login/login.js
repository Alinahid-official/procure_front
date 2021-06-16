import {useEffect} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form'
import {signIn} from '../../actions'
import { SubmissionError } from 'redux-form'
import axios from 'axios';

const validate = values => {
    const errors = {}
    if (!values.email) {
      errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address'
    }
    if (!values.password) {
      errors.password = 'Required'
    }
    return errors
  }

  const renderField = ({
    input,
    label,
    type,
    meta: { touched, error }
  }) => {
    const className = `input ${error && touched ? 'error' : ''}`;
    const icon = `fas fa-exclamation-circle ${error && touched ? 'show1' : 'hide1'}`;
    return(
     
     <div className='field' >
         <div className='input-box'>
         <input id='input' className={className} {...input} type={type} required />
         <label htmlFor='input' className='label' alt={label} placeholder={label}></label>
         </div><i className={icon}></i><br></br>
         {touched &&
           (error &&<span class='span'>{error}</span>)}
     </div>
     )
  }
  const Form = props => {
    const submit=  async values=>{
    const response=await axios.post('https://procback.herokuapp.com/checkEmail', values)
    if(!response.data.email) {
      throw new SubmissionError( {email : 'email is not registered'})
    } else{
        const res =await axios.post('https://procback.herokuapp.com/checkPassword', values)
        if(res.data.password){
            props.onSubmit(values)
        }else{
            throw new SubmissionError( {password : 'wrong password'})
        }
    }
}
    const { error,handleSubmit, submitting } = props
    return (<div>
        <div class='row head align_center'>
            <h1>Welcome Admin!! </h1>
            <h3>please login to proceed</h3>
        </div>
        <div class='row align_center box'>
        <form class='flex flex_down login_form' onSubmit={handleSubmit(submit)}>
        <i class="fas fa-user-circle fa-4x"></i>
        <Field name="email" type="email" component={renderField} label="Email" />
        <Field name="password" type="password" component={renderField} label="password" />
        {error && <strong>{error}</strong>}
        <div>
          <button class='btn' type="submit" disabled={submitting}>
            Submit
          </button>
       
        </div>
      </form>
        </div>
             
    </div>
     
    )
  }
const LoginForm = reduxForm({
    form: 'syncValidation',
    validate
})(Form)


function Login(props) {
     
    useEffect(()=>{
        if(props.auth.isAuthenticated && props.auth.user.admin){
            props.history.push('/adminSuper')
        } else if(props.auth.isAuthenticated){
          props.history.push('/admin')
        }
    })
    const onSubmit=(values)=>{
        props.signIn(values)
    }
    return (
       <LoginForm onSubmit={onSubmit}/>
    );
  }
  const mapStateToProps = state => ({
    auth: state.auth,
});
  export default connect(mapStateToProps,{signIn})(Login);