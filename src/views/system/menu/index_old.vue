<template>
	<el-container>
		<el-aside width="20%" v-loading="menuloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="menuFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="menu" class="menu" node-key="id" :data="menuList" :props="menuProps" draggable :highlight-current="true" :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="menuFilterNode" @node-click="menuClick" @node-drop="nodeDrop">

						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">
									{{ node.label }}
								</span>
								<span class="do">
									<el-button icon="el-icon-plus" size="small" @click.stop="add(node, data)"></el-button>
								</span>
							</span>
						</template>

					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="addMenu()"></el-button>
					<el-button type="danger" size="small" plain icon="el-icon-delete" @click="delMenu"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-aside width="30%">
			<el-container>
				<el-main class="nopadding" style="padding:20px;" ref="main">
					<edit ref="edit" :menu="menuList"></edit>
				</el-main>
			</el-container>
		</el-aside>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
					<!--<el-button type="primary" plain @click="syncMenu">同步菜单</el-button>-->
					<sc-file-import :apiObj="$API.system.menu.import" :data="{otherData:'meta'}" templateUrl="http://www.scuiadmin/file.xlsx" accept=".xls, .xlsx" :maxSize="30" tip="请上传小于或等于 30M 的 .xls, .xlsx 格式文件(自定义TIP)" @success="success">
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
					<sc-file-export :apiObj="$API.system.menu.export" blob :fileName="'菜单列表_'+Date.now()" :data="{otherData:'meta'}" showData :column="column" :fileTypes="['xlsx','docx','pdf']">
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
					<el-table-column label="名称" prop="name" width="150"></el-table-column>
					<el-table-column label="标题" prop="title" width="200"></el-table-column>
					<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
					<el-table-column label="状态" prop="status" width="80">
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
	import scFileImport from '@/components/scFileImport'
	import scFileExport from '@/components/scFileExport'

	import saveDialog from './save'

	let newMenuIndex = 1;
	import edit from './edit'

	export default {
		name: "settingMenu",
		components: {
			saveDialog,
			edit,
			scFileImport,
			scFileExport,
		},
		data(){
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.system.menu.list,
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
				menuloading: false,
				menuList: [],
				menuProps: {
					label: (data)=>{
						return data.meta.title
					}
				},
				menuFilterText: ""
			}
		},
		watch: {
			menuFilterText(val){
				this.$refs.menu.filter(val);
			}
		},
		mounted() {
			this.getMenu();
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
				var res = await this.$API.system.menu.delete.delete(reqData);
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
					var res = await this.$API.system.menu.delete.delete(reqData)
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
				var res = await this.$API.system.menu.update.put(reqData);
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
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
			},
			async syncMenu(){
				var reqData = {}
				var res = await this.$API.system.menu.sync.post(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("操作成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//加载树数据
			async getMenu(){
				this.menuloading = true
				var res = await this.$API.system.menu.tree.get();
				this.menuloading = false
				this.menuList = res.data;
			},
			//树点击
			menuClick(data, node){
				var pid = node.level==1?undefined:node.parent.data.id;
				this.$refs.edit.setData(data, pid)
				this.$refs.main.$el.scrollTop = 0
			},
			//树过滤
			menuFilterNode(value, data){
				if (!value) return true;
				var targetText = data.meta.title;
				return targetText.indexOf(value) !== -1;
			},
			//树拖拽
			async nodeDrop(draggingNode, dropNode, dropType){
				this.$refs.edit.setData({})
				// this.$message(`拖拽对象：${draggingNode.data.meta.title}, 释放对象：${dropNode.data.meta.title}, 释放对象的位置：${dropType}`)
				// console.log('dropType:', dropType); // dropType: before | after | inner
				// console.log('dropNode.data:', dropNode.data);
				// console.log('draggingNode.data:', draggingNode.data);

				// 父类id
				var parentId = dropNode.data.parentId || 0;
				if (dropType === 'inner'){
					parentId = dropNode.data.id;
				}
				// 排序
				var sort = dropNode.data.sort;
				if (sort) {
					sort = dropType === 'before' ? parseInt(sort) - 1 : parseInt(sort) + 1;
				} else {
					sort = 1000
				}
				// console.log('parentId:', parentId);
				// console.log('sort:', sort);
				var data = draggingNode.data;
				data.parentId = parentId;
				data.sort = sort;

				this.loading = true

				var res
				if (data.id) {
					res = await this.$API.system.menu.update.put(data)
				} else {
					res = await this.$API.system.menu.add.post(data)
				}
				if (res.code == 200) {
					this.$message.success("保存成功")
				} else {
					this.$message.warning(res.message)
				}

				this.loading = false
			},
			//增加
			async addMenu(node, data){
				var newMenuName = "未命名" + newMenuIndex++;
				var newMenuData = {
					parentId: data ? data.id : "",
					name: newMenuName,
					path: "",
					component: "",
					meta:{
						title: newMenuName,
						type: "menu"
					}
				}
				this.menuloading = true
				var res = await this.$API.system.menu.add.post(newMenuData)
				this.menuloading = false
				newMenuData.id = res.data.id || res.data

				this.$refs.menu.append(newMenuData, node)
				this.$refs.menu.setCurrentKey(newMenuData.id)
				var pid = node ? node.data.id : ""
				this.$refs.edit.setData(newMenuData, pid)
			},
			//删除菜单
			async delMenu(){
				var CheckedNodes = this.$refs.menu.getCheckedNodes()
				if(CheckedNodes.length == 0){
					this.$message.warning("请选择需要删除的项")
					return false;
				}

				var confirm = await this.$confirm('确认删除已选择的菜单吗？','提示', {
					type: 'warning',
					confirmButtonText: '删除',
					confirmButtonClass: 'el-button--danger'
				}).catch(() => {})
				if(confirm != 'confirm'){
					return false
				}

				this.menuloading = true
				var reqData = {
					ids: CheckedNodes.map(item => item.id)
				}
				var res = await this.$API.system.menu.delete.delete(reqData)
				this.menuloading = false

				if(res.code == 200){
					CheckedNodes.forEach(item => {
						var node = this.$refs.menu.getNode(item)
						if(node.isCurrent){
							this.$refs.edit.setData({})
						}
						this.$refs.menu.remove(item)
					})
				}else{
					this.$message.warning(res.message)
				}
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
