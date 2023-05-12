export default {
	/**
	 * 合并相同数据，导出合并列所需的方法(只适合el-table)
	 * @param {Object} tableData
	 * @param {Object} rowspanArray
	 */
	getRowSpanData(tableData, rowspanArray) {
		/**
		 * 要合并列的数据
		 */
		const rowspanNumObject = {};
		//初始化 rowspanNumObject
		rowspanArray.map(item => {
			rowspanNumObject[item] = new Array(tableData.length).fill(1, 0, 1).fill(0, 1);
			rowspanNumObject[`${item}-index`] = 0;
		});
		//计算相关的合并信息
		let idx = 0
		for (let i in tableData) {
			rowspanArray.map(key => {
				const index = rowspanNumObject[`${key}-index`];
				let lastRowIndex = 1
				if (!tableData[i - lastRowIndex] && i - idx > lastRowIndex) {
					for (lastRowIndex = 1; lastRowIndex <= (i - idx); lastRowIndex++) {
						if (tableData[i - lastRowIndex]) {
							break
						}
					}
				}
				if ((tableData[i] && tableData[i - lastRowIndex]) && tableData[i][key] === tableData[i - lastRowIndex][key]) {
					rowspanNumObject[key][index]++;
				} else {
					rowspanNumObject[`${key}-index`] = idx;
					rowspanNumObject[key][idx] = 1;
				}
			});
			idx++
		}
		return rowspanNumObject
	},
	/**
	 * 合并方法
	 * @param rowspanArray 要合并列数组
	 * @param rowspanNumObject 要合并列的数据
	 * @param row
	 * @param column
	 * @param rowIndex
	 * @param columnIndex
	 * @returns {{colspan: number, rowspan: *}|{colspan: number, rowspan: number}}
	 */
	spanMethod(rowspanArray, rowspanNumObject, {row, column, rowIndex, columnIndex}) {
		if (typeof column != 'undefined' && rowspanArray.includes(column['property'])) {
			const rowspan = rowspanNumObject[column['property']][rowIndex];
			if (rowspan > 0) {
				return {rowspan: rowspan, colspan: 1}
			}
			return {rowspan: 0, colspan: 0}
		}
		return {rowspan: 1, colspan: 1}
	},
}
