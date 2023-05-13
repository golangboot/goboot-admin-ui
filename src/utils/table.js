export default {
	objectSpanMethod(tableRowSpanArray, tableRowSpanNumObject, {row, column, rowIndex, columnIndex}) {
		return this.mergeTableSpanMethod(tableRowSpanArray, tableRowSpanNumObject, {row, column, rowIndex, columnIndex})
	},
	/**
	 * 合并相同数据，导出合并列所需的方法(只适合el-table)
	 * @param {Object} tableData 表格数据
	 * @param {Object} rowSpanArray ['颜色', '内存', '运营商']
	 */
	getTableRowSpanData(tableData, rowSpanArray) {
		/**
		 * 要合并列的数据
		 */
		let rowSpanNumObject = {};
		//初始化 rowSpanNumObject
		rowSpanArray.map(item => {
			rowSpanNumObject[item] = new Array(tableData.length).fill(1, 0, 1).fill(0, 1);
			rowSpanNumObject[`${item}-index`] = 0;
		});
		//计算相关的合并信息
		let idx = 0
		for (let i in tableData) {
			rowSpanArray.map(key => {
				const index = rowSpanNumObject[`${key}-index`];
				let lastRowIndex = 1
				// 防止表格数据key不是连续的
				if (!tableData[i - lastRowIndex] && i - idx > lastRowIndex) {
					for (lastRowIndex = 1; lastRowIndex <= (i - idx); lastRowIndex++) {
						if (tableData[i - lastRowIndex]) {
							break
						}
					}
				}
				if ((tableData[i] && tableData[i - lastRowIndex]) && tableData[i][key] === tableData[i - lastRowIndex][key]) {
					rowSpanNumObject[key][index]++;
				} else {
					rowSpanNumObject[`${key}-index`] = idx;
					rowSpanNumObject[key][idx] = 1;
				}
			});
			idx++
		}
		return rowSpanNumObject
	},
	/**
	 * 合并方法
	 * @param rowSpanArray 要合并列的数据
	 * @param rowSpanNumObject 要合并列的数据
	 * @param row
	 * @param column
	 * @param rowIndex
	 * @param columnIndex
	 * @returns {{colspan: number, rowspan: *}|{colspan: number, rowspan: number}}
	 */
	// eslint-disable-next-line
	mergeTableSpanMethod(rowSpanArray, rowSpanNumObject, {row, column, rowIndex, columnIndex}) {
		if (typeof column != 'undefined' && rowSpanArray.includes(column['property'])) {
			let rowSpan = rowSpanNumObject[column['property']][rowIndex];
			if (rowSpan > 0) {
				return {rowspan: rowSpan, colspan: 1}
			}
			return {rowspan: 0, colspan: 0}
		}
		return {rowspan: 1, colspan: 1}
	},
}
