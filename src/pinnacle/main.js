import fs from "fs"
import fetchData from "./fetchData.js"


const getData = async (writeToFile = false) => {
    const response = await fetchData()

    if (writeToFile) {
        // TODO: Write to file
    }

    console.log("data fetched")
    return response
}


export default getData
