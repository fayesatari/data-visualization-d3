const width = 1000
const height = 600

const mouseover = (g, d, geoPath) => {
    const d3Provinces = d3.select(g)

    d3Provinces
        .select("circle")
        .attr("stroke-width", 3)
        .attr("fill-opacity", 0.9)

    d3Provinces
        .select("path")
        .attr("fill", "#dee2e6") //gray-300
}
const mouseleave = (g, d, geoPath) => {
    const d3Provinces = d3.select(g)

    d3Provinces
        .select("circle")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.4)
    d3Provinces
        .select("path")
        .attr("fill", "#ced4da") //gray-400

}
const drawMap = (dataMap, dataRows, geoPath) => {

    d3
        .select("#d3Map svg")
        .selectAll("g")
        .data(dataMap.features)
        .enter()
        .append("g")
        .append("path")
        .attr("d", geoPath)
        .attr("stroke-width", 1)
        .attr("stroke", "#6c757d") //gray-600
        .attr("fill", "#ced4da") //gray-400
}
const getQtyByProvinceName = (dataMarkers, provinceName) =>
    dataMarkers.find(dm => dm.key.toLowerCase() === provinceName.toLowerCase())?.value ?? 0

const drawMarkers = (dataMap, dataRows, geoPath, d3LineChartUpdateFilter, d3PieUpdateFilter) => {
    
    const dataMarkers = d3
        .nest()
        .key(d => d.Province)
        .rollup(d => d.length)
        .entries(dataRows)

    // Scale
    const raduis = d3
        .scaleLinear()
        .range([10, 80]) // custom size raduis
        .domain([0, d3.max(dataMarkers, vs => d3.max(dataMarkers, v => v.value))])

    // Draw
    const d3Provinces = d3
        .select("#d3Map svg")
        .selectAll("g")
    // .data(dataMap.features)
    // .enter()

    d3Provinces
        .append("circle")
        .attr("r", d => raduis(getQtyByProvinceName(dataMarkers, d.properties.name)))
        .attr("cx", d => geoPath.centroid(d)[0])
        .attr("cy", d => geoPath.centroid(d)[1])
        .style("fill", "#479f76") //green-400
        .attr("stroke", "#d1e7dd") //green-100
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.4)
        .attr("class", "cursor-pointer")
        .on("mouseover", function (d) { mouseover(this.parentNode, d, geoPath) })
        .on("mouseleave", function (d) { mouseleave(this.parentNode, d, geoPath) })
        .on("click", function (d) { 
            d3LineChartUpdateFilter(dataRows, d) 
            d3PieUpdateFilter(dataRows, d) 
        })
        
    d3Provinces.
        append("text", "circle")
        .text(d => getQtyByProvinceName(dataMarkers, d.properties.name))
        .attr("x", d => geoPath.centroid(d)[0])
        .attr("y", d => geoPath.centroid(d)[1])
        .attr("text-anchor", "middle")
        .attr("stroke", "#212529") //gray-900
        .attr("dy", "0.3em")
        .attr("class", "cursor-pointer")
        .on("mouseover", function (d) { mouseover(this.parentNode, d, geoPath) })
        .on("mouseleave", function (d) { mouseleave(this.parentNode, d, geoPath) })
        .on("click", function (d) { 
            d3LineChartUpdateFilter(dataRows, d) 
            d3PieUpdateFilter(dataRows, d)             
        })
}
const drawTooltip = (dataMap, dataRows, geoPath) => {
    // Add tooltip
    d3
        .select("#d3Map svg")
        .append("text")
        .attr("id", "d3Map-tooltip")
}

export const draw = (dataRows, d3LineChartUpdateFilter, d3PieUpdateFilter) => {
    // Read map-data from jason
    d3.json('canada.geo.json')
        .then(dataMap => {
            // Calculate geo
            const geoProjection = d3
                .geoMercator()
                .rotate([100, -45])
                .center([5, 20])
                .scale(width)
                .translate([width / 2, height / 2])

            const geoPath = d3
                .geoPath()
                .projection(geoProjection);

            // Append main svg
            const svg = d3
                .select("#d3Map")
                .attr("class", "shadow-sm w-100")
                .append("svg")
                .attr("width", "100%")
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`)

            // draw sections
            drawMap(dataMap, dataRows, geoPath)
            drawMarkers(dataMap, dataRows, geoPath, d3LineChartUpdateFilter, d3PieUpdateFilter)
            drawTooltip(dataMap, dataRows, geoPath)
        })
        .catch(ex => alert("Error read json: " + (ex?.message ?? "")))
}

