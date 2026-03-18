import { useState } from "react";
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff5436',
    },
    background: {
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
  },
  shape: {
    borderRadius: 16,
  }
});

function App() {
  const [todos, settodos] = useState(() => {
    try {
      const storedtodos = localStorage.getItem("todo");
      if (!storedtodos) {
        return [];
      }
      const parsed = JSON.parse(storedtodos);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to parse todos from local storage", e);
      return [];
    }
  });
  const [inputvalue, setvalue] = useState("");
  
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  function savetodo(save) {
    localStorage.setItem("todo", JSON.stringify(save));
  }

  function change(e) {
    setvalue(e.target.value);
  }

  function submit(e) {
    e.preventDefault();
    if (inputvalue.trim() === "") {
      return;
    }
    const newtodo = {
      text: inputvalue.trim(),
      completed: false,
    };
    const newtodos = [...todos, newtodo];
    settodos(newtodos);
    savetodo(newtodos);
    setvalue("");
  }

  function del(indexToDelete) {
    const updated = todos.filter((todo, index) => index !== indexToDelete);
    settodos(updated);
    savetodo(updated);
  }

  function check(indexToCheck) {
    const updated = todos.map((todo, index) => {
      if (index === indexToCheck) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    settodos(updated);
    savetodo(updated);
  }

  function openEdit(index) {
    setEditIndex(index);
    setEditValue(todos[index].text);
  }

  function handleEditClose() {
    setEditIndex(null);
    setEditValue("");
  }

  function handleEditSave() {
    if (editValue.trim() !== "") {
      const updated = todos.map((todo, index) => {
        if (index === editIndex) {
          return { ...todo, text: editValue.trim() };
        }
        return todo;
      });
      settodos(updated);
      savetodo(updated);
    }
    handleEditClose();
  }

  function openDelete(index) {
    setDeleteIndex(index);
  }

  function handleDeleteClose() {
    setDeleteIndex(null);
  }

  function handleDeleteConfirm() {
    if (deleteIndex !== null) {
      del(deleteIndex);
    }
    handleDeleteClose();
  }

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="app-card">
        <header className="app-header">
          <div className="logo-container">
            <h1 className="logo">XERO<span>TODO</span></h1>
          </div>

          <form className="input-group" onSubmit={submit}>
            <input 
              className="task-input" 
              placeholder="write your next task" 
              value={inputvalue} 
              onChange={change} 
            />
            <button type="submit" className="add-btn">+</button>
          </form>

          <div className="header-right">
            <div className="progress-card">
              <div className="progress-text">
                <h2>Todo Done</h2>
                <p>keep it up</p>
              </div>
              <div className="progress-circle">
                {completedCount}/{totalCount}
              </div>
            </div>
          </div>
        </header>

        <div className="task-list-container">
          <div className="task-list">
            {todos.map((todo, index) => (
              <div className="task-item" key={index}>
                <button 
                  className={`check-circle ${todo.completed ? 'completed' : ''}`}
                  onClick={() => check(index)}
                  type="button"
                />
                <span className={`task-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                <div className="task-actions">
                  <button type="button" className="action-btn" onClick={() => openEdit(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="action-icon">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button type="button" className="action-btn" onClick={() => openDelete(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="action-icon">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={editIndex !== null} onClose={handleEditClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            variant="outlined"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEditSave();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleEditClose} color="inherit">Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteIndex !== null} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <span style={{ fontSize: '1rem' }}>Are you sure you want to delete this task? This action cannot be undone.</span>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteClose} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
