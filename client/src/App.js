import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react'
import { Container, Row } from 'react-bootstrap';
import MyNavbar from './components/navbar';
import { MyMain } from "./components/mainContent";
import { MySidebar } from "./components/sidebar";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { LoginForm } from './components/login';
import { useState } from 'react';
import API from './API';


function App() {

  const [open, setOpen] = useState(false);
  const [logged, setLogged] = useState(false);
  const [username, setUsername] = useState('');

  const [firstAccess, setFirstAccess] = useState(false);

  return (
    <>
      <Router>
        <MyNavbar open={open} setOpen={setOpen} logout={API.logout} username={username} setUser={setUsername} logged={logged} setLogged={setLogged} />
        <Container fluid>
          <Row className='vheight-100'>
            <Switch>
              <Route exact path="/login" render={() => (
                <>{logged ? <Redirect to="/" /> : <LoginForm login={API.login} setLogged={setLogged} setUser={setUsername} setFa={setFirstAccess} />}</>
              )
              } />

              <Route exact path="/list/:filterId/:action" render={({ match }) => (
                <>{logged ?
                  <>
                    <MySidebar act={match.params.filterId} open={open} />
                    <MyMain filterState={match.params.filterId} action={match.params.action} open={open} username={username} fa={firstAccess} setFa={setFirstAccess} />
                  </> : <Redirect to="/" />}</>
              )} />

              <Route exact path="/list/:filterId" render={({ match }) => (
                <>{logged ?
                  <>
                    <MySidebar act={match.params.filterId} open={open} />
                    <MyMain filterState={match.params.filterId} action={match.params.action} open={open} username={username} fa={firstAccess} setFa={setFirstAccess} />
                  </> : <Redirect to="/" />}</>
              )} />

              <Route path="/" render={() => <>{logged ? <Redirect to="/list/all" /> : <Redirect to="/login" />}</>
              } />

            </Switch>
          </Row>
        </Container>
      </Router>
    </>
  );
}

export default App;