const router = require("express").Router();

const mongoose = require('mongoose');

const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

// Retrieves all of the projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((allProjects) => res.json(allProjects))
    .catch((err) => res.json(err));
});

//  Creates a new project
router.post("/projects", (req, res, next) => {
  const { title, description } = req.body;

  Project.create({ title, description, tasks: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  Retrieves a specific project by id
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

// Validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Project.findById(projectId)
    .populate("tasks")
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

//  Updates a specific project by id
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch((error) => res.json(error));
});


// Deletes a specific project by id + associated tasks
router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }


    Project.findByIdAndRemove(projectId)
    .then(deteletedProject => {
        return Task.deleteMany({ _id: { $in: deteletedProject.tasks } });
    })
    .then(() => res.json({ message: `Project with id ${projectId} & all associated tasks were removed successfully.` }))
    .catch(error => res.status(500).json(error));
});

module.exports = router;
