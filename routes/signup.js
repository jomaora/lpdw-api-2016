const express = require('express');
const _ = require('lodash');
const router = express.Router();
const SongService = require('../services/songService');
const APIError = require('../lib/apiError');

router.get('/', function(req, res) {
  var err = (req.session.err) ? req.session.err : null;
  if (req.accepts('text/html')) {
     res.render('signup', {err: err});
  }
  else {
     res.send(406, {err: 'Not valid type for asked ressource'});
  }
});

module.exports = router;