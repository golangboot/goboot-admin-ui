<template>
	<el-container>
		<el-aside width="32%">
			<el-container>
				<el-header>
					<div class="left-panel">
						商品规格列表
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-input v-model="list.search.keyword" placeholder="关键字" clearable @keyup.enter="parentUpSearch"></el-input>
							<el-button type="primary" icon="el-icon-search" @click="parentUpSearch" ></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<scTable ref="parentTable" :apiObj="list.apiObj" :params="list.params" row-key="id" stripe highlightCurrentRow @row-click="parentRowClick">
						<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
						<el-table-column label="商品规格名称" prop="name" min-width="120"></el-table-column>
						<el-table-column label="是否全局" prop="isGlobal" width="100" sortable>
							<template #default="scope">
								<el-tag v-if="scope.row.isGlobal==1" type="success">是</el-tag>
								<el-tag v-if="scope.row.isGlobal==0" type="warning">否</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
						<el-table-column label="状态" prop="status" width="80" sortable>
							<template #default="scope">
								<el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
								<el-tag v-if="scope.row.status==0" type="warning">禁用</el-tag>
							</template>
						</el-table-column>
					</scTable>
				</el-main>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
					<el-button @click="refreshPage()">刷新</el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="关键字" clearable @keyup.enter="upSearch"></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upSearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="apiObj" :params="params" row-key="id" @selection-change="selectionChange" stripe>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
					<el-table-column label="商品属性名称" prop="name" width="150"></el-table-column>
					<el-table-column label="销售属性" prop="isSaleAttribute" width="100" sortable>
						<template #default="scope">
							<el-tag v-if="scope.row.isSaleAttribute==1" type="success">是</el-tag>
							<el-tag v-else type="warning">否</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="属性值可选值列表" prop="options" width="200" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
					<el-table-column label="状态" prop="status" width="80" sortable>
						<template #default="scope">
							<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="170">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
								<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
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
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'
	import useTabs from "@/utils/useTabs";

	export default {
		name: 'storeAttribute',
		components: {
			saveDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.store.productAttribute.list,
				params: {},
				selection: [],
				search: {
					keyword: null
				},
				list: {
					apiObj: this.$API.store.productSpec.list,
					params: {},
					search: {
						keyword: null
					},
				},
			}
		},
		watch: {
		},
		mounted() {
		},
		methods: {
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					let form = {}
					if (this.search.productSpecId){
						form.productSpecId = this.search.productSpecId
					}
					this.$refs.saveDialog.open('add').setData(form)
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//删除
			async table_del(row){
				var reqData = {id: row.id}
				var res = await this.$API.store.productAttribute.delete.delete(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
					type: 'warning'
				}).then(async () => {
					const loading = this.$loading();

					var reqData = {
						ids: this.selection.map(v => v.id)
					}
					var res = await this.$API.store.productAttribute.delete.delete(reqData)
					if (res.code != 200) {
						await this.$alert(res.message, "提示", {type: 'error'})
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
			selectionChange(selection){
				this.selection = selection;
			},
			//表格内开关
			async changeSwitch(val, row){
				//1.还原数据
				row.status = row.status == '1'?'0':'1'
				//2.执行加载
				row.$switch_status = true;
				//3.等待接口返回后改变值
				var reqData = {id: row.id,status: val}
				var res = await this.$API.store.productAttribute.update.put(reqData);
				delete row.$switch_status;
				if(res.code == 200){
					row.status = val;
					this.$message.success("操作成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//搜索
			upSearch(){
				this.$refs.table.upData(this.search)
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if (mode == 'add') {
					data.id = data.id ?? new Date().getTime()
					this.$refs.table.tableData.unshift(data)
				} else if (mode == 'edit') {
					this.$refs.table.tableData.filter(item => item.id === data.id).forEach(item => {
						Object.assign(item, data)
					})
				}
			},
			parentRowClick(row){
				this.search.productSpecId = row.id
				this.$refs.table.upData(this.search)
			},
			//搜索
			parentUpSearch(){
				this.$refs.parentTable.upData(this.list.search)
			},
			// 刷新页面
			refreshPage(){
				useTabs.refresh()
			},
		}
	}
</script>

<style>
</style>
