import fs from "fs";
import { cleanMatchupData, UStoEU, redundantLines, getNameId } from "./aux.js";

export const getPinnacleData = () => {

    // const matchupsData = await getAPIData(matchups_url, apiKey)
    const matchupsData = JSON.parse(fs.readFileSync("./data/matchups.json", "utf8"))
    const straights = JSON.parse(fs.readFileSync("./data/straight.json", "utf8"))
    // const leagues = await getAPIData(leagues_url, apiKey)
    // const straight  = await getAPIData(straight_url, apiKey)
    // fs.writeFileSync("./data/matchups.json", JSON.stringify(matchupsData, null, 4));
    // fs.writeFileSync("./data/leagues.json", JSON.stringify(leagues, null, 4));
    // fs.writeFileSync("./data/straight.json", JSON.stringify(straight, null, 4));


    cleanMatchupData(matchupsData)
    let totalNameData = [];
    let ids = [];

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

    // matchupBets objects
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
    }

    return matchups
}
