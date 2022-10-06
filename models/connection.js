/////////////////////////////////////////////
// import dependencies
/////////////////////////////////////////////
//need dotenv and mongoose
require("dotenv").config()
const mongoose = require("mongoose") 

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// here is our DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

//have to tell mongoose what to do with events
//opens, disconnects, and errors
mongoose.connection 
    .on("open", () => console.log("connected to mongoose"))
    .on("close", () => console.log("disconnected from mongoose"))
    .on("error", (error) => console.log("error occured: \n", error))

/////////////////////////////////////////////
// export the connection
/////////////////////////////////////////////
module.exports = mongoose
