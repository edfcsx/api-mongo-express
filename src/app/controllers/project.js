/* eslint-disable no-underscore-dangle */
const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate(['user', 'tasks']);

    return res.status(200).send({ projects });
  } catch (err) {
    return res.status(400).send({ error: 'Error loagind projects' });
  }
});

router.get('/:projectId', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

    if (!project) return res.status(404).send({ error: 'Project not found' });

    return res.status(200).send({ project });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading project' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      user: req.userId,
    });

    if (req.body.tasks) {
      const { tasks } = req.body;

      await Promise.all(
        tasks.map(async (task) => {
          const projectTask = new Task({ ...task, project: project._id });

          await projectTask.save();

          project.tasks.push(projectTask);
        }),
      );

      await project.save();
    }

    return res.status(200).send({ project });
  } catch (err) {
    return res.status(400).send({ error: 'Error create new project' });
  }
});

router.delete('/:projectId', async (req, res) => {
  try {
    const del = await Project.deleteOne({ _id: req.params.projectId });

    if (!del) return res.status(400).send({ error: 'Cannot delete project' });

    return res.status(200).send({ success: 'Project deleted' });
  } catch (error) {
    return res.status(400).send({ error: 'Error delete project' });
  }
});

module.exports = (app) => app.use('/project', router);
