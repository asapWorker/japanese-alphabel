import React, {useEffect, useMemo, useRef} from "react";
import "./Menu.css";
import {Letter} from "../letter/Letter";
import {useDispatch, useSelector} from "react-redux";
import {ACTIVE, HIRAGANA, KATAKANA, LEARN, REVISE, USED, UNUSED} from "../../constants";
import {changeType, resetChangeLetterProperty, setAlphabet, setLettersToTrain, updateLetterInfo} from "../../store/alphabetSlice";

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
  for (let i = 0; (i < letters.length); i++) {
    if (checkIfLetterMatchToStatus(letters[i], status)) {
      lettersToTrain.push({
        symbol: letters[i].symbol,
        transcription: letters[i].transcription,
        indInAlphabet: i,
        level: letters[i].level
      });
      if ((i + 1) % 5 === 0) {
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
  const lettersToTrain = useSelector(state => state.alphabet.lettersToTrain);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!alphabet) {
      fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => {
        dispatch(setAlphabet(data));
      })
      .catch(() => console.log('error'))
    } else {
      // form changes data to send by network
      const changes = {
        alphabetType,
        letters: null
      }

      changes.letters = lettersToTrain.map(item => {
        return {
          ind: item.indInAlphabet,
          content: {
            ...alphabet[alphabetType][item.indInAlphabet],
            change: false
          }
        }
      })

      // send changes
      fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changes)
      }).catch((error) => console.log(error.message));
    }
  }, [])

  useEffect(() => {
    if (alphabet) {
      if (checkAreWhereLettersMatchingStatus(alphabet[HIRAGANA], USED)) {
      isPendingLearningStatus[HIRAGANA] = true;
      } else if (checkAreWhereLettersMatchingStatus(alphabet[KATAKANA], USED)) {
        isPendingLearningStatus[KATAKANA] = true;
      }
    }
  }, [alphabet])

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
    if (lettersToTrain) {
      for (let letter of lettersToTrain) {
        dispatch(resetChangeLetterProperty(letter.indInAlphabet));
      }
    }

    let newLettersToTrain = null;

    if (isPendingLearningStatus[alphabetType]) {
      newLettersToTrain = makeLettersListMatchingStatus(alphabet[alphabetType], USED);
    } else {
      newLettersToTrain = makeLettersListMatchingStatus(alphabet[alphabetType], UNUSED);
    }

    dispatch(setLettersToTrain(newLettersToTrain));
    props.changeAppScreen();
  }
}
