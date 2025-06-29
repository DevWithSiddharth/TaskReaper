import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit, FaTrash } from 'react-icons/fa';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  const saveToLocal = (updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleAdd = () => {
    if (todo.trim().length < 3) return;

    let updatedTodos;

    if (editingId) {
      updatedTodos = todos.map(item =>
        item.id === editingId ? { ...item, todo } : item
      );
      setEditingId(null);
    } else {
      updatedTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    }

    setTodos(updatedTodos);
    saveToLocal(updatedTodos);
    setTodo("");
  };

  const handleChange = (e) => setTodo(e.target.value);

  const handleCheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map(item =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    saveToLocal(updatedTodos);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this todo?")) {
      const updatedTodos = todos.filter(item => item.id !== id);
      setTodos(updatedTodos);
      saveToLocal(updatedTodos);
      if (editingId === id) {
        setEditingId(null);
        setTodo("");
      }
    }
  };

  const handleEdit = (id) => {
    const selected = todos.find(item => item.id === id);
    if (selected && editingId === null) {
      setTodo(selected.todo);
      setEditingId(id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.isCompleted;
    return !todo.isCompleted;
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl shadow-lg bg-black p-5 min-h-[80vh] max-w-3xl text-white">
        <div className="addTodo my-5">
          <h2 className='text-xl font-bold mb-3'>Add a Todo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              onChange={handleChange}
              value={todo}
              onKeyDown={handleKeyDown}
              className='w-full sm:w-3/4 rounded-full px-4 py-2 border border-gray-600 bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
              type="text"
              placeholder="Enter at least 3 characters"
            />
            <button
              onClick={handleAdd}
              className='cursor-pointer bg-gray-800 hover:bg-gray-700 px-5 py-2 text-white rounded-full shadow-sm text-sm font-semibold'
            >
              {editingId ? "Save" : "Add"}
            </button>
          </div>
        </div>

        <div className="filter mb-4">
          <label className='font-semibold text-sm mr-2'>Filter:</label>
          <div className="relative inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='appearance-none rounded-md px-3 py-1 pr-8 bg-black border border-gray-600 text-sm shadow-sm text-white'
            >
              <option value="all">All</option>
              <option value="completed">Finished</option>
              <option value="pending">Not Finished</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              ▼
            </div>
          </div>
        </div>

        <h2 className='text-lg font-bold mb-3'>Your Todos</h2>
        <div className="todos flex flex-col overflow-auto gap-4 h-[45vh]">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-5">
              No record found.
            </div>
          ) : (
            filteredTodos.map(item => (
              <div
                key={item.id}
                className="todo flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg shadow-md border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <input
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                    name={item.id}
                    className="w-4 h-4 accent-white bg-black border border-gray-500 rounded"
                  />
                  <span className={`text-sm ${item.isCompleted ? "line-through text-gray-500" : "text-white"}`}>
                    {item.todo}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className='cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-white hover:text-gray-300'
                    disabled={editingId !== null && editingId !== item.id}
                  >
                    <FaEdit className="text-inherit" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className='cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-full text-white hover:text-gray-300'
                  >
                    <FaTrash className="text-inherit" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
