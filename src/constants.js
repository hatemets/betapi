// Betting-api (GGBet, Marathonbet)
const bettingApiKey = "07bbcd102b2c4aa8bf9de833a8753e07c7590977ff124c559630e741b786605d"

/* Pinnacle */
export const pinnacle = {
    baseUrl: "https://guest.api.arcadia.pinnacle.com/0.1",
    apiKey: "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
    matchupUrl: "/leagues/206571/matchups",
    leaguesUrl: "/sports/29/leagues",
    irrelevantKeys: {
        matchups: [
            "ageLimit",
            "altTeaser",
            "external",
            "featureOrder",
            "hasAltSpread",
            "hasAltTotal",
            "hasLive",
            "isBetshareEnabled",
            "isFeatured",
            "isHighlighted",
            "isLive",
            "isPromoted",
            "liveMode",
            "rotation",
            "state"
        ],
        leagues: [
            "ageLimit",
            "featureOrder",
            "external",
            "isHidden",
            "isFeatured",
            "isPromoted",
            "isSticky",
            "matchupCountSE",
            "sport"
        ]
    }
}

/* GGBet */
export const ggbet = {
    baseUrl: `https://api.betting-api.com/ggbet/football/line/all?token=${bettingApiKey}`,
    apiKey: "07bbcd102b2c4aa8bf9de833a8753e07c7590977ff124c559630e741b786605d",
    irrelevantKeys: [
        "id",
        "v",
        "score1",
        "score2",
        "team1_id",
        "team2_id",
        "isLive",
        "slug",
        "hash",
        "actual_at"
    ]
}
