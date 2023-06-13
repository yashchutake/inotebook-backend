// const mongoose = require('mongoose');
// const mangoURI="mongodb://localhost:27017"

// const connectToMango =()=>{
//     mongoose.connect(mangoURI,()=>{
//         console.log ("Connected to Mongo Successfully");
//     })

// }
// module.exports=connectToMango;


const mongoose = require('mongoose');
const mangoURI="mongodb://0.0.0.0:27017/inotebook"  //"mongodb://localhost:27017";

const connectToMango = async () => {
  try {
    await mongoose.connect(mangoURI);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

module.exports = connectToMango;



// const mongoose = require('mongoose');
// const mangoURI="mongodb://localhost:27017"


// const connectToMango =()=>{
//   return mongoose.connect(mangoURI)
//     .then(() => console.log("Connected to Mongo Successfully"))
//     .catch(err => console.error("Error connecting to Mongo", err));
// }


// module.exports = connectToMango;