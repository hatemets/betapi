import fs from "fs"
import util from "util"
import getPinnacleData from "./src/pinnacle/main.js"
import { leaguesUrl, matchupsUrl, straightUrl, pinnacleKey, pinnacleBaseUrl } from "./src/constants.js"
import { cleanMatchupData, UStoEU, getNameId, getAPIData } from "./src/helper.js"


(async () => {
    const pinnacleSoccer = await getPinnacleData()

    console.log("Process finished.")
})()
