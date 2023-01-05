import React, {useEffect, useRef, useState} from "react";
import "./Task.css";
import {useSelector} from "react-redux";
import {takeSubArray} from "../../functions";
import {ANSWER_OPTIONS_COUNT, FINISH, NEXT} from "../../constants";

export function Task(props) {
  const [taskNo, setTaskNo] = useState(0);
  const [tasks, setTasks] = useState(null);

  const lettersToTrain = useSelector(state => state.alphabet.lettersToTrain);

  useEffect(() => {
    const list = [];

    for (let i = 0; i < lettersToTrain.length; i++) {
      const task = takeSubArray(lettersToTrain, i, ANSWER_OPTIONS_COUNT);
      list.push(task);
    }
    console.log(lettersToTrain);
    console.log(list);

    setTasks(list);
  }, [])

  return (
    (!tasks) ? <div>Loading...</div> :
    <div className='task'>
      <div className='transcription top-interface'>
        {lettersToTrain[taskNo].transcription}
      </div>

      <div className='letter-options-container'>
        {tasks[taskNo].map((letter, ind) => <button key={ind} className="letter-option">{letter.symbol}</button>)}
      </div>

      <button
        className='bottom-btn next-btn'
        onClick={nextBtnClickHandler}
      >{(taskNo === lettersToTrain.length - 1) ? FINISH : NEXT}
      </button>
    </div>
  )

  function nextBtnClickHandler() {
    if (taskNo < lettersToTrain.length - 1) {
      setTaskNo(prevState => prevState + 1);
    } else {
      props.changeAppScreen();
    }
  }
}