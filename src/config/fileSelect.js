import API from "@/api";

//文件选择器配置

export default {
	apiObj: API.file.upload,
	menuApiObj: API.file.fileCategory.tree,
	listApiObj: API.file.fileDetail.list,
	successCode: 200,
	maxSize: 30,
	max: 100,
	uploadParseData: function (res) {
		return {
			id: res.data.id,
			fileName: res.data.name || res.data.fileName,
			url: res.data.url || res.data.src
		}
	},
	listParseData: function (res) {
		return {
			data: res.data,
			rows: res.data.records || res.data.rows,
			total: res.data.total,
			msg: res.message || res.msg,
			code: res.code
		}
	},
	request: {
		page: 'current', // page
		pageSize: 'size', // pageSize
		keyword: 'keyword',
		menuKey: 'categoryId', // groupId
	},
	menuProps: {
		key: 'id',
		label: 'name', // label
		children: 'children'
	},
	fileProps: {
		key: 'id',
		fileName: 'name', // fileName
		url: 'url'
	},
	files: {
		doc: {
			icon: 'sc-icon-file-word-2-fill',
			color: '#409eff'
		},
		docx: {
			icon: 'sc-icon-file-word-2-fill',
			color: '#409eff'
		},
		xls: {
			icon: 'sc-icon-file-excel-2-fill',
			color: '#67C23A'
		},
		xlsx: {
			icon: 'sc-icon-file-excel-2-fill',
			color: '#67C23A'
		},
		ppt: {
			icon: 'sc-icon-file-ppt-2-fill',
			color: '#F56C6C'
		},
		pptx: {
			icon: 'sc-icon-file-ppt-2-fill',
			color: '#F56C6C'
		}
	}
}
