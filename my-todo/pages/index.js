import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [tTitle, setTTitle] = useState('');
  const [tDescription, setTDescription] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/tasks');
        setTaskList(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchData();
  }, []);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const completeTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${taskId}`, {
        completed: true,
      });
      setTaskList(
        taskList.map((task) =>
          task.id === taskId ? { ...task, completed: true } : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  const addTask = async () => {
    try {
      const res = await axios.post('http://localhost:3001/tasks', {
        title: tTitle,
        description: tDescription,
      });
      setTaskList([...taskList, res.data]);
      setTTitle('');
      setTDescription('');
      closeDialog();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${taskId}`);
      setTaskList(taskList.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="m-10 relative">
      <div className="flex justify-center">
        <h1 className="text-3xl mt-3">Welcome to My Todo App</h1>
      </div>
      <hr className="mt-4" />
      <div className="mt-4 mx-10">
        <div className="relative">
          {/* Task items */}
          {taskList.map((task) => (
            <div
              key={task.id}
              className="bg-gray-700 p-2 px-6 rounded-xl shadow-lg mb-4 flex justify-between items-center"
            >
              <div>
                <h2
                  className={`text-xl text-white ${task.completed ? 'line-through' : ''}`}
                >
                  Title: {task.title}
                </h2>
                <div className='flex gap-40'>
                <p
                  className={`text-white ${task.completed ? 'line-through' : ''}`}
                >
                  Description: {task.description}
                </p>
                <p>
                  Time: {task.time}
                </p>
                </div>
              </div>
              <div className="flex gap-2">
              <div
                  className={`text-white px-4 py-1 rounded-lg mx-8 cursor-pointer ${task.completed ? 'bg-green-500' : 'bg-indigo-500'}`}
                  onClick={() => completeTask(task.id)}
                >
                  {task.completed ? 'Completed' : 'Complete'}
                </div>
                <div className="mt-1">
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer"
                    onClick={() => deleteTask(task.id)}
                  />
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Background overlay when dialog is open */}
        {showDialog && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
            onClick={closeDialog}
          >
            {/* Dialog */}
            <dialog
              open
              className="bg-gray-700 p-6 rounded-xl shadow-2xl z-20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Enter task Title"
                className="w-full p-2 rounded bg-gray-600 mb-4 text-white"
                value={tTitle}
                onChange={(e) => setTTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter task Description"
                className="w-full p-2 rounded bg-gray-600 mb-4 text-white"
                value={tDescription}
                onChange={(e) => setTDescription(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  onClick={closeDialog}
                  className="bg-red-500 text-white rounded px-4 py-2"
                >
                  Close
                </button>
                <button
                  onClick={addTask}
                  className="bg-indigo-500 text-white rounded px-4 py-2 ml-4"
                >
                  Add Task
                </button>
              </div>
            </dialog>
          </div>
        )}

        {/* Add button */}
        <Link href="#">
          <div
            onClick={openDialog}
            className="bg-gray-700 p-4 rounded-full mt-4 w-fit flex justify-center fixed bottom-10 right-10 shadow-lg cursor-pointer"
          >
            <div className="p-2 text-white">Add</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
