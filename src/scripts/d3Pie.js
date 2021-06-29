const _WIDTH = 600
const _HEIGHT = 300
const _MARGIN = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
}


export const draw = (dataRows) => {
    //  Append Pie
    // ===================================
    const svg = d3
        .select("#d3Pie")
        .attr("class", "shadow-sm w-100")
        .append("svg")
        .attr("width", "100%")
        .attr("height", _HEIGHT)
        .attr("viewBox", `0 0 ${_WIDTH + _MARGIN.left + _MARGIN.right} ${_HEIGHT + _MARGIN.top + _MARGIN.bottom}`)
    svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${_WIDTH/2}, ${_HEIGHT/2})`)

    // Draw
    // ===================================
    update(dataRows)
}

export const update = (dataRows) => {
    //console.log("update", dataRows)
}

export const updateFilter = (dataRows, dataMarker) => {
    let dataRowsFilteredByProvince = dataRows.filter(d => d.Province === dataMarker.properties.name)
    const dataNestLang = d3
        .nest()
        .key(d => d.Language)
        .rollup(d => d.length)
        .entries(dataRowsFilteredByProvince)

    // Draw Pie
    const scaleColor = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(d3.map(dataNestLang, d => d.key).keys())
    const radius = Math.min(_WIDTH, _HEIGHT) / 2
    const pie = d3
        .pie()
        .value(d => d.value)
    const pieData = pie(dataNestLang)
    const pieArc = d3.arc().innerRadius(0).outerRadius(radius)


    console.log("dataNestLang", dataNestLang)
    const svg = d3.select('#d3Pie svg ').select("g.chart")
    svg
        .selectAll('path')
        .data(pieData)
        .join("path")
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .attr("fill", d => scaleColor(d.data.key))
        .transition()
        //.duration(250)
        //.delay(100)
        //.ease(d3.easeLinear)
        .style("opacity", 0.7)
        .attr("d", pieArc)

    svg
        .selectAll('text')
        .remove()
    svg
        .selectAll('text')
        .data(pieData)
        .enter()
        .append('text')
        .attr("transform", d => `translate(${pieArc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", 16)
        .text(d => d.data.key)


    // Update/redraw table
    update(dataRows)
}