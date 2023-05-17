<template>
	<el-dialog :title="title" v-model="dialogVisible" :width="'80%'" :top="'5vh'" destroy-on-close append-to-body @closed="$emit('closed')">
		<div class="select-city-container">
			<el-cascader-panel ref="cascader" v-model="form.areaIds" :options="options" :props="props"  @change="selectChange" />
		</div>
		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			 <el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	name: "selectCity",
	emits: ['success', 'closed'],
	props: {
		title: {
			type: String,
			default: '城市选择器'
		},
		lazyLoad: {
			type: Boolean,
			default: false
		},
		limitLevel: {
			type: Number,
			default: 0
		},
		separator: {
			type: String,
			default: ','
		},
		pathValueSeparator: {
			type: String,
			default: ','
		},
		pathLabelSeparator: {
			type: String,
			default: '/'
		},
	},
	data() {
		return {
			dialogVisible: false,
			isSaving: false,
			visible: false,
			//表单数据
			form: {
				areas: {},
				ignoreAreas: {},
				areaIds: [],
				ignoreAreaIds: [],
			},
			//验证规则
			rules: {
				name: [
					{required: true, message: '请输入名称'}
				],
			},
			lazyLoadOptions: [],
			lazyLoadTreeProps: {
				// value: 'id',
				// label: 'name',
				// 是否多选
				multiple: true,
				// checkStrictly: true,
				// 只能选择叶子节点(最后一级分类)
				checkStrictly: false,
				// 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
				// emitPath: false,
				// 次级菜单的展开方式
				expandTrigger: "hover",
				// 动态加载
				lazy: true,
				lazyLoad: async (node, resolve) => {
					// eslint-disable-next-line
					const {value, level} = node
					// console.log('node:', node)
					// console.log('value, level:', value, level)
					/*
					let id = 0
					setTimeout(() => {
						// eslint-disable-next-line
						const nodes = Array.from({ length: level + 10 }).map((item) => ({
							value: ++id,
							label: `Option - ${id}`,
							leaf: level >= 2,
						}))
						// Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
						resolve(nodes)
					}, 100)
					*/

					let pid = value || 0
					let reqData = {
						parentId: pid,
						size: 999999,
					}
					let res = await this.$API.system.area.list.get(reqData);
					if (res.code == 200) {
						let items = res.data?.records || res.data;
						// console.log('items:', items)
						let options = []
						items.forEach(item => {
							options.push({
								label: item.name,
								value: item.id,
								leaf: level >= 2,
							})
						})

						resolve(options)
					}
				},
			},
			treeOptions: [],
			treeProps: {
				value: 'id',
				label: 'name',
				// 是否多选
				multiple: true,
				// checkStrictly: true,
				// 只能选择叶子节点(最后一级分类)
				checkStrictly: false,
				// 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
				// emitPath: false,
				// 次级菜单的展开方式
				expandTrigger: "hover",
			},
		}
	},
	computed: {
		options() {
			return this.lazyLoad ? this.lazyLoadOptions : this.treeOptions
		},
		props() {
			return this.lazyLoad ? this.lazyLoadTreeProps : this.treeProps
		},
	},
	watch: {
		form: {
			// eslint-disable-next-line
			handler(newValue, oldValue) {
			},
			deep: true
		},
	},
	mounted() {
		if (!this.lazyLoad) {
			this.getTreeList()
		}
	},
	methods: {
		open() {
			this.dialogVisible = true
			return this
		},
		submit() {
			this.$emit('submit', this.form);
			this.$nextTick(() => {
				this.dialogVisible = false
				this.visible = false
				this.clear()
			});
		},
		setData(data) {
			Object.assign(this.form, data)
			let ignoreAreas = this.form.ignoreAreas
			if (ignoreAreas && Object.keys(ignoreAreas).length > 0) {
				let ignoreAreaIds = []
				Object.keys(ignoreAreas).forEach((item) => {
					let itemIds = item.split(',');
					ignoreAreaIds.push(itemIds.pop())
				})
				// console.log('setData -> ignoreAreaIds:', ignoreAreaIds)
				this.treeOptions = this.setTreeDataDisable(this.treeOptions, ignoreAreaIds);
			}
		},
		//获取列表数据
		async getTreeList() {
			this.isSaving = true
			let reqData = {}
			let res = await this.$API.system.area.tree.get(reqData);
			let items = res.data;
			this.treeOptions = items;
			if (this.limitLevel && this.limitLevel > 0) {
				this.treeOptions = this.getTreeData(1, this.treeOptions, 2);
				// this.setDisable(1, this.treeOptions, limitLevel)
			}
			this.isSaving = false
		},
		// 递归判断列表，把children设为undefined
		// num 设定显示的层级
		/**
		 * 递归的方式将树形结构处理
		 * @param currentLevel 当前层级
		 * @param data 当前层级的数据
		 * @param limitLevel 限制层级, 最多不能超过几级
		 * @returns {*[]}
		 */
		getTreeData(currentLevel = 1, data = [], limitLevel) {
			data.forEach(v => {
				v.level = currentLevel // 设置最外层数据的初始level
				// console.log(v)
				if (v.level <= limitLevel) {
					if (v.level === limitLevel) {
						// children若为空数组，则将children设为undefined
						v.children = undefined
					} else if (v.children && v.children.length) {
						// children若不为空数组，则继续 递归调用 本方法
						this.getTreeData(currentLevel + 1, v.children, limitLevel)
					}
				}
			})
			return data
		},
		/**
		 * 递归的方式将树形结构处理，如：
		 * this.setDisable(1, this.parentMenuList, 2)// 限制2级以后不可选中
		 * count: 当前层级
		 * data: 当前层级的数据
		 * maxNum: 最多不能超过几级，超过2级,不能选中,
		 */
		setTreeDisable(count, data, maxNum) {
			if (count > maxNum) { //最多几级就写几
				data.forEach(v => {
					v.disabled = true // 超过设定的最大级数,给这一集的数据添加disabled属性
				})
			} else {
				data.forEach(v => {
					v.count = count // 设置最外层数据的初始count
					if (v.children && v.children.length) {
						this.setTreeDisable(count + 1, v.children, maxNum) // 子级循环时把这一层数据的count传入
					}
				})
			}
		},
		setTreeDataDisable(data = [], ids) {
			data.forEach(v => {
				// console.log('ids.includes(String(v.value)): ', String(v.id))
				// console.log('ids.includes(String(v.value)): ', ids.includes(String(v.value)))
				if (ids.includes(String(v.id))) {
					v.disabled = true
				}
				if (v.children && v.children.length) {
					// children若不为空数组，则继续 递归调用 本方法
					this.setTreeDataDisable(v.children, ids)
				}
			})
			return data
		},
		clear() {
			this.filterData = []
		},
		// eslint-disable-next-line
		selectChange(data) {
			// console.log('selectChange -> data:', data)
			let nodes = this.$refs.cascader.getCheckedNodes()
			// console.log('selectChange cascader:', nodes[0].pathLabels.join(" / "))
			// let items = {}
			let rootAreas = {}
			let ignoreAreas = this.form.ignoreAreas
			let areas = {}
			// let selectLabels = []
			nodes.forEach(node => {
				let nodePathLabels = node.pathLabels.join(this.pathLabelSeparator)
				let nodePathValues = node.pathValues.join(this.pathValueSeparator)
				// console.log('selectChange -> cascader node:', node)
				// console.log('selectChange -> cascader node nodePathLabels:', nodePathLabels)
				let flag = false
				let area = {
					label: nodePathLabels,
					value: nodePathValues,
				}

				if (node.pathValues.length == 1) {
					rootAreas[area.value] = area.label
					// flag = true
				}

				if (node.pathValues.length == 1) {
					let idFlag = Object.keys(ignoreAreas).some(item => {
						let itemIds = item.split(',');
						return itemIds.includes(String(node.pathValues[0]))
					})
					// console.log('selectChange -> cascader idFlag:', idFlag)
					// console.log('selectChange -> cascader node area.label:', area.label)
					if (idFlag) {
						delete rootAreas[area.value]
						flag = false
					} else {
						flag = true
					}
				} else if (!Object.keys(rootAreas).includes(String(node.pathValues[0]))) {
					// selectLabels = [selectLabels, nodePathLabels].join(this.separator)
					// selectLabels.push(nodePathLabels)
					flag = true
				}

				if (Object.keys(ignoreAreas).includes(String(area.value))) {
					flag = false
				}

				// console.log('selectChange -> cascader rootAreas:', Object.keys(rootAreas))
				// console.log('selectChange -> cascader node.pathValues[0]:', String(node.pathValues[0]))

				if (flag){
					areas[area.value] = area.label
				}
			})

			// console.log('selectChange -> cascader areas:', areas)
			this.form.areas = areas
		},
	},
}
</script>

<style lang="scss" scoped>
.el-cascader-panel{
	height: 60vh;
	:deep(.el-cascader-menu__wrap).el-scrollbar__wrap {
		height: 100%;
	}
}
</style>
