const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/todabeach';
const client = new MongoClient(uri);

const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors());
const port = 3001;

app.get('/', async (req, res) => {
	await client.connect();
	const beaches = client.db('todabeach').collection('beach').find({});
	const results = await beaches.toArray();

	const bestBeachName = getBestBeachName(results);

	const bestBeach = await client
		.db('todabeach')
		.collection('beach')
		.findOne({ beach: bestBeachName });

	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(bestBeach));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

function getBestBeachName(results) {
	const points = results.map((beach) => {
		let total = 0;

		if (beach.hammocks == 'si') {
			total += 33;
		}

		if (beach.temperature > 24 && beach.temperature < 30) {
			total += 34;
		} else if (beach.temperature >= 30 && beach.temperature < 36) {
			total += 17;
		}

		if (beach.bathroom == 'si') {
			total += 33;
		}

		return {
			name: beach.beach,
			points: total,
		};
	});

	points.sort((a, b) => {
		return b.points - a.points;
	});

	return points[0].name;
}
