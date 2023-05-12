<template>
	<el-container>
		<el-header class="header-tabs">
			<el-tabs type="card" v-model="search.groupId" @tab-change="tabChange">
				<el-tab-pane label="全部商品" name=""></el-tab-pane>
				<el-tab-pane label="自营商品" name="1"></el-tab-pane>
				<el-tab-pane label="第三方商品" name="2"></el-tab-pane>
				<el-tab-pane label="回收站商品" name="3"></el-tab-pane>
			</el-tabs>
		</el-header>
		<el-header style="height: auto;">
			<sc-select-filter :data="filterData" :label-width="80" @on-change="filterChange"></sc-select-filter>
		</el-header>
		<el-header style="height: auto;">
			<el-form :inline="true" :model="search" class="form-inline" style="vertical-align: middle;">
				<el-form-item label="分类：" prop="categoryId">
					<el-cascader v-model="search.categoryId" :options="treeOptions" :props="treeProps" :show-all-levels="true" placeholder="请选择商品分类" clearable filterable></el-cascader>
				</el-form-item>
				<el-form-item label="品牌：" prop="brandId">
					<select-remote v-model="search.brandId" :apiObj="brandSelect.apiObj" :params="brandSelect.params" :props="brandSelect.props" clearable filterable style="width: 160px;"></select-remote>
				</el-form-item>
				<el-form-item label="商家：" prop="merchantId">
					<select-remote v-model="search.merchantId" :apiObj="merchantSelect.apiObj" :params="merchantSelect.params" :props="merchantSelect.props" clearable filterable style="width: 160px;"></select-remote>
				</el-form-item>
			</el-form>
		</el-header>
		<el-header>
			<div class="left-panel">
				<!--<el-button type="primary" icon="el-icon-plus" @click="addPage">添加商品</el-button>-->
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length == 0"
					@click="batch_del"></el-button>
				<el-button @click="refreshPage()">刷新</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-form :inline="true" :model="search" class="form-inline" style="vertical-align: middle;">
						<el-form-item label="商品搜索：" prop="keyword">
							<el-input v-model="search.keyword" placeholder="请输入商品名称/货号/ID" clearable />
						</el-form-item>
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="upSearch"></el-button>
						</el-form-item>
					</el-form>
					<!-- <el-input v-model="search.keyword" placeholder="关键字" clearable @keyup.enter="upSearch"></el-input> -->
					<!-- <el-button type="primary" icon="el-icon-search" @click="upSearch"></el-button> -->
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" :params="params" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
				<el-table-column label="商品图片" prop="image" width="80">
					<template #default="scope">
						<div style="display: flex; align-items: center; max-width: 40px; height: 40px;">
							<el-image class="image" :src="scope.row.image" v-if="scope.row.image" :preview-src-list="[scope.row.image]" fit="cover" hide-on-click-modal preview-teleported></el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品名称" prop="name" width="150" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
				<el-table-column label="状态" prop="status" width="80" sortable>
					<template #default="scope">
						<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)"
							:loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="170">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small"
								@click="table_show(scope.row, scope.$index)">查看</el-button>
							<el-button text type="primary" size="small"
								@click="table_edit(scope.row, scope.$index)">编辑</el-button>
							<el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
								<template #reference>
									<el-button text type="primary" size="small">删除</el-button>
								</template>
							</el-popconfirm>
						</el-button-group>
					</template>
				</el-table-column>

			</scTable>
		</el-main>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess"
		@closed="dialog.save = false"></save-dialog>
</template>

<script>
import saveDialog from './save'
import scSelectFilter from '@/components/scSelectFilter'
import SelectRemote from '@/components/SelectRemote'
import useTabs from "@/utils/useTabs";

