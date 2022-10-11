const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Task = require('../models/Task');

module.exports = Router()
//get

  .get('/', authenticate, async (req, res, next) => {
    try {
      const tasks = await Task.getAll(req.user.id);
      res.json(tasks);
    } catch (e) {
      next(e);
    }
  })
  //post
  .post('/', authenticate, async (req, res, next) => {
    try {
      const newTask = await Task.insert({ ...req.body, user_id: req.user.id });
      res.json(newTask);
    } catch (e) {
      next(e);
    }
  });
