import mongoose from "mongoose"


type ConnectionObject = {
    isConnected?: number
}

const connection : ConnectionObject = {} 

async function dbConnect() {
    if(connection.isConnected){
        console.log('Already connected')
        return
    }

    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}`)
        connection.isConnected = response?.connections[0].readyState
        // console.log(response)
        console.log('Connected to MongoDB')
    } catch (error : any ) {
        throw new Error("ERROR CONNECTING THE DATABASE: " + error.message);

    }

}

export default dbConnect;