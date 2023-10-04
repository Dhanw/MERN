import React, { useState, useCallback } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UsersPlaces from "./places/pages/UsersPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
// all this is needed for the routing in react
// First need the <Router> tag and then the Switch in order to choose which pahe I want to go
// inside the Switch there are going to be all the routes for the differets pages an theis component
// See the structure in the app component

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Switch>
            <Route path="/" exact>
              <Users />
            </Route>

            <Route path="/:userId/places" exact>
              <UsersPlaces />
            </Route>

            <Route path="/places/new" exact>
              <NewPlace />
            </Route>

            <Route path="/places/:placeId" exact>
              <UpdatePlace />
            </Route>

            <Route path="/auth" exact>
              <Auth />
            </Route>

            <Redirect to="/" />
          </Switch>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
