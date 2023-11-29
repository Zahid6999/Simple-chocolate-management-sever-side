const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;
require('dotenv').config()

// Middleware---------
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixkdtuw.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const chocolateCollection = client.db('chocolatesDB').collection('chocolate');


        app.get('/chocolates', async (req, res) => {
            const query = {}
            const cursor = await chocolateCollection.find(query).toArray()
            res.send(cursor)

        })

        app.get('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolateCollection.findOne(query)
            res.send(result)
            console.log(result)
        });

        app.post('/chocolate', async (req, res) => {
            const chocolate = req.body;
            const result = await chocolateCollection.insertOne(chocolate)
            res.send(result)
        });

        app.put('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const chocolate = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: chocolate.name,
                    country: chocolate.country,
                    select: chocolate.select
                }
            };
            const result = await chocolateCollection.updateOne(filter, updateDoc, options)
            res.send(result);


        })

        app.delete('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(query)
            console.log(result)
            res.send(result)

        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('chocolate Server Is Running')
});
app.listen(port, () => console.log(`server running port: ${port}`))