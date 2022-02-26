import fs from "fs";
import util from "util";
import { getPinnacleData } from "./src/pinnacle.js";
import { getGGBetData } from "./src/ggbet.js";
import stringSimilarity from "string-similarity";


(async () => {
    const pinnacleSoccer = await getPinnacleData();
    console.log(util.inspect(pinnacleSoccer.matchups[0], false, null))
    fs.writeFileSync("./data/pinnacle.json", JSON.stringify(pinnacleSoccer, null, 4))

    // const ggbetData = await getGGBetData();
    // console.log(ggbetData);


    // fs.writeFileSync("./data/ggbet.json", JSON.stringify(ggBetMatchups, null, 4))

    console.log("Process finished")
})();
