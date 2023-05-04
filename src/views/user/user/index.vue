<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
				<el-button type="primary" plain :disabled="selection.length!=1" @click="accountManagement">账户管理</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="关键字" clearable @keyup.enter="upsearch"></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :apiObj="table.apiObj" :column="table.column" row-key="id"
					 @selection-change="selectionChange" stripe>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
				<el-table-column label="头像" prop="avatar" width="80" column-key="filterAvatar"
								 :filters="[{text: '已上传', value: '1'}, {text: '未上传', value: '0'}]">
					<template #default="scope">
						<el-avatar :src="scope.row.avatar" size="small"></el-avatar>
					</template>
				</el-table-column>
				<el-table-column label="用户名" prop="username" width="150" sortable
								 column-key="filterUserName"
								 :filters="[{text: '系统账号', value: '1'}, {text: '普通账号', value: '0'}]"></el-table-column>
				<el-table-column label="邮箱" prop="email" width="150" sortable></el-table-column>
				<el-table-column label="手机号" prop="mobile" width="150" sortable></el-table-column>
				<el-table-column label="余额" prop="balance" width="150" sortable></el-table-column>
				<el-table-column label="积分" prop="integral" width="150" sortable></el-table-column>
				<el-table-column label="姓名" prop="realName" width="150" sortable></el-table-column>
				<el-table-column label="性别" prop="gender" width="150" sortable>
					<template #default="scope">
						<el-tag v-if="scope.row.gender==1" type="primary">男</el-tag>
						<el-tag v-else-if="scope.row.gender==2" type="warning">女</el-tag>
						<el-tag v-else type="info">保密</el-tag>
					</template>
				</el-table-column>
				<!--<el-table-column label="所属角色" prop="groupName" width="200" sortable></el-table-column>-->
				<el-table-column label="状态" prop="status" width="80" sortable>
					<template #default="scope">
						<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="150" sortable></el-table-column>
				<el-table-column label="操作" fixed="right" align="right" width="170">
					<template #default="scope">
						<el-button-group>
							<el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">
								查看
							</el-button>
							<el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">
								编辑
							</el-button>
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
	<account-dialog v-if="dialog.account" ref="accountDialog" @closed="dialog.account=false"></account-dialog>

</template>

<script>
import saveDialog from './save'
import accountDialog from './account'

export default {
	name: 'user',
	components: {
		saveDialog,
		accountDialog,
	},
	data() {
		return {
			dialog: {
				save: false,
				account: false,
			},
			table: {
				apiObj: this.$API.user.user.list,
				params: {},
			},
			selection: [],
			search: {
				keyword: "", // 关键字
				departmentId: null, // 部门id
			},
		}
	},
	mounted() {

	},
	methods: {
		//添加
		add() {
			this.dialog.save = true
			this.$nextTick(() => {
				this.$refs.saveDialog.open()
			})
		},
		//批量删除
		async batch_del() {
			this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
				type: 'warning'
			}).then(async () => {
				const loading = this.$loading();

				var reqData = {
					ids: this.selection.map(v => v.id)
				}
				var res = await this.$API.user.user.delete.delete(reqData)
				if (res.code != 200) {
					await this.$alert(res.message, "提示", {type: 'error'})
					return
				}

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
		async table_del(row, index) {
			var reqData = {id: row.id}
			var res = await this.$API.user.user.delete.delete(reqData);
			if (res.code == 200) {
				//这里选择刷新整个表格 OR 插入/编辑现有表格数据
				this.$refs.table.tableData.splice(index, 1);
				this.$message.success("删除成功")
			} else {
				await this.$alert(res.message, "提示", {type: 'error'})
			}
		},
		//表格选择后回调事件
		selectionChange(selection) {
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
			var res = await this.$API.user.user.update.put(reqData);
			delete row.$switch_status;
			if(res.code == 200){
				row.status = val;
				this.$message.success("操作成功")
			}else{
				await this.$alert(res.message, "提示", {type: 'error'})
			}
		},
		//搜索
		upsearch() {
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
		// 账户管理
		async accountManagement(){
			this.dialog.account = true
			this.$nextTick(() => {
				let row = this.selection.at(0);
				this.$refs.accountDialog.open().setData(row)
			})
		}
	},
}
</script>

<style>
</style>
