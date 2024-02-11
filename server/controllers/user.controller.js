const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = (req, res) => {

  // Extracting information from body.
  const {username,email,password} = req.body;

  // Validating the received data.
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Creating a new user instance after validation.
  const newUser=new User({username,email,password});

  // Hashing password before saving it to database.
  bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(newUser.password,salt,(err,hash) => {
          if(err) throw err;
          newUser.password=hash;

          newUser.save()
                .then(user => {
                  jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                      if(err) throw err;
                      res.json({
                        token,
                        user: {
                          id: user.id,
                          username: user.username,
                          email: user.email
                        }
                      });
                    }
                  )
                })
                .catch(err => console.log(err));
      });
  });
};

exports.login = (req, res) => {

  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email
                }
              });
            }
          )
        })
    })
};