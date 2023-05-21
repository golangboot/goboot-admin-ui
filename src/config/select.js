import API from "@/api";

//字典选择器配置

export default {
	dictApiObj: API.platform.sys.dict.getDictItemList,		//获取字典接口对象
	parseData: function (res) {
		return {
			data: res.data?.records || res.data,				//分析行数据字段结构
			msg: res.message,			//分析描述字段结构
			code: res.code				//分析状态字段结构
		}
	},
	request: {
		// name: 'name',					//规定搜索字段
		name: 'code',
	},
	props: {
		label: 'label',					//映射label显示字段
		value: 'value',					//映射value值字段
		type: 'type',					//映射type值字段
	}
}
