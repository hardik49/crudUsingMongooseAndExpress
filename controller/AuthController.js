const jwt = require('jsonwebtoken');

const userModel = require('../model/userModels');
const { message } = require('../controller/JobController');

async function authenticate(req, res) {
  const em = req.body.email;
  const pwd = req.body.password;
  try {
    const user = await userModel.findOne({ email: em, password: pwd });
    if (user != null) {
      jwt.sign(req.body.email, 'secret', (err, token) => {
        res.json(
          message(200, 'OK', 'token generated..', token)
        );
      });
    }
  } catch (err) {
    res.json(message(400, 'bad request', `There are no such user exists`));
  }
}

async function registerUser(req, res) {
  const users = new userModel(req.body);
  try {
    const regiserUser = await users.save();
    res.send(message(200, 'OK', `User successfully added!`, regiserUser));
  } catch (err) {
    res.sendStatus(500).send(err);
  }
}

module.exports = { authenticate, registerUser }
