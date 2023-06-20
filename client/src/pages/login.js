import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'          //điều url tới các component
import { login } from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'


const Login = () => {
    const initialState = { email: '', password: '' }        // khai báo bien ob để set useState
    const [userData, setUserData] = useState(initialState)  // khai báo biến state userData và setUserData update state
    const { email, password } = userData

    const [typePass, setTypePass] = useState(false)         // khai báo biến typePass với giá trị ban đầu là false

    const { auth } = useSelector(state => state)
    const dispatch = useDispatch()                          // lấy ra đối số của state
    const history = useHistory()

    // thay đổi url sau khi render
    useEffect(() => {                    
        if(auth.token) history.push("/")
    }, [auth.token, history])

    // e read email and password
    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value})        //
    }
    // e login
    const handleSubmit = e => {
        e.preventDefault()                 // ngan ko gui from auth_page
        dispatch(login(userData))          // gọi action
    }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Social media</h3>

                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" name="email"
                    aria-describedby="emailHelp" onChange={handleChangeInput} value={email} />
                    
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>

                    <div className="pass">
                        
                        <input type={ typePass ? "text" : "password" } 
                        className="form-control" id="exampleInputPassword1"
                        onChange={handleChangeInput} value={password} name="password" />

                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                   
                </div>
                
                <button type="submit" className="btn btn-dark w-100"
                disabled={email && password ? false : true}>
                    Login
                </button>

                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{color: "crimson"}}>Register Now</Link>
                </p>
            </form>
        </div>
    )
}

export default Login
