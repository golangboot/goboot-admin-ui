<!--
 * @Descripttion: 异步选择器
 * @version: 1.1
 * @Author: sakuya
 * @Date: 2021年8月3日15:53:37
 * @LastEditors: sakuya
 * @LastEditTime: 2023年2月23日15:17:24
-->

<template>
	<div class="sc-select">
		<div v-if="initLoading" class="sc-select-loading">
			<el-icon class="is-loading"><el-icon-loading /></el-icon>
		</div>
		<el-select v-bind="$attrs" :loading="loading" @visible-change="visibleChange">
			<el-option v-for="item in options" :key="item[props.value]" :label="item[props.label]" :value="objValueType ? item : item[props.value]">
				<slot name="option" :data="item"></slot>
			</el-option>
		</el-select>
	</div>
</template>

<script>
	import config from "@/config/select";

	export default {
		props: {
			apiObj: { type: Object, default: () => {} },
			dict: { type: String, default: "" },
			dictType: { type: String, default: "STRING" },
			objValueType: { type: Boolean, default: false },
			params: { type: Object, default: () => ({}) },
			defaultOptions: { type: Object, default: () => ({}) },
		},
		data() {
			return {
				dictParams: this.params,
				loading: false,
				options: [],
				props: config.props,
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
				if(isOpen && this.options.length==0 && (this.dict || this.apiObj)){
					this.getRemoteData()
				}
			},
			//获取数据
			async getRemoteData(){
				this.loading = true
				this.dictParams[config.request.name] = this.dict
				var res = {}
				if(this.apiObj){
					res = await this.apiObj.get(this.params)
				}else if(this.dict){
					res = await config.dictApiObj.get(this.dictParams)
				}
				var response = config.parseData(res)
				// this.options = response.data
				let items = response.data
				this.options = []
				items.forEach(item => {
					let label = item[this.props.label]
					let value = item[this.props.value]
					// 数据类型处理
					let dictType = String(this.dictType).toUpperCase();
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
					this.options.push({
						[this.props.label]: label,
						[this.props.value]: value,
					})
				})
				if (this.options.length <= 0){
					this.options = this.defaultOptions
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
