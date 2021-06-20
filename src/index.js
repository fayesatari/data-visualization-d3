'use strict'

import * as helper from './scripts/helper.js'
import * as d3Table from './scripts/d3Table.js'
import * as d3Stack from './scripts/d3Stack.js'


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
		d3
			.text('telefilmCanada.csv')
			.then((dataText) => {
				// Read data and save in dataRow
				const dataRows = d3
					.csvParse(dataText)
				//.slice(0, 20)
				console.log("dataRows", dataRows)

				// Draw objects
				d3Table.draw(d3
					.csvParseRows(dataText)
					.slice(0, 20))
				d3Stack.draw(dataRows)
			})
	}
})(d3)
