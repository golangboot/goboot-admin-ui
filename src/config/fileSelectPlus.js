import API from "@/api";

//文件选择器配置

export default {
	apiObj: API.common.upload,
	menuApiObj: API.common.file.menu,
	listApiObj: API.common.file.list,
	successCode: 200,
	maxSize: 1024,
	max: 1000,
	rowCol: 6,
	pageSize: 12,
	uploadParseData: function (res) {
		return {
			id: res.data.id,
			fileName: res.data.name || res.data.fileName,
			url: res.data.url || res.data.src,
			type: res.data.type,
			suffix: res.data.suffix,
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
		url: 'url',
		type: 'type',
		suffix: 'suffix',
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
		},
		mp4: {
			icon: 'el-icon-video-play',
			color: '#409eff'
		},
		mp3: {
			icon: 'el-icon-microphone',
			color: '#67C23A'
		},
		unknown: {
			icon: 'el-icon-document',
			color: '#409eff'
		},
	}
}
