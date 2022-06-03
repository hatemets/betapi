import { pinnacle } from "../constants.js"
import fetchData from "./fetchData.js"
import cleanData from "./cleaner.js"

const { baseUrl, leaguesUrl, irrelevantKeys } = pinnacle

const getLeagues = async () => {
    const url = baseUrl + leaguesUrl
    const response = await fetchData(url)
    const cleanedLeagues = await cleanData(response.data, irrelevantKeys.leagues)
}


export default getLeagues
