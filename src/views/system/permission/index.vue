<template>
	<el-container>
		<el-aside width="25%" v-loading="treeShowLoading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="treeFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="tree" class="menu" node-key="id" :data="treeList" :props="treeProps" draggable
							 :highlight-current="true" :expand-on-click-node="false" check-strictly show-checkbox
							 :filter-node-method="treeFilterNode" @node-click="treeNodeClick" @node-drop="treeNodeDrop">
						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">{{ node.label }}</span>
								<!--<span class="code">{{ data.code }}</span>-->
								<span class="do" v-if="data.id">
									<el-button-group>
										<el-button icon="el-icon-plus" size="small" @click.stop="treeNodeAdd(node, data)"></el-button>
										<el-button icon="el-icon-edit" size="small" @click.stop="treeNodeEdit(node, data)"></el-button>
										<el-button icon="el-icon-delete" size="small" @click.stop="treeNodeDel(node, data)"></el-button>
									</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="treeAdd"></el-button>
					<el-button type="danger" size="small" plain icon="el-icon-delete" @click="treeDel"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
					<el-button type="primary" plain @click="syncPermission">同步系统内置权限</el-button>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="search.keyword" placeholder="权限名称" clearable></el-input>
						<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="apiObj" row-key="id" @selection-change="selectionChange" stripe>
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="ID" prop="id" width="80" sortable></el-table-column>
					<el-table-column label="权限名称" prop="name" width="150"></el-table-column>
					<el-table-column label="编码" prop="code" width="200"></el-table-column>
					<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
					<el-table-column label="状态" prop="status" width="80">
						<template #default="scope">
							<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
					<el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
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

	export default {
		name: 'permission',
		components: {
			saveDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.system.permission.list,
				params: {},
				selection: [],
				search: {
					keyword: null
				},
				treeShowLoading: true,
				treeList: [],
				treeFilterText: '',
				treeProps: {
					label: 'name'
				},
			}
		},
		watch: {
			treeFilterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.getTree()
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
				var res = await this.$API.system.permission.delete.delete(reqData);
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
					var res = await this.$API.system.permission.delete.delete(reqData)
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
				var res = await this.$API.system.permission.update.put(reqData);
				delete row.$switch_status;
				if(res.code == 200){
					row.status = val;
					this.$message.success("操作成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
				// 触发树更新
				this.getTree()
			},
			async syncPermission(){
				var reqData = {}
				var res = await this.$API.system.permission.sync.post(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("操作成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//加载树数据
			async getTree(){
				let res = await this.$API.system.permission.tree.get();
				this.treeShowLoading = false;
				const allNode = {id: '', name: '全部', label: '全部', disabled: true,};
				res.data.unshift(allNode);
				this.treeList = res.data;
			},
			//树点击
			treeNodeClick(data, node){
				const pid = node.level == 1 ? undefined : node.parent.data.id;
				console.log('pid', pid);
				this.params.parentId = data.id
				this.$refs.table.reload(this.params)
			},
			//树过滤
			treeFilterNode(value, data){
				if (!value) return true;
				var targetText = data.name + data.code;
				return targetText.indexOf(value) !== -1;
			},
			//树拖拽
			async treeNodeDrop(draggingNode, dropNode, dropType) {
				let { data } = draggingNode;
				let parentId = dropType === 'inner' ? dropNode.data.id : dropNode.data.parentId || 0;
				let sort = dropNode.data.sort ? (dropType === 'before' ? dropNode.data.sort - 1 : dropNode.data.sort + 1) : 0;

				Object.assign(data, {
					parentId: parentId,
					sort: sort,
				})

				this.loading = true;

				const res = data.id
					? await this.$API.system.permission.update.put(data)
					: await this.$API.system.permission.add.post(data);

				if (res.code == 200) {
					this.$message.success("保存成功");
				} else {
					this.$message.warning(res.message);
				}

				this.loading = false;
			},
			//树增加
			treeAdd(){
				this.add()
			},
			//树删除
			async treeDel(){
				var CheckedNodes = this.$refs.tree.getCheckedNodes()
				if (CheckedNodes.length == 0) {
					this.$message.warning("请选择需要删除的数据")
					return false;
				}

				var confirm = await this.$confirm('确认删除已选择的数据吗？', '提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {
				})
				if (confirm != 'confirm') {
					return false
				}

				this.menuloading = true

				var reqData = {
					ids: CheckedNodes.map(item => item.id)
				}
				var res = await this.$API.system.permission.delete.delete(reqData)

				this.menuloading = false

				if (res.code == 200) {
					CheckedNodes.forEach(item => {
						var node = this.$refs.tree.getNode(item)
						if (node.isCurrent) {
							// this.$refs.save.setData({})
						}
						this.$refs.tree.remove(item)
						this.$refs.table.refresh()
					})
				} else {
					this.$message.warning(res.message)
				}
			},
			treeNodeAdd(node, data){
				let form = {
					parentId: data.id,
				}
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('add').setData(form)
				})
			},
			treeNodeEdit(node, data){
				let row = data
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			async treeNodeDel(node, data){
				this.$confirm(`确定删除 ${data.name??''} 吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					let row = data
					var reqData = {id: row.id}
					var res = await this.$API.system.permission.delete.delete(reqData);
					if(res.code == 200){
						this.$refs.tree.remove(node)
						this.$refs.table.refresh()
						this.$message.success("删除成功")
					}else{
						this.$alert(res.message, "提示", {type: 'error'})
					}
				}).catch(() => {
				})
			},
		}
	}
</script>

<style scoped>
.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
.custom-tree-node .code {font-size: 12px;color: #999;}
.custom-tree-node .do {display: none;}
.custom-tree-node:hover .code {display: none;}
.custom-tree-node:hover .do {display: inline-block;}
</style>
