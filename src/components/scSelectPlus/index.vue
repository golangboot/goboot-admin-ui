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
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
			>
				<slot name="option" :data="item"></slot>
			</el-option>
		</el-select>
	</div>
</template>

<script>
	export default {
		props: {
			// api接口
			apiObj: { type: Object, default: () => {} },
			// 搜索参数(搜索关键词为空时生效)
			params: { type: Object, default: () => ({}) },
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
		},
		data() {
			return {
				loading: false,
				options: [],
				initLoading: false
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
				let reqData = {}
				// console.log('query',query)
				if (query){
					reqData[this.props.keyword] = query
				}else {
					reqData = this.params
				}
				// console.log('reqData',reqData)
				var res = await this.apiObj.get(reqData)
				var response = this.parseData(res)
				let items =  response.data
				this.options = []
				items.forEach(item => {
					/*this.options.push({
						label: item[this.props.label],
						value: item[this.props.value],
					})*/
					this.options.push(this.parseDataField(item))
					/*let option = this.parseDataField(item)
					console.log('label', option.label)
					console.log('value', option.value)
					this.options.push({
						label:  option.label,
						value:  option.value,
					})*/
				})
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
