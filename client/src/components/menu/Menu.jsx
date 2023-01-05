import React, {useEffect, useMemo, useRef} from "react";
import "./Menu.css";
import {Letter} from "../letter/Letter";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE, HIRAGANA, KATAKANA, LEARN, PENDING, REVISE, UNUSED} from "../../constants";
import {changeType, setAlphabet, setLettersToTrain} from "../../store/alphabetSlice";

function checkIfLetterMatchToStatus(letter, status) {
  if (!letter) return false;
  if (status === PENDING) {
    if (letter.level >= 5 && Date.now() - letter.lastCall >= letter.timeout) {
      return true;
    } else return false;
  } else if (status === UNUSED) {
    if (letter.level <= 4) return true;
    else return false;
  }
  return false;
}

function updateTimeInfo(letter) {
  letter.lastCall = Date.now();
}

function makeLettersListMatchingStatus(letters, status) {
  const lettersToTrain = [];
  for (let i = 0; i < letters.length; i++) {
    if (checkIfLetterMatchToStatus(letters[i], status)) {
      lettersToTrain.push(letters[i]);
    }
  }
  return lettersToTrain;
}
function checkAreWhereLettersMatchingStatus(letters, status) {
  let count = 0;
  for (let i = 0; i < letters.length; i++) {
    if (letters[i]) {
      if (checkIfLetterMatchToStatus(letters[i], status)) {
        count++;
        if (count === 4) return true;
      }
    }
  }
  return false;
}

/* Menu Component
--------------------------------------------------------------- */
export function Menu(props){
  const alphabetButtons = {
    [HIRAGANA]: useRef(),
    [KATAKANA]: useRef()
  };

  const isPendingLearningStatus = useMemo(() => {
    return {
      [HIRAGANA]: false,
      [KATAKANA]: false
    }
  }, []);

  const alphabetType = useSelector(state => state.alphabet.type);
  const alphabet = useSelector(state => state.alphabet.alphabet);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:5000/')
    .then(response => response.json())
    .then(data => {
      if (checkAreWhereLettersMatchingStatus(data[HIRAGANA], PENDING)) {
        isPendingLearningStatus[HIRAGANA] = true;
      }
      if (checkAreWhereLettersMatchingStatus(data[KATAKANA], PENDING)) {
        isPendingLearningStatus[KATAKANA] = true;
      }

      dispatch(setAlphabet(data));
    })
    .catch(() => console.log('error'))
  }, [])

  return(
    (!alphabet) ? <div>Loading...</div> :
    <div className='menu'>
      <div className='alphabet-choosing-container top-interface'>
        <button
          ref={alphabetButtons[HIRAGANA]}
          className='alphabet-choosing-btn active hiragana-btn'
          onClick={chooseAlphabet}
          data-alphabet-type={HIRAGANA}
        >Хирагана</button>

        <button
          ref={alphabetButtons[KATAKANA]}
          className='alphabet-choosing-btn katakana-btn'
          onClick={chooseAlphabet}
          data-alphabet-type={KATAKANA}
        >Катакана</button>
      </div>

      <div className='alphabet-container'>
        {alphabet[alphabetType].map((item, ind) => <Letter key={alphabetType + ind} letterObj={item}/>)}
      </div>
      <button className='bottom-btn train-btn' onClick={trainBtnClickHandler}>
        {(isPendingLearningStatus[alphabetType]) ? REVISE : LEARN}
      </button>
    </div>
  )

  function chooseAlphabet(event) {
    const currentAlphabetType = event.target.dataset.alphabetType;
    if (currentAlphabetType !== alphabetType) {
      alphabetButtons[alphabetType].current.classList.remove(ACTIVE);
      alphabetButtons[currentAlphabetType].current.classList.add(ACTIVE);
      dispatch(changeType(currentAlphabetType));
    }
  }

  function trainBtnClickHandler() {
    const lettersToTrain = makeLettersListMatchingStatus(alphabet[alphabetType], UNUSED);
    dispatch(setLettersToTrain(lettersToTrain));
    props.changeAppScreen();
  }
}
