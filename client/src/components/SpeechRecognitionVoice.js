import React, {  useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import {  useDispatch } from 'react-redux'

const SpeechRecognitionVoice = ({setData}) => {
  
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('vi-VN')
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition()
  const dispatch = useDispatch()

  const handleListing = () => {
    if (isListening ){
      voiceEnd();
    }
    else {
      voiceStart();
    }
  };

  const voiceStart = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: language }); //vi-VN
  } 

  const voiceEnd = () => {
    setIsListening(false);
    setData(transcript);
    SpeechRecognition.stopListening();
    
    dispatch({ type: GLOBALTYPES.SPEECH, payload: false  })
  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="voice">
      <div className="voice_box">
          <h5 className="text-center">            {
              isListening ? <p>Listening...</p> : <p>Click to start listening</p>
            }</h5>
          <hr/>

          <div className="chooseVoice" style={{paddingLeft: '110px'}}>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{width: '50%', textAlign: 'center'}}>
                  <option value="vi-VN">Viet Nam</option>
                  <option value="en-US">English</option>
            </select>
          </div>
          <br></br>
          <div className="voice_content">
               <button type="button" className="btn btn-link" 
               style={{backgroundColor:'#fff',
                    border:'1px solid black',    
                    height:'70px',
                    borderRadius:'50%',
                    width:'70px',
                    position: 'absolute',
                    left: '140px',
                    top: '120px'}}
                // onTouchStart={handleListing}
                // // onMouseDown={handleListing}
                // onTouchEnd={handleListing}
                // // onMouseUp={handleListing}
                onClick={handleListing}>
                <span className="bi bi-mic red-color" > </span></button>

                <p style={{
                    position: 'absolute',
                    maxHeight:'500px',
                    maxwidth:'500px',
                    right: '10px',
                    left: '10px',
                    top: '200px'}}>{transcript}</p>
          </div>
          <div className="close" onClick={() => dispatch({
                        type: GLOBALTYPES.SPEECH, payload: false
                    })}>
              &times;
          </div>
      </div>
    </div>
  )
}
export default SpeechRecognitionVoice