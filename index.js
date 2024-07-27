const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors")
const { MongoClient } = require("mongodb")

const url = "mongodb://localhost:27017";

app.use(
    cors({
        origin: "http://localhost:3000"
    })
)

app.post("/create", async (req, res) => {
    try {
        const connection = await MongoClient.connect(url);
        const db = connection.db("cookbook");
        await db.collection("recipes").insertOne(req.body);
        await connection.close();
        res.json({ message: "Recipe Posted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }

})
app.get("/menu", async (req, res) => {
    try {
        const connection = await MongoClient.connect(url);
        const db = connection.db("cookbook");
        const store = await db.collection("recipes").find().toArray();
        await connection.close();
        res.json(store)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" })
    }

})

app.listen(3003)