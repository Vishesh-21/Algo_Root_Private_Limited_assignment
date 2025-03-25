import React, { useState, useEffect } from "react";
import axios from "axios";

const apiURI = "http://localhost:3000/api/task/";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [delTask, setDelTask] = useState(false);

  //to load all the tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get(apiURI);
    setTasks(response.data);
  };

  //function to create new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(apiURI, newTask);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   function to make the task is complete or not
  const toggleComplete = async (task) => {
    await axios.put(`${apiURI}${task._id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  //   function to delete specific task
  const deleteTask = async (id) => {
    try {
      setDelTask(true);
      await axios.delete(`${apiURI}${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setDelTask(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center md:items-stretch flex-col md:flex-row py-8 md:gap-10 px-5">
      {/* Sidebar - Input Form on Left */}
      <div className="w-full max-w-md bg-blue-600 text-white flex flex-col items-center justify-center gap-5 rounded-lg shadow-lg p-6">
        <h1 className="md:text-5xl text-3xl font-bold mb-6">Task Manager</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title"
            required
            className="w-full p-3 border border-gray-300 bg-gray-200 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            placeholder="Description"
            className="w-full p-2 resize-none  h-36 bg-gray-200 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 cursor-pointer font-semibold text-white p-3 rounded-md hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add task"}
          </button>
        </form>
      </div>

      {/* Task Cards on Right */}
      <div className="flex-1 mt-10 md:mt-0 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-h-screen md:max-h-[80vh] overflow-auto"
          id="scroll-hidden"
        >
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">
              No tasks available
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between hover:shadow-xl transition"
              >
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task)}
                    className="mr-3 cursor-pointer w-3 h-3"
                    id={`${task._id}`}
                  />
                  <label
                    htmlFor={`${task._id}`}
                    className={`text-lg cursor-pointer font-semibold ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </label>
                </div>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  disabled={delTask}
                >
                  {delTask ? "Please wait..." : "Delete"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
