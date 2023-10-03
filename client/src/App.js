import React from 'react'
import './App.css';
import {BrowserRouter as Router, Route, Redirect,Switch} from 'react-router-dom'
import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'; 
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UsersPlaces from './places/pages/UsersPlaces';



// all this is needed for the routing in react
// First need the <Router> tag and then the Switch in order to choose which pahe I want to go
// inside the Switch there are going to be all the routes for the differets pages an theis component
// See the structure in the app component

const  App = ()=> {
  return (
    <Router>
      <MainNavigation/>
      <main>
        <Switch>
          <Route path="/" exact>
            <Users/>
          </Route>

          <Route path="/:userId/places" exact>
            <UsersPlaces/>
          </Route>


          <Route path="/places/new" exact>
            <NewPlace/>
          </Route>

          <Redirect to="/" />

        </Switch>
      </main>
      
      
  </Router>
  ); 
};

export default App;
