import React, {useEffect, useState} from "react";
import {Menu} from "./components/menu/Menu";
import {Task} from "./components/task/Task";

function App() {
  const [isMenu, setIsMenu] = useState(true);

  return (
    (isMenu) ? <Menu changeAppScreen={changeAppScreen}/> : <Task changeAppScreen={changeAppScreen}/>
  )

  function changeAppScreen() {
    setIsMenu((prevState) => !prevState);
  }
}

export default App;
