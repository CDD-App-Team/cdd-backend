const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const Task = require('../models/Task');

module.exports = Router()
  //get
  //post
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newTask = await Task.insert({ ...req.body, user_id: req.user.id });
      res.json(newTask);
    } catch (e) {
      next(e);
    }
  });
