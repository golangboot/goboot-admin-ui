<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
				<el-button type="danger" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del"></el-button>
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
				<el-table-column label="拖动排序" width="80" fixed>
					<template #default>
						<el-tag class="move" style="cursor: move;"><el-icon-d-caret style="width: 1em; height: 1em;"/></el-tag>
					</template>
				</el-table-column>
        <el-table-column label="字典项名称" prop="name" width="120" fixed>
          <template #default="scope">
            <el-tooltip :content="scope.row.name" effect="light" :disabled="!(scope.row.name && scope.row.name.length > 60)">
              <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
                {{scope.row.name}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="字典项值" prop="value" width="150">
          <template #default="scope">
            <el-tooltip :content="scope.row.value" effect="light" :disabled="!(scope.row.value && scope.row.value.length > 60)">
              <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
                {{scope.row.value}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="字典项类型" prop="type" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="是否锁定" prop="isLock" width="100" sortable>
          <template #default="scope">
            <el-switch v-model="scope.row.isLock"
                       @change="isLockChangeSwitch($event, scope.row)"
                       :loading="scope.row.$switch_isLock"
                       :active-value="1" :inactive-value="0"
                       active-text="已锁定" inactive-text="未锁定"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            >
            </el-switch>
          </template>
        </el-table-column>
				<el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
				<el-table-column label="状态" prop="status" width="80">
					<template #default="scope">
						<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
					</template>
				</el-table-column>
        <el-table-column label="字典项编码" prop="code" width="150">
          <template #default="scope">
            <el-tooltip :content="scope.row.code" effect="light" :disabled="!(scope.row.code && scope.row.code.length > 60)">
              <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
                {{scope.row.code}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="字典项描述" prop="description" width="150">
          <template #default="scope">
            <el-tooltip :content="scope.row.description" effect="light" :disabled="!(scope.row.description && scope.row.description.length > 60)">
              <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
                {{scope.row.description}}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
				<el-table-column label="ID" prop="id" width="150" sortable></el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="150"></el-table-column>
				<el-table-column label="更新时间" prop="updateTime" width="150"></el-table-column>
				<el-table-column label="操作" fixed="right" align="center" width="170">
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
	import Sortable from "sortablejs";

	export default {
		name: 'backendSysDictItem',
		components: {
			saveDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.backend.sys.dictItem.list,
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
			this.rowDrop()
		},
		methods: {
			//添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					let form = {}
					if (this.params.dictId){
						form.dictId = this.params.dictId
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
				var res = await this.$API.backend.sys.dictItem.delete.delete(reqData);
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
					var res = await this.$API.backend.sys.dictItem.delete.delete(reqData)
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
				var res = await this.$API.backend.sys.dictItem.update.put(reqData);
				delete row.$switch_status;
				if(res.code == 200){
					row.status = val;
					this.$message.success("操作成功")
				}else{
					await this.$alert(res.message, "提示", {type: 'error'})
				}
			},
      async isLockChangeSwitch(val, row) {
        //1.还原数据
        row.isLock = row.isLock == 1 ? 0 : 1
        //2.执行加载
        row.$switch_isLock = true;
        //3.等待接口返回后改变值
        let reqData = {id: row.id, isLock: val}
        let res = await this.$API.backend.sys.dict.update.put(reqData);
        delete row.$switch_isLock;
        if (res.code == 200) {
          row.isLock = val;
          this.$message.success("操作成功")
        } else {
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
			//行拖拽
			rowDrop(){
				const _this = this
				const tbody = this.$refs.table.$el.querySelector('.el-table__body-wrapper tbody')
				Sortable.create(tbody, {
					handle: ".move",
					animation: 300,
					ghostClass: "ghost",
					async onEnd({newIndex, oldIndex}) {
						const tableData = _this.$refs.table.tableData
						const currRow = tableData.splice(oldIndex, 1)[0]
						tableData.splice(newIndex, 0, currRow)
						// _this.$message.success("排序成功")
						// console.log('rowDrop -> newIndex:', newIndex)
						// console.log('rowDrop -> oldIndex:', oldIndex)
						// console.log('rowDrop -> currRow:', currRow)
						// console.log('rowDrop -> tableData:', tableData)
						let sort = 1000
						const lastRow = tableData[newIndex - 1]
						const nextRow = tableData[newIndex + 1]
						// console.log('rowDrop -> lastRow:', lastRow)
						// console.log('rowDrop -> nextRow:', nextRow)
						if (lastRow && lastRow.sort) {
							sort = lastRow.sort + 1
						} else if (nextRow && nextRow.sort) {
							sort = nextRow.sort - 1
						}
						let reqData = currRow
						reqData.sort = sort
						let res = await _this.$API.backend.sys.dictItem.update.put(reqData)
						if (res.code == 200) {
							_this.handleSaveSuccess(res.data, 'edit')
							_this.$message.success("排序成功")
						} else {
							await _this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
		}
	}
</script>

<style>
</style>
