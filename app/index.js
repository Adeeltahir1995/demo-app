
const http = require('http');
const collectionName = 'expense'
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'expenseDB';
let db = null;
// Use connect method to connect to the server

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

const server = http.createServer(async (req, res) => {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 60 * 60 * 24, // 1 day
        "Access-Control-Allow-Headers" : "Content-Type"
    }
      res.writeHead(200, headers);

      if (req.method === 'OPTIONS') {
        res.end();
        return;
      }

    if (req.url === '/') {
        res.write('Hellow World', headers);
        res.end();
    }
    if (req.url === '/api/getExpenses') {
        const expenses = await findAllExpenses(db);
        res.write(JSON.stringify(expenses));
        res.end();
    }

    if (req.url === '/api/addExpense') {
        if (req.method === 'POST') {
            try {
                jsonParser(req, res, async (error) => {
                    const data = req.body;
                    result = await insertDocuments(data);
                    res.write('success')
                    res.end();
                })
            }
            catch (error) {
                res.write('error')
                res.end();
            }
        } else {
            res.write('error');
            res.end();
        }

    }
});

server.listen(3000);
console.log('Listening on Port 3000');

const findAllExpenses = async (db) => {
    return new Promise((resolve, reject) => {
        try{
        const collection = db.collection(collectionName);

        collection.find({}).toArray(function (err, docs) {
            if(err !== null) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    } catch(error) {
        reject(error)
    }
    })
}

const insertDocuments = function (data) {

    return new Promise((resolve, reject) => {

        try {
            const collection = db.collection(collectionName);

            collection.insertOne(
                data
                , function (err, result) {
                    if(err !== null || result.result.n != 1) {
                        reject('Some Error Occured')
                    }
                    resolve(result.result);
                });
        } catch (error) {
            console.log('Error while inserting doc in db: ', error);
            reject(error);
        }
    })
}
