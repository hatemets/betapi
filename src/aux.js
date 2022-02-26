import fetch from "node-fetch"

// remove these keys
const unnecessaryKeysPinnacle = [
    "ageLimit", "altTeaser", "external",
    "featureOrder", "hasAltSpread", "hasAltTotal",
    "hasLive", "isBetshareEnabled", "isFeatured",
    "isHighlighted", "isLive", "isPromoted",
    "liveMode", "rotation", "state",
]

export const redundantValuesGGBet = [ "id", "v", "score1", "score2", "team1_id", "team2_id", "isLive", "slug", "hash", "actual_at" ]

// Lines that are unnecessary in the value for the key "parent" in pinnacle data
export const redundantLines = ["correct score", "winning margin"];

export const UStoEU = val => (val >= 0) ? val / 100 + 1 : 100 / Math.abs(val) + 1

export const cleanMatchupData = (matchupsData) => {
    for (const matchup of matchupsData) {
        for (const key of Object.keys(matchup)) {
            if (unnecessaryKeysPinnacle.includes(key)) {
                try {
                    // console.log(`deleting: ${key}`)
                    delete matchup[key]
                }
                catch (err) {
                    console.log(err)
                }
            }
        }
    }
}

export const removeDuplicates = objects => {
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

export const getAPIData = (url, key) => fetch(url, {
        method: 'GET',
        headers: { "x-api-key": key },
        redirect: 'follow'
    })
    .then(res => res.json())
    .catch(err => console.log('Error: ', err));

export const getNameId = teams => {
    let id = teams.reduce((team1, team2) => team1 + team2).hashCode();

    if (id < 0) {
        // Replace minus sign with 1
        id = parseInt(id.toString().replace("-", "1"));
    }

    return id;
}

// Add a function to string class
String.prototype.hashCode = function () {
    let hash = 0;

    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}
