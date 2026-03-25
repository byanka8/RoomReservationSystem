// connects to MongoDB database 

import mongoose from "mongoose";

// set dns server for updated node
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MongoURL)
        console.log("Connected to DB")
    } catch(err) {
        console.log(err)
    }
}

export default connectToDatabase