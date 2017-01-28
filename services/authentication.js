const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/userService');

module.exports.songApiLocalStrategy = () => {
  return new LocalStrategy((username, password, done) => {
       return UserService.findOneByQuery({ username: username })
           .then(user => {
               if (!user) {
                  return done(null, false, { message: 'Incorrect username.' });
               }
               if (!bcrypt.compareSync(password, user.password)) {
                   return done(null, false, { message: 'Incorrect password.' });
               }
               return done(null, user);
           })
           .catch(err => {
               return done(err);
           });
  });
};