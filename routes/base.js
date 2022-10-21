'use strict';

const express = require('express');
const router = new express.Router();
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.post('/log-in', (req, res, next) => {
  const { email, password } = req.body;
  let user;
  User.findOne({ email })
    .then((userDocument) => {
      user = userDocument;
      if (user) {
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      } else {
        return false;
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.redirect('/log-in');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/register', (req, res, next) => {
  const { name, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hashAndSalt) => {
      return User.create({
        name: name,
        email,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then((user) => {
      req.session.user = user;
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/log-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
