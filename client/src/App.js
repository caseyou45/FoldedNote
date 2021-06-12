import Landing from "./Components/Landing";

import { Switch, Route } from "react-router-dom";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
