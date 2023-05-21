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
			<el-icon class="is-loading">
				<el-icon-loading/>
			</el-icon>
		</div>
		<el-select
			v-bind="$attrs"
			remote
			:reserve-keyword="false"
			placeholder="请输入关键字搜索"
			:remote-method="getRemoteData"
			:loading="loading"
			remote-show-suffix
			clearable
			filterable
			@visible-change="visibleChange"
		>
			<el-option
				v-for="(item, index) in options"
				:key="`${index}-${item[props.value]}`"
				:label="item[props.label]"
				:value="item[props.value]"
			>
				<slot name="option" :data="item"></slot>
			</el-option>
		</el-select>
	</div>
</template>

<script>
export default {
	name: "selectRemote",
	props: {
		// api接口
		apiObj: {
			type: Object, default: () => {
			}
		},
		// 参数
		params: {type: Object, default: () => ({})},
		// 搜索清理参数字段列表
		searchClearParams: {
			type: Array,
			default: () => []
		},
		request: {
			type: Object, default: () => {
				return {
					name: 'keyword',					//规定搜索字段
				}
			}
		},
		// 属性字段
		props: {
			type: Object, default: () => {
				return {
					label: 'label',
					value: 'value',
				}
			}
		},
		// 解析数据
		parseData: {
			type: Function, default: (res) => {
				return {
					data: res.data?.records || res.data,
					msg: res.message,
					code: res.code
				}
			}
		},
		// 解析数据字段
		parseDataField: {type: Function, default: null},
		/*parseDataField: {
			type: Function, default: (item) => {
				return {
					label: item.name,
					value: item.id,
				}
			}
		},*/
		/*
		// 解析数据
		parseData: function (res) {
			return {
				data: res.data?.records || res.data,
				msg: res.message,
				code: res.code
			}
		},
		// 解析数据字段
		parseDataField: function (item) {
			return {
				label: item.username || item.nickname || item.mobile || item.email,
				value: item.id,
			}
		},
		*/
	},
	computed: {},
	data() {
		return {
			loading: false,
			options: [],
			initLoading: false,
		}
	},
	/*watch: {
		'$attrs.modelValue': {
			// eslint-disable-next-line
			handler(newValue, oldValue){
				console.log('selectRemote -> $attrs.modelValue:', newValue, oldValue)
				if (newValue && newValue !== oldValue){}
			},
			deep: true
		},
	},*/
	created() {
		//如果有默认值就去请求接口获取options
		if (this.hasValue()) {
			this.initLoading = true
			this.getRemoteData()
		}
	},
	methods: {
		//选项显示隐藏事件
		visibleChange(isOpen) {
			if (isOpen && this.options.length == 0 && (this.apiObj)) {
				this.getRemoteData()
			} else if (isOpen) {
				this.getRemoteData()
			}
		},
		//获取数据
		async getRemoteData(query) {
			this.loading = true

			// 远程搜索
			let reqData = this.params
			// console.log('query',query)
			if (typeof query != 'undefined') {
				if (this.searchClearParams && this.searchClearParams.length > 0) {
					this.searchClearParams.forEach(key => {
						if (reqData[key]) {
							delete reqData[key]
						}
					})
				}
				reqData[this.request.name] = query
			}
			// console.log('reqData',reqData)
			let res = await this.apiObj.get(reqData)
			let response = this.parseData(res)
			let items = response.data
			let options = []
			if (items && items.length > 0) {
				items.forEach(item => {
					if (this.parseDataField) {
						options.push(this.parseDataField(item))
					} else {
						options.push({
							[this.props.label]: item[this.props.label],
							[this.props.value]: item[this.props.value],
						})
					}
				})
			}
			this.options = options
			// console.log('options', this.options)
			this.loading = false
			this.initLoading = false
		},
		//判断是否有回显默认值
		hasValue() {
			if (Array.isArray(this.$attrs.modelValue) && this.$attrs.modelValue.length <= 0) {
				return false
			} else if (this.$attrs.modelValue) {
				return true
			} else if (typeof (this.$attrs.modelValue) != 'undefined') {
				return true
			} else {
				return false
			}
		}
	}
}
</script>

<style scoped>
.sc-select {
	display: inline-block;
	position: relative;
}

.sc-select-loading {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #fff;
	z-index: 100;
	border-radius: 5px;
	border: 1px solid #EBEEF5;
	display: flex;
	align-items: center;
	padding-left: 10px;
}

.sc-select-loading i {
	font-size: 14px;
}

.dark .sc-select-loading {
	background: var(--el-bg-color-overlay);
	border-color: var(--el-border-color-light);
}
</style>
