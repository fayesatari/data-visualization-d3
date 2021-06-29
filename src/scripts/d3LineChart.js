const _WIDTH = 1000
const _HEIGHT = 600
const _MARGIN = {
    top: 0,
    left: 80,
    bottom: 130,
    right: 40,
}


export const draw = (dataRows) => {
    //  Append LineChart
    // ===================================
    const svg = d3
        .select("#d3LineChart")
        .attr("class", "shadow-sm w-100")
        .append("svg")
        .attr("width", "100%")
        .attr("height", _HEIGHT)
        .attr("viewBox", `0 0 ${_WIDTH + _MARGIN.left + _MARGIN.right} ${_HEIGHT + _MARGIN.top + _MARGIN.bottom}`)
    svg
        .append("g")
        .attr("class", "chart")
        .attr("transform", `translate(${_MARGIN.left},${_MARGIN.top})`)
        .append('path')


    // Append overlay
    // ===================================
    svg
        .append("rect")
        .attr("class", "transparent cursor-pointer")
        .attr("opacity", "0")
        .attr("width", "100%")
        .attr("height", _HEIGHT)

    // Append Axis & Legend
    // ===================================
    svg
        .append("g")
        .attr("class", "x-axis")
    svg
        .append("g")
        .attr("class", "y-axis")

    // Append tooltip
    // ===================================
    svg
        .append("line")
        .attr('class', "tooltip-line")
        .attr('stroke-width', '3')
        .attr('stroke', 'none')

    d3
        .select("#d3LineChart")
        .append("div")
        .attr("id", "d3LineChart-tooltip")
        .attr("class", "tooltip shadow p-2 text-center rounded")
        .style("opacity", "0.9")

    // Draw
    // ===================================
    update(dataRows)
}

export const update = (dataRows) => {
    //console.log("update", dataRows)
}

export const updateFilter = (dataRows, dataMarker) => {
    let dataRowsFilteredByProvince = dataRows.filter(d => d.Province === dataMarker.properties.name)
    const dataNestPeriodQty = d3
        .nest()
        .key(d => d.Period)
        .rollup(d => d.length)
        .entries(dataRowsFilteredByProvince)
    const Periods = d3.map(dataNestPeriodQty, d => d.key).keys()
    const PeriodQtysMax = d3.max(dataNestPeriodQty, d => d.value)
    const xScale = d3.scalePoint().domain(Periods).range([0, _WIDTH]);
    const yScale = d3.scaleLinear().domain([0, PeriodQtysMax]).range([_HEIGHT, 0]);
    const line = d3
        .line()
        .x(d => xScale(d.key))
        .y(d => yScale(d.value));
    const svg = d3.select('#d3LineChart svg')

    //console.log("===>", dataNestPeriodQty, x("2010-2011"), x.invert(280))

    svg
        .select('g.chart path')
        .datum(dataNestPeriodQty)
        .attr('fill', 'none')
        .attr('stroke', "#198754")
        .attr('stroke-width', 2)
        .transition()
        //.duration(2500)
        //.delay(1000)
        .ease(d3.easeLinear)
        .attr('d', line)

    svg
        .select("g.x-axis")
        .attr("transform", `translate(${_MARGIN.left},${_HEIGHT})`)
        .call(d3.axisBottom(xScale))
        .attr("font-size", "26")
        .selectAll("text")
        .attr("transform", "translate(-15, 10)rotate(-90)")
        .style("text-anchor", "end")

    svg
        .select("g.y-axis")
        .attr("transform", `translate(${_MARGIN.left},${_MARGIN.top})`)
        .call(d3.axisLeft(yScale))
        .attr("font-size", "26")


    svg
        .select("rect.transparent")
        .on("mouseover", function mouseover() {
            //console.log("mouseover")
            // Show Tooltip
            d3
                .select("#d3LineChart-tooltip")
                .style("display", "inline-block");
            svg
                .select("line.tooltip-line")
                .attr('stroke', "black")

        })
        .on("mouseout", function mouseout() {
            //console.log("mouseout")
            // Hide Tooltip
            // d3
            //     .select("#d3LineChart-tooltip")
            //     .style("display", "none");
            // svg
            //     .select("line.tooltip-line")
            //     .attr('stroke', "none")
        })
        .on("mousemove", function mousemove(d) {
            //console.log("mousemove")
            const dataParent = d3.select(this.parentNode).datum()
            const xPos = d3.mouse(this)[0]
            const yPos = d3.mouse(this)[0]
            const domain = xScale.domain();
            const range = xScale.range();
            const rangePoints = d3.range(range[0], range[1], xScale.step())
            const period = domain[d3.bisect(rangePoints, xPos) - 1];
            const province = dataMarker.properties.name
            const dataRowsFilteredByProvinceByPeriod = dataRows.filter(d => d.Province === dataMarker.properties.name && d.Period === period)
            const dataNestCities = d3
                .nest()
                .key(d => d.City)
                .rollup(d => d.length)
                .entries(dataRowsFilteredByProvinceByPeriod)
                .sort((a, b) => d3.descending(a.value, b.value))
            console.log("dataNestCities", dataNestCities)
            const overalSum = d3.sum(d3.map(dataNestCities, d => d.value).keys())
            svg
                .select("line.tooltip-line")
                .attr('x1', xPos)
                .attr('x2', xPos)
                .attr('y1', 0)
                .attr('y2', _HEIGHT)
            //.attr('stroke', "black")

            d3
                .select("#d3LineChart-tooltip")
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px")
                //.style("display", "inline-block")
                .html(`<div class="text-start">
                    <div>Movies made in ${period}</div>
                    <div>at ${province}</div>
                    <br />
                    <div>- ${dataNestCities[0].key}: ${dataNestCities[0].value}</div>
                    <div>- ${dataNestCities[1].key}: ${dataNestCities[1].value}</div>
                    <div>- ${dataNestCities[2].key}: ${dataNestCities[2].value}</div>
                    <br />
                    <div><b>Overall: ${overalSum}</b></div>
                </div>`)
        })



    // Update/redraw table
    update(dataRows)
}