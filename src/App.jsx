import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
function App() {
  const [todos, settodos] = useState([]);
  const [left, setleft] = useState(() => {
    var data = localStorage.getItem("todo");
    var len = JSON.parse(data).length;
    return len;
  });
  const [inputvalue, setvalue] = useState("");
  useEffect(() => {
    const storedtodos = localStorage.getItem("todo");
    settodos(JSON.parse(storedtodos));
  }, []);
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
    setleft((prevLeft) => prevLeft + 1);
    settodos(newtodos);
    savetodo(newtodos);
  }
  function del(del) {
    const updated = todos.filter((todo, index) => index != del);
    setleft((prevLeft) => prevLeft - 1);
    settodos(updated);
    savetodo(updated);
  }
  function check(check) {
    const updated = todos.map((todo, index) => {
      if (index === check) {
        if (todo.completed) {
          setleft((prevLeft) => prevLeft + 1);
        } else {
          setleft((prevLeft) => prevLeft - 1);
        }
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    settodos(updated);
    savetodo(updated);
  }
  return (
    <div className="d-flex justify-content-center align-items-center flex-column p-4">
      <form onSubmit={submit}>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            label="Write To-do"
            value={inputvalue}
            onChange={change}
            variant="outlined"
            size="small"
            required
          />
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </form>
      <div style={{ minWidth: 320 }}>
        <Typography
          variant="body"
          sx={{ mb: 2, display: "flex", justifyContent: "center" }}
        >
          Total number of todos : {left}
        </Typography>
        {Array.isArray(todos) &&
          todos.map((todo, index) => (
            <Paper
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: todo.completed ? "gray" : "black",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => check(index)}
                  size="small"
                />
                <Typography variant="body" sx={{ ml: 1 }}>
                  {todo.text}
                </Typography>
              </Box>
              <Button
                variant="contained"
                type="submit"
                size="small"
                onClick={() => del(index)}
              >
                Delete
              </Button>
            </Paper>
          ))}
      </div>
    </div>
  );
}
export default App;