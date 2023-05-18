<template>
	<el-dialog :title="title" v-model="dialogVisible" :width="'60%'" :top="'10vh'" destroy-on-close append-to-body @closed="$emit('closed')">
		<el-container>
			<el-header>
				<el-input placeholder="输入关键字进行过滤" v-model="treeFilterText" clearable></el-input>
			</el-header>
			<el-main class="nopadding">
				<!--<div class="select-city-container"></div>-->
				<el-cascader-panel ref="cascaderPanel" v-model="form.areaIds" :options="options" :props="props" :border="false" @expand-change="cascaderPanelExpandChange" @change="getSelectedData" />
			</el-main>
			<el-footer style="height:51px;">
				<el-button type="default" size="small" icon="el-icon-folder-opened" @click="shrinkTreeNode" v-if="treeStatus"></el-button>
				<el-button type="default" size="small" icon="el-icon-folder" @click="shrinkTreeNode" v-if="!treeStatus"></el-button>
			</el-footer>
		</el-container>
		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			 <el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	name: "selectArea",
	emits: ['success', 'closed'],
	props: {
		title: {
			type: String,
			default: '地区选择器'
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
				areaIds: [],
				areas: {},
				province: [],
				city: [],
				district: [],
				ignoreAreas: {},
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
				emitPath: false,
				// 次级菜单的展开方式
				expandTrigger: "hover",
			},
			treeFilterText: '',
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
		/*form: {
			// eslint-disable-next-line
			handler(newValue, oldValue) {
			},
			deep: true
		},*/
		treeFilterText(val) {
			this.$refs.cascaderPanel.filter(val);
		}
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
				/*let ignoreAreaIds = []
				Object.keys(ignoreAreas).forEach((item) => {
					let itemIds = item.split(',');
					ignoreAreaIds.push(itemIds.pop())
				})*/
				let ignoreAreaIds = Object.keys(ignoreAreas)
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
				this.treeOptions = this.getTreeData(1, this.treeOptions, this.limitLevel);
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
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		// eslint-disable-next-line
		getSelectedData(data) {
			// console.log('getSelectedData -> data:', data)
			// console.log('getSelectedData -> this.$refs.cascaderPanel.menus', this.$refs.cascaderPanel.menus)
			let nodes = this.$refs.cascaderPanel.getCheckedNodes()
			// console.log('getSelectedData -> nodes', nodes)
			let areas = {}
			let province = []
			let city = []
			let district = []
			nodes.forEach(node => {
				// console.log('getSelectedData -> node', node)
				// let nodeLabel = node.label
				let nodeValue = node.value
				let nodePathLabels = node.pathLabels.join(this.pathLabelSeparator)
				// let nodePathValues = node.pathValues.join(this.pathValueSeparator)
				let flag = false
				if (node.checked) {
					flag = true
				}
				// 存在父类 判断父类是否被选中
				if (node.parent) {
					// 父类被选中, 则不加入
					if (node.parent.checked) {
						flag = false
					}
				} else {
					// 不存在父类说明是顶级节点
				}
				// 忽略区域排除
				if (Object.keys(this.form?.ignoreAreas).includes(nodeValue)) {
					flag = false
				}
				if (flag) {
					if (node.level == 1) {
						province.push(nodeValue)
					}
					if (node.level == 2) {
						city.push(nodeValue)
					}
					if (node.level == 3) {
						district.push(nodeValue)
					}
					// areas[nodePathValues] = nodePathLabels
					areas[nodeValue] = nodePathLabels
				}
			})
			console.log('getSelectedData -> areas:', areas)
			console.log('getSelectedData -> province:', province)
			console.log('getSelectedData -> city:', city)
			console.log('getSelectedData -> district:', district)
			this.form.areas = areas
			this.form.province = province
			this.form.city = city
			this.form.district = district
		},
		// 保持所选子菜单展开
		// eslint-disable-next-line
		cascaderPanelExpandChange(val) {
			// console.log('cascaderPanelExpandChange -> val:', val)
			/*if (val.length == 1) {
				this.$nextTick(() => {
					let nodes = this.$refs.cascaderPanel.menus
					let nodeArr = nodes[0].filter(node => node.value == val[0])
					let cascaderPanel = this.$refs.cascaderPanel
					console.log('cascaderPanelExpandChange -> nodeArr:', nodeArr)
					cascaderPanel.handleExpand(nodeArr,true)
					cascaderPanel.handleExpand(nodeArr[0],true)
					cascaderPanel.handleExpand(nodeArr[0],true)
					cascaderPanel.handleExpand(nodeArr[0].children[0],true)
					cascaderPanel.handleCheckChange(nodeArr, true)
					cascaderPanel.handleCheckChange(nodeArr[0], true)
					cascaderPanel.handleCheckChange(nodeArr[0].children[0], true)
				})
			}*/
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
