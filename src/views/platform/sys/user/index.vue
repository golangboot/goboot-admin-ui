<template>
	<el-container>
		<el-aside width="25%" v-loading="treeShowLoading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="treeFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="tree" class="menu" node-key="id" :data="treeList" :props="treeProps" :current-node-key="'id'" :highlight-current="true" :expand-on-click-node="false" :filter-node-method="treeNodeFilter" @node-click="treeNodeClick"></el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="default" size="small" icon="el-icon-folder-opened" @click="shrinkTreeNode" v-if="treeStatus"></el-button>
					<el-button type="default" size="small" icon="el-icon-folder" @click="shrinkTreeNode" v-if="!treeStatus"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
				<el-header>
					<div class="left-panel">
						<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
						<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
						<!-- <el-button type="primary" plain :disabled="selection.length!=1" @click="assignGroups">分配用户组</el-button> -->
						<!-- <el-button type="primary" plain :disabled="selection.length!=1" @click="assignRoles">分配角色</el-button> -->
						<!-- <el-button type="primary" plain :disabled="selection.length!=1" @click="assignDepartments">分配部门</el-button> -->
						<!--<el-button type="primary" plain :disabled="selection.length==0">密码重置</el-button>-->
					</div>
					<div class="right-panel">
						<div class="right-panel-search">
							<el-input v-model="search.name" placeholder="用户名/邮箱/手机号/姓名/昵称" clearable></el-input>
							<el-button type="primary" icon="el-icon-search" @click="upSearch"></el-button>
						</div>
					</div>
				</el-header>
				<el-main class="nopadding">
					<scTable ref="table" :apiObj="apiObj" :params="params" @selection-change="selectionChange" stripe remoteSort remoteFilter>
						<el-table-column type="selection" width="50"></el-table-column>
						<el-table-column label="ID" prop="id" width="80" sortable='custom'></el-table-column>
						<el-table-column label="头像" width="80" column-key="filterAvatar" :filters="[{text: '已上传', value: '1'}, {text: '未上传', value: '0'}]">
							<template #default="scope">
								<el-avatar :src="scope.row.avatar" size="small"></el-avatar>
							</template>
						</el-table-column>
						<el-table-column label="用户名" prop="username" width="150" sortable='custom' column-key="filterUserName" :filters="[{text: '系统账号', value: '1'}, {text: '普通账号', value: '0'}]"></el-table-column>
						<el-table-column label="邮箱" prop="email" width="150" sortable='custom'></el-table-column>
						<el-table-column label="手机号" prop="mobile" width="150" sortable='custom'></el-table-column>
						<el-table-column label="姓名" prop="realName" width="150" sortable='custom'></el-table-column>
						<el-table-column label="性别" prop="gender" width="150" sortable>
							<template #default="scope">
								<el-tag v-if="scope.row.gender==1" type="primary">男</el-tag>
								<el-tag v-else-if="scope.row.gender==2" type="warning">女</el-tag>
								<el-tag v-else type="info">保密</el-tag>
							</template>
						</el-table-column>
						<!--<el-table-column label="所属角色" prop="groupName" width="200" sortable='custom'></el-table-column>-->
						<el-table-column label="状态" prop="status" width="150">
							<template #default="scope">
								<el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
								<el-tag v-if="scope.row.status==0" type="danger">禁用</el-tag>
							</template>
						</el-table-column>
						<el-table-column label="创建时间" prop="createTime" width="170" sortable='custom'></el-table-column>
						<el-table-column label="操作" fixed="right" align="right" width="160">
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

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>
	<assign-dialog v-if="dialog.assign" ref="assignDialog" @closed="dialog.assign=false"></assign-dialog>

</template>

<script>
	// import saveDialog from './save'
	import assignDialog from './assign'
	import saveDialog from '@/views/platform/user/user/save'
	import treeUtils from '@/utils/tree'

	export default {
		name: 'systemUser',
		components: {
			saveDialog,
			assignDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
					assign: false,
				},
				treeShowLoading: false,
				treeStatus: false,
				treeFilterText: '',
				treeList: [],
				treeProps: {
					value: "id",
					label: "name",
					emitPath: false,
					checkStrictly: true
				},
				apiObj: this.$API.platform.sys.user.list,
				params: {},
				selection: [],
				search: {
					// "orders[0].column": "id",
					// "orders[0].asc": false,
					// name: "",
					keyword: "", // 关键字
					departmentId: null, // 部门id
				}
			}
		},
		watch: {
			treeFilterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.getTreeList()
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
			async table_del(row, index){
				var reqData = {id: row.id}
				var res = await this.$API.platform.sys.user.delete.delete(reqData);
				if(res.code == 200){
					//这里选择刷新整个表格 OR 插入/编辑现有表格数据
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					const loading = this.$loading();

					var reqData = {
						ids: this.selection.map(v => v.id)
					}
					var res = await this.$API.platform.sys.user.delete.delete(reqData)
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
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getTreeList(){
				this.treeShowLoading = true;
				var res = await this.$API.platform.sys.department.tree.get();
				this.treeShowLoading = false;
				// var allNode ={id: '', label: '全部'}
				var allNode ={id: '', name: '全部', label: '全部'}
				res.data.unshift(allNode);
				this.treeList = res.data;
			},
			//树过滤
			treeNodeFilter(value, data){
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			//树点击事件
			treeNodeClick(data){
				this.search.departmentId = data.id
				// this.$refs.table.reload(this.search)
				this.$refs.table.upData(this.search)
			},
			//树展开/收缩
			shrinkTreeNode () {
				// 改变一个全局变量
				this.treeStatus = !this.treeStatus;
				// 改变每个节点的状态
				treeUtils.changeTreeNodeStatus(this.$refs.tree.store.root, this.treeStatus);
			},
			//分配用户组
			assignGroups(){
				this.dialog.assign = true
				this.$nextTick(() => {
					let data = {
						userIds: this.selection.map(v => v.id)
					}
					this.$refs.assignDialog.open('group').setData(data)
				})
			},
			//分配角色
			assignRoles(){
				this.dialog.assign = true
				this.$nextTick(() => {
					let data = {
						userIds: this.selection.map(v => v.id)
					}
					this.$refs.assignDialog.open('role').setData(data)
				})
			},
			//分配部门
			assignDepartments(){
				this.dialog.assign = true
				this.$nextTick(() => {
					let data = {
						userIds: this.selection.map(v => v.id)
					}
					this.$refs.assignDialog.open('department').setData(data)
				})
			},
			//搜索
			upSearch(){
				this.$refs.table.upData(this.search)
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
