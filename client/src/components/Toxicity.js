import React, { useState, useEffect } from 'react'
import useTextToxicity from "react-text-toxicity"
import { useSelector, useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'

const Toxicity = ({ text }) => {
    const style = { margin: 10, textAlign: 'center'};   
    const [value, setValue] = useState(text)
    const { toxic } = useSelector(state => state)
    const predictions = useTextToxicity(value)
    const dispatch = useDispatch()

    if (predictions != null) {
      var lstData = predictions.filter(prediction => prediction.match === true)
      if (lstData.length > 0) {
        dispatch({ type: GLOBALTYPES.TOXIC, payload: true  })
      } else{
        dispatch({ type: GLOBALTYPES.TOXIC, payload: false  })
      }
    }


    useEffect(() => {
      if(text.length > 0){
        setValue(text)
        console.log(predictions)
      }
  },[text])

    if (!predictions) return <div style={style}>Loading predictions...🙄</div>

  return (
    <div style={style}>
      {/* {predictions.map(({ label, match, probability }) => (
        <div style={{ margin: 5 }} key={label}>
          {match === true ? `So ${label} 🤢 (${probability})` : '' }
        </div>
      ))} */}
      <div style={{textAlign: 'center'}}>{toxic ? 'You so toxic 😥' : ''}</div>
    </div>
    
  )
}
export default Toxicity