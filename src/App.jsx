import { useState } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Analytics } from '@vercel/analytics/react';

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
    } catch {
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
    const updated = todos.filter((_, index) => index !== indexToDelete);
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
      <div className="min-h-screen w-full bg-[#111111] px-3 py-4 font-sans text-[#f5f5f5] sm:px-[18px] md:px-6">
        <header className="mb-[18px] grid w-full grid-cols-1 items-center gap-3 pt-2 sm:mb-6 sm:gap-3.5 lg:grid-cols-[1fr_minmax(300px,600px)_1fr] lg:gap-5 lg:pt-3">
          <div className="flex justify-center lg:justify-start">
            <h1 className="text-[1.35rem] font-bold tracking-[1px] text-[#f5f5f5] sm:text-2xl">XERO<span className="text-[#ff5436]">TODO</span></h1>
          </div>

          <form className="order-2 mx-auto flex w-full items-center gap-2.5 lg:order-none lg:gap-3" onSubmit={submit}>
            <input 
              className="flex-1 rounded-full border-none bg-[#1e1e1e] px-[18px] py-3.5 text-[0.96rem] text-[#f5f5f5] outline-none placeholder:text-[#888888] sm:px-6 sm:py-4 sm:text-base" 
              placeholder="write your next task" 
              value={inputvalue} 
              onChange={change} 
            />
            <button type="submit" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff5436] text-[1.35rem] font-bold text-[#111111] transition-transform hover:scale-105 sm:h-[52px] sm:w-[52px] sm:text-2xl">+</button>
          </form>

          <div className="flex justify-center lg:justify-end">
            <div className="flex w-full max-w-[340px] items-center justify-between gap-3 rounded-2xl border border-[#333333] px-3.5 py-2.5 sm:w-auto sm:max-w-none sm:justify-center sm:gap-[20px] sm:rounded-[20px] sm:px-6 sm:py-3">
              <div>
                <h2 className="mb-0.5 text-base font-semibold text-[#f5f5f5] sm:text-[1.2rem]">Todo Done</h2>
                <p className="text-[0.82rem] font-normal text-[#888888] sm:text-[0.9rem]">keep it up</p>
              </div>
              <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#ff5436] text-[1.05rem] font-bold text-[#111111] sm:h-[60px] sm:w-[60px] sm:text-[1.2rem]">
                {completedCount}/{totalCount}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[800px]">
          <div className="flex flex-col gap-3 sm:gap-4">
            {todos.map((todo, index) => (
              <div className="flex items-center gap-2.5 rounded-xl border border-[#333333] bg-transparent px-3.5 py-3 sm:gap-4 sm:px-5 sm:py-4" key={index}>
                <button 
                  className={`h-6 w-6 shrink-0 rounded-full border-2 transition-all ${todo.completed ? 'border-[#4dd566] bg-[#4dd566]' : 'border-[#ff5436] bg-transparent'}`}
                  onClick={() => check(index)}
                  type="button"
                />
                <span className={`flex-1 break-words text-[0.98rem] font-medium leading-[1.35] sm:overflow-hidden sm:text-ellipsis sm:whitespace-nowrap sm:text-[1.1rem] sm:leading-normal ${todo.completed ? 'text-[#777777] line-through decoration-2 decoration-[#777777]' : 'text-[#f5f5f5]'}`}>
                  {todo.text}
                </span>
                <div className="flex gap-2 sm:gap-3">
                  <button type="button" className="flex items-center justify-center bg-transparent opacity-60 transition-opacity hover:opacity-100" onClick={() => openEdit(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="h-5 w-5 sm:h-[22px] sm:w-[22px]" fill="none" stroke="#f5f5f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  </button>
                  <button type="button" className="flex items-center justify-center bg-transparent opacity-60 transition-opacity hover:opacity-100" onClick={() => openDelete(index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" className="h-5 w-5 sm:h-[22px] sm:w-[22px]" fill="none" stroke="#f5f5f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
          <span className="text-base">Are you sure you want to delete this task? This action cannot be undone.</span>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteClose} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
