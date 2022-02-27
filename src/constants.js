// Betting-api (GGBet, Marathonbet)
const bettingApiKey = "07bbcd102b2c4aa8bf9de833a8753e07c7590977ff124c559630e741b786605d";
export const GGBetUrl = `https://api.betting-api.com/ggbet/football/line/all?token=${bettingApiKey}`;

// Pinnacle
export const pinnacleBaseUrl = "https://guest.api.arcadia.pinnacle.com/0.1";
const leagueId = 2196;
export const pinnacleKey = "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R";
export const leaguesUrl = `${pinnacleBaseUrl}/sports/29/leagues?all=false`;
export const matchupsUrl = `${pinnacleBaseUrl}/leagues/${leagueId}/matchups`;
export const straightUrl = `${pinnacleBaseUrl}/leagues/${leagueId}/markets/straight`;

