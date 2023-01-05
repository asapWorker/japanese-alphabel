import React, {useEffect, useRef, useState} from "react";
import "./Letter.css";

export function Letter(props) {
  const [isMenuLetter, setIsMenuLetter] = useState(true);
  const progressRef = useRef();

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = (props.letterObj.level * 10) + '%';
    }
  }, [props])

  return (
    <div className="letter-container">
      {
        (!props.letterObj) ? <div className='empty-item'/> :
        <div className="letter">
          <div className="letter-symbol">{props.letterObj.symbol}</div>
          <div className="letter-transcription">{props.letterObj.transcription}</div>
          <div className="letter-progress">
            <div ref={progressRef} className="progress-indicator"/>
          </div>
        </div>
      }
    </div>
  )
}