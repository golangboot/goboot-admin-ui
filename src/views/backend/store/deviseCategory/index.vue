<template>
	<el-container>
		<el-container class="is-vertical">
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
					<el-table-column label="ID" prop="id" width="150" sortable></el-table-column>
					<el-table-column label="商品分类" prop="category" width="100" :show-overflow-tooltip="true">
						<template #default="scope">
							<span>{{ scope.row.category?.name }}</span>
						</template>
					</el-table-column>
          <el-table-column label="标题" prop="title" width="200">
            <template #default="scope">
              <el-tooltip :content="scope.row.title" effect="light" :disabled="!(scope.row.title && scope.row.title.length > 60)">
					  <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
						{{scope.row.title}}
					  </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <!--<el-table-column label="编码" prop="code" width="150" :show-overflow-tooltip="true"></el-table-column>-->
          <el-table-column label="位置" prop="position" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="端点" prop="endpoint" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="左侧图片" prop="leftImage" width="100">
						<template #default="scope">
							<div style="display: flex; align-items: center; max-width: 40px; height: 40px;">
								<el-image class="image" :src="scope.row.leftImage" :preview-src-list="[scope.row.leftImage]" v-if="scope.row.leftImage" fit="cover" hide-on-click-modal preview-teleported></el-image>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="左侧链接" prop="leftLink" width="150" :show-overflow-tooltip="true"></el-table-column>
          <!--<el-table-column label="顶部图片" prop="topImage" width="100">
            <template #default="scope">
              <div style="display: flex; align-items: center; max-width: 40px; height: 40px;">
                <el-image class="image" :src="scope.row.topImage" :preview-src-list="[scope.row.topImage]" v-if="scope.row.topImage" fit="cover" hide-on-click-modal preview-teleported></el-image>
              </div>
            </template>
          </el-table-column>-->
         <!-- <el-table-column label="顶部链接" prop="topLink" width="150" :show-overflow-tooltip="true"></el-table-column>-->
					<el-table-column label="底部图片" prop="bottomImage" width="100">
						<template #default="scope">
							<div style="display: flex; align-items: center; max-width: 40px; height: 40px;">
								<el-image class="image" :src="scope.row.bottomImage" :preview-src-list="[scope.row.bottomImage]" v-if="scope.row.bottomImage" fit="cover" hide-on-click-modal preview-teleported></el-image>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="底部链接" prop="bottomLink" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column label="描述" prop="description" width="200">
            <template #default="scope">
              <el-tooltip :content="scope.row.description" effect="light" :disabled="!(scope.row.description && scope.row.description.length > 60)">
					  <span style="display:-webkit-box; text-overflow:ellipsis; overflow:hidden; -webkit-line-clamp: 2; -webkit-box-orient:vertical;">
						{{scope.row.description}}
					  </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" width="80" sortable></el-table-column>
					<el-table-column label="状态" prop="status" width="80" sortable>
						<template #default="scope">
							<el-switch v-model="scope.row.status" @change="changeSwitch($event, scope.row)" :loading="scope.row.$switch_status" :active-value="1" :inactive-value="0"></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" prop="createTime" width="150"></el-table-column>
					<el-table-column label="更新时间" prop="updateTime" width="150"></el-table-column>
					<el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
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
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './save'

	export default {
		name: 'backendStoreDeviseCategory',
		components: {
			saveDialog,
		},
		data() {
			return {
				dialog: {
					save: false,
				},
				apiObj: this.$API.backend.store.deviseCategory.list,
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
				var res = await this.$API.backend.store.deviseCategory.delete.delete(reqData);
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
					var res = await this.$API.backend.store.deviseCategory.delete.delete(reqData)
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
				var res = await this.$API.backend.store.deviseCategory.update.put(reqData);
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
		}
	}
</script>

<style>
</style>
