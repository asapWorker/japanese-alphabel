import React, {useEffect, useMemo, useRef} from "react";
import "./Menu.css";
import {Letter} from "../letter/Letter";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE, HIRAGANA, KATAKANA, LEARN, REVISE, USED, UNUSED} from "../../constants";
import {changeType, setAlphabet, setLettersToTrain} from "../../store/alphabetSlice";

function checkIfLetterMatchToStatus(letter, status) {
  if (!letter) return false;
  if (status === USED) {
    if (letter.level > 0 && (Date.now() - letter.lastCall >= letter.timeout)) {
      return true;
    } else return false;
  } else if (status === UNUSED) {
    if (letter.level === 0) return true;
    else return false;
  }
  return false;
}

function makeLettersListMatchingStatus(letters, status) {
  const lettersToTrain = [];
  let count = 0;
  for (let i = 0; (i < letters.length); i++) {
    if (checkIfLetterMatchToStatus(letters[i], status)) {
      lettersToTrain.push(letters[i]);
      count++;
      if (count % 5 === 0) {
        if (i === letters.length - 2) continue;
        else break;
      }
    }
  }
  return lettersToTrain;
}
function checkAreWhereLettersMatchingStatus(letters, status) {
  for (let i = 0; i < letters.length; i++) {
    if (letters[i]) {
      if (checkIfLetterMatchToStatus(letters[i], status)) {
        return true;
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
      dispatch(setAlphabet(data));
      if (checkAreWhereLettersMatchingStatus(alphabet[HIRAGANA], USED)) {
        isPendingLearningStatus[HIRAGANA] = true;
      } else if (checkAreWhereLettersMatchingStatus(alphabet[KATAKANA], USED)) {
        isPendingLearningStatus[KATAKANA] = true;
      }
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
    let lettersToTrain = null;
    if (isPendingLearningStatus[alphabetType]) {
      lettersToTrain = makeLettersListMatchingStatus(alphabet[alphabetType], USED);
    } else {
      lettersToTrain = makeLettersListMatchingStatus(alphabet[alphabetType], UNUSED);
    }
    dispatch(setLettersToTrain(lettersToTrain));
    props.changeAppScreen();
  }
}
