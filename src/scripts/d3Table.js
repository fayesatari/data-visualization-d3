/**
 * Draw a table
 * @date 2021-06-19
 * @param {any} dataRows - A array of all rows
 * @returns {any}
 */
export const draw = (dataRows) => {
    // Add table and style
    const table = d3
        .select("#d3Table")
        .attr("class", "shadow-sm w-100")
        .append('table')
        .attr('class', 'table table-sm table-striped')

    // headers
    table
        .append("thead")
        .attr('class', 'thead-dark')
        .append("tr")
        .selectAll("th")
        .data(d => [dataRows[0][6], dataRows[0][8], dataRows[0][7], dataRows[0][4]])
        //.data(dataRows[0])
        .enter()
        .append("th")
        .text(function (d) { return d; })

    // data
    table
        .append("tbody")
        .selectAll("tr")
        .data(dataRows.slice(1))
        .enter()
        .append("tr")
        .selectAll("td")
        .data(d => [d[6], d[8], d[7], d[4]])
        .enter().append("td")
        .on("mouseover", function () {
            d3
                .select(this.parentNode)
                .attr("role", "button")
                .attr("class", "bg-light")
        })
        .on("mouseout", function () {
            d3
                .select(this.parentNode)
                .attr("role", "")
                .attr("class", "");
        })
        .text(function (d) { return d; })
}
