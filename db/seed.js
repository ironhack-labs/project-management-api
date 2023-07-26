require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project.model');
const Task = require('../models/Task.model');
const projects = require('./data/projects');
const tasks = require('./data/tasks');


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-management-api';



mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    
    // Delete all existing projects and tasks before seeding the database
    return Promise.all([Project.deleteMany(), Task.deleteMany()]);
  })
  .then(() => {
    // Seed the database
    return Promise.all([
      Project.create(projects),
      Task.create(tasks),
    ]);
  })
  .then((results) => {
    const [projects, tasks] = results;
    
    const project1 = projects[0];
    const project2 = projects[1];
    
    // Update the projects by adding the ids of tasks to each project
    const taskIds = tasks.map((task) => task._id);

    project1.tasks.push(taskIds[0]);
    project1.tasks.push(taskIds[1]);
    project1.tasks.push(taskIds[2]);
    project2.tasks.push(taskIds[3]);

    const saveProject1Promise = project1.save();
    const saveProject2Promise = project2.save();

    return Promise.all([saveProject1Promise, saveProject2Promise]);
  })
  .then((savedProjects) => {
    console.log("Database Seeding Completed:");
    console.log(savedProjects);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  })
  .finally(() => {
    console.log('Database Connection Closed');
  });

