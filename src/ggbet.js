// export const getGGBetData = async () => {
//     // const response = await fetch(GGBetUrl)
//     //     .then(res => res.json())
//     //     .catch(err => console.log(err))
//     // fs.writeFileSync("./data/ggbetInitial.json", JSON.stringify(response, null, 4));

//     const ggbetData = JSON.parse(fs.readFileSync("./data/ggbetInitial.json", "utf8"));

//     // Remove unnecessary values
//     for (const match of ggbetData) {
//         for (const attr of redundantValuesGGBet) {
//             delete match[attr];
//         }

//         delete match.tournament.league_id;

//         match.tournament.league = match.tournament.league.split(".").slice(0, -1).reduce((a, b) => a + b)
//     }

//     // fs.writeFileSync("./data/ggbet.json", JSON.stringify(ggbetData, null, 4))

//     return ggbetData;
// }
