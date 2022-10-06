

////////////////////////////////////////////////
// Our Schema Model with connection.js
////////////////////////////////////////////////
const mongoose = require("./connection")

const {Schema, model} = mongoose
// make NPC schema
const npcSchema = new Schema({
  name: String,
  affiliation: String,
  occupation: String,
  age: Number,
  alive: Boolean,
})

// make NPC model
const NPC = model("Npc", npcSchema)

///////////////////////////////////////////////////
// Export Model
///////////////////////////////////////////////////
module.exports = Npc;
