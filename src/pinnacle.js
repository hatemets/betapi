import fs from "fs";
import { leaguesUrl, matchupsUrl, straightUrl, pinnacleKey, pinnacleBaseUrl } from "./constants.js";
import { cleanMatchupData, UStoEU, redundantLines, getNameId, getAPIData } from "./aux.js";

export const getPinnacleData = async () => {
    // const matchupsData = await getAPIData(matchupsUrl, pinnacleKey)
    // const straights = await getAPIData(straightUrl, pinnacleKey)
    // const matchupsData = JSON.parse(fs.readFileSync("./data/matchups.json", "utf8"))
    // const straights = JSON.parse(fs.readFileSync("./data/straight.json", "utf8"))
    const leagues = JSON.parse(fs.readFileSync("./data/leagues.json", "utf8"))
    // const leagues = await getAPIData(leaguesUrl, pinnacleKey)
    // const straight  = await getAPIData(straight_url, apiKey)
    // fs.writeFileSync("./data/matchups.json", JSON.stringify(matchupsData, null, 4));
    // fs.writeFileSync("./data/leagues.json", JSON.stringify(leagues, null, 4));
    // fs.writeFileSync("./data/straight.json", JSON.stringify(straights, null, 4));

    // console.log(leagues);

    // Contains objects with opposing teams and their ID's
    let totalNameData = [];

    // Contains the ID's generated from the team names (e.g. atletico-madrid => 51203874)
    let ids = [];

    // Contains all matches of each league
    let totalGames = []


    // Contains objects with league's ID and name
    const leagueObjects = leagues.filter(league => league.matchupCountSE > 0).map(league => ({ name: league.name, id: league.id, matchupCount: league.matchupCountSE }))
    console.log(leagueObjects);
    // console.log(leagues);
    // fs.writeFileSync("./uuuga.txt", JSON.stringify(leagues, null, 4))

    // Contains promises that each league iteration creates
    let promises = []

    for (const league of leagueObjects) {
        const baseUrl = `${pinnacleBaseUrl}/leagues/${league.id}`
        // https://guest.api.arcadia.pinnacle.com/0.1/leagues/2036/matchups

        // const x = await getAPIData("https://guest.api.arcadia.pinnacle.com/0.1/leagues/1980/matchups", "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R")
        const url = `${baseUrl}/matchups`

        getAPIData(url).then(matchupsData => {
            if (matchupsData.status === 403) {
                throw new Error(`No available data for ${url}`)
            }

            getAPIData(`${baseUrl}/markets/straight`).then(straightsData => {
                if (straightsData.status === 403) {
                    throw new Error(`No available data for ${url}`)
                }

                for (const matchup of matchupsData) {
                    for (const [key, value] of Object.entries(matchup)) {
                        try {
                            if (key === "parent") {
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
                            // else if (league.length === 0 && key === "league") {
                            //     league = value.name;
                            // }
                        }
                        catch (err) {
                            console.log(err)
                            return;
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

                for (const matchupObj of matchups) {
                    for (const betObj of matchupObj.bets) {
                        // Find the corresponding straight object that contains the odds
                        const straightObj = straightsData.find(el => betObj.matchupId === el.matchupId)

                        for (const betValue of betObj.bets) {
                            try {
                                // console.log(straightObj.prices);
                                const found = straightObj.prices.find(price => price.participantId === betValue.id)
                                // Check if odds exist for the bet
                                if (found) {
                                    const odds = parseFloat(UStoEU(found.price).toFixed(3))
                                    betValue.odds = odds
                                }
                                else {
                                    // Remove bets that don't have odds
                                    let isLastElement = betObj.bets.map(el => el.id).indexOf(betValue.id) !== betObj.bets.length - 1; 
                                    if (isLastElement) {
                                        betObj.bets = betObj.bets.filter(el => el.odds);

                                        while (isLastElement) { 
                                            betObj.bets.pop()
                                            isLastElement = betObj.bets.map(el => el.id).indexOf(betValue.id) !== betObj.bets.length - 1; 
                                        } 
                                    }
                                }
                            }
                            catch (err) {
                                console.log(err)
                                return
                            }
                        }
                    }

                }

                totalGames.push(matchups)
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))

    }

    console.log(totalGames);

    return totalGames;
}
