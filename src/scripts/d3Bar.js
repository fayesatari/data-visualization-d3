export const draw = (dataRows) => {
    const width = 640
    const height = 800
    const speed = 1000
    const margin = {
        top: 10,
        left: 70,
        bottom: 180,
        right: 20,
    }

    // Draw BarChart
    // ===================================
    const svg = d3
        .select("#d3Bar")
        .attr("class", "shadow-sm w-100")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // svg
    //     .append("g")
    //     .selectAll("g")
    //     .data(series)
    //     .join("g")
    //     .attr("fill", d => z(d.key))
    //     .selectAll("rect")
    //     .data(d => d)
    //     .join("rect")
    //     .attr("x", d => x(d[0]))
    //     .attr("y", d => y(d.data.key))
    //     .attr("width", d => x(d[1]) - x(d[0]))
    //     .attr("height", y.bandwidth())
    //     .attr("role", "button")
    //     .on("mousemove", function (d) {
    //         const dataParent = d3.select(this.parentNode).datum()
    //         const genre = dataParent.key
    //         const period = d.data.key
    //         const qty = d.data.values.find(v => v.key === genre).value
    //         // Show Tooltip
    //         tooltip.style("left", d3.event.pageX + "px");
    //         tooltip.style("top", d3.event.pageY - 90 + "px");
    //         tooltip.style("display", "inline-block");
    //         tooltip.html(`<div>Number of movie in</div><div><b>${genre}</b> at <b>${period}</b>:</div><b>${qty}</b>`);

    //         // Highlight this rect
    //         svg
    //             .selectAll("rect")
    //             .style("opacity", 0.6)
    //         d3
    //             .select(this.parentNode)
    //             .selectAll("rect")
    //             .style("opacity", 1)
    //     })
    //     .on("mouseout", function (d) {
    //         // Hide Tooltip
    //         tooltip.style("display", "none");

    //         // Normal opacity
    //         svg
    //             .selectAll("rect")
    //             .style("opacity", 1)
    //     })

    // X-Axis
    // ===================================
    // svg
    //     .append("g")
    //     .attr("transform", `translate(0, ${height - margin.bottom})`)
    //     .transition()
    //     .duration(speed)
    //     .call(d3.axisBottom(x))

    // Y-Axis
    // ===================================
    // svg
    //     .append("g")
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .transition()
    //     .duration(speed)
    //     .call(d3.axisLeft(y))

    // Legend
    // ===================================
    // const legend = d3Legend
    //     .legendColor()
    //     //.title("Legend")
    //     .orient('horizontal')
    //     .shape('circle')
    //     .scale(z)
    //     .labelAlign("start")
    //     .shapePadding(5)

    // svg
    //     .append("g")
    //     .attr("transform", `translate(20, ${height - margin.bottom + 50})`)
    //     .call(legend)
    // svg
    //     .selectAll(".legendCells text")
    //     .style("font-size", "9px")
    //     .attr("transform", "translate(-4,14) rotate(90)")
}
