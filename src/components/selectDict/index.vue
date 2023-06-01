<!--
 * @Descripttion: 字典选择器
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
    <!-- 添加属性: allow-create default-first-option filterable 可直接回车键入 -->
		<el-select
			v-bind="$attrs"
			:loading="loading"
			@visible-change="visibleChange"
      ref="select"
		>
			<el-option
				v-for="(item, index) in options"
				:key="index"
				:label="item[props.label]"
				:value="objValueType ? item : item[props.value]"
			>
				<slot name="option" :data="item">
          <el-row>
            <el-col :span="24">
              <span style="display: flex;align-items: center;justify-content: space-between;">
                {{ item[props.label] }}
                <el-tooltip v-if="item[props.tips] && item[props.tips] !== ''" effect="light">
                  <template #content>
                    <span style="max-width: 50%;line-height: 2;color: var(--el-color-info);">
                      {{ item[props.tips] }}
                    </span>
                  </template>
                  <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-info-filled /></el-icon>
                  <!--<el-icon class="sc-statistic-tips" style="margin-left: .5rem;"><el-icon-question-filled/></el-icon>-->
                </el-tooltip>
              </span>
            </el-col>
          </el-row>
        </slot>
			</el-option>
		</el-select>
  </div>
</template>

<script>
	import API from "@/api";

	export default {
		name: "selectDict",
		props: {
			// api接口
			apiObj: {
				type: Object, default: () => {
					return API.platform.sys.dict.getDictItemList
				}
			},
			params: { type: Object, default: () => ({}) },
			request: {
				type: Object, default: () => {
					return {
						name: 'code',					//规定搜索字段
					}
				}
			},
			// 属性字段
			props: {
				type: Object, default: () => {
					return {
						// label: 'label',		//映射label显示字段
						label: 'name',				//映射label显示字段
						value: 'value',				//映射value值字段
						type: 'type',					//映射type值字段
            tips: 'description',	//映射tips值字段
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
			dict: { type: String, default: "" },
			dictType: { type: String, default: "" },
			objValueType: { type: Boolean, default: false },
		},
		computed: {
			/*isDictSelect() {
				return this.dict && this.dict !== ''
			},*/
		},
    /*watch: {
      '$attrs.modelValue': {
        // eslint-disable-next-line
        handler(newValue, oldValue){
          // console.log('selectDict -> $attrs.modelValue:', newValue, oldValue)
          if (newValue && newValue !== oldValue){
            // this.selectChange(newValue);
            // console.log('selectDict -> select:', this.$refs.select)
            // console.log('selectDict -> select:', this.$refs.select.selected)
          }
        },
        deep: true
      },
    },*/
		data() {
			return {
				loading: false,
				options: [],
				initLoading: false,
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
			async getRemoteData(){
				this.loading = true
				let reqData = this.params
				reqData[this.request.name] = this.dict
				let res = await this.apiObj.get(reqData)
				let response = this.parseData(res)
				let items = response.data
				let options = []
				items.forEach(item => {
					let label = item[this.props.label]
					let value = item[this.props.value]
					let type = item[this.props.type]
					let tips = item[this.props.tips]
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
						[this.props.label]: label,
						[this.props.value]: value,
						[this.props.type]: type,
						[this.props.tips]: tips,
					})
				})
				if (options.length <= 0){
					if (this.defaultOptions && this.defaultOptions.length > 0){
						options = this.defaultOptions
					}
				}
				this.options = options
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
	.sc-select {display: inline-flex;position: relative;align-items: center;}
	.sc-select-loading {position: absolute;top:0;left:0;right:0;bottom:0;background: #fff;z-index: 100;border-radius: 5px;border: 1px solid #EBEEF5;display: flex;align-items: center;padding-left:10px;}
	.sc-select-loading i {font-size: 14px;}

	.dark .sc-select-loading {background: var(--el-bg-color-overlay);border-color: var(--el-border-color-light);}
</style>
