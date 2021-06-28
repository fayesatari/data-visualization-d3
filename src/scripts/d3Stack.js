import d3Legend from 'd3-svg-legend';

const getDataByQTY = (dataRows) =>
    d3
        .nest()
        .key(d => d.Period)
        .key(d => d.Genre)
        .rollup(d => d.length)
        .entries(dataRows)

const getDataBySum = (dataRows) =>
    d3
        .nest()
        .key(d => d.Period)
        .key(d => d.Genre)
        .rollup(d => d3.sum(d, v => v["Final Value"]))
        .entries(dataRows)

/**
 * Draw a horizontal stacked bar chart
 * @date 2021-06-19
 * @param {any} dataRows - A array of all rows
 * @returns {any}
 */
export const draw = (dataRows) => {
    // Append tooltip
    // ===================================
    var tooltip = d3
        .select("#d3Stack")
        .append("div")
        .attr("class", "tooltip shadow p-2 text-center rounded")
        .style("opacity", "0.9")

    //  Append stackchart
    // ===================================
    const svg = d3
        .select("#d3Stack")
        .attr("class", "shadow-sm w-100")
        .append("svg")

    svg
        .append("g")
        .attr("class", "chart")


    // Append Axis & Legend
    // ===================================
    svg
        .append("g")
        .attr("class", "x-axis")
    svg
        .append("g")
        .attr("class", "y-axis")

    svg
        .append("g")
        .attr("class", "legend")

    // Draw
    // ===================================
    update(dataRows)
}

export const update = (dataRows) => {
    const width = 640
    const height = 800
    const speed = 1000
    const margin = {
        top: 10,
        left: 70,
        bottom: 180,
        right: 20,
    }

    // Read radio selection
    // ===================================
    const movieType = document?.movieForm?.movieType?.value ?? ""

    // Prepare data for stacked chart
    // ===================================
    const data = (movieType === 'qty')
        ? getDataByQTY(dataRows)
        : getDataBySum(dataRows)
    const listGenre = d3.map(dataRows, d => d.Genre).keys();
    const listPeriod = d3.map(data, d => d.key).keys();
    
    // Scales
    // ===================================
    const y = d3
        .scaleBand()
        .range([margin.top, height - margin.bottom])
        .padding(0.3)
        .domain(d3.map(data, d => d.key).keys())

    const x = d3
        .scaleLinear()
        .range([margin.left, width - margin.right])
        .domain([0, d3.max(data, vs => d3.sum(vs.values, v => v.value))])

    const z = d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain(listGenre)

    const series = d3
        .stack()
        .keys(listGenre)
        .value((d, key) => d.values.find(v => v.key === key)?.value ?? 0)
        (data)

    // Elements
    // ===================================
    const tooltip = d3
    .select("#d3Stack div.tooltip")

    const svg = d3
        .select("#d3Stack svg")
        .attr("width", width)
        .attr("height", height)

    // Draw stackchart
    // ===================================
    svg
        .select("g.chart")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => z(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("class", "cursor-pointer")
        .attr("y", d => y(d.data.key))
        .attr("height", y.bandwidth())
        .transition()
        //.duration(25)
        .delay((d,i) => i * 25)
        .ease(d3.easeLinear)
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("x", d => x(d[0]))
        
    svg
        .selectAll("g.chart rect")
        .on("mousemove", function (d) {
            const dataParent = d3.select(this.parentNode).datum()
            const genre = dataParent.key
            const period = d.data.key
            const qty = d.data.values.find(v => v.key === genre).value
            // Show Tooltip
            tooltip.html(`<div>Number of movie in</div><div><b>${genre}</b> at <b>${period}</b>:</div><b>${qty}</b>`);
            tooltip.style("left", d3.event.pageX + "px");
            tooltip.style("top", d3.event.pageY - 90 + "px");
            tooltip.style("display", "inline-block");

            // Highlight this rect
            svg
                .selectAll("rect")
                .style("opacity", 0.6)
            d3
                .select(this.parentNode)
                .selectAll("rect")
                .style("opacity", 1)
        })
        .on("mouseout", function (d) {
            // Hide Tooltip
            tooltip.style("display", "none");

            // Normal opacity
            svg
                .selectAll("rect")
                .style("opacity", 1)
        })

    // X-Axis
    // ===================================
    svg
        .select("g.x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))

    // Y-Axis
    // ===================================
    svg
        .select("g.y-axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

    // Legend
    // ===================================
    const legend = d3Legend
        .legendColor()
        //.title("Legend")
        .orient('horizontal')
        .shape('circle')
        .scale(z)
        .labelAlign("start")
        .shapePadding(5)

    svg
        .select("g.legend")
        .attr("transform", `translate(20, ${height - margin.bottom + 50})`)
        .call(legend)
    svg
        .selectAll(".legendCells text")
        .style("font-size", "9px")
        .attr("transform", "translate(-4,14) rotate(90)")
}
