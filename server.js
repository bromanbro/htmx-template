const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('1353'));

const server = http.createServer(app);

const ensureAuthenticated = (req, res, next) => {
  if (req.signedCookies.user) { return next(); }
  res.redirect('/login.html');
}

app.get('/', ensureAuthenticated, (req, res) => {
  res.render('home', { animals: ['dog', 'cat', 'bird'] });
});

app.post('/logout', (req, res) => {
  res.clearCookie('user');
  res.header('HX-Redirect', '/login.html');
  res.send();
});

app.post('/login', (req, res) => {
  if (req.signedCookies.user) {
    res.send('already logged in');
  }

  const user = {
    userName: "dee",
    password: "test"
  };

  const { user_name, password } = req.body;

  if (user.userName === user_name && user.password === password) {
    res.cookie('user', JSON.stringify(user), { signed: true, maxAge: 3 * 24 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
    res.redirect('/');
  } else {
    res.send('invalid');
  }

});

server.listen(3000);
console.log('Express server started on port %s', server.address().port);
