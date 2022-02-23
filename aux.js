// remove these keys
const unnecessaryKeys = [
    "ageLimit", "altTeaser", "external",
    "featureOrder", "hasAltSpread", "hasAltTotal",
    "hasLive", "isBetshareEnabled", "isFeatured",
    "isHighlighted", "isLive", "isPromoted",
    "liveMode", "rotation", "state",
]

export const cleanMatchupData = (matchupsData) => {
    for (const matchup of matchupsData) {
        for (const key of Object.keys(matchup)) {
            if (unnecessaryKeys.includes(key)) {
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

export const UStoEU = val => (val >= 0) ? val / 100 + 1 : 100 / Math.abs(val) + 1
