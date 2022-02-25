import fetch from "node-fetch";
import fs from "fs";
import util from "util";
import { getPinnacleData } from "./src/pinnacle.js";

(async () => {
    // const response = await fetch(url)
    //     .then(res => res.json())
    //     .catch(err => console.log(err))

    // // fs.writeFileSync("./ggbet.json", JSON.stringify(response));
    // const game = response[0];

    const matchups = getPinnacleData();
    console.log(util.inspect(matchups[0].bets, { showHidden: false, depth: null }))

    console.log("Process finished")
})();
