<template>
	<el-container>
		<el-aside width="300px" v-loading="showDictloading">
			<el-container>
				<el-header>
					<el-input placeholder="输入关键字进行过滤" v-model="dictFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="dict" class="menu" node-key="id" :data="dictList" :props="dictProps" draggable :highlight-current="true" :expand-on-click-node="false" check-strictly show-checkbox :filter-node-method="dictFilterNode" @node-click="dictClick" @node-drop="nodeDrop">
						<template #default="{node, data}">
							<span class="custom-tree-node">
								<span class="label">{{ node.label }}</span>
								<span class="code">{{ data.code }}</span>
								<span class="do">
									<el-button-group>
										<el-button icon="el-icon-edit" size="small" @click.stop="dictEdit(data)"></el-button>
										<el-button icon="el-icon-delete" size="small" @click.stop="dictDel(node, data)"></el-button>
									</el-button-group>
								</span>
							</span>
						</template>
					</el-tree>
				</el-main>
				<el-footer style="height:51px;">
					<el-button type="primary" size="small" icon="el-icon-plus" @click="addDict"></el-button>
					<el-button type="danger" size="small" plain icon="el-icon-delete" @click="delDict"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<el-button type="primary" icon="el-icon-plus" @click="addInfo"></el-button>
					<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable ref="table" :apiObj="listApi" row-key="id" :params="listApiParams" @selection-change="selectionChange" stripe :paginationLayout="'prev, pager, next'">
					<el-table-column type="selection" width="50"></el-table-column>
					<el-table-column label="" width="60">
						<template #default>
							<el-tag class="move" style="cursor: move;"><el-icon-d-caret style="width: 1em; height: 1em;"/></el-tag>
						</template>
					</el-table-column>
					<el-table-column label="名称" prop="name" width="150"></el-table-column>
					<el-table-column label="编码" prop="code" width="150"></el-table-column>
					<el-table-column label="键值" prop="value" width="150"></el-table-column>
					<el-table-column label="排序" prop="sort" width="150" sortable></el-table-column>
					<el-table-column label="是否有效" prop="status" width="100">
						<template #default="scope">
							<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="right" width="120">
						<template #default="scope">
							<el-button-group>
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

	<dict-dialog v-if="dialog.dict" ref="dictDialog" @success="handleDictSuccess" @closed="dialog.dict=false"></dict-dialog>

	<list-dialog v-if="dialog.list" ref="listDialog" @success="handleListSuccess" @closed="dialog.list=false"></list-dialog>

</template>

