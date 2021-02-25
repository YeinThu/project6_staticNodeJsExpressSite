const express = require('express');
const app = express();
const data = require('./data.json');
const path = require('path');

/* ---------------------------------------------------------------------------------------------------- */
// Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

/* ---------------------------------------------------------------------------------------------------- */
// Routes
// Home 
app.get('/', (req, res) => {
  res.render('index', { projects: data.projects });
})

// About
app.get('/about', (req, res) => {
  res.render('about');
})

// Individual Projects
app.get('/projects/:id', (req, res) => {
  let found = data.projects.some(project => project.id === +req.params.id);

  if (found) {
    data.projects.forEach(project => {
      if (project.id === +req.params.id) {
        res.render('project', { project });
      }
    })
  }
})

/* ---------------------------------------------------------------------------------------------------- */
// Error Handlers
app.use((req, res, next) => {
  const err = new Error('The page you requested cannot be found.');
  err.status = 404;
  next(err);
})

app.use((error, req, res, next) => {
  res.status(error.status);
  
  if (res.statusCode === 404) {
    res.render('page-not-found', { error });
  }
  else {
    const errorGlobal = new Error('Something went wrong');
    res.render('error', { errorGlobal });
  }

  next();
})

/* ---------------------------------------------------------------------------------------------------- */
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));