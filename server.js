/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module

/////////////////////////////////////////////
// Import Our Models
/////////////////////////////////////////////
const Npc = require('./models/NPC')

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with certain events
// opens, disconnects, errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log("An error occurred: \n", error))

/////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////
const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request is processed through our middleware before mongoose does anything with it.
app.use(morgan("tiny")) // This is for request logging, the "tiny" argument declares what size of morgan log to use.
app.use(express.urlencoded({ extended: true })) // this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")) // serve files from the public folder statically
app.use(express.json()) // parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
})

// Here, we're going to set up a seed route
// this will seed our database for us, so we have some starting resources
// there are two ways we're going to talk about seeding a db
// routes -> they work, but they're not best practices
// seed scripts -> they work, and they are best practices
app.get("/NPCs/seed", (req, res) => {
    // array of starter fruits
    const startNPCs = [
        { name: "Brokka Brokkisdotter", affiliation: "Order", occupation: "Captain", age: '156', alive: true },
        { name: "Gungir Emberarms", affiliation: "Order", occupation: "First Mate", age: '36', alive: true },
        { name: "Norgri Steamstrike", affiliation: "Order", occupation: "Chief Endrineer", age: '277', alive: true },
        { name: "Belegrick Droughtwind", affiliation: "Order", occupation: "Crewman", age: '75', alive: true },
        { name: "Kazrinja Grundfray", affiliation: "Order", occupation: "Crewman", age: '40', alive: true },
    ]

    // Delete every NPC in the db
   Npc.deleteMany({})
        .then(() => {
            // seed with the starter NPC array
            Npc.create(startNPCs)
                .then(data => {
                    res.json(data)
                })
        })
})

// GET request
// index route -> shows all instances of a document in the db
app.get("/NPCs", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Npc.find({})
        .then(npcs => {
            // this is fine for initial testing
            // res.send(npcs)
            // this the preferred method for APIs
            res.json({ npcs: npcs })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new NPCs
app.post("/NPCs", (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose model method `create` to make a new NPC
    Npc.create(req.body)
        .then(npc => {
            // send the user a '201 created' response, along with the new NPC
            res.status(201).json({ npc: npc.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific NPC
app.put("/NPCs/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    
    // for now, we'll use a simple mongoose model method, eventually we'll update this(and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    Npc.findByIdAndUpdate(id, req.body, { new: true })
        .then(npc => {
            console.log('the npc from update', npc)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource(NPC)
app.delete("/NPCs/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the NPC
    Npc.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send the error if not
        .catch(err => res.json(err))
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now listening to the sweet sounds of port: ${PORT}`))

// END