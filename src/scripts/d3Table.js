import d3Legend from 'd3-svg-legend';
let listFilter = []

/**
 * Draw a table
 * @date 2021-06-19
 * @param {any} dataRows - A array of all rows
 * @returns {any}
 */
export const draw = (dataRows) => {
    // Append table and style
    const height = 640
    const table = d3
        .select("#d3Table")
        .attr("class", "shadow-sm w-100")
        .append("div")
        .attr("class", "position-relative overflow-auto")
        .style("height", height + "px")
        .append('table')
        .attr('class', 'table table-sm table-striped')

    // table header
    table
        .append("thead")
        .attr('class', 'thead-dark')
        .append("tr")
        .selectAll("th")
        .data(d => ["Title", "Genre", "Language", "Province"])
        //.data(headerList)
        .enter()
        .append("th")
        .text(function (d) {
            return d;
        })
        .attr("class", "text-start")

    // table body
    table
        .append("tbody")

    // Append filter        
    d3
        .select("#d3TableFilter")
        .append("svg")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")

    // Draw table
    update(dataRows)
}

export const update = (dataRows) => {
    const tableBody = d3.select("#d3Table table tbody")
    const dataRowsAfterFilter = dataRows.filter(row => listFilter.length < 1 || listFilter.includes(row.Genre))

    tableBody
        .selectAll("tr")
        .remove()
    tableBody
        .selectAll("tr")
        .data(dataRowsAfterFilter)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(d => [d.Title, d.Genre, d.Language, d.Province])
        .enter()
        .append("td")
        .on("mouseover", function () {
            d3
                .select(this.parentNode)
                .attr("class", "bg-light cursor-pointer")
        })
        .on("mouseout", function () {
            d3
                .select(this.parentNode)
                .attr("role", "")
                .attr("class", "");
        })
        .text(d => d)
        .attr("class", "text-start")

    // Draw filter tags
    var offserHeight = 0
    var offsetWidth = 0
    d3
        .select("#d3TableFilter svg")
        .selectAll("g.tag")
        .remove()
    d3
        .select("#d3TableFilter svg")
        .selectAll("g.tag")
        .data(listFilter)
        .enter()
        .append("g")
        .attr("class", "tag")
        .attr("font-size", "smaller")
        .each(function (key, i) {
            const tagG = d3.select(this);
            const parentWidth = d3.select(this.parentNode).node().getBoundingClientRect().width
            const tagText = tagG
                .append("text")
                .attr("x", 0)
                .attr("y", 15)
                .text(d => "❌ " + d)
            const textWidth = tagText.node().getBBox().width + 26
            if (offsetWidth + textWidth > parentWidth) {
                offsetWidth = 0
                offserHeight += 26
            }
            tagG
                .attr("transform", function (d, i) {
                    return `translate(${offsetWidth}, ${offserHeight})`;
                })
                .append("rect")
                .attr("fill", "#33333388")
                .attr("width", 18)
                .attr("height", 20)
                .attr("class", "cursor-pointer")
                .on("click", function (d) {
                    listFilter = listFilter.filter(lf => lf != d)
                    update(dataRows)
                })
            offsetWidth += textWidth
        })

    // Update footer
    d3
        .select("#d3TableFooter")
        .attr("class", "text-end mt-2")
        .text(dataRowsAfterFilter.length + " records")

}

export const updateFilter = (dataRows, dataFilter) => {
    // Update data
    listFilter.push(dataFilter)
    listFilter = d3.map(listFilter, lf => lf).keys()

    // Update/redraw table
    update(dataRows)
}