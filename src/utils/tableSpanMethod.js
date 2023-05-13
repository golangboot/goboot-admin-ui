/**
 * 参考代码(待作废)
 * 合并相同数据，导出合并列所需的方法(只适合el-table)
 * @param {Object} data
 * @param {Object} rowspanArray
 */
export function getRowspanMethod(data, rowspanArray) {

	/**
	 * 要合并列的数据
	 */
	const rowspanNumObject = {};

	//初始化 rowspanNumObject
	rowspanArray.map(item => {
		rowspanNumObject[item] = new Array(data.length).fill(1, 0, 1).fill(0, 1);
		rowspanNumObject[`${item}-index`] = 0;
	});
	//计算相关的合并信息
	let idx = 0
	for (let i in data) {
		rowspanArray.map(key => {
			const index = rowspanNumObject[`${key}-index`];
			// while (i - idx > lastRowIndex && !data[i - lastRowIndex]) {}
			let lastRowIndex = 1
			if (!data[i - lastRowIndex] && i - idx > lastRowIndex){
				// console.log(`getRowspanMethod.i => idx: ${i} => ${idx}`)
				for (lastRowIndex = 1; lastRowIndex <= (i - idx); lastRowIndex++) {
					// console.log(`getRowspanMethod.i => idx: ${i} => ${idx}`)
					if (data[i - lastRowIndex]){
						// console.log(`getRowspanMethod.i => lastRowIndex: ${i} => ${lastRowIndex}`)
						// console.log('getRowspanMethod.data.lastRow:', data[i - lastRowIndex])
						break
					}
				}
			}
			if ((data[i] && data[i - lastRowIndex]) && data[i][key] === data[i - lastRowIndex][key]) {
				rowspanNumObject[key][index]++;
			} else {
				rowspanNumObject[`${key}-index`] = idx;
				rowspanNumObject[key][idx] = 1;
			}
		});
		idx++
	}
	/*for (let i = 1; i < data.length; i++) {
		rowspanArray.map(key => {
			const index = rowspanNumObject[`${key}-index`];
			if ((data[i] && data[i - 1]) && data[i][key] === data[i - 1][key]) {
				rowspanNumObject[key][index]++;
			} else {
				rowspanNumObject[`${key}-index`] = i;
				rowspanNumObject[key][i] = 1;
			}
		});
	}*/
	// console.log('getRowspanMethod.rowspanArray:', rowspanArray)
	// console.log('getRowspanMethod.rowspanNumObject:', rowspanNumObject)
	//提供合并的方法并导出
	// eslint-disable-next-line
	const spanMethod = function ({row, column, rowIndex, columnIndex}) {
		// console.log('getRowspanMethod.rowspanArray:', rowspanArray)
		// console.log('getRowspanMethod.column:', column)
		if (typeof column != 'undefined' && rowspanArray.includes(column['property'])) {
			const rowspan = rowspanNumObject[column['property']][rowIndex];
			if (rowspan > 0) {
				return {rowspan: rowspan, colspan: 1}
			}
			return {rowspan: 0, colspan: 0}
		}
		return {rowspan: 1, colspan: 1}
	};

	return spanMethod;
}
