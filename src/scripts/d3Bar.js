import d3Legend from 'd3-svg-legend';
const _WIDTH = 1000
const _HEIGHT = 300
const _MARGIN = {
    top: 10,
    left: 60,
    bottom: 130,
    right: 10,
}

const drawNest = (dataNest, scaleColor, listTypes, width) => {
    const speed = 1000

    // Scales
    // ===================================
    const maxTypesValue = d3
        .max(dataNest, nq => d3.max(nq.values, nt => nt.value))

    const scaleX = d3
        .scaleBand()
        .range([0, width])
        .domain(listTypes)
        .padding(.1)

    const scaleY = d3
        .scaleLinear()
        .range([_HEIGHT, 0])
        .domain([0, maxTypesValue])

    console.log(dataNest)
    // Draw SVG
    // ===================================
    const d3SVG = d3
        .select("#d3Bar")
        .append("div")
        .selectAll("svg")
        .data(dataNest)
        .enter()
        .append("svg")
        .attr("width", width + _MARGIN.left + _MARGIN.right)
        .attr("height", _HEIGHT + _MARGIN.top + _MARGIN.bottom)
        .append("g")
        .attr("transform", `translate(${_MARGIN.left},${_MARGIN.top})`)

    // Draw Bars
    // ===================================
    const d3Bar = d3SVG
        .selectAll(".bar")
        .data(d => d.values)
        .enter()
        .append("rect")
        .attr("class", "cursor-pointer")
        .attr("x", d => scaleX(d.key))
        .attr("width", scaleX.bandwidth())
        .attr("y", d => scaleY(d.value))
        .attr("height", d => _HEIGHT - scaleY(d.value))
        .attr("fill", d => scaleColor(d.key))
        .attr("data-type", d => d.key)
        .style("opacity", 1)
        .on("mousemove", function (d) {
            const dataParent = d3.select(this.parentNode).datum()
            d3
                .select("#d3Bar-tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 90 + "px")
                .style("display", "inline-block")
                .html(`<div>Number of movie(s) in</div><div><b>${d.key}</b> in quarter <b>${dataParent.key}</b>:</div><b>${d.value}</b>`)

            // Highlight opacity
            d3.selectAll(`#d3Bar rect:not([data-type='${d.key}'])`).style("opacity", 0.33)
            d3.selectAll(`#d3Bar rect[data-type='${d.key}']`).style("opacity", 1)
        })
        .on("mouseout", function (d) {
            // Hide Tooltip
            d3
                .select("#d3Bar-tooltip")
                .style("display", "none");

            // Normal opacity
            d3.selectAll(`#d3Bar rect`).style("opacity", 1)
        })

    d3Bar
        .append("title")
        .text(d => d.value)


    // X-Axis
    // ===================================
    d3SVG
        .append("g")
        .attr("transform", `translate(0, ${_HEIGHT})`)
        .transition()
        .duration(speed)
        .call(d3.axisBottom(scaleX))
        .selectAll("text")
        .attr("transform", "translate(-10, 0)rotate(-45)")
        .style("text-anchor", "end")

    // Y-Axis
    // ===================================
    d3SVG
        .append("g")
        .transition()
        .duration(speed)
        .call(d3.axisLeft(scaleY))

    // Label
    // ===================================
    d3SVG
        .append("g")
        .append("text")
        .attr("transform", `translate(${width - _MARGIN.right},${_MARGIN.top})`)
        .attr("text-anchor", `end`)
        .text(d => "Quarter: " + d.key)
}

const drawLegend = (scaleColor, width) => {
    // Draw SVG
    // ===================================
    const d3SVG = d3
        .select("#d3Bar")
        .append("svg")
        .attr("width", width + _MARGIN.left + _MARGIN.right)
        .attr("height", _HEIGHT / 2 + _MARGIN.top + _MARGIN.bottom)

    // Legend
    // ===================================
    const legend = d3Legend
        .legendColor()
        .title("Legend")
        .orient('horizontal')
        .shape('circle')
        .scale(scaleColor)
        .labelAlign("start")
        .shapePadding(5)
    d3SVG
        .append("g")
        .attr("transform", `translate(20, ${_HEIGHT / 2 - _MARGIN.bottom + 50})`)
        .call(legend)
    d3SVG
        .selectAll(".legendCells text")
        .style("font-size", "12px")
        .attr("transform", "translate(-4,14) rotate(90)")
}

const drawTooltip = () => {
    // Draw Tooltip
    // ===================================
    d3
        .select("#d3Bar")
        .append("div")
        .attr("id", "d3Bar-tooltip")
        .attr("class", "tooltip shadow p-2 text-center rounded")
        .style("opacity", "0.9")
}


export const draw = (dataRows) => {

    // Section preparation
    d3
        .select("#d3Bar")
        .attr("class", "shadow-sm w-100")

    // Nest data
    const nestQuarters = d3
        .nest()
        .key(d => d.Quarter)
        .key(d => d.Type)
        .rollup(d => d.length)
        .entries(dataRows)
    const nestTypes = d3
        .nest()
        .key(d => d.Type)
        .rollup(d => d.length)
        .entries(dataRows)
    const nestOverall = [{
        key: "Overall",
        values: nestTypes,
    }]
    const listTypes = d3
        .map(nestTypes, d => d.key)
        .keys()

    // Scales
    // ===================================
    const scaleColor = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(listTypes)

    // Draw total
    drawTooltip()
    drawNest(nestOverall, scaleColor, listTypes, _WIDTH, _HEIGHT)
    drawNest(nestQuarters, scaleColor, listTypes, _WIDTH / 2, _HEIGHT)
    drawLegend(scaleColor, _WIDTH, _HEIGHT)
}
