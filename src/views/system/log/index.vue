<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="关键字" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="apiObj" :params="params" row-key="id" @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="ID" prop="id" width="150" sortable></el-table-column>
				<el-table-column label="用户名" prop="username" width="150"></el-table-column>
				<el-table-column label="用户ID" prop="userId" width="100"></el-table-column>
				<el-table-column label="执行操作" prop="operation" width="200" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="业务类型" prop="businessType" width="100"></el-table-column>
				<el-table-column label="请求网址(URL)" prop="url" width="150"></el-table-column>
				<el-table-column label="请求方法" prop="method" width="100"></el-table-column>
				<el-table-column label="执行时间(ms)" prop="time" width="100"></el-table-column>
				<el-table-column label="IP" prop="ip" width="150"></el-table-column>
				<el-table-column label="IP地址" prop="ipAddress" width="150"></el-table-column>
				<el-table-column label="浏览器" prop="browser" width="100"></el-table-column>
				<el-table-column label="功能模块" prop="module" width="100"></el-table-column>
				<el-table-column label="系统版本号" prop="sysVersion" width="100"></el-table-column>
				<el-table-column label="请求类名称" prop="className" width="300" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="请求类方法名称" prop="classMethodName" width="150"></el-table-column>
				<el-table-column label="操作时间" prop="createTime" width="180"></el-table-column>
				<el-table-column label="备注" prop="remark" min-width="150" :show-overflow-tooltip="true"></el-table-column>
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

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'systemLog',
		components: {
			saveDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.system.log.list,
				params: {},
				selection: [],
				search: {
					keyword: null
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
					this.$refs.saveDialog.open()
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
				var res = await this.$API.system.log.delete.delete(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
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
					var res = await this.$API.system.log.delete.delete(reqData)
					if (res.code != 200) {
						this.$alert(res.message, "提示", {type: 'error'})
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
				var res = await this.$API.system.log.update.put(reqData);
				delete row.$switch_status;
				if(res.code == 200){
					row.status = val;
					this.$message.success("操作成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//搜索
			upsearch(){
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
		}
	}
</script>

<style>
</style>
