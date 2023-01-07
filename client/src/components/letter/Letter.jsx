import React, {useEffect, useRef} from "react";
import "./Letter.css";

export function Letter(props) {
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
        <div className={"letter" + ((props.letterObj.change) ? " " + props.letterObj.change : '')}>
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