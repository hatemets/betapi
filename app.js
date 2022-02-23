import fetch from "node-fetch";
import fs from "fs";
import util from "util";
import { cleanMatchupData, UStoEU } from "./aux.js";

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

const getAPIData = (url, key) => fetch(url, {
        method: 'GET',
        headers: { "x-api-key": key },
        redirect: 'follow'
    })
    .then(res => res.json())
    .catch(err => console.log('Error: ', err));

String.prototype.hashCode = function () {
    var hash = 0;

    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}

const removeDuplicates = (objects) => {
    let uniques = []
    let ids = []

    for (const obj of objects) {
        if (!ids.includes(obj.id)) {
            uniques.push(obj);
            ids.push(obj.id);
        }
    }

    return uniques
}

const getNameId = teams => {
    let id = teams.reduce((team1, team2) => team1 + team2).hashCode();

    if (id < 0) {
        // Replace minus sign with 1
        id = parseInt(id.toString().replace("-", "1"));
    }

    return id;
}

// Lines that are unnecessary in the value for the key "parent"
const redundantLines = ["correct score", "winning margin"];

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
    let totalNameData = [];
    let ids = [];

    // Cleanup
    cleanMatchupData(matchupsData)

    for (const matchup of matchupsData) {
        for (const [key, value] of Object.entries(matchup)) {
            if (key === "parent") {
                try {
                    // Push both teams of one match to the array
                    if (value !== null) {
                        const teams = [...value.participants].map(el => el.name)
                        // ID for identifying names
                        const id = getNameId(teams);

                        // Prevent duplicates
                        if (!Object.values(totalNameData).map(el => el.id).includes(id)) {
                            const teamNamesObj = {
                                teams,
                                id
                            }

                            totalNameData.push(teamNamesObj);
                            ids.push(value.id)
                        }
                    }
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    }

    // Contains matchupBets objects
    let matchups = []

    // Format the data
    for (const name_id of totalNameData.map(el => el.id)) {
        const [name1, name2] = totalNameData.find(el => el.id === name_id).teams

        // Create the initial object (missing bets)
        const matchupBets = {
            name1,
            name2,
            name_id,
            bets: []
        }

        // Find all bets for one team and add them to the object
        for (const matchup of matchupsData) {
            // Example
            // {
            // hasMarkets: true,
            // id: 1490554644,
            // league: {
            //   ageLimit: 0,
            //   external: [Object],
            //   featureOrder: 2,
            //   group: 'UEFA',
            //   id: 2630,
            //   isFeatured: true,
            //   isHidden: false,
            //   isPromoted: false,
            //   isSticky: false,
            //   matchupCount: 9,
            //   matchupCountSE: 9,
            //   name: 'UEFA - Europa League',
            //   sport: [Object]
            // },
            // parent: {
            //   id: 1458449286,
            //   participants: [Array],
            //   startTime: '2022-02-17T17:45:00+00:00'
            // },
            // parentId: 1458449286,
            // parlayRestriction: null,
            // participants: [ [Object], [Object] ],
            // periods: [ [Object] ],
            // special: {
            //   category: 'Team Props',
            //   description: 'Either Team To Score 1st Half'
            // },
            // startTime: '2022-02-17T17:45:00Z',
            // status: 'pending',
            // totalMarketCount: 1,
            // type: 'special',
            // units: null,
            // version: 189439310
            // }
            for (const [key, value] of Object.entries(matchup)) {
                if (key === "parent") {
                    try {
                        if (value !== null && name_id === getNameId(value.participants.map(el => el.name))) {
                            const participants = matchup.participants;

                            // Remove unnecessary keys
                            for (const participant of participants) {
                                delete participant.order;
                                delete participant.rotation;
                                if (participant.alignment === "neutral") delete participant.alignment;
                            }

                            // Only add the bet if it contains information of interest (no correct scores, etc...)
                            if (matchup.special && !redundantLines.some(el => matchup.special.description.toLowerCase().includes(el))) {
                                const betObj = {
                                    description: matchup.special.description,
                                    matchupId: matchup.id,
                                    bets: participants,
                                }

                                // console.log(betObj.description, betObj.bets)
                                // console.log()
                                matchupBets.bets.push(betObj);
                                ids.push(matchup.id)
                            }
                        }
                    }
                    catch (err) {
                        console.log(err)
                    }
                }
            }
        }

        matchups.push(matchupBets)
    }

    for (const betObj of matchups[0].bets) {
        const straightObj = straights.find(el => betObj.matchupId === el.matchupId)
        // console.log(util.inspect(betObj.bets, { showHidden: false, depth: null }));

        // console.log(straightObj)
        for (const betValue of betObj.bets) {
            try {
                const found = straightObj.prices.find(price => price.participantId === betValue.id)
                // Check if odds exist for the bet
                if (found) {
                    const odds = parseFloat(UStoEU(found.price).toFixed(3))
                    betValue.odds = odds
                }
                else {
                    // Remove bets that don't have odds
                    // TODO: Improve the safety: currently, it pops the values from the end until it finds the missing id
                    let isLastElement = betObj.bets.map(el => el.id).indexOf(betValue.id) !== betObj.bets.length - 1; 

                    if (isLastElement) {
                        while (isLastElement) { 
                            betObj.bets.pop()
                            isLastElement = betObj.bets.map(el => el.id).indexOf(betValue.id) !== betObj.bets.length - 1; 
                        } 
                        // Remove the last empty element
                        betObj.bets.pop()
                    }
                }
            }
            catch (err) {
                console.log(err)
            }
        }

        // console.log(betObj)
    }

    console.log(matchups[0].bets[0])

    // console.log(util.inspect(matchups[0].bets, { showHidden: false, depth: null }))
    // console.log(util.inspect(straights, { showHidden: false, depth: null }))

    // fs.writeFile("./bets.json", JSON.stringify(bets, null, 4), err => {
    //     if (err) console.log(err);
    //     console.log("File written")
    // });
    // console.log(util.inspect(bets, { showHidden: false, depth: null }))
    console.log("Process finished")
})();
