<template>
	<div class="sku-container">
		<div class="sku-header"></div>
		<div v-if="!disabled" class="sku-check">
			<div v-if="theme == 1 || theme == 3" :class="'theme-' + theme">
				<el-card v-for="(item, index) in sourceAttributes" :key="index" class="item" shadow="never">
					<template v-slot:header>
						<div>{{ item.label }}</div>
					</template>
					<el-checkbox v-for="(item2, index2) in item.children" :key="index2" v-model="item2.checked" :label="item2.label" size="default" />
					<el-input v-if="item.canAddAttribute" v-model="item.addAttribute" size="default" placeholder="请输入规格名称" class="add-attr" clearable @keyup.enter="onAddAttribute(index)">
						<template v-slot:append>
							<el-button type="default" size="default" icon="el-icon-plus" style="display: flex;" @click="onAddAttribute(index)">添加</el-button>
						</template>
					</el-input>
				</el-card>
			</div>
			<el-table v-else :data="sourceAttributes" :show-header="false" class="theme-2">
				<el-table-column prop="label" width="120" :resizable="false" />
				<el-table-column>
					<template #default="scope">
						<el-checkbox v-for="(item2, index2) in scope.row.children" :key="index2" v-model="item2.checked" :label="item2.label" size="default" />
					</template>
				</el-table-column>
				<el-table-column width="250">
					<template #default="scope">
						<el-input v-model="scope.row.addAttribute" size="default" placeholder="新增一个规格" class="add-attr" @keyup.enter="onAddAttribute(scope.$index)">
							<template v-slot:append>
								<el-button size="default" icon="el-icon-plus" @click="onAddAttribute(scope.$index)">添加</el-button>
							</template>
						</el-input>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="sku-list">
			<el-form ref="form" :model="form" status-icon inline-message>
				<el-table :data="form.skuData" stripe border highlight-current-row>
					<!-- 考虑到异步加载的情况，如果 attribute 数据先加载完成，则表头会立马展示，效果不理想，故使用emitAttributes 数据，该数据为计算属性，通过 myAttribute 生成，结构与 attribute 一致 -->
					<el-table-column v-if="emitAttributes.length > 0" label="ID" type="index" width="50" align="center" :resizable="false" />
					<el-table-column v-for="(attr, index) in emitAttributes" :key="`attribute-${index}`" :label="attr.label" :prop="attr.label" width="120" align="center" :resizable="false" sortable>
						<!-- 自定义表格内部展示 -->
						<template #default="scope">
							<el-form-item>
								<el-input v-model="scope.row.label" disabled :placeholder="`${JSON.stringify(scope.row)}`" size="default" />
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column v-for="(item, index) in structures" :key="`structure-${index}`" :label="item.label" :prop="item.name" align="center" :resizable="false" min-width="120px">
						<!-- 自定义表头 -->
						<template #header>
                            <span :class="{'required_title': item.required}">
                                {{ item.label }}
                            </span>
							<el-tooltip v-if="item.tip" effect="dark" :content="item.tip" placement="top">
								<i class="el-icon-info" />
							</el-tooltip>
						</template>
						<!-- 自定义表格内部展示 -->
						<template #default="scope">
							<!-- 增加是 key 是为了保证异步验证不会出现 skuData 数据变化后无法验证的 bug -->
							<el-form-item v-if="item.type == 'input'" :key="`structure-input-${index}-${scope.row.sku}`" :prop="'skuData.' + scope.$index + '.' + item.name" :rules="rules[item.name]">
								<el-input v-model="scope.row[item.name]" :placeholder="`请输入${item.label}`" size="default" />
							</el-form-item>
							<el-form-item v-else-if="item.type == 'slot'" :key="`structure-input-${index}-${scope.row.sku}`" :prop="'skuData.' + scope.$index + '.' + item.name" :rules="rules[item.name]">
								<slot :name="item.name" :index="scope.$index" :row="scope.row" :column="scope.column" />
							</el-form-item>
						</template>
					</el-table-column>
					<!-- 批量设置，当 sku 数超过 2 个时出现 -->
					<template v-if="isBatch && form.skuData.length > 2" #append>
						<el-table :data="[{}]" :show-header="false">
							<el-table-column :width="attributes.length * 120 + 50" align="center" :resizable="false">批量设置</el-table-column>
							<el-table-column v-for="(item, index) in structures" :key="`batch-structure-${index}`" align="center" :resizable="false" min-width="120px">
								<el-input v-if="item.type == 'input' && item.batch != false" v-model="batch[item.name]" :placeholder="`填写${item.label}`" size="default" @keyup.enter="onBatchSet(item.name)" />
							</el-table-column>
						</el-table>
					</template>
				</el-table>
			</el-form>
		</div>
		<div class="sku-footer"></div>
	</div>
