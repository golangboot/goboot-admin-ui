<!--
 * @Descripttion: 异步选择器Plus
 * @version: 1.0.0
 * @Author: 鸿宇
 * @Date: 2023年5月1日10:53:38
 * @LastEditors: 鸿宇
 * @LastEditTime: 2023年5月1日10:53:38
-->

<template>
	<div class="sc-select">
		<div v-if="initLoading" class="sc-select-loading">
			<el-icon class="is-loading"><el-icon-loading /></el-icon>
		</div>
		<el-select
			v-bind="$attrs"
			remote
			reserve-keyword
			placeholder="请输入关键词搜索"
			:remote-method="getRemoteData"
			:loading="loading"
			remote-show-suffix
			clearable
			filterable
			@visible-change="visibleChange"
		>
			<el-option
				v-for="(item, index) in options"
				:key="index"
				:label="isDictSelect ? item[dictConfig.props.label] : item.label"
				:value="isDictSelect ? item[dictConfig.props.value] : item.value"
			>
				<slot name="option" :data="item"></slot>
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import API from "@/api";

	export default {
		name: "selectRemote",
		props: {
			// api接口
			apiObj: { type: Object, default: () => {} },
			// 参数(搜索关键字为空时生效)
			params: { type: Object, default: () => ({}) },
			// 搜索参数(搜索关键字不为空时生效)
			search: { type: Object, default: () => ({}) },
			// 属性字段
			props: {
				type: Object, default: () => {
					return {
						// 搜索字段
						keyword: 'keyword',
					}
				}
			},
			// 解析数据
			parseData: {
				type: Function, default: (res) => {
					return {
						data: res.data.records || res.data,
						msg: res.message,
						code: res.code
					}
				}
			},
			// 解析数据字段
			parseDataField: {
				type: Function, default: (item) => {
					return {
						label: item.name,
						value: item.id,
					}
				}
			},
			dict: { type: String, default: "" },
			dictType: { type: String, default: "" },
			objValueType: { type: Boolean, default: false },
			defaultOptions: { type: Object, default: () => ({}) },
			dictConfig: {
				type: Object, default: () => {
					return {
						dictApiObj: API.system.dict.getDictList,		//获取字典接口对象
						parseData: function (res) {
							return {
								data: res.data || res.data.records,				//分析行数据字段结构
								msg: res.message,			//分析描述字段结构
								code: res.code				//分析状态字段结构
							}
						},
						request: {
							name: 'code',					//规定搜索字段
						},
						props: {
							label: 'label',					//映射label显示字段
							value: 'value',					//映射value值字段
							type: 'type',					//映射type值字段
						}
					}
				}
			},
		},
		computed: {
			isDictSelect() {
				return this.dict && this.dict !== ''
			},
		},
		data() {
			return {
				loading: false,
				options: [],
				initLoading: false,
				dictParams: this.params,
			}
		},
		created() {
			//如果有默认值就去请求接口获取options
			if(this.hasValue()){
				this.initLoading = true
				this.getRemoteData()
			}
		},
		methods: {
			//选项显示隐藏事件
			visibleChange(isOpen){
				if(isOpen && this.options.length==0 && (this.apiObj)){
					this.getRemoteData()
				}
			},
			//获取数据
			async getRemoteData(query){
				this.loading = true
				if (this.apiObj) {
					// 远程搜索
					let reqData = {}
					// console.log('query',query)
					if (query){
						reqData[this.props.keyword] = query
						Object.assign(reqData, this.search)
					}else {
						reqData = this.params
					}
					// console.log('reqData',reqData)
					let res = await this.apiObj.get(reqData)
					let response = this.parseData(res)
					let items =  response.data
					let options = []
					items.forEach(item => {
						/*options.push({
							label: item[this.props.label],
							value: item[this.props.value],
						})*/
						options.push(this.parseDataField(item))
						/*let option = this.parseDataField(item)
						console.log('label', option.label)
						console.log('value', option.value)
						options.push({
							label:  option.label,
							value:  option.value,
						})*/
					})
					this.options = options
				} else if (this.isDictSelect) {
					// 字典搜索
					let res = {}
					this.dictParams[this.dictConfig.request.name] = this.dict
					res = await this.dictConfig.dictApiObj.get(this.dictParams)
					let response = this.dictConfig.parseData(res)
					let items = response.data
					let options = []
					items.forEach(item => {
						let label = item[this.dictConfig.props.label]
						let value = item[this.dictConfig.props.value]
						let type = item[this.dictConfig.props.type]
						if (this.dictType && this.dictType !== ''){
							type = this.dictType
						}
						// 数据类型处理
						let dictType = String(type).toUpperCase();
						switch(dictType)
						{
							case "INTEGER" || "INT" || "LONG":
								// value = Number(value)
								value = parseInt(value)
								break;
							case "FLOAT" || "DOUBLE"  || "DECIMAL" || "BIG_DECIMAL":
								value = parseFloat(value)
								break;
							case "BOOLEAN":
								value = Boolean(value)
								break;
							default:
								value = String(value)
						}
						options.push({
							[this.dictConfig.props.label]: label,
							[this.dictConfig.props.value]: value,
						})
					})
					if (options.length <= 0 && (this.defaultOptions && this.defaultOptions.length > 0)){
						options = this.defaultOptions
					}
					this.options = options
				}
				// console.log('options', this.options)
				this.loading = false
				this.initLoading = false
			},
			//判断是否有回显默认值
			hasValue(){
				if(Array.isArray(this.$attrs.modelValue) && this.$attrs.modelValue.length <= 0){
					return false
				}else if(this.$attrs.modelValue){
					return true
				}else if(typeof(this.$attrs.modelValue) != 'undefined'){
					return true
				}else{
					return false
				}
			}
		}
	}
</script>

<style scoped>
	.sc-select {display: inline-block;position: relative;}
	.sc-select-loading {position: absolute;top:0;left:0;right:0;bottom:0;background: #fff;z-index: 100;border-radius: 5px;border: 1px solid #EBEEF5;display: flex;align-items: center;padding-left:10px;}
	.sc-select-loading i {font-size: 14px;}

	.dark .sc-select-loading {background: var(--el-bg-color-overlay);border-color: var(--el-border-color-light);}
</style>
