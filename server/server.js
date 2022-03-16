'use strict'

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB


const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB


/*** Set up Passport ***/

// initialize and configure passport
passport.use(new LocalStrategy(
      function (username, password, done) {

            userDao.getUser(username, password).then((user) => {

                  if (!user)
                        return done(null, false, { message: 'Incorrect username and/or password.' });

                  return done(null, user);
            })
      }
));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {

      done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {

      userDao.getUserById(id)
            .then(user => {

                  done(null, user); // this will be available in req.user
            }).catch(err => {
                  done(err, null);
            });
});


// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());


// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
      if (req.isAuthenticated())
            return next();

      return res.status(401).json({ error: 'not authenticated' });
}


// set up the session
app.use(session({
      // by default, Passport uses a MemoryStore to keep track of the sessions
      secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
      resave: false,
      saveUninitialized: false,
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());




/*** Tasks APIs ***/

// GET /api/all   work
app.get('/api/all', isLoggedIn, async (req, res) => {

      dao.listAllActivities(req.user.id)
            .then(activities => res.json(activities))
            .catch(() => res.status(500).json({ error: 'error connection db' }));
});


//GET /api/:filter  work
app.get('/api/filtered/:filter', isLoggedIn, async (req, res) => {

      try {
            const lists = await dao.getActivitybyFilter(req.params.filter, req.user.id);
            res.status(200).json(lists);
      } catch (err) {

            res.status(500).end();
      }

});


//GET /api/retrieve/:id works
app.get('/api/retrieve/:id', isLoggedIn, async (req, res) => {

      try {

            const result = await dao.getActivity(req.params.id, req.user.id);

            if (result.error)
                  res.status(404).json(result);
            else
                  res.status(200).json(result);
      } catch (err) {
            res.status(500).end();
      }

});


app.post('/api/create', isLoggedIn, [
      check(['completed', 'important', 'private']).isInt({ min: 0, max: 1 }),
      check('deadline').isISO8601({ strict: true }).optional({ nullable: true, checkFalsy: true })
], async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {

            return res.status(422).json({ errors: errors.array() })
      }

      const activity = {
            description: req.body.description,
            important: req.body.important,
            private: req.body.private,
            deadline: req.body.deadline,
            completed: req.body.completed,

      };
      try {
            await dao.createActivity(activity, req.user.id);
            res.status(201).end();
      } catch (err) {
            res.status(503).json({ error: `Database error ${err}.` });
      }

})


app.put('/api/update/:id', isLoggedIn, [
      check(['completed']).isInt({ min: 0, max: 1 }),
      check(['important', 'private']).isBoolean(),
      check('deadline').isISO8601({ strict: true }).optional({ nullable: true, checkFalsy: true })
], async (req, res) => {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {

            return res.status(422).json({ errors: errors.array() })
      }

      const activity = {
            id: req.body.id,
            description: req.body.description,
            important: req.body.important,
            private: req.body.private,
            deadline: req.body.deadline,
            completed: req.body.completed,

      };
      try {
            await dao.updateActivity(activity, req.user.id);
            res.status(201).end();
      } catch (err) {
            res.status(503).json({ error: `Database error ${err}.` });
      }

})


app.delete('/api/delete/:id', isLoggedIn, async (req, res) => {

      try {

            const result = await dao.deleteActivity(req.params.id, req.user.id);

            if (result.error)
                  res.status(404).json(result);
            else
                  res.status(200).json(result);

      } catch (err) {

            res.status(500).end();
      }

});


app.put('/api/mark/:id', isLoggedIn, [
      check(['completed', 'important', 'private']).isInt({ min: 0, max: 1 }),
      check('deadline').isISO8601({ strict: true }).optional({ nullable: true, checkFalsy: true })
], async (req, res) => {

      const activity = {
            id: req.body.id,
            completed: req.body.completed ? 0 : 1,
      };

      const errors = validationResult(req);
      if (!errors.isEmpty()) {

            return res.status(422).json({ errors: errors.array() })
      }

      try {
            await dao.markTask(activity, req.user.id);

            res.status(201).end();
      } catch (err) {
            res.status(503).json({ error: `Database error ${err}.` });
      }

})






/*** Users APIs ***/

app.post('/login', passport.authenticate('local'), (req, res) => {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.json(req.user);
});




// DELETE /sessions/current 
// logout
app.delete('/logout', (req, res) => {
      req.logout();
      res.end();
});




app.listen(port, () => {
      console.log(`react-score-server listening at http://localhost:${port}`);
});
