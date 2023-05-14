<template>
	<!-- 组件说明: vue3-sku-form -->
	<!-- 开发文档: https://hooray.github.io/vue-sku-form/guide/ -->
	<!-- 参考代码: https://github.com/hooray/vue-sku-form.git -->
	<div class="sku-container">
		<div v-if="!disabled" class="sku-check">
			<div v-if="theme == 1 || theme == 3" :class="'theme-' + theme">
				<el-card v-for="(item, index) in myAttributes" :key="index" class="item" shadow="never">
					<template v-slot:header>
						<div>{{ item[attributeProps.label] }}</div>
					</template>
					<div v-if="item[attributeProps.options] && item[attributeProps.options].length > 0">
						<el-checkbox v-for="(item2, index2) in item[attributeProps.options]" :key="`attribute-checkbox-${index2}`" v-model="item2.checked" :label="item2[attributeProps.label]" size="default" />
					</div>
					<div class="attr-button-group">
						<div class="add-attr">
							<el-input v-if="item.canAddAttribute" v-model="item.addAttribute" :key="`attribute-input-${index}`" size="default" placeholder="请输入规格项" clearable @keyup.enter="onAddAttribute(index)">
								<template v-slot:append>
									<el-button type="default" size="default" icon="el-icon-plus" style="display: flex;" @click="onAddAttribute(index)">添加</el-button>
								</template>
							</el-input>
						</div>
						<div class="delete-attr" v-if="item.canDeleteAttribute">
							<el-popconfirm title="确定删除选中吗？" @confirm="onDeleteAttribute(index)">
								<template #reference>
									<el-button type="default" size="default" icon="el-icon-delete">删除</el-button>
								</template>
							</el-popconfirm>
						</div>
					</div>
				</el-card>
			</div>
			<el-table v-else :data="myAttributes" :show-header="false" class="theme-2">
				<el-table-column prop="label" width="120" :resizable="false" />
				<el-table-column>
					<template #default="scope">
						<el-checkbox v-for="(item2, index2) in scope.row[attributeProps.options]" :key="index2" v-model="item2.checked" :label="item2[attributeProps.label]" size="default" />
					</template>
				</el-table-column>
				<el-table-column width="250">
					<template #default="scope">
						<el-input v-model="scope.row.addAttribute" size="default" placeholder="新增一个规格项" class="add-attr" clearable @keyup.enter="onAddAttribute(scope.$index)">
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
				<el-table ref="table" :data="form.skuData" :span-method="objectSpanMethod" stripe border highlight-current-row>
					<!-- 考虑到异步加载的情况，如果 attribute 数据先加载完成，则表头会立马展示，效果不理想，故使用emitAttributes 数据，该数据为计算属性，通过 myAttribute 生成，结构与 attribute 一致 -->
					<el-table-column v-if="emitAttributes.length > 0" label="序号" type="index" width="50" align="center" :resizable="false" fixed />
					<el-table-column v-for="(attr, index) in emitAttributes" :key="`attribute-${index}`" :label="attr[attributeProps.label]" :prop="attr[attributeProps.label]" width="120" align="center" :resizable="false" fixed>
						<!-- 自定义表格内部展示 -->
						<!--<template #default="scope">
							<el-form-item>
								<el-input v-model="scope.row[scope.column.property]" disabled :data-attr="`${JSON.stringify(scope.column)}`" :placeholder="`${JSON.stringify(scope.row)}`" size="default" />
							</el-form-item>
						</template>-->
					</el-table-column>
					<el-table-column v-for="(item, index) in structures" :key="`structure-${index}`" :label="item[attributeProps.label]" :prop="item.name" align="center" :resizable="false" min-width="120px">
						<!-- 自定义表头 -->
						<template #header>
                            <span :class="{'required_title': item.required}">
                                {{ item[attributeProps.label] }}
                            </span>
							<el-tooltip v-if="item.tip" effect="dark" :content="item.tip" placement="top">
								<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-info-filled /></el-icon>
							</el-tooltip>
						</template>
						<!-- 自定义表格内部展示 -->
						<template #default="scope">
							<!-- 增加是 key 是为了保证异步验证不会出现 skuData 数据变化后无法验证的 bug -->
							<el-form-item :key="`structure-input-${index}-${scope.$index}`" :prop="`skuData.${scope.$index}.${item.name}`" :rules="rules[item.name]">
								<el-input v-if="item.type == 'input'" v-model="scope.row[item.name]" :placeholder="`${item[attributeProps.label]}`" size="default" clearable />
								<template v-else-if="item.type == 'slot'">
									<slot :name="item.name" :index="scope.$index" :row="scope.row" :column="scope.column" />
								</template>
							</el-form-item>
						</template>
					</el-table-column>
					<!-- 批量设置，当 sku 数超过 1 个时出现 -->
					<!-- <template v-if="isBatchSet && form.skuData.length >= batchSetShowTriggerCount" #append></template> -->
				</el-table>
				<el-table :data="[{}]" :show-header="false" v-if="isBatchSet && form.skuData.length >= batchSetShowTriggerCount" border>
					<el-table-column :width="attributes.length * 120 + 50" align="center" :resizable="false" fixed>
						<template #default="scope">
							<el-button :key="`batch-structure-button-${scope.$index}`" type="default" size="default" icon="el-icon-edit" @click="onBatchSets()">批量设置</el-button>
						</template>
					</el-table-column>
					<el-table-column v-for="(item, index) in structures" :key="`batch-structure-${index}`" align="center" :resizable="false" min-width="120px">
						<template #default="scope">
							<el-form-item v-if="item.batch != false" :key="`batch-structure-input-${index}-${scope.$index}`">
								<!--<el-input v-model="batchSetData[item.name]" :placeholder="`${item[attributeProps.label]}`" size="default" clearable @keyup.enter="onBatchSet(item.name)" />-->
								<el-input v-if="item.type == 'input'" v-model="batchSetData[item.name]" :placeholder="`${item[attributeProps.label]}`" size="default" clearable @keyup.enter="onBatchSet(item.name)" />
								<template v-else-if="item.type == 'slot'">
									<slot :name="item.name" :index="scope.$index" :row="batchSetData = scope.row" :column="scope.column" />
								</template>
							</el-form-item>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	name: "SkuForm",
	props: {
		/**
		 * 原始规格数据
		 * sourceAttribute: [
		 *   { name: '颜色', item: ['黑', '金', '白'] },
		 *   { name: '内存', item: ['16G', '32G'] },
		 *   { name: '运营商', item: ['电信', '移动', '联通'] }
		 * ]
		 */
		/**
		 * 新 原始规格数据
		 * sourceAttributes: [
		 * 	{
		 * 		label: '颜色', value: 1,
		 * 		options: [
		 * 			{label: '黑色', value: 1, checked: false},
		 * 			{label: '白色', value: 2, checked: false},
		 * 			{label: '银色', value: 3, checked: false},
		 * 			{label: '金色', value: 4, checked: false},
		 * 		],
		 * 		canAddAttribute: true,
		 * 	},
		 * 	{
		 * 		label: '内存', value: 2,
		 * 		options: [
		 * 			{label: '128G', value: 11, checked: false},
		 * 			{label: '512G', value: 12, checked: false},
		 * 			{label: '1T', value: 13, checked: false},
		 * 		],
		 * 		canAddAttribute: true,
		 * 	},
		 * 	{
		 * 		label: '运营商', value: 3,
		 * 		options: [
		 * 			{label: '全网通', value: 21, checked: false},
		 * 			{label: '电信', value: 22, checked: false},
		 * 			{label: '移动', value: 23, checked: false},
		 * 			{label: '联通', value: 24, checked: false},
		 * 		],
		 * 		canAddAttribute: false,
		 * 	},
		 * ]
		 */
		sourceAttributes: {
			type: Array,
			default: () => []
		},
		/**
		 * 已使用的规格数据，用于复原数据，支持.sync修饰符
		 * attribute: [
		 *   { name: '颜色', item: ['黑'] },
		 *   { name: '运营商', item: ['电信', '移动', '联通'] }
		 * ]
		 */
		/**
		 * 新 已使用的规格数据，用于复原数据，支持.sync修饰符
		 * attributes: [
		 * 	{
		 * 		label: '颜色', value: 1,
		 * 		options: [
		 * 			{label: '黑色', value: 1, checked: false},
		 * 		],
		 * 		canAddAttribute: true,
		 * 	},
		 * 	{
		 * 		label: '内存', value: 2,
		 * 		options: [
		 * 			{label: '128G', value: 11, checked: false},
		 * 			{label: '512G', value: 12, checked: false},
		 * 		],
		 * 		canAddAttribute: true,
		 * 	},
		 * 	{
		 * 		label: '运营商', value: 3,
		 * 		options: [
		 * 			{label: '全网通', value: 21, checked: false},
		 * 			{label: '电信', value: 22, checked: false},
		 * 			{label: '移动', value: 23, checked: false},
		 * 		],
		 * 		canAddAttribute: false,
		 * 	},
		 * ]
		 */
		attributes: {
			type: Array,
			default: () => []
		},
		/**
		 * 用于复原sku数据，支持.sync修饰符
		 * skus: [
		 *   { sku: '黑;电信', price: 1, stock: 1 },
		 *   { sku: '黑;移动', price: 2, stock: 2 },
		 *   { sku: '黑;联通', price: 3, stock: 3 }
		 * ]
		 */
		skus: {
			type: Array,
			default: () => []
		},
		/**
		 * 表格结构，注意name字段，用于输出sku数据
		 */
		structures: {
			type: Array,
			default: () => [
				{ name: 'price', type: 'input', label: '价格', required: true, },
				{ name: 'stock', type: 'input', label: '库存', required: true, },
			]
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
			default: 1
		},
		// 是否开启异步加载
		async: {
			type: Boolean,
			default: false
		},
		//sku字段
		skuProps: {
			type: Object, default: () => {
				return {
					sku: 'sku',
					attributeParams: 'attributeParams',
					attribute: 'attribute',
					attributeValue: 'attributeValue',
				}
			}
		},
		//属性字段
		attributeProps: {
			type: Object, default: () => {
				return {
					label: 'label',
					value: 'value',
					options: 'options',
				}
			}
		},
		//规格选项限制总数量(为0时则表示不限制)
		attributeOptionLimitTotalCount: {
			type: Number,
			default: 0
		},
		//批量设置显示触发数量
		batchSetShowTriggerCount: {
			type: Number,
			default: 2
		},
	},
	data() {
		return {
			isInit: false,
			myAttributes: [],
			form: {
				skuData: []
			},
			batchSetData: {},
			//需要合并的列
			tableRowSpanArray: [],
			tableRowSpanNumObject: {},
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
						rules[v.name].push({ required: true, message: `${v[this.attributeProps.label]}不能为空`, trigger: 'blur' })
					}
					if (v.validate) {
						rules[v.name].push({ validator: this.customizeValidate, trigger: 'blur' })
					}
				} else if (v.type == 'slot') {
					rules[v.name] = []
					if (v.required) {
						rules[v.name].push({ required: true, message: `${v[this.attributeProps.label]}不能为空`, trigger: ['change', 'blur'] })
					}
					if (v.validate) {
						rules[v.name].push({ validator: this.customizeValidate, trigger: ['change', 'blur'] })
					}
				}
			})
			// console.log('structures:', this.structures)
			// console.log('rules:', rules)
			return rules
		},
		isBatchSet() {
			return this.structures.some(item => {
				return item.type == 'input' && item.batch != false
			})
		},
		// 将 myAttributes 数据还原回 attributes 数据的结构，用于更新 attribute
		emitAttributes() {
			let attributes = []
			this.myAttributes.forEach(v1 => {
				// console.log('v1', v1)
				const obj = {
					// name: v1.name,
					[this.attributeProps.label]: v1[this.attributeProps.label],
					[this.attributeProps.value]: v1[this.attributeProps.value],
					[this.attributeProps.options]: []
				}
				v1[this.attributeProps.options].forEach(v2 => {
					// console.log('v2', v2)
					if (v2.checked) {
						const obj2 = {
							// name: v2.name,
							[this.attributeProps.label]: v2[this.attributeProps.label],
							[this.attributeProps.value]: v2[this.attributeProps.value],
						}
						obj[this.attributeProps.options].push(obj2)
					}
				})
				if (obj[this.attributeProps.options].length !== 0) {
					attributes.push(obj)
				}
			})
			// console.log('attributes', attributes)
			return attributes
		}
	},
	watch: {
		myAttributes: {
			// eslint-disable-next-line
			handler(newValue, oldValue) {
				// console.log('myAttributes.newValue:', newValue)
				// console.log('myAttributes.oldValue:', oldValue)
				// console.log('myAttributes.newValue.length:', newValue.length)
				// console.log('myAttributes.oldValue.length:', oldValue.length)
				if (!this.isInit) {
					// this.attributes = this.emitAttributes || []
					// 更新父组件
					this.$emit('update:attributes', this.emitAttributes || [])
				}
				// 解决通过 $emit 更新后无法拿到 attribute 最新数据的问题
				this.$nextTick(() => {
					// console.log('this.attributes.length', this.attributes.length)
					if (this.attributes && this.attributes.length !== 0) {
						this.combinationAttributes()
					} else {
						this.form.skuData = []
						const obj = {
							[this.skuProps.sku]: this.emptySku
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
					if (this.attributes && this.attributes.length > 0) {
						// console.log('触发合并表单:', 'myAttributes')
						this.triggerMergeTable() // 合并表单
					}
				})
			},
			deep: true
		},
		'form.skuData': {
			handler(newValue, oldValue) {
				// console.log('watch -> form.skuData.newValue:', newValue)
				// console.log('watch -> form.skuData.oldValue:', oldValue)
				// console.log('form.skuData.newValue.length:', Object.keys(newValue).length)
				// console.log('form.skuData.oldValue.length:', Object.keys(oldValue).length)
				if (!this.isInit || (newValue.length == 1 && newValue[0][this.skuProps.sku] == this.emptySku)) {
					// 如果有老数据，或者 sku 数据为空，则更新父级 sku 数据
					// if (oldValue.length || !this.skus.length) {
					if ((oldValue && oldValue.length) || (!this.skus || !this.skus.length)) {
						// console.log(`如果有老数据，或者 sku 数据为空，则更新父级 sku 数据`)
						// 更新父组件
						let skus = []
						newValue.forEach(skuDataItem => {
							// console.log('form.skuData skuDataItem:', skuDataItem)
							//使用 Object.assign() 拷贝数据, 可以避免直接赋值时, 如果删除元素数据会导致原数据也被删除
							let obj = Object.assign({}, skuDataItem)
							obj[this.skuProps.sku] = skuDataItem[this.skuProps.sku]
							if (skuDataItem[this.skuProps.attributeParams]) {
								obj[this.skuProps.attributeParams] = skuDataItem[this.skuProps.attributeParams]
							}
							//表格结构数据过滤
							this.structures.forEach(structureItem => {
								// console.log('form.skuData structureItem', structureItem)
								if (!(structureItem.type == 'slot' && structureItem.skuProperty == false)) {
									// console.log('form.skuData.structures structureItem:', structureItem)
									// console.log(`form.skuData.structures skuDataItem.${structureItem.name}:`, skuDataItem[structureItem.name])
									// obj[structureItem.name] = skuDataItem[structureItem.name] || (typeof structureItem.defaultValue != 'undefined' ? structureItem.defaultValue : '')
									if (typeof skuDataItem[structureItem.name] != 'undefined') {
										// console.log('form.skuData structureItem:', skuDataItem[structureItem.name])
										obj[structureItem.name] = skuDataItem[structureItem.name]
									} else {
										obj[structureItem.name] = (typeof structureItem.defaultValue != 'undefined' ? structureItem.defaultValue : '')
									}
									// obj[structureItem.name] = (typeof skuDataItem[structureItem.name] != 'undefined') ? skuDataItem[structureItem.name] : (typeof structureItem.defaultValue != 'undefined' ? structureItem.defaultValue : '')
								}
							})
							//冗余数据过滤
							if (this.attributes && this.attributes.length > 0) {
								this.attributes.forEach(attributeItem => {
									// console.log('form.skuData attributeItem', attributeItem)
									if (typeof attributeItem.label != 'undefined' && typeof obj[attributeItem.label] != 'undefined') {
										delete obj[attributeItem.label]
									}
								})
							}
							skus.push(obj)
						})
						// console.log('触发合并表单:', 'form.skuData')
						// this.triggerMergeTable() // 合并表单
						// console.log('skus:', skus)
						// this.skus = skus
						this.$emit('update:skus', skus || [])
					}
				}
			},
			deep: true
		},
		skus: {
			// eslint-disable-next-line
			handler(newValue, oldValue) {
				// console.log('watch -> skus.newValue:', newValue)
				// console.log('watch -> skus.oldValue:', oldValue)
				// console.log('skus.newValue.length:', newValue.length)
				// console.log('skus.oldValue.length:', oldValue.length)
				// console.log('skus.newValue:', typeof newValue)
				if (newValue && newValue.length > 0) {
					let flag = newValue.some(item => {
						return item[this.skuProps.sku] && item[this.skuProps.sku] !== '' && item[this.skuProps.sku].length > 0;
					})
					if (oldValue && oldValue.length > 0 && newValue.length === oldValue.length) {
						flag = false
					}
					if (flag) {
						// console.log('触发合并表单:', 'skus')
						this.triggerMergeTable() // 合并表单
					}
				}
			},
			deep: true
		},
	},
	mounted() {
		!this.async && this.init()
	},
	methods: {
		init() {
			this.$nextTick(() => {
				this.isInit = true
				// 初始化 myAttributes
				let myAttributes = []
				if (this.sourceAttributes && this.sourceAttributes.length > 0) {
					// 根据 sourceAttribute 复原 myAttributes 的结构
					this.sourceAttributes.forEach(v => {
						const temp = {
							// name: v.name,
							[this.attributeProps.label]: v[this.attributeProps.label],
							[this.attributeProps.value]: v[this.attributeProps.value],
							[this.attributeProps.options]: [],
							canAddAttribute: typeof v.canAddAttribute != 'undefined' ?  v.canAddAttribute : true,
							canDeleteAttribute: typeof v.canDeleteAttribute != 'undefined' ?  v.canDeleteAttribute : true,
							addAttribute: '',
						}
						v[this.attributeProps.options].forEach(item2 => {
							temp[this.attributeProps.options].push({
								// name: item2.name,
								[this.attributeProps.label]: item2[this.attributeProps.label],
								[this.attributeProps.value]: item2[this.attributeProps.value],
								checked: false
							})
						})
						myAttributes.push(temp)
					})
				}
				if (this.attributes && this.attributes.length > 0) {
					// 根据 attribute 更新 myAttributes
					this.attributes.forEach(attrVal => {
						myAttributes.forEach(myAttrVal => {
							if (attrVal[this.attributeProps.label] === myAttrVal[this.attributeProps.label]) {
								attrVal[this.attributeProps.options].forEach(attrName => {
									if (
										!myAttrVal[this.attributeProps.options].some(myAttrItem => {
											if (attrName[this.attributeProps.label] === myAttrItem[this.attributeProps.label]) {
												myAttrItem.checked = true
											}
											return attrName[this.attributeProps.label] === myAttrItem[this.attributeProps.label]
										})
									) {
										myAttrVal[this.attributeProps.options].push({
											// name: attrName.name,
											[this.attributeProps.label]: attrName[this.attributeProps.label],
											[this.attributeProps.value]: attrName[this.attributeProps.value],
											checked: true
										})
									}
								})
							}
						})
					})
				}
				this.myAttributes = myAttributes
				// 通过 sku 更新 skuData，但因为 skuData 是实时监听 myAttributes 变化并自动生成，而 watch 是在 methods 后执行，所以增加 setTimeout 方法，确保 skuData 生成后在执行下面的代码
				setTimeout(() => {
					//初始化赋值
					// console.log('setTimeout -> skus',this.skus)
					if (this.skus && this.skus.length > 0) {
						this.skus.forEach(skuItem => {
							this.form.skuData.forEach(skuDataItem => {
								if (skuItem[this.skuProps.sku] === skuDataItem[this.skuProps.sku]) {
									// skuDataItem = skuItem // 全部赋值数据(*注意: 不可使用该方式赋值, 会造成数据错乱)
									this.structures.forEach(structureItem => {
										skuDataItem[structureItem.name] = skuItem[structureItem.name]
									})
								}
							})
						})
					}
					this.isInit = false
				}, 0)
			})
		},
		// 根据 attributes 进行排列组合，生成 skuData 数据
		combinationAttributes(index = 0, skuDataTemp = []) {
			// console.log('combinationAttributes => this.attributes', this.attributes)
			// console.log('combinationAttributes => structures', this.structures)
			if (index === 0) {
				for (let i = 0; i < this.attributes[0][this.attributeProps.options].length; i++) {
					let obj = {
						[this.skuProps.sku]: this.attributes[0][this.attributeProps.options][i][this.attributeProps.label],
						[this.skuProps.attributeParams]: [],
						[this.attributes[0][this.attributeProps.label]]: this.attributes[0][this.attributeProps.options][i][this.attributeProps.label],
					}
					let attributeParams = {
						[this.skuProps.attribute]: {
							[this.attributeProps.label]: this.attributes[0][this.attributeProps.label],
							[this.attributeProps.value]: this.attributes[0][this.attributeProps.value],
						},
						[this.skuProps.attributeValue]: this.attributes[0][this.attributeProps.options][i],
					}
					obj[this.skuProps.attributeParams].push(attributeParams)
					// obj[this.skuProps.attributeParams].push(this.attributes[0][this.attributeProps.options][i])
					this.structures.forEach(structureItem => {
						if (!(structureItem.type == 'slot' && structureItem.skuProperty == false)) {
							obj[structureItem.name] = typeof structureItem.defaultValue != 'undefined' ? structureItem.defaultValue : ''
						}
					})
					// console.log(`combinationAttributes => form.skuData[${i}]:`, this.form.skuData[i])
					// console.log(`combinationAttributes => skuDataTemp:`, skuDataTemp)
					skuDataTemp.push(obj)
				}
			} else {
				let temp = []
				for (let i = 0; i < skuDataTemp.length; i++) {
					for (let j = 0; j < this.attributes[index][this.attributeProps.options].length; j++) {
						temp.push(JSON.parse(JSON.stringify(skuDataTemp[i])))
						// console.log('combinationAttributes => JSON:', JSON.parse(JSON.stringify(skuDataTemp[i])))
						// console.log('combinationAttributes => temp[temp.length - 1]:', temp[temp.length - 1])
						let obj = temp[temp.length - 1]
						let obj2 = this.attributes[index][this.attributeProps.options][j]
						// temp[temp.length - 1][this.attributes[index][this.attributeProps.label]] = obj2[this.attributeProps.label]
						// temp[temp.length - 1]['sku'] = [temp[temp.length - 1]['sku'], obj2[this.attributeProps.label]].join(this.separator)
						// console.log('obj2:', obj2)
						// console.log('temp[temp.length - 1][\'sku\']:', temp[temp.length - 1]['sku'])
						obj[this.skuProps.sku] = [obj[this.skuProps.sku], obj2[this.attributeProps.label]].join(this.separator)
						let attributeParams = {
							[this.skuProps.attribute]: {
								[this.attributeProps.label]: this.attributes[index][this.attributeProps.label],
								[this.attributeProps.value]: this.attributes[index][this.attributeProps.value],
							},
							[this.skuProps.attributeValue]: obj2,
						}
						obj[this.skuProps.attributeParams].push(attributeParams)
						// obj[this.skuProps.attributeParams].push(obj2)
						obj[this.attributes[index][this.attributeProps.label]] = obj2[this.attributeProps.label]
						// console.log('obj:', obj)
						temp[temp.length - 1] = obj
					}
				}
				skuDataTemp = temp
			}
			if (index !== this.attributes.length - 1) {
				this.combinationAttributes(index + 1, skuDataTemp)
			} else {
				if (!this.isInit || this.async) {
					// console.log(`combinationAttributes => !this.isInit || this.async:`, 'true')
					// 将原有的 sku 数据和新的 sku 数据比较，相同的 sku 则把原有的 sku 数据覆盖到新的 sku 数据里
					for (let i = 0; i < this.form.skuData.length; i++) {
						for (let j = 0; j < skuDataTemp.length; j++) {
							if (typeof this.form.skuData[i] != 'undefined'){
								if (typeof skuDataTemp[j] != 'undefined'){
									if (this.form.skuData[i][this.skuProps.sku] === skuDataTemp[j][this.skuProps.sku]) {
										skuDataTemp[j] = this.form.skuData[i]
									}
								}
							}
						}
					}
				}
				// console.log('combinationAttributes -> skus',this.skus)
				// 原属性赋值
				if (this.skus && this.skus.length > 0) {
					for (let i = 0; i < this.skus.length; i++) {
						for (let j = 0; j < skuDataTemp.length; j++) {
							if (typeof this.skus[i] != 'undefined') {
								if (typeof skuDataTemp[j] != 'undefined') {
									if (this.skus[i][this.skuProps.sku] === skuDataTemp[j][this.skuProps.sku]) {
										let skuDataTempItem = Object.assign({}, this.skus[i])
										skuDataTemp[j] = Object.assign(skuDataTempItem, skuDataTemp[j])
									}
								}
							}
						}
					}
				}
				// console.log(`combinationAttributes => form.skuData:`, this.form.skuData)
				// console.log(`combinationAttributes => skuDataTemp:`, skuDataTemp)
				this.form.skuData = skuDataTemp
			}
		},
		// 删除选中规格
		onDeleteAttribute(index) {
			const flag = this.myAttributes[index][this.attributeProps.options].some(item => {
				return item.checked;
			})
			if (!flag) {
				this.$message({type: 'warning', message: '请勾选需要删除的规格项'})
				return
			}
			this.myAttributes[index][this.attributeProps.options] = this.myAttributes[index][this.attributeProps.options].filter((item) => {
				return !item.checked;
			})
		},
		// 新增一个规格
		onAddAttribute(index) {
			// console.log('onAddAttribute.index:', index)
			if (!this.myAttributes[index].addAttribute){
				this.$message({type: 'warning', message: '规格项不能为空'})
				return
			}
			let addAttributeText = this.myAttributes[index].addAttribute.trim()
			this.myAttributes[index].addAttribute = addAttributeText
			if (addAttributeText !== '') {
				if (!addAttributeText.includes(this.separator)) {
					// console.log('onAddAttribute attributeOptionLimitTotalCount:', this.attributeOptionLimitTotalCount)
					//检查规格项是否超出最大数量
					if (this.attributeOptionLimitTotalCount > 0) {
						let attributeOptionTotalCount = 0
						this.myAttributes.forEach(myAttribute => {
							if (myAttribute[this.attributeProps.options]) {
								attributeOptionTotalCount += myAttribute[this.attributeProps.options].length
							}
						})
						// console.log('onAddAttribute attributeOptionTotalCount:', attributeOptionTotalCount)
						if (attributeOptionTotalCount >= this.attributeOptionLimitTotalCount) {
							this.$message({
								type: 'warning',
								message: `规格项总数不能超过 ${this.attributeOptionLimitTotalCount} 个`
							})
							return
						}
					}
					const flag = this.myAttributes[index][this.attributeProps.options].some(item => {
						return item[this.attributeProps.label] === addAttributeText
					})
					if (!flag) {
						this.myAttributes[index][this.attributeProps.options].push({
							[this.attributeProps.label]: addAttributeText,
							// [this.attributeProps.value]: "",
							checked: true
						})
						this.myAttributes[index].addAttribute = ''
					} else {
						this.$message({
							type: 'warning',
							message: '请勿添加相同规格项'
						})
					}
				} else {
					this.$message({
						type: 'warning',
						message: `规格项中不允许出现「 ${this.separator} 」字符，请检查后重新添加`
					})
				}
			}
		},
		onBatchSets() {
			// console.log('this.structures:', this.structures)
			// console.log('批量设置 onBatchSets:', this.batchSetData)
			// console.log('批量设置 onBatchSets Object.keys(this.batchSetData):', Object.keys(this.batchSetData).length)
			if (this.batchSetData && Object.keys(this.batchSetData).length > 0) {
				Object.keys(this.batchSetData).forEach(type => {
					// console.log('onBatchSets[type]:', type)
					this.onBatchSet(type)
				})
			}
		},
		onBatchSet(type) {
			let value = this.batchSetData[type]
			// console.log('单个设置 onBatchSet[type]:', this.batchSetData[type])
			// console.log('单个设置 onBatchSet[value]:', value)
			// console.log('单个设置 onBatchSet[typeof]:', typeof value)
			// console.log('单个设置 onBatchSet[isNaN]:', isNaN(value))
			let flag = true
			//字符串
			if (typeof value === 'string' && (value == '' || value.trim() == '')) {
				flag = false
			}
			//数字
			if (typeof value === 'number' && isNaN(value)) {
				flag = false
			}
			//布尔
			if (typeof value === 'boolean') {
				flag = true
			}
			//未知
			if (typeof value === 'undefined') {
				flag = false
			}
			if (flag) {
				this.form.skuData.forEach(v => {
					v[type] = this.batchSetData[type]
				})
				this.batchSetData[type] = ''
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
		validateFieldByColumns(columns, callback) {
			let props = []
			/*this.form.skuData.forEach((v, i) => {
				columns.forEach(v => {
					props.push(`skuData.${i}.${v}`)
					// console.log(`validateFieldByColumns.skuData.${i}.${v}`)
				})
			})*/
			let i = 0
			// eslint-disable-next-line
			for(let idx in this.form.skuData){
				columns.forEach(v => {
					let prop = `skuData.${i}.${v}`
					props.push(prop)
					// console.log(`validateFieldByColumns.prop => ${prop}`)
				})
				i++
			}
			// console.log('validateFieldByColumns props:', props)
			// console.log('validateFieldByColumns form:', this.$refs['form'])
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
		},
		// 触发表格合并(数据获取)
		triggerMergeTable(){
			// this.$refs.table.doLayout()
			// console.log('tableData:', tableData)
			// console.log('attributes', this.attributes)
			// this.$nextTick(() => {})
			let tableData = this.form.skuData
			let tableRowSpanArray = [];
			if (this.attributes && this.attributes.length > 0) {
				this.attributes.forEach(attr => {
					tableRowSpanArray.push(attr[this.attributeProps.label])
				})
			}
			this.tableRowSpanArray = tableRowSpanArray
			this.tableRowSpanNumObject = this.getTableRowSpanData(tableData, tableRowSpanArray)
		},
		// 默认接受四个值 { row-当前行的值, column-当前列的值, rowIndex-行的下标, columnIndex-列的下标 }
		// eslint-disable-next-line
		objectSpanMethod({row, column, rowIndex, columnIndex}) {
			return this.mergeTableSpanMethod(this.tableRowSpanArray, this.tableRowSpanNumObject, {row, column, rowIndex, columnIndex})
		},
		/**
		 * 合并相同数据，导出合并列所需的方法(只适合el-table)
		 * @param {Object} tableData 表格数据
		 * @param {Object} rowSpanArray ['颜色', '内存', '运营商']
		 */
		getTableRowSpanData(tableData, rowSpanArray) {
			/**
			 * 要合并列的数据
			 */
			let rowSpanNumObject = {};
			//初始化 rowSpanNumObject
			rowSpanArray.map(item => {
				rowSpanNumObject[item] = new Array(tableData.length).fill(1, 0, 1).fill(0, 1);
				rowSpanNumObject[`${item}-index`] = 0;
			});
			//计算相关的合并信息
			let idx = 0
			for (let i in tableData) {
				rowSpanArray.map(key => {
					const index = rowSpanNumObject[`${key}-index`];
					let lastRowIndex = 1
					// 防止表格数据key不是连续的
					if (!tableData[i - lastRowIndex] && i - idx > lastRowIndex) {
						for (lastRowIndex = 1; lastRowIndex <= (i - idx); lastRowIndex++) {
							if (tableData[i - lastRowIndex]) {
								break
							}
						}
					}
					if ((tableData[i] && tableData[i - lastRowIndex]) && tableData[i][key] === tableData[i - lastRowIndex][key]) {
						rowSpanNumObject[key][index]++;
					} else {
						rowSpanNumObject[`${key}-index`] = idx;
						rowSpanNumObject[key][idx] = 1;
					}
				});
				idx++
			}
			return rowSpanNumObject
		},
		/**
		 * 合并方法
		 * @param rowSpanArray 要合并列的数据
		 * @param rowSpanNumObject 要合并列的数据
		 * @param row
		 * @param column
		 * @param rowIndex
		 * @param columnIndex
		 * @returns {{colspan: number, rowspan: *}|{colspan: number, rowspan: number}}
		 */
		// eslint-disable-next-line
		mergeTableSpanMethod(rowSpanArray, rowSpanNumObject, {row, column, rowIndex, columnIndex}) {
			if (typeof column != 'undefined' && rowSpanArray.includes(column['property'])) {
				let rowSpan = rowSpanNumObject[column['property']][rowIndex];
				if (rowSpan > 0) {
					return {rowspan: rowSpan, colspan: 1}
				}
				return {rowspan: 0, colspan: 0}
			}
			return {rowspan: 1, colspan: 1}
		},
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
				/*.add-attr {
					width: 100%;
					margin-top: 10px;
				}*/
				.attr-button-group {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 10px;
					.add-attr {
						flex: 1;
						padding-right: 20px;
					}
					.delete-attr {}
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
				/*.add-attr {
					width: 100%;
					margin-top: 10px;
				}*/
				.attr-button-group {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 10px;
					.add-attr {
						flex: 1;
						padding-right: 20px;
					}
					.delete-attr {}
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
