import fs from "fs"
import util from "util"
import getPinnacleData from "./src/pinnacle/main.js"


(async () => {
    await getPinnacleData(false)
    console.log("Process finished")
})()
