<template>
	<el-card shadow="never" header="近7天操作记录">
		<scTable ref="table" :apiObj="apiObj" :params="params" :pageSize="10" row-key="id" @selection-change="selectionChange" stripe height="auto" paginationLayout="total, prev, pager, next" hideDo>
			<!--<sc-table-column label="序号" type="index"></sc-table-column>-->
			<el-table-column label="ID" prop="id" min-width="150" sortable='custom'></el-table-column>
			<!-- <sc-table-column label="业务类型" prop="type" min-width="100"></sc-table-column> -->
			<!-- <sc-table-column label="业务编号" prop="bizNo" min-width="100"></sc-table-column> -->
			<sc-table-column label="操作" prop="action" min-width="150"></sc-table-column>
			<sc-table-column label="请求接口" prop="uri" min-width="200"></sc-table-column>
			<sc-table-column label="请求方法" prop="method" min-width="80"></sc-table-column>
			<sc-table-column label="浏览器" prop="browser" min-width="80"></sc-table-column>
			<sc-table-column label="IP" prop="ip" min-width="100"></sc-table-column>
			<sc-table-column label="IP地址" prop="ipAddress" min-width="100"></sc-table-column>
			<sc-table-column label="结果" prop="fail" width="80">
				<template #default="scope">
				<el-tag type="success" v-if="!scope.row.fail">成功</el-tag>
				<el-tag type="warning" v-else>失败</el-tag>
				</template>
			</sc-table-column>
			<sc-table-column label="操作时间" prop="createTime" width="150"></sc-table-column>
		</scTable>

		<!--<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>-->

	</el-card>
</template>

<script>
	// import saveDialog from "./../logRecord/save";

	export default {
		components: {
			// saveDialog,
		},
		data() {
			return {
				isLoading: false,
				dialog: {
					save: false
				},
				apiObj: this.$API.user.userCenter.logRecord,
				params: {},
				selection: [],
				data: [
					{
						title: "修改用户 lolowan",
						ip: "211.187.11.18",
						code: "成功",
						time: "2022-10-10 08:41:17"
					},
					{
						title: "用户登录",
						ip: "211.187.11.18",
						code: "成功",
						time: "2022-10-10 08:21:51"
					}
				]
			}
		},
		mounted() {
		},
		methods: {
			//增加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('add')
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
			async table_del(row, index){
				var reqData = {id: row.id}
				var res = await this.$API.user.userCenter.deleteLogRecord.delete(reqData);
				if(res.code == 200){
					//这里选择刷新整个表格 OR 插入/编辑现有表格数据
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
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
			//本地更新数据
			handleSuccess(data, mode){
				if(mode=='add'){
					data.id = data.id ?? new Date().getTime()
					this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
		}
	}
</script>

<style>
</style>
