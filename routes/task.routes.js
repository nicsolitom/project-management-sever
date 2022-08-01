const router = require("express").Router();
const mongoose = require('mongoose');

const Task = require('../models/Task.model');
const Project = require('../models/Project.model');



//  Creates a new task
router.post('/tasks', (req, res, next) => {
  const { title, description, projectId } = req.body;

  Task.create({ title, description, project: projectId })
    .then(newTask => {
      return Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } } );
    })
    .then(response => res.json(response))
    .catch(err => res.json(err));
});

// Read single task
router.get('/tasks/edit/:taskId', (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findById(taskId)
    .then((task) => res.status(200).json(task))
    .catch((error) => res.json(error));
});

// Update single task
router.put('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndUpdate(taskId, req.body, { new: true })
    .then((updatedTask) => res.json(updatedTask))
    .catch((error) => res.json(error));
});


router.delete('/tasks/:taskId', (req, res, next) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Task.findByIdAndRemove(taskId)
    .then(deletedTask => res.json(deletedTask))
    .catch(error => res.status(500).json(error));
});

module.exports = router;
