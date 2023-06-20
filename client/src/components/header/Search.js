import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import UserCard from '../UserCard'
import LoadIcon from '../../images/loading.gif'
import SpeechRecognitionVoice  from '../SpeechRecognitionVoice'

const Search = () => {
    
    const [search, setSearch] = useState('')
    const [data, setData] = useState('');
    const [users, setUsers] = useState([])

    const { auth, speech } = useSelector(state => state)
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)
    const [onVoiceSearch, setVoiceSearch] = useState(false)


    const handleSearch = async (e) => {
        e.preventDefault()
        if(!search) return;

        try {
            setLoad(true)
            const res = await getDataAPI(`search?username=${search}`, auth.token)
            setUsers(res.data.users)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleVoiceSearch = async (e) => {
        try {
            setLoad(true)
            const res = await getDataAPI(`search?username=${data.replace('.', '')}`, auth.token)
            setUsers(res.data.users)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

    const handleClose = () => {
        setSearch('')
        setUsers([])
    }
    useEffect(() => {
        if(data.length > 0){
            setSearch(data)
            handleVoiceSearch();
        }
    },[data])

    return (
        <form className="search_form" onSubmit={handleSearch}>

            
            <input type="text" name="search" value={search} id="search" title="Enter to Search"
            onChange={e => setSearch(e.target.value)} >       
            </input>
            <div className="search_icon" style={{opacity: search ? 0 : 0.3}}>
                <span className="material-icons">search</span>
                <span>Enter to Search</span>
            </div>

            <div className="close_search" onClick={handleClose}
            style={{opacity: users.length === 0 ? 0 : 1}} >
                &times;
            </div>
            <button style={{position: 'absolute', top: 0, right: -20, cursor:'pointer', border: 'none', backgroundColor: "#f8f9fa", height: "0%"}} 
             > 
                <i className="fa fa-microphone" onClick={() => dispatch({ type: GLOBALTYPES.SPEECH, payload: true })} >
                </i>
            </button>
            
            <button type="submit" style={{display: 'none'}}>Search</button>

            { load && <img className="loading" src={LoadIcon} alt="loading"  /> }
            {speech && <SpeechRecognitionVoice setData={setData}/>}

            <div className="users">
                {
                    search && users.map(user => (
                        <UserCard 
                        key={user._id} 
                        user={user} 
                        border="border"
                        handleClose={handleClose} 
                        />
                    ))
                }
            </div>
        </form>
    )
}

export default Search
