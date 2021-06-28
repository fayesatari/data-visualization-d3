const _MOVIES = "Movies"
const _CONTRACT_SIGNED = "Signed contract"
const _CONTRACT_UNSIGNED = "Without contract"
const _CONTRACT_UNKNOWN = "Unknown status"
const _STATIC_NODES = [_MOVIES, _CONTRACT_SIGNED, _CONTRACT_UNSIGNED, _CONTRACT_UNKNOWN]

const getSankeyColor = (colorScale, nodeName) => {
    switch (nodeName) {
        case _MOVIES:
            return "#6c757d"; // Secondary
        case _CONTRACT_SIGNED:
            return "#198754"; // Success
        case _CONTRACT_UNSIGNED:
            return "#ffc107"; // Warning
        case _CONTRACT_UNKNOWN:
            return "#dc3545"; // Danger
        default:
            return colorScale(nodeName)
    }
}


const getSankeyData = (dataRows) => {
    let result = {};

    // Create node lists
    const listNodes = d3
        .map(dataRows, d => d.Purpose)
        .keys()
        .concat(_STATIC_NODES)

    // Create color scale
    const colorScale = d3
        .scaleOrdinal()
        .range(["#052c65", "#6ea8fe"]) //blue-800 to blue-300
        .domain(listNodes.slice(0, listNodes.length - 4))


    // Collect Nodes
    result.nodes = []
    d3.map(listNodes, (d, dIndex) => result.nodes.push({
        node: dIndex,
        name: d,
        color: getSankeyColor(colorScale, d)
    }))

    // Collect Links - Movies<->Purpose
    result.links = []
    const nestMovies = d3
        .nest()
        .key(d => d.Purpose)
        .rollup(d => d.length)
        .entries(dataRows)
    d3.map(nestMovies, d =>
        result.links.push({
            source: listNodes.findIndex(n => n === _MOVIES),
            target: listNodes.findIndex(n => n === d.key),
            value: d.value,
        })
    )

    // Collect Links - Purpose<->Contracts
    const nestContract = d3
        .nest()
        .key(d => d.Purpose)
        .key(d => {
            if (d.Comments.toLowerCase().includes("signed") > 0) return _CONTRACT_SIGNED
            else if (d.Comments.trim() === "0") return _CONTRACT_UNSIGNED
            else return _CONTRACT_UNKNOWN
        })
        .rollup(d => d.length)
        .entries(dataRows)
    d3.map(nestContract, p =>
        d3.map(p.values, c =>
            result.links.push({
                source: listNodes.findIndex(n => n === p.key),
                target: listNodes.findIndex(n => n === c.key),
                value: c.value,
            })
        )
    )
    return result;
}

export const draw = (dataRows) => {
    // Read map-data from jason
    const width = 1000
    const height = 900
    const dataSankey = getSankeyData(dataRows)

    // Set the sankey diagram properties
    const d3Sankey = d3
        .sankey()
        .nodeAlign(d3.sankeyJustify)
        .nodeWidth(36)
        .nodePadding(40)
        .extent([[0, 16], [width, height - 16]])

    const d3SankeyValues = d3Sankey({
        nodes: dataSankey.nodes.map(d => Object.assign({}, d)),
        links: dataSankey.links.map(d => Object.assign({}, d))
    })

    // Draw main svg
    const d3Svg = d3
        .select("#d3Sankey")
        .attr("class", "shadow-sm w-100")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    const d3Defs = d3Svg.append("defs")

    // Draw links
    const d3Link = d3Svg
        .append("g")
        .attr("fill", "none")
        .selectAll("g")
        .data(d3SankeyValues.links.sort((a, b) => b.width - a.width))
        .join("g")
        .attr("stroke", "#666")
        .style("mix-blend-mode", "multiply");

    d3Link
        .append("path")
        .style('fill', 'none')
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("stroke", d => {
            const gradientID = `gradient${d.index}`;
            const d3LinearGradient = d3Defs
                .append('linearGradient')
                .attr('id', gradientID);
            d3LinearGradient
                .selectAll('stop')
                .data([
                    { offset: '10%', color: d.source.color },
                    { offset: '90%', color: d.target.color }
                ])
                .enter()
                .append('stop')
                .attr('offset', d => d.offset)
                .attr('stop-color', d => d.color);
            return `url(#${gradientID})`;
        })
        .style('stroke-opacity', 1)
        .on("mousemove", function (d) {
            d3.selectAll("#d3Sankey path").style('stroke-opacity', 0.33)
            d3.selectAll("#d3Sankey rect").style('fill-opacity', 0.33)
            d3.select(this).style('stroke-opacity', 1)
        })
        .on("mouseout", function (d) {
            d3.selectAll("#d3Sankey path").style('stroke-opacity', 1)
            d3.selectAll("#d3Sankey rect").style('fill-opacity', 1)
        })

    d3Link
        .append("title")
        .text(d => `${d.source.name} → ${d.target.name}\n${d.value.toLocaleString()} Movies`);

    // Draw nodes
    d3Svg
        .append("g")
        .selectAll("rect")
        .data(d3SankeyValues.nodes)
        .enter()
        .append("rect")
        .attr("x", d => d.x0 + 1)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0 - 2)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => d.color)
        .style('fill-opacity', 1)
        .on("mousemove", function (d) {
            d3.selectAll("#d3Sankey path").style('stroke-opacity', 0.33)
            d3.selectAll("#d3Sankey rect").style('fill-opacity', 0.33)
            d3.select(this).style('fill-opacity', 1)
        })
        .on("mouseout", function (d) {
            d3.selectAll("#d3Sankey path").style('stroke-opacity', 1)
            d3.selectAll("#d3Sankey rect").style('fill-opacity', 1)
        })
        .append("title")
        .text(d => `${d.name}\n${d.value.toLocaleString()} Movies`);

    // Draw text
    d3Svg
        .append("g")
        .style("font-size", "11px")
        .attr("pointer-events", "none")
        .selectAll("text")
        .data(d3SankeyValues.nodes)
        .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .append("tspan")
        .attr("fill-opacity", 0.7)
        .text(d => ` (${d.value.toLocaleString()} Movies)`);
}