<script>
	import dictDialog from './dict'
	import listDialog from './list'
	import Sortable from 'sortablejs'

	export default {
		name: 'dict',
		components: {
			dictDialog,
			listDialog
		},
		data() {
			return {
				dialog: {
					dict: false,
					info: false
				},
				showDictloading: true,
				dictList: [],
				dictFilterText: '',
				dictProps: {
					label: 'name'
				},
				listApi: null,
				listApiParams: {},
				selection: []
			}
		},
		watch: {
			dictFilterText(val) {
				this.$refs.dict.filter(val);
			}
		},
		mounted() {
			this.getDict()
			this.rowDrop()
		},
		methods: {
			//加载树数据
			async getDict(){
				var res = await this.$API.system.dict.tree.get();
				this.showDictloading = false;
				this.dictList = res.data;
				//获取第一个节点,设置选中 & 加载明细列表
				var firstNode = this.dictList[0];
				if(firstNode){
					this.$nextTick(() => {
						this.$refs.dict.setCurrentKey(firstNode.id)
					})
					this.listApiParams = {
						parentId: firstNode.id,
						// code: firstNode.code,
					}
					this.listApi = this.$API.system.dict.list;
				}
			},
			//树过滤
			dictFilterNode(value, data){
				if (!value) return true;
				var targetText = data.name + data.code;
				return targetText.indexOf(value) !== -1;
			},
			//树增加
			addDict(){
				this.dialog.dict = true
				this.$nextTick(() => {
					this.$refs.dictDialog.open()
				})
			},
			//批量删除选中字典
			async delDict(){
				var CheckedNodes = this.$refs.dict.getCheckedNodes()
				if (CheckedNodes.length == 0) {
					this.$message.warning("请选择需要删除的项")
					return false;
				}

				var confirm = await this.$confirm('确认删除已选择的字典吗？', '提示', {
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
				var res = await this.$API.system.dict.delete.delete(reqData)
				this.menuloading = false

				if (res.code == 200) {
					CheckedNodes.forEach(item => {
						var node = this.$refs.dict.getNode(item)
						if (node.isCurrent) {
							// this.$refs.save.setData({})
						}
						this.$refs.dict.remove(item)
					})
				} else {
					this.$message.warning(res.message)
				}
			},
			//编辑树
			dictEdit(data){
				this.dialog.dict = true
				this.$nextTick(() => {
					var editNode = this.$refs.dict.getNode(data.id);
					var editNodeParentId =  editNode.level==1?undefined:editNode.parent.data.id
					data.parentId = editNodeParentId
					this.$refs.dictDialog.open('edit').setData(data)
				})
			},
			//树点击事件
			dictClick(data){
				this.$refs.table.reload({
					parentId: data.id,
					// code: data.code,
				})
			},
			//删除树
			async dictDel(node, data){
				this.$confirm(`确定删除 ${data.name} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					this.showDictloading = true;

					var reqData = {
						id: data.id
					}
					var res = await this.$API.system.dict.delete.delete(reqData)
					if (res.code == 200) {
						//删除节点是否为高亮当前 是的话 设置第一个节点高亮
						var dictCurrentKey = this.$refs.dict.getCurrentKey();
						this.$refs.dict.remove(data.id)
						if (dictCurrentKey == data.id) {
							var firstNode = this.dictList[0];
							if (firstNode) {
								this.$refs.dict.setCurrentKey(firstNode.id);
								this.$refs.table.upData({
									code: firstNode.code
								})
							} else {
								this.listApi = null;
								this.$refs.table.tableData = []
							}
						}

						this.$message.success("操作成功")
					} else {
						this.$message.warning(res.message)
					}

					this.showDictloading = false;

				}).catch(() => {

				})
			},
			//树拖拽
			async nodeDrop(draggingNode, dropNode, dropType){
				// this.$message(`拖拽对象：${draggingNode.data.meta.title}, 释放对象：${dropNode.data.meta.title}, 释放对象的位置：${dropType}`)

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

				var data = draggingNode.data;
				data.parentId = parentId;
				data.sort = sort;

				this.loading = true

				var res
				if (data.id) {
					res = await this.$API.system.dict.update.put(data)
				} else {
					res = await this.$API.system.dict.add.post(data)
				}
				if (res.code == 200) {
					this.$message.success("保存成功")
				} else {
					this.$message.warning(res.message)
				}

				this.loading = false
			},
			//行拖拽
			rowDrop(){
				const _this = this
				const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody')
				Sortable.create(tbody, {
					handle: ".move",
					animation: 300,
					ghostClass: "ghost",
					onEnd({ newIndex, oldIndex }) {
						const tableData = _this.$refs.table.tableData
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
						_this.$message.success("排序成功")
					}
				})
			},
			//添加明细
			addInfo(){
				this.dialog.list = true
				this.$nextTick(() => {
					var dictCurrentKey = this.$refs.dict.getCurrentKey();
					console.log('dictCurrentKey', dictCurrentKey)
					const data = {
						// dict: dictCurrentKey,
						// dict: this.dictList,
						parentId: dictCurrentKey,
					}
					this.$refs.listDialog.open().setData(data)
				})
			},
			//编辑明细
			table_edit(row){
				this.dialog.list = true
				this.$nextTick(() => {
					this.$refs.listDialog.open('edit').setData(row)
				})
			},
			//删除明细
			async table_del(row, index){
				var reqData = {id: row.id}
				var res = await this.$API.system.dict.delete.delete(reqData);
				if(res.code == 200){
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
				}).then(async () => {
					const loading = this.$loading();

					// var ids = this.selection.map(v => v.id)
					var reqData = {
						ids: this.selection.map(v => v.id)
					}
					var res = await this.$API.system.dict.delete.delete(reqData)
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
						this.$alert(res.message, "提示", {type: 'error'})
					}

					loading.close();
				}).catch(() => {

				})
			},
			//提交明细
			saveList(){
				this.$refs.listDialog.submit(async (formData) => {
					this.isListSaveing = true;
					var res = await this.$API.demo.post.post(formData);
					this.isListSaveing = false;
					if(res.code == 200){
						//这里选择刷新整个表格 OR 插入/编辑现有表格数据
						this.listDialogVisible = false;
						this.$message.success("操作成功")
					}else{
						this.$alert(res.message, "提示", {type: 'error'})
					}
				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//表格内开关事件
			async changeSwitch(val, row){
				//1.还原数据
				row.status = row.status == '1'?'0':'1'
				//2.执行加载
				row.$switch_status = true;
				//3.等待接口返回后改变值
				var reqData = {id: row.id,status: val}
				var res = await this.$API.system.dict.update.put(reqData);
				delete row.$switch_status;
				if(res.code == 200){
					row.status = val;
					this.$message.success("操作成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//本地更新数据
			handleDictSuccess(data, mode){
				if(mode=='add'){
					data.id = data.id ?? new Date().getTime()
					if(this.dictList.length > 0){
						this.$refs.table.upData({
							code: data.code
						})
					}else{
						this.listApiParams = {
							code: data.code,
						}
						this.listApi = this.$API.dict.info;
					}
					this.$refs.dict.append(data, data.parentId[0])
					this.$refs.dict.setCurrentKey(data.id)
				}else if(mode=='edit'){
					var editNode = this.$refs.dict.getNode(data.id);
					//判断是否移动？
					var editNodeParentId =  editNode.level==1?undefined:editNode.parent.data.id
					console.log('handleDictSuccess editNodeParentId', editNodeParentId)
					if(editNodeParentId != data.parentId){
						var obj = editNode.data;
						this.$refs.dict.remove(data.id)
						this.$refs.dict.append(obj, data.parentId[0])
					}
					Object.assign(editNode.data, data)
				}
				this.getDict()
			},
			//本地更新数据
			handleListSuccess(data, mode){
				if(mode=='add'){
					data.id = data.id ?? new Date().getTime()
					this.$refs.table.tableData.push(data)
				}else if(mode=='edit'){
					this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
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
