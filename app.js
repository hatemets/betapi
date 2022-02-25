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
    
    // const matchupsData = await getAPIData(matchups_url, apiKey)
    const matchupsData = JSON.parse(fs.readFileSync("./data/matchups.json", "utf8"))
    const straights = JSON.parse(fs.readFileSync("./data/straight.json", "utf8"))
    // const leagues = await getAPIData(leagues_url, apiKey)
    // const straight  = await getAPIData(straight_url, apiKey)
    // fs.writeFileSync("./data/matchups.json", JSON.stringify(matchupsData, null, 4));
    // fs.writeFileSync("./data/leagues.json", JSON.stringify(leagues, null, 4));
    // fs.writeFileSync("./data/straight.json", JSON.stringify(straight, null, 4));

    // console.log(util.inspect(matchups[0], { showHidden: false, depth: null }))

    // console.log(matchups[0].bets[0])
    const matchups = getPinnacleData(matchupsData, straights);

    console.log(util.inspect(matchups[0].bets, { showHidden: false, depth: null }))
    // console.log(util.inspect(straights, { showHidden: false, depth: null }))

    // fs.writeFile("./bets.json", JSON.stringify(bets, null, 4), err => {
    //     if (err) console.log(err);
    //     console.log("File written")
    // });
    // console.log(util.inspect(bets, { showHidden: false, depth: null }))
    console.log("Process finished")
})();
