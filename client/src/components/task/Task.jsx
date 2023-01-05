import React, {useEffect, useState} from "react";
import "./Task.css";
import {useSelector} from "react-redux";
import {random, takeSubArray} from "../../functions";
import {ANSWER_OPTIONS_COUNT, FINISH, NEXT} from "../../constants";

export function Task(props) {
  const [taskNo, setTaskNo] = useState(0);
  const [tasks, setTasks] = useState(null);

  const alphabet = useSelector(state => state.alphabet.alphabet);
  const lettersToTrain = useSelector(state => state.alphabet.lettersToTrain);

  useEffect(() => {
    const list = [];

    for (let i = 0; i < lettersToTrain.length; i++) {
      const task = takeSubArray(lettersToTrain, Math.min(ANSWER_OPTIONS_COUNT, lettersToTrain.length), i);

      // add missing options
      const missingOptionsCount = ANSWER_OPTIONS_COUNT - lettersToTrain.length;

      if (missingOptionsCount > 0) {
        const missingOptions = [];
        const letterIndInAlphabet = alphabet.indexOf(lettersToTrain[lettersToTrain.length - 1]);

        for (let i = 1; (i < alphabet.length) && missingOptions; i++) {
          const currentInd = (letterIndInAlphabet + i) % alphabet.length;
          if (alphabet[currentInd]) {
            missingOptionsCount--;
            missingOptions.push(alphabet[currentInd]);
          }
        }
        
        if (random(2)) {
          task = [...missingOptions, ...task];
        } else {
          task.push(...missingOptions);
        }
      }

      list.push(task);
    }

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