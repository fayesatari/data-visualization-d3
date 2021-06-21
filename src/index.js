'use strict'

import * as helper from './scripts/helper.js'
import * as d3Table from './scripts/d3Table.js'
import * as d3Stack from './scripts/d3Stack.js'
import * as d3Map from './scripts/d3Map.js'
import * as d3Sankey from './scripts/d3Sankey.js'
import * as d3Bar from './scripts/d3Bar.js'



/**
 * @file This file is the entry-point for the the code
 * @version v1.0.0
 */
(function (d3) {
	//const svgSize = { width: 800, height: 600 }
	build()

	/**
	 * This function builds the graph.
	 * @date 2021-06-19
	 * @returns {any}
	 */
	function build() {
		console.log("1- Reading csv")
		d3
			.text('telefilmCanada.csv')
			.then((dataText) => {
				// Read data and save in dataRow
				const dataRows = d3.csvParse(dataText)
				console.log("2- The csv data", dataRows)
				console.log("3- Loading visualization", dataRows)

				// Draw objects
				d3Table.draw(d3.csvParseRows(dataText).slice(0, 20))
				d3Stack.draw(dataRows)
				d3Map.draw(dataRows)
				d3Sankey.draw(dataRows)
				d3Bar.draw(dataRows)
			})
	}
})(d3)
