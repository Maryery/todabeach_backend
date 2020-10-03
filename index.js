const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/todabeach';
const client = new MongoClient(uri);

const express = require('express');
const app = express();
const port = 3001;

app.get('/', async (req, res) => {
	await client.connect();
	const beaches = client.db('todabeach').collection('beach').find({});
	const results = await beaches.toArray();

	console.log(results[0]);
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(results));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