export default {
	name: 'storeProduct',
	components: {
		saveDialog,
		scSelectFilter,
		SelectRemote,
	},
	data() {
		return {
			dialog: {
				save: false,
			},
			apiObj: this.$API.store.product.list,
			params: {},
			selection: [],
			search: {
				keyword: null,
				categoryId: null,
				brandId: null,
				merchantId: null,
				groupId: "",
			},
			filterData: [
				{
					title: "商品类型",
					key: "type",
					// multiple: true,
					options: [
						{
							label: "全部",
							value: ""
						},
						{
							label: "实物商品",
							value: "0"
						},
						{
							label: "虚拟商品",
							value: "1"
						},
					]
				},
				{
					title: "审核状态",
					key: "auditStatus",
					options: [
						{
							label: "全部",
							value: ""
						},
						{
							label: "待审核",
							value: "0"
						},
						{
							label: "审核通过",
							value: "1"
						},
						{
							label: "审核驳回",
							value: "2"
						},
					]
				},
				{
					title: "商品状态",
					key: "status",
					options: [
						{
							label: "全部",
							value: ""
						},
						{
							label: "上架",
							value: "1"
						},
						{
							label: "下架",
							value: "0"
						},
					]
				},
			],
			treeOptions: [],
			treeProps: {
				value: 'id',
				label: 'name',
				checkStrictly: true,
				emitPath: false,
				expandTrigger: "hover",
			},
			brandSelect: {
				// api接口
				apiObj: this.$API.store.brand.list,
				// 搜索参数(搜索关键词为空时生效)
				params: {},
				// 属性字段
				props: {
					keyword: 'keyword',
				},
			},
			merchantSelect: {
				// api接口
				apiObj: this.$API.store.merchant.list,
				// 搜索参数(搜索关键词为空时生效)
				params: {},
				// 属性字段
				props: {
					keyword: 'keyword',
				},
			},
		}
	},
	mounted() {
		this.getTreeList()
	},
	methods: {
		//页面新增
		addPage() {
			this.$router.push({
				path: '/store/product/detail',
				// path: '/template/list/crud/detail',
			})
		},
		//添加
		add() {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open()
			})
		},
		//编辑
		table_edit(row) {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('edit').setData(row)
			})
		},
		//查看
		table_show(row) {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open('show').setData(row)
			})
		},
		//删除
		async table_del(row) {
			var reqData = { id: row.id }
			var res = await this.$API.store.product.delete.delete(reqData);
			if (res.code == 200) {
				this.$refs.table.refresh()
				this.$message.success("删除成功")
			} else {
				await this.$alert(res.message, "提示", { type: 'error' })
			}
		},
		//批量删除
		async batch_del() {
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
				type: 'warning'
			}).then(async () => {
				const loading = this.$loading();

				var reqData = {
					ids: this.selection.map(v => v.id)
				}
				var res = await this.$API.store.product.delete.delete(reqData)
				if (res.code != 200) {
					await this.$alert(res.message, "提示", { type: 'error' })
				}
				// this.$refs.table.refresh()

				this.selection.forEach(item => {
					this.$refs.table.tableData.forEach((itemI, indexI) => {
						if (item.id === itemI.id) {
							this.$refs.table.tableData.splice(indexI, 1)
						}
					})
				})
				loading.close();
				this.$message.success("操作成功")
			}).catch(() => {

			})
		},
		//表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		//表格内开关
		async changeSwitch(val, row) {
			//1.还原数据
			row.status = row.status == '1' ? '0' : '1'
			//2.执行加载
			row.$switch_status = true;
			//3.等待接口返回后改变值
			var reqData = { id: row.id, status: val }
			var res = await this.$API.store.product.update.put(reqData);
			delete row.$switch_status;
			if (res.code == 200) {
				row.status = val;
				this.$message.success("操作成功")
			} else {
				await this.$alert(res.message, "提示", { type: 'error' })
			}
		},
		//搜索
		upSearch() {
			this.$refs.table.upData(this.search)
		},
		//本地更新数据
		handleSaveSuccess(data, mode) {
			if (mode == 'add') {
				data.id = data.id ?? new Date().getTime()
				this.$refs.table.tableData.unshift(data)
			} else if (mode == 'edit') {
				this.$refs.table.tableData.filter(item => item.id === data.id).forEach(item => {
					Object.assign(item, data)
				})
			}
		},
		// 刷新页面
		refreshPage() {
			useTabs.refresh()
		},
		//标签切换
		tabChange(name) {
			let params = {
				groupId: name
			}
			// this.$refs.table.reload(params)
			Object.assign(this.search, params)
			this.$refs.table.reload(this.search)
		},
		filterChange(data) {
			// this.$refs.table.upData(data)
			Object.assign(this.search, data)
			this.$refs.table.upData(this.search)
		},
		async getTreeList() {
			let res = await this.$API.store.category.tree.get();
			this.treeOptions = res.data
		},
	}
}
</script>

<style lang="scss" scoped>
.form-inline .el-form-item {
	margin-bottom: 0;
}
</style>
