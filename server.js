const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const Todo = require('./models/todos');

const db = mongoose.connection;
mongoose.connect('mongodb://127.0.0.1:27017/generic-db');
db.on('error', (error) => console.error(error));
db.on('open', () => console.log('db:live'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', async (req, res) => {
	const todos = await Todo.find({});
	res.render('index', { todos });
});

app.post('/create-todo', async (req, res) => {
	try {
		const { title, content } = req.body;
		const todo = new Todo({ title, content });
		await todo.save();
		res.redirect(`/`);
	} catch (err) {
		console.log(err);
	}
});

app.post('/delete-todo/:id', async (req, res) => {
	const { id } = req.params;
	const todo = await Todo.findById(id);
	await todo.deleteOne();
	res.redirect('/');
});

app.listen(port, () => console.log(`server:${port}`));
