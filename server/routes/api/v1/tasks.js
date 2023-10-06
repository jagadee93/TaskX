const express = require('express');
const router = express.Router();
const taskController = require('../../../controllers/taskController');
const addUserInfoToReq = require("../../../middleware/userInfo")
router.route("/delete/:id")
    .delete(taskController.deleteTask)
router.route("/new")
    .post(taskController.AddTask)
router.route('/update')
    .post(taskController.updateTasklist)
router.route("/lists")
    .get(taskController.getAllTasks)


module.exports = router;