</template>

<script>
export default {
	name: "SkuForm",
	props: {
		params: {
			type: Object, default: () => {
				return {
					sourceAttributes: {
						type: Array,
						// default: () => [],
						default: () => [
							{
								label: '颜色', value: 1,
								children: [
									{label: '黑色', value: 1, checked: false},
									{label: '白色', value: 2, checked: false},
									{label: '银色', value: 3, checked: false},
									{label: '金色', value: 4, checked: false},
								],
								canAddAttribute: true,
							},
							{
								label: '内存', value: 2,
								children: [
									{label: '128G', value: 11, checked: false},
									{label: '512G', value: 12, checked: false},
								],
								canAddAttribute: true,
							},
							{
								label: '运营商', value: 3,
								children: [
									{label: '全网通', value: 21, checked: false},
									{label: '电信', value: 22, checked: false},
									{label: '移动', value: 23, checked: false},
									{label: '联通', value: 24, checked: false},
								],
								canAddAttribute: false,
							},
						],
					},
					attributes: {
						type: Array,
						default: () => []
					},
					skus: {
						type: Array,
						default: () => []
					},
					structures: {
						type: Array,
						default: () => [
							{ name: 'price', type: 'input', label: '价格' },
							{ name: 'stock', type: 'input', label: '库存' },
						]
					},
				}
			}
		},
		// sku 字段分隔符
		separator: {
			type: String,
			default: ';'
		},
		// 无规格的 sku
		emptySku: {
			type: String,
			default: ''
		},
		// 是否显示 sku 选择栏
		disabled: {
			type: Boolean,
			default: false
		},
		// 主题风格
		theme: {
			type: Number,
			default: 3
		},
		// 是否开启异步加载
		async: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			loading: false,
			/**
			 * 原始规格数据
			 * sourceAttribute: [
			 *   { name: '颜色', item: ['黑', '金', '白'] },
			 *   { name: '内存', item: ['16G', '32G'] },
			 *   { name: '运营商', item: ['电信', '移动', '联通'] }
			 * ]
			 */
			sourceAttributes: this.params.sourceAttributes,
			/**
			 * 已使用的规格数据，用于复原数据，支持.sync修饰符
			 * attribute: [
			 *   { name: '颜色', item: ['黑'] },
			 *   { name: '运营商', item: ['电信', '移动', '联通'] }
			 * ]
			 */
			attributes: this.params.attributes,
			/**
			 * 用于复原sku数据，支持.sync修饰符
			 * sku: [
			 *   { sku: '黑;电信', price: 1, stock: 1 },
			 *   { sku: '黑;移动', price: 2, stock: 2 },
			 *   { sku: '黑;联通', price: 3, stock: 3 }
			 * ]
			 */
			skus: this.params.skus,
			/**
			 * 表格结构，注意name字段，用于输出sku数据
			 */
			structures: this.params.structures,
			isInit: false,
			form: {
				skuData: []
			},
			batch: {},
		}
	},
	computed: {
		rules() {
			// 重新生成验证规则
			let rules = {}
			this.structures.forEach(v => {
				if (v.type == 'input') {
					rules[v.name] = []
					if (v.required) {
						rules[v.name].push({ required: true, message: `${v.label}不能为空`, trigger: 'blur' })
					}
					if (v.validate) {
						rules[v.name].push({ validator: this.customizeValidate, trigger: 'blur' })
					}
				} else if (v.type == 'slot') {
					rules[v.name] = []
					if (v.required) {
						rules[v.name].push({ required: true, message: `${v.label}不能为空`, trigger: ['change', 'blur'] })
					}
					if (v.validate) {
						rules[v.name].push({ validator: this.customizeValidate, trigger: ['change', 'blur'] })
					}
				}
			})
			return rules
		},
		isBatch() {
			return this.structures.some(item => {
				return item.type == 'input' && item.batch != false
			})
		},
		// 将 sourceAttributes 数据还原会 attributes 数据的结构，用于更新 attribute
		emitAttributes() {
			let attributes = []
			this.sourceAttributes.forEach(v1 => {
				// console.log('v1', v1)
				const obj = {
					name: v1.name,
					label: v1.label,
					value: v1.value,
					children: []
				}
				v1.children.forEach(v2 => {
					// console.log('v2', v2)
					if (v2.checked) {
						const obj2 = {
							name: v2.name,
							label: v2.label,
							value: v2.value,
						}
						obj.children.push(obj2)
					}
				})
				if (obj.children.length !== 0) {
					attributes.push(obj)
				}
			})
			// console.log('sourceAttributes', this.sourceAttributes)
			console.log('emitAttributes', attributes)
			return attributes
		}
	},
	watch: {
		sourceAttributes: {
			handler() {
				if (!this.isInit) {
					this.attributes = this.emitAttributes || []
					// 更新父组件
					this.$emit('update:attributes', this.emitAttributes)
				}
				// 解决通过 $emit 更新后无法拿到 attribute 最新数据的问题
				this.$nextTick(() => {
					console.log('this.attributes.length', this.attributes.length)
					if (this.attributes.length !== 0) {
						this.combinationAttributes()
					} else {
						this.form.skuData = []
						const obj = {
							sku: this.emptySku
						}
						this.structures.forEach(v => {
							if (!(v.type == 'slot' && v.skuProperty == false)) {
								obj[v.name] = typeof v.defaultValue != 'undefined' ? v.defaultValue : ''
							}
						})
						this.form.skuData.push(obj)
						// console.log('form.skuData', this.form.skuData)
					}
					this.clearValidate()
				})
			},
			deep: true
		},
		'form.skuData': {
			handler(newValue, oldValue) {
				if (!this.isInit || (newValue.length == 1 && newValue[0].sku == this.emptySku)) {
					// 如果有老数据，或者 sku 数据为空，则更新父级 sku 数据
					if (oldValue.length || !this.skus.length) {
						// 更新父组件
						let arr = []
						newValue.forEach(v1 => {
							// console.log('structure v1', v1)
							const obj = {
								sku: v1.sku
							}
							this.structures.forEach(v2 => {
								// console.log('structure v2', v2)
								if (!(v2.type == 'slot' && v2.skuProperty == false)) {
									obj[v2.name] = v1[v2.name] || (typeof v2.defaultValue != 'undefined' ? v2.defaultValue : '')
								}
							})
							arr.push(obj)
						})
						this.skus = this.arr || []
						this.$emit('update:skus', arr)
					}
				}
			},
			deep: true
		}
	},
	mounted() {
		!this.async && this.init()
	},
	methods: {
		init() {
			this.$nextTick(() => {
				this.isInit = true
				// 初始化 sourceAttributes
				let sourceAttributes = []
				// 根据 sourceAttribute 复原 sourceAttributes 的结构
				this.sourceAttributes.forEach(v => {
					const temp = {
						name: v.name,
						label: v.label,
						value: v.value,
						canAddAttribute: typeof v.canAddAttribute != 'undefined' ?  v.canAddAttribute : true,
						addAttribute: '',
						children: []
					}
					v.children.forEach(item2 => {
						temp.children.push({
							name: item2.name,
							label: item2.label,
							value: item2.value,
							checked: false
						})
					})
					sourceAttributes.push(temp)
				})
				// 根据 attribute 更新 sourceAttributes
				this.attributes.forEach(attrVal => {
					sourceAttributes.forEach(myAttr => {
						if (attrVal.label === myAttr.label) {
							attrVal.children.forEach(attrVal2 => {
								if (
									!myAttr.children.some(myAttrItem => {
										if (attrVal2.label === myAttrItem.label) {
											myAttrItem.checked = true
										}
										return attrVal2.label === myAttrItem.label
									})
								) {
									myAttr.children.push({
										name: attrVal2.name,
										label: attrVal2.label,
										value: attrVal2.value,
										checked: true
									})
								}
							})
						}
					})
				})
				this.sourceAttributes = sourceAttributes
				// 通过 sku 更新 skuData，但因为 skuData 是实时监听 sourceAttributes 变化并自动生成，而 watch 是在 methods 后执行，所以增加 setTimeout 方法，确保 skuData 生成后在执行下面的代码
				setTimeout(() => {
					console.log('this.skus',this.skus)
					this.skus.forEach(skuItem => {
						this.form.skuData.forEach(skuDataItem => {
							if (skuItem.sku === skuDataItem.sku) {
								this.structures.forEach(structureItem => {
									skuDataItem[structureItem.name] = skuItem[structureItem.name]
								})
							}
						})
					})
					this.isInit = false
				}, 0)
			})
		},
		// 根据 attributes 进行排列组合，生成 skuData 数据
		combinationAttributes(index = 0, dataTemp = []) {
			console.log('combinationAttributes => this.attributes', this.attributes)
			if (index === 0) {
				for (let i = 0; i < this.attributes[0].children.length; i++) {
					const obj = {
						sku: this.attributes[0].children[i],
						[this.attributes[0].name || 'label']: this.attributes[0].children[i].label,
					}
					this.structures.forEach(v => {
						if (!(v.type == 'slot' && v.skuProperty == false)) {
							obj[v.name] = typeof v.defaultValue != 'undefined' ? v.defaultValue : ''
						}
					})
					dataTemp.push(obj)
				}
			} else {
				const temp = []
				for (let i = 0; i < dataTemp.length; i++) {
					for (let j = 0; j < this.attributes[index].children.length; j++) {
						temp.push(JSON.parse(JSON.stringify(dataTemp[i])))
						temp[temp.length - 1][this.attributes[index].name] = this.attributes[index].children[j].label
						temp[temp.length - 1]['sku'] = [temp[temp.length - 1]['sku'], this.attributes[index].children[j]].join(this.separator)
					}
				}
				dataTemp = temp
			}
			if (index !== this.attributes.length - 1) {
				this.combinationAttributes(index + 1, dataTemp)
			} else {
				if (!this.isInit || this.async) {
					// 将原有的 sku 数据和新的 sku 数据比较，相同的 sku 则把原有的 sku 数据覆盖到新的 sku 数据里
					for (let i = 0; i < this.form.skuData.length; i++) {
						for (let j = 0; j < dataTemp.length; j++) {
							if (this.form.skuData[i].sku === dataTemp[j].sku) {
								dataTemp[j] = this.form.skuData[i]
							}
						}
					}
				}
				this.form.skuData = dataTemp
			}
		},
		// 新增一个规格
		onAddAttribute(index) {
			console.log('onAddAttribute.index:', index)
			if (!this.sourceAttributes[index].addAttribute){
				this.$message({
					type: 'warning',
					message: '规格名称不能为空'
				})
				return
			}
			this.sourceAttributes[index].addAttribute = this.sourceAttributes[index].addAttribute.trim()
			if (this.sourceAttributes[index].addAttribute !== '') {
				if (!this.sourceAttributes[index].addAttribute.includes(this.separator)) {
					const flag = this.sourceAttributes[index].children.some(item => {
						return item.label === this.sourceAttributes[index].addAttribute
					})
					if (!flag) {
						this.sourceAttributes[index].children.push({
							label: this.sourceAttributes[index].addAttribute,
							checked: true
						})
						this.sourceAttributes[index].addAttribute = ''
					} else {
						this.$message({
							type: 'warning',
							message: '请勿添加相同规格'
						})
					}
				} else {
					this.$message({
						type: 'warning',
						message: `规格里不允许出现「 ${this.separator} 」字符，请检查后重新添加`
					})
				}
			}
		},
		onBatchSet(type) {
			if (this.batch[type] != '') {
				this.form.skuData.forEach(v => {
					v[type] = this.batch[type]
				})
				this.batch[type] = ''
				// 批量设置完成后，触发一次当前列的验证
				this.validateFieldByColumns([type], () => {})
			}
		},
		// 自定义输入框验证，通过调用 structure 里的 validate 方法实现，重点是 callback 要带过去
		customizeValidate(rule, value, callback) {
			let [model, index, name] = rule.field.split('.')
			this.structures.forEach(v => {
				if (v.name == name) {
					v.validate(this.form[model], index, callback)
				}
			})
		},
		// sku 表单验证
		validate(callback) {
			this.$refs['form'].validate(valid => {
				callback(valid)
			})
		},
		validateFieldByColumns(colums, callback) {
			let props = []
			this.form.skuData.forEach((v, i) => {
				colums.forEach(v => {
					props.push(`skuData.${i}.${v}`)
				})
			})
			this.$refs['form'].validateField(props, valid => {
				callback(valid)
			})
		},
		validateFieldByRows(index, prop, callback) {
			this.$refs['form'].validateField([`skuData.${index}.${prop}`], valid => {
				callback(valid)
			})
		},
		clearValidate() {
			this.$refs['form'].clearValidate()
		}
	},
}
</script>

