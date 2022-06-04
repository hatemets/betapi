import { pinnacle } from "../constants.js"
import fetchData from "./fetchData.js"
import cleanData from "./cleanData.js"
import fs from "fs"

const { baseUrl, matchupUrl, irrelevantKeys } = pinnacle

const getMatchups = async () => {
    const url = baseUrl + matchupUrl

    const response = await fetchData(url)
    const cleaned = cleanData(response.data, irrelevantKeys.matchups)

    return cleaned
}


export default getMatchups
