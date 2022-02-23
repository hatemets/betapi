import fetch from "node-fetch";
import fs from "fs";
import util from "util";
import { getPinnacleData } from "./pinnacle.js";

// betting-api
const token = "07bbcd102b2c4aa8bf9de833a8753e07c7590977ff124c559630e741b786605d";

// ggbet
// const url = `https://api.betting-api.com/ggbet/football/line/all?token=${token}`;

// Pinnacle
const pinnacle_base_url = "https://guest.api.arcadia.pinnacle.com/0.1";
const apiKey = "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R";
const leagueId = 2630;
const leagues_url = `${pinnacle_base_url}/sports/29/leagues?all=false`;
const matchups_url = `${pinnacle_base_url}/leagues/${leagueId}/matchups`;
const straight_url = `${pinnacle_base_url}/leagues/${leagueId}/markets/straight`;

(async () => {
    // const response = await fetch(url)
    //     .then(res => res.json())
    //     .catch(err => console.log(err))

    // // fs.writeFileSync("./ggbet.json", JSON.stringify(response));
    // const game = response[0];
    // const { id, team1, team2, markets } = game;
    // const { win1: winObjectA, winX, win2: winObjectB } = markets;
    // const [win1, draw, win2] = [winObjectA.v, winX.v, winObjectB.v];

    // console.log(id, team1, team2)
    // console.log(win1, draw, win2)

    // console.log(util.inspect(response[0], { showHidden: false, depth: null, colors: true }))
    
    // const matchupsData = await getAPIData(matchups_url, apiKey)
    const matchupsData = JSON.parse(fs.readFileSync("./matchups.json", "utf8"))
    const straights = JSON.parse(fs.readFileSync("./straight.json", "utf8"))
    // const leagues = await getAPIData(leagues_url, apiKey)
    // const straight  = await getAPIData(straight_url, apiKey)
    // fs.writeFileSync("./matchups.json", JSON.stringify(matchupsData, null, 4));
    // fs.writeFileSync("./leagues.json", JSON.stringify(leagues, null, 4));
    // fs.writeFileSync("./straight.json", JSON.stringify(straight, null, 4));

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