<style lang="scss" scoped>
.sku-container {
	:deep(.el-card) {
		margin: 10px 0;
		.el-card__header {
			line-height: initial;
			padding: 10px 20px;
		}
		.el-card__body {
			padding: 10px 20px 20px;
		}
	}
	.sku-header {}
	.sku-check {
		.theme-1 {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom: 10px;
			.item {
				width: 32%;
				&:last-child:nth-child(3n - 1) {
					margin-right: calc(100% - 32% * 2 - 4% / 2) !important;
				}
				.add-attr {
					width: 100%;
					margin-top: 10px;
				}
			}
		}
		.theme-2 {
			border: 1px solid #ebeef5;
			border-bottom: 0;
			margin-bottom: 20px;
		}
		.theme-3 {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-bottom: 10px;
			.item {
				width: 49%;
				&:last-child:nth-child(2n - 1) {
					margin-right: calc(100% - 49% * 2 - 4% / 2) !important;
				}
				.add-attr {
					width: 100%;
					margin-top: 10px;
				}
			}
		}
	}
	.sku-name {
		text-align: right;
	}
	.batch-set {
		width: 100%;
		margin-top: 5px;
	}
	.sku-list {
		line-height: initial;
		:deep(.el-input__inner) {
			text-align: center;
		}
		:deep(.el-table__append-wrapper) {
			overflow: initial;
			.el-table {
				overflow: initial;
				.el-table__body-wrapper {
					overflow: initial;
				}
			}
		}
		:deep(.el-form-item) {
			margin-bottom: 0;
			.el-form-item__content {
				line-height: initial;
				.el-form-item__error {
					margin-left: 0;
				}
			}
		}
		.required_title::before {
			content: '*';
			color: #f56c6c;
		}
	}
}
</style>
