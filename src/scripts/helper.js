export function cleanData(dataRows) {
    console.log("dataRows", dataRows)
    const result = dataRows.map(d => {
        if (d.Genre === "0" || d.Genre === "") d.Genre = "N/A"
        if (d.Province === "0" || d.Province === "") d.Genre = "Other"
        if (d.Province === "Newfoundland/Labrad." || d.Province === "Newfoundland/Labrador") d.Province = "Newfoundland & Labrador"
        if (d.Province === "North West Territories" || d.Province === "North W. Territories") d.Province = "Northwest Territories"
        if (d.Province === "Yukon") d.Province = "Yukon Territory"
        return d;
    })
    console.log("result", result)
    return result
}