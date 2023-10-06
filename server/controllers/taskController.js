const User = require("../model/userModel");
const asyncHandler = require('express-async-handler');





const AddTask = asyncHandler(async (req, res) => {
    const { task } = req.body;


    try {
        const user = await User.findOne({ _id: req.userId });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }


        user.tasks.push(task);

        // Save the updated taskList
        await user.save();

        res.status(201).json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong.' });
    }


})




const updateTasklist = asyncHandler(async (req, res) => {

    const { taskId, description, completed, due_date } = req.body;

    const taskObj = await User.findOne({ _id: req.userId, "tasks._id": taskId });

    const task = taskObj.tasks.id(taskId);

    task.description = description ? description : task.description;
    task.completed = completed ? completed : task.completed;
    task.due_date = due_date ? due_date : task.due_date;
    await taskObj.save();
    res.json({ message: "Updated successfully" })
});


const getAllTasks = asyncHandler(async (req, res) => {

    const userId = req.userId;


    try {
        // Find task lists associated with the user
        const Tasks = await User.findById(userId).select("tasks").lean();


        const tasks = Tasks.tasks

        // Respond with a success status and the task lists
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching task lists:", error);
        // Respond with an error status and message
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});


const deleteTask = asyncHandler(async (req, res) => {

    try {
        // Get the task object from the database.
        const taskObj = await User.findOne({ _id: req.userId, "tasks._id": req.params.id });

        if (!taskObj) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Get the task array from the task object.
        const tasks = taskObj.tasks;

        // Find the index of the task to be removed.
        const indexToRemove = tasks.findIndex(task => Number(task._id) === Number(req.params.id));

        if (indexToRemove !== -1) {
            // Remove the task from the array.
            tasks.splice(indexToRemove, 1);
            // Save the updated user document.
            await taskObj.save();
            // Send a success response to the client.
            return res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            // If the task is not found, send a 404 response.
            return res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        // Handle any errors that occur.
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong.' });
    }

});



module.exports = {
    updateTasklist,
    getAllTasks,
    AddTask,
    deleteTask

}
