const express = require("express");
const auth = require("../middleware/auth");
const Todo = require("../models/todo");

const router = express.Router();

router.post('/post', auth, async(req, res) => {
    const {name, author, uid, date} = req.body;
    try {
        const newTodo = new Todo({name, author, uid, date});
        
        const todo = await newTodo.save();

        res.status(200).json(todo);

    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.get('/', auth, async (req, res, next) => {
    try {
        const todos = await Todo.find().sort({date : -1});

        const filteredTodos = todos.filter((todo) => todo.uid === req.user._id);
        res.send(filteredTodos);

        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.delete('/:id', auth, async (req, res) => {
    const {id} = req.params;
    try {
        await Todo.findByIdAndDelete(id);

        res.status(200).json({msg : "Todo deleted successfully."});
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

module.exports = router;