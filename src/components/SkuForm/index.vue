<template>
	<div class="sku-container">
		<div class="sku-header"></div>
		<div v-if="!disabled" class="sku-check">
			<div v-if="theme == 1 || theme == 3" :class="'theme-' + theme">
				<el-card v-for="(item, index) in sourceAttributes" :key="index" class="item" shadow="never">
					<template v-slot:header>
						<div>{{ item.label }}</div>
					</template>
					<el-checkbox v-for="(item2, index2) in item.children" :key="index2" v-model="item2.checked" :label="item2.label" size="small" />
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
						<el-checkbox v-for="(item2, index2) in scope.row.children" :key="index2" v-model="item2.checked" :label="item2.label" size="small" />
					</template>
				</el-table-column>
				<el-table-column width="250">
					<template #default="scope">
						<el-input v-model="scope.row.addAttribute" size="small" placeholder="新增一个规格" class="add-attr" @keyup.enter="onAddAttribute(scope.$index)">
							<template v-slot:append>
								<el-button size="small" icon="el-icon-plus" @click="onAddAttribute(scope.$index)">添加</el-button>
							</template>
						</el-input>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="sku-list">
			sku列表
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
					tableStructures: {
						type: Array,
						default: () => [
							{ name: 'price', type: 'input', label: '价格' },
							{ name: 'stock', type: 'input', label: '库存' },
						]
					},
				}
			}
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
	},
	data() {
		return {
			loading: false,
			sourceAttributes: this.params.sourceAttributes,
			attributes: this.params.attributes,
			tableStructures: this.params.tableStructures,
			skus: this.params.skus,
			form: {
				skuData: []
			},
		}
	},
	watch: {
	},
	mounted() {
	},
	methods: {
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
