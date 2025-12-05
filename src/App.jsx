import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import Checkbox from '@mui/material/Checkbox';

import Paper from '@mui/material/Paper';

import Typography from '@mui/material/Typography'; 

function App() {

    const [todos, settodos] = useState([]);

    const [inputvalue, setvalue] = useState('');



    useEffect(() => {

        const storedtodos = localStorage.getItem('todo');

        if (storedtodos) {

            settodos(JSON.parse(storedtodos));

        }

    }, []);



    const savetodo = (currentTodos) => {

        localStorage.setItem('todo', JSON.stringify(currentTodos));

    };



    function change(e) {

        setvalue(e.target.value);

    }



    function submit(e) {

        e.preventDefault();

        if (inputvalue.trim() === '') {

            return;

        }

        

        const newtodo = {

            text: inputvalue.trim(),

            completed: false,

        };



        const currentTodos = Array.isArray(todos) ? todos : [];



        const newtodos = [...currentTodos, newtodo];



        settodos(newtodos);

        savetodo(newtodos);

        

        setvalue('');

    }



    function del(indexToDelete) { 

        const updated = todos.filter((_, index) => index !== indexToDelete);

        

        settodos(updated);

        savetodo(updated);

    }



    function check(indexToToggle) {

        const updated = todos.map((todo, index) => {

            if (index === indexToToggle) {

                return { ...todo, completed: !todo.completed };

            }

            return todo;

        });



        settodos(updated);

        savetodo(updated);

    }



    return (

        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>

            <form onSubmit={submit}>

                <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>

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

            <Box>

                {Array.isArray(todos) && todos.map((todo, index) => (

                    <Paper 

                        key={index}

                        sx={{

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent: 'space-between',

                            p: 1,

                            mb: 1.5,

                            opacity: todo.completed ? 0.6 : 1,

                            textDecoration: todo.completed ? 'line-through' : 'none',

                        }}

                        elevation={2}

                    >

                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>

                            <Checkbox

                                checked={todo.completed}

                                onChange={() => check(index)} 

                                size="small"

                            />
                            <Typography variant="body1" sx={{ ml: 1 }}>
                                {todo.text}
                            </Typography>
                        </Box>
                    </Paper>

                ))}

            </Box>

        </Box>

    );

}



export default App;