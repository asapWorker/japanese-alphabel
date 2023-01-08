import React, {useEffect, useState} from "react";
import "./Task.css";
import {useDispatch, useSelector} from "react-redux";
import {random, takeSubArray} from "../../functions";
import {ANSWER_OPTIONS_COUNT, CORRECT, FINISH, NEXT, WRONG} from "../../constants";
import { updateLetterInfo } from "../../store/alphabetSlice";

export function Task(props) {
  const [taskNo, setTaskNo] = useState(0);
  const [tasks, setTasks] = useState(null);
  const [chosenOption, setChosenOption] = useState(null);

  const alphabet = useSelector(state => state.alphabet.alphabet);
  const alphabetType = useSelector(state => state.alphabet.type);
  const lettersToTrain = useSelector(state => state.alphabet.lettersToTrain);

  const dispatch = useDispatch();

  useEffect(() => {
    const list = [];

    for (let i = 0; i < lettersToTrain.length; i++) {
      let task = takeSubArray(lettersToTrain, Math.min(ANSWER_OPTIONS_COUNT, lettersToTrain.length), i);

      // add missing options
      let missingOptionsCount = ANSWER_OPTIONS_COUNT - lettersToTrain.length;

      if (missingOptionsCount > 0) {
        const missingOptions = [];
        const letterIndInAlphabet = alphabet[alphabetType].indexOf(lettersToTrain[lettersToTrain.length - 1]);

        for (let i = 1; (i < alphabet[alphabetType].length) && (missingOptionsCount > 0); i++) {
          const currentInd = (letterIndInAlphabet + i) % alphabet[alphabetType].length;
          if (alphabet[alphabetType][currentInd]) {
            missingOptionsCount--;
            const letter = alphabet[alphabetType][currentInd];
            missingOptions.push({
              symbol: letter.symbol,
              transcription: letter.transcription,
              indInAlphabet: currentInd,
              level: letter.level
            });
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

  useEffect(() => {
    if (chosenOption) {
      chosenOption.elem.classList.remove(chosenOption.status);
      setChosenOption(null);
    }
  }, [taskNo])

  return (
    (!tasks) ? <div className="spinner"/> :
    <div className='task'>
      <div className='transcription top-interface'>
        {`[ ${lettersToTrain[taskNo].transcription} ]`}
      </div>

      <div className='letter-options-container'>
        {
          tasks[taskNo].map((letter, ind) => {
            return (
              <button 
                key={ind}
                className="letter-option"
                data-ind-in-alphabet={letter.indInAlphabet}
                onClick={letterOptionChooseHandler}
                disabled={chosenOption}
              >{letter.symbol}</button>
            )
          })
        }
      </div>

      {(chosenOption) && <button
        className={'bottom-btn next-btn ' + chosenOption.status}
        onClick={nextBtnClickHandler}
      >{
        (taskNo === lettersToTrain.length - 1) ? FINISH : NEXT
      }</button>}
    </div>
  )

  function nextBtnClickHandler() {
    if (taskNo < lettersToTrain.length - 1) {
      setTaskNo(prevState => prevState + 1);
    } else {
      props.changeAppScreen();
    }
  }

  function letterOptionChooseHandler(event) {
    const chosenOptionObj = {
      elem: event.target,
      status: null
    };

    let answerStatus = WRONG;
    let level = lettersToTrain[taskNo].level;

    if (parseInt(event.target.dataset.indInAlphabet) === lettersToTrain[taskNo].indInAlphabet) {
      chosenOptionObj.status = CORRECT;
      event.target.classList.add(CORRECT);

      answerStatus = CORRECT;
      if (level < 10) level++;
    } else {
      chosenOptionObj.status = WRONG;
      event.target.classList.add(WRONG);

      if (level > 0) level--;
    }

    dispatch(updateLetterInfo({
      indInAlphabet: lettersToTrain[taskNo].indInAlphabet,
      answerStatus,
      level
    }));

    setChosenOption(chosenOptionObj);
  }
}