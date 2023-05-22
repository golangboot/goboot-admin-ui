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
							 :filter-node-method="treeNodeFilter" @node-click="treeNodeClick" @node-drop="treeNodeDrop">
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
					<!--<el-button type="primary" plain @click="syncMenu">同步菜单</el-button>-->
					<sc-file-import :apiObj="$API.platform.sys.menu.import" :data="{otherData:'meta'}" templateUrl="http://www.scuiadmin/file.xlsx" accept=".xls, .xlsx" :maxSize="30" tip="请上传小于或等于 30M 的 .xls, .xlsx 格式文件(自定义TIP)" @success="success">
						<template #default="{open}">
							<el-button type="primary" icon="sc-icon-upload" @click="open">导入</el-button>
						</template>
						<template #uploader>
							<el-icon class="el-icon--upload"><sc-icon-file-excel /></el-icon>
							<div class="el-upload__text">
								将文件拖到此处或 <em>点击选择文件上传</em>
							</div>
						</template>
						<template #form="{formData}">
							<el-form-item label="覆盖已有数据">
								<el-switch v-model="formData.coverage" />
							</el-form-item>
							<el-form-item label="跳过错误数据">
								<el-switch v-model="formData.skipError" />
							</el-form-item>
						</template>
					</sc-file-import>
					<sc-file-export :apiObj="$API.platform.sys.menu.export" blob :fileName="'菜单列表_' + Date.now()" :data="{otherData:'meta'}" showData :column="column" :fileTypes="['xlsx','docx','pdf']">
						<template #default="{open}">
							<el-button type="primary" icon="sc-icon-download" @click="open">导出</el-button>
						</template>
						<template #form="{formData}">
							<el-form-item label="导出条数">
								<el-select v-model="formData.limit" placeholder="全部">
									<el-option label="100条" value="100" />
									<el-option label="500条" value="500" />
									<el-option label="1000条" value="1000" />
									<el-option label="5000条" value="5000" />
									<el-option label="10000条" value="10000" />
								</el-select>
							</el-form-item>
						</template>
					</sc-file-export>
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
					<el-table-column label="ID" prop="id" width="100" sortable></el-table-column>
					<el-table-column label="名称" prop="name" width="200"></el-table-column>
					<el-table-column label="标题" prop="title" width="200"></el-table-column>
					<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
					<el-table-column label="状态" prop="status" width="80">
						<template #default="scope">
							<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="150"></el-table-column>
					<el-table-column label="更新时间" prop="updateTime" width="150"></el-table-column>
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
	import scFileImport from '@/components/scFileImport'
	import scFileExport from '@/components/scFileExport'
	import treeUtils from '@/utils/tree'

	import saveDialog from './save'

	export default {
		name: 'platformSysMenu',
		components: {
			saveDialog,
			scFileImport,
			scFileExport,
		},
		data(){
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.platform.sys.menu.list,
				params: {},
				column: [
					{
						label: "ID",
						prop: "id"
					},
					{
						label: "名称",
						prop: "name"
					},
					{
						label: "路径",
						prop: "path"
					},
					{
						label: "组件",
						prop: "component"
					},
					{
						label: "重定向地址",
						prop: "redirect"
					},
					{
						label: "显示名称",
						prop: "title"
					},
					{
						label: "是否隐藏菜单",
						prop: "hidden"
					},
					{
						label: "是否固定",
						prop: "affix"
					},
					{
						label: "显示图标",
						prop: "icon"
					},
					{
						label: "菜单类型",
						prop: "type"
					},
					{
						label: "是否隐藏面包屑",
						prop: "hiddenBreadcrumb"
					},
					{
						label: "左侧菜单的路由地址活动状态",
						prop: "active"
					},
					{
						label: "颜色值",
						prop: "color"
					},
					{
						label: "是否整页打开路由",
						prop: "fullpage"
					},
					{
						label: "角色",
						prop: "role"
					},
					{
						label: "标签",
						prop: "tag"
					},
					{
						label: "父类ID",
						prop: "parentId"
					},
					{
						label: "排序",
						prop: "sort"
					},
					{
						label: "状态",
						prop: "status"
					},
					{
						label: "元数据",
						prop: "meta",
						hide: true
					}
				],
				selection: [],
				search: {
					keyword: null
				},
				treeShowLoading: true,
				treeStatus: false,
				treeList: [],
				treeFilterText: '',
				treeProps: {
					label: 'title'
				},
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
			async table_del(row){
				var reqData = {id: row.id}
				var res = await this.$API.platform.sys.menu.delete.delete(reqData);
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
					var res = await this.$API.platform.sys.menu.delete.delete(reqData)
					if (res.code == 200) {
						this.selection.forEach(item => {
							this.$refs.table.tableData.forEach((itemI, indexI) => {
								if (item.id === itemI.id) {
									this.$refs.table.tableData.splice(indexI, 1)
								}
							})
						})
						this.$message.success("操作成功")
					} else {
						await this.$alert(res.message, "提示", {type: 'error'})
					}

					// this.$refs.table.refresh()
					loading.close();
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//表格内开关
			async changeSwitch(val, row){
				row.status = row.status == '1'?'0':'1'
				row.$switch_status = true;
				var reqData = {id: row.id,status: val}
				var res = await this.$API.platform.sys.menu.update.put(reqData);
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
			async syncMenu(){
				var reqData = {}
				var res = await this.$API.platform.sys.menu.sync.post(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("操作成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
				//重获获取用户菜单
				// this.$store.commit("getUserMenus")
				// 触发树更新
				treeUtils.treeHandleSuccess(this.$refs.tree, data, mode)
			},
			//加载树数据
			async getTreeList(){
				let res = await this.$API.platform.sys.menu.tree.get();
				this.treeShowLoading = false;
				const allNode = {id: '', name: '全部', label: '全部', title: '全部', disabled: true,};
				res.data.unshift(allNode);
				this.treeList = res.data;
			},
			//树点击
			treeNodeClick(data){
				this.params.parentId = data.id
				this.$refs.table.reload(this.params)
			},
			/*treeNodeClick(data, node){
				const pid = node.level == 1 ? undefined : node.parent.data.id;
				console.log('pid', pid);
				this.params.parentId = data.id
				this.$refs.table.reload(this.params)
			},*/
			//树过滤
			treeNodeFilter(value, data){
				if (!value) return true;
				var targetText = data.name + data.code + data.title;
				return targetText.indexOf(value) !== -1;
			},
			//树拖拽
			async treeNodeDrop(draggingNode, dropNode, dropType) {
				treeUtils.treeNodeDrop(draggingNode, dropNode, dropType, async data => {
					this.loading = true;
					let res = data.id
						? await this.$API.platform.sys.menu.update.put(data)
						: await this.$API.platform.sys.menu.add.post(data);
					if (res.code == 200) {
						this.$message.success("保存成功");
					} else {
						this.$message.warning(res.message);
					}
					this.loading = false;
				})
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
				var res = await this.$API.platform.sys.menu.delete.delete(reqData)

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
					var res = await this.$API.platform.sys.menu.delete.delete(reqData);
					if(res.code == 200){
						this.$refs.tree.remove(node)
						this.$refs.table.refresh()
						this.$message.success("删除成功")
					}else{
						await this.$alert(res.message, "提示", {type: 'error'})
					}
				}).catch(() => {
				})
			},
			//树展开/收缩
			shrinkTreeNode () {
				// 改变一个全局变量
				this.treeStatus = !this.treeStatus;
				// 改变每个节点的状态
				treeUtils.changeTreeNodeStatus(this.$refs.tree.store.root, this.treeStatus);
			},
		}
	}
</script>

<style scoped>
	.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;height:100%;padding-right:24px;}
	.custom-tree-node .label {display: flex;align-items: center;;height: 100%;}
	.custom-tree-node .label .el-tag {margin-left: 5px;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node .do i {margin-left:5px;color: #999;}
	.custom-tree-node .do i:hover {color: #333;}

	.custom-tree-node:hover .do {display: inline-block;}
</style>
