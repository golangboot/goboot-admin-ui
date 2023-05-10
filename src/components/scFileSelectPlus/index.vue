<!--
 * @Descripttion: 资源文件选择器Plus
 * @version: 1.0.0
 * @Author: 鸿宇
 * @Date: 2023年4月30日12:06:59
 * @LastEditors:
 * @LastEditTime:
-->

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
					<el-button type="default" size="small" icon="el-icon-folder-opened" @click="shrinkTreeNode" v-if="treeStatus"></el-button>
					<el-button type="default" size="small" icon="el-icon-folder" @click="shrinkTreeNode" v-if="!treeStatus"></el-button>
				</el-footer>
			</el-container>
		</el-aside>
		<el-container class="is-vertical">
			<el-header>
				<div class="left-panel">
					<div class="upload" v-if="!hideUpload">
						<el-upload class="sc-file-select__upload" action="" multiple :show-file-list="false" :accept="accept" :on-change="uploadChange" :before-upload="uploadBefore" :on-progress="uploadProcess" :on-success="uploadSuccess" :on-error="uploadError" :http-request="uploadRequest">
							<el-button type="primary" icon="el-icon-upload">本地上传</el-button>
						</el-upload>
						<span class="tips" style="margin-left:10px;"><el-icon><el-icon-warning /></el-icon>大小不超过{{maxSize}}MB</span>
					</div>
				</div>
				<div class="right-panel">
					<div class="right-panel-search">
						<el-input v-model="keyword" placeholder="文件名搜索" clearable @keyup.enter="search" @clear="search"></el-input>
						<el-button type="primary" icon="el-icon-search" @click="search"></el-button>
					</div>
				</div>
			</el-header>
			<el-main class="nopadding">
				<el-scrollbar ref="scrollbar">
					<el-empty v-if="tempFileList.length==0 && fileList.length==0" description="无数据" :image-size="80"></el-empty>
					<div class="sc-file-select__list" v-else>
						<!--<el-checkbox-group v-model="selectionList" :min="0" :max="max">-->
						<el-row :gutter="10" class="box">
							<el-col :span="rowCol" v-for="(file, index) in tempFileList" :key="index">
								<div class="sc-file-select__item">
									<div class="sc-file-select__item__file">
										<div class="sc-file-select__item__upload">
											<el-progress type="circle" :percentage="file.progress" :width="70"></el-progress>
										</div>
										<el-image :src="file.tempImg" fit="contain"></el-image>
									</div>
									<p>{{file.name}}</p>
								</div>
							</el-col>
							<el-col :span="rowCol" v-for="(item) in fileList" :key="item[fileProps.key]">
								<el-card shadow="hover" header="" class="item-background" :body-style="{ padding: '10px' }">
									<div class="sc-file-select__item" :class="{active: selection.includes(item[fileProps.url]) }">
										<div class="sc-file-select__item__file" @click="select(item)">
											<div class="sc-file-select__item__checkbox" v-if="multiple">
												<el-icon><el-icon-check /></el-icon>
											</div>
											<div class="sc-file-select__item__select" v-else>
												<el-icon><el-icon-check /></el-icon>
											</div>
											<div class="sc-file-select__item__box"></div>
											<el-image v-if="_isImg(item[fileProps.url])" :src="item[fileProps.url]" fit="contain" lazy></el-image>
											<div v-else class="item-file item-file-doc" style="position:relative;">
												<el-icon v-if="files[_getExt(item[fileProps.url])]" :class="files[_getExt(item[fileProps.url])].icon" :style="{color:files[_getExt(item[fileProps.url])].color}">
													<component :is="files[_getExt(item[fileProps.url])].icon" />
												</el-icon>
												<el-icon v-else class="sc-icon-file-list-fill" style="color: #999;">
													<component :is="files['unknown'].icon" />
												</el-icon>
												<!--<i v-if="files[_getExt(item[fileProps.url])]" :class="files[_getExt(item[fileProps.url])].icon" :style="{color:files[_getExt(item[fileProps.url])].color}"></i>-->
												<!--<i v-else class="sc-icon-file-list-fill" style="color: #999;"></i>-->
												<!--<el-badge :value="item.type" class="item"></el-badge>-->
												<el-tag type="info" style="margin-top: 10px;">{{ item.ext || item.contentType }}</el-tag>
											</div>
										</div>
										<p :title="item[fileProps.originalFilename]" style="width:100%; overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{item[fileProps.originalFilename]}}</p>
										<!--<el-checkbox v-model="item[fileProps.key]" :key="item[fileProps.key]" :label="item[fileProps.fileName]" :title="item[fileProps.fileName]" style="margin-top: 0px;width: 100%;"></el-checkbox>-->
										<div class="item-button-group" style="text-align: center;">
											<el-button-group>
												<el-button text type="primary" size="small" @click="table_show(item, item[fileProps.key])">查看</el-button>
												<el-button text type="primary" size="small" @click="table_edit(item, item[fileProps.key])">编辑</el-button>
												<el-popconfirm title="确定删除吗？" @confirm="table_del(item, item[fileProps.key])">
													<template #reference>
														<el-button text type="primary" size="small">删除</el-button>
													</template>
												</el-popconfirm>
											</el-button-group>
										</div>
									</div>
								</el-card>
							</el-col>
						</el-row>
						<!--</el-checkbox-group>-->
					</div>
				</el-scrollbar>
			</el-main>
			<el-footer>
				<div class="left-panel">
					<el-pagination small background layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize" :page-sizes="pageSizes" v-model:currentPage="currentPage" @current-change="paginationChange" @update:page-size="pageSizeChange"></el-pagination>
				</div>
				<div class="right-panel" style="text-align: right;">
					<div class="sc-file-select__side-msg" v-if="multiple" style="position: absolute;">
						已选择 <b>{{selection.length}}</b> / <b>{{max}}</b> 项
					</div>
					<slot name="do"></slot>
					<!--<el-button type="default" :disabled="selection.length != 1" v-if="selection.length > 0" @click="openSelect()">预览</el-button>-->
					<el-button type="danger" v-if="selection.length > 0" @click="deleteSelect()">删除选中</el-button>
					<el-button type="default" v-if="selection.length > 0" @click="cancelSelect()">取消选中</el-button>
					<el-button type="default" v-if="multiple" @click="allSelect()">全选</el-button>
					<el-button type="primary" :disabled="selection.length<=0" @click="submit">确 定</el-button>
				</div>
			</el-footer>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSaveSuccess" @closed="dialog.save=false"></save-dialog>
	<tree-save-dialog v-if="dialog.treeSave" ref="treeSaveDialog" @success="handleTreeSaveSuccess" @closed="dialog.treeSave=false"></tree-save-dialog>

</template>

<script>
	import config from "@/config/fileSelectPlus"
	import treeUtils from '@/utils/tree'
	import treeSaveDialog from './treeSave'
	import saveDialog from './save'

	export default {
		components: {
			saveDialog,
			treeSaveDialog,
		},
		props: {
			modelValue: null,
			hideUpload: { type: Boolean, default: false },
			multiple: { type: Boolean, default: false },
			max: {type: Number, default: config.max},
			rowCol: {type: Number, default: config.rowCol},
			onlyImage: { type: Boolean, default: false },
			maxSize: {type: Number, default: config.maxSize},
		},
		data() {
			return {
				dialog: {
					save: false,
					treeSave: false,
				},
				keyword: null,
				pageSize: config.pageSize || 20,
				pageSizes: [10, 20, 30, 40, 50, 100, 500, 1000],
				total: 0,
				currentPage: 1,
				fileList: [],
				menu: [],
				menuId: '',
				selectionList: [],
				selection: this.multiple ? [] : '',
				tempFileList: [],
				accept: this.onlyImage ? "image/gif, image/jpeg, image/png" : "",
				listLoading: false,
				menuLoading: false,
				// treeProps: config.menuProps,
				fileProps: config.fileProps,
				files: config.files,
				treeShowLoading: true,
				treeStatus: false,
				treeList: [],
				treeFilterText: '',
				treeProps: {
					key: 'id',
					label: 'name', // label
					children: 'children',
				},
			}
		},
		watch: {
			treeFilterText(val) {
				this.$refs.tree.filter(val);
			},
			multiple(){
				this.selection = this.multiple ? [] : ''
				this.$emit('update:modelValue', JSON.parse(JSON.stringify(this.selection)));
			}
		},
		mounted() {
			this.getTreeList()
			this.getMenu()
			this.getData()
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
				var res = await this.$API.file.fileDetail.delete.delete(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//获取分类数据
			async getMenu(){
				this.menuLoading = true
				var res = await config.menuApiObj.get()
				this.menu = res.data
				this.menuLoading = false
			},
			//获取列表数据
			async getData(){
				this.listLoading = true
				var reqData = {
					[config.request.menuKey]: this.menuId,
					[config.request.page]: this.currentPage,
					[config.request.pageSize]: this.pageSize,
					[config.request.keyword]: this.keyword
				}
				if(this.onlyImage){
					reqData.type = 'image'
				}
				if (!reqData[config.request.menuKey]){
					delete reqData[config.request.menuKey]
				}
				var res = await config.listApiObj.get(reqData)
				var parseData = config.listParseData(res)
				this.fileList = parseData.rows
				this.total = parseData.total
				this.listLoading = false
				this.$refs.scrollbar.setScrollTop(0)
			},
			//树点击事件
			groupClick(data){
				this.menuId = data.id
				this.currentPage = 1
				this.keyword = null
				this.getData()
				// this.cancelSelect()
			},
			//分页刷新表格
			reload(){
				this.getData()
			},
			//分页点击
			paginationChange(){
				this.getData();
			},
			//条数变化
			pageSizeChange(size){
				this.pageSize = size
				this.getData();
			},
			search(){
				this.currentPage = 1
				this.getData()
			},
			select(item){
				const itemUrl = item[this.fileProps.url]
				if(this.multiple){
					if(this.selection.includes(itemUrl)){
						this.selection.splice(this.selection.findIndex(f => f == itemUrl), 1)
					}else{
						if (this.selection.length >= this.max){
							this.$message.warning(`选择文件数量不能超过 ${this.max}个!`);
							return
						}
						this.selection.push(itemUrl)
					}
				}else{
					if(this.selection.includes(itemUrl)){
						this.selection = ''
					}else{
						this.selection = itemUrl
					}
				}
			},
			deleteSelect(){
				const selection = JSON.parse(JSON.stringify(this.selection))
				const fileList = this.fileList

				// console.log('selection', selection)
				// console.log('selection typeof', typeof selection)

				let ids = [];
				fileList.forEach(item => {
					if (typeof selection == 'string'){
						if (selection.includes(item.url)){
							ids.push(item.id)
						}
					}
					if (typeof selection == 'object'){
						selection.forEach((itemI) => {
							if (itemI === item.url) {
								ids.push(item.id)
							}
						})
					}
				})
				console.log('ids', ids)

				this.$confirm(`确定删除选中的 ${ids.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					let loading = this.$loading();

					let reqData = {
						// ids: this.selection.map(v => v.id),
						ids: ids,
					}
					let res = await this.$API.file.fileDetail.delete.delete(reqData)
					if (res.code != 200) {
						await this.$alert(res.message, "提示", {type: 'error'})
					}

					this.cancelSelect()
					await this.getData()

					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			allSelect(){
				const fileList = this.fileList
				// this.selection = [];
				fileList.forEach(item => {
					if (this.selection.length >= this.max){
						// this.$message.warning(`选择文件数量不能超过 ${this.max}个!`);
						return
					}
					if (typeof this.selection == 'string'){
						this.selection = item.url
					}
					if (typeof this.selection == 'object'){
						if (!this.selection.includes(item.url)){
							this.selection.push(item.url)
						}
					}
				})
			},
			openSelect(){
				const selection = JSON.parse(JSON.stringify(this.selection))
				if (typeof selection == 'string'){
					let url = selection
					window.open(`${url}`, "_blank");
				}
				if (typeof selection == 'object'){
					selection.forEach((url) => {
						// console.log(`url: ${url}`)
						window.open(`${url}`, "_blank");
					})
				}
			},
			cancelSelect(){
				this.selection = []
			},
			cancel(){
				this.cancelSelect()
			},
			submit(){
				const selection = JSON.parse(JSON.stringify(this.selection))
				this.cancelSelect();
				this.$emit('update:modelValue', selection);
				this.$emit('submit', selection);
			},
			//上传处理
			uploadChange(file, fileList){
				file.tempImg = URL.createObjectURL(file.raw);
				this.tempFileList = fileList
			},
			uploadBefore(file){
				const maxSize = file.size / 1024 / 1024 < this.maxSize;
				if (!maxSize) {
					this.$message.warning(`上传文件大小不能超过 ${this.maxSize}MB!`);
					return false;
				}
			},
			uploadRequest(param){
				var apiObj = config.apiObj;
				const data = new FormData();
				data.append("file", param.file);
				data.append([config.request.menuKey], this.menuId);
				apiObj.post(data, {
					onUploadProgress: e => {
						param.onProgress(e)
					}
				}).then(res => {
					param.onSuccess(res)
				}).catch(err => {
					param.onError(err)
				})
			},
			uploadProcess(event, file){
				file.progress = Number((event.loaded / event.total * 100).toFixed(2))
			},
			uploadSuccess(res, file){
				// console.log('uploadSuccess res', res)
				if (res.code != 200){
					this.$alert(res.message, "提示", {type: 'error'})
					return
				}
				this.tempFileList.splice(this.tempFileList.findIndex(f => f.uid == file.uid), 1)
				this.fileList.pop() // 删除文件列表最后一个元素
				var response = config.uploadParseData(res);
				this.fileList.unshift({
					[this.fileProps.key]: response.id,
					[this.fileProps.fileName]: response.fileName,
					[this.fileProps.url]: response.url,
					[this.fileProps.type]: response.type,
					[this.fileProps.suffix]: response.suffix,
				})
				if(!this.multiple){
					this.selection = response.url
				}

				this.getData()
			},
			uploadError(err){
				this.$notify.error({
					title: '上传文件错误',
					message: err
				})
			},
			//内置函数
			_isImg(fileUrl){
				const imgExt = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']
				const fileExt = fileUrl.substring(fileUrl.lastIndexOf("."))
				return imgExt.indexOf(fileExt) != -1
			},
			_getExt(fileUrl){
				return fileUrl.substring(fileUrl.lastIndexOf(".") + 1)
			},
			//本地更新数据
			// handleSaveSuccess(data, mode){
			handleSaveSuccess(){
				this.getData()
			},
			//本地Tree更新数据
			handleTreeSaveSuccess(data, mode){
				// 触发树更新
				treeUtils.treeHandleSuccess(this.$refs.tree, data, mode)
			},
			//加载树数据
			async getTreeList(){
				let res = await this.$API.file.fileCategory.tree.get();
				this.treeShowLoading = false;
				const allNode = {id: '', name: '全部', label: '全部', disabled: true,};
				res.data.unshift(allNode);
				this.treeList = res.data;
			},
			//树点击
			treeNodeClick(data){
				// this.params.parentId = data.id
				// this.$refs.table.reload(this.params)
				this.groupClick(data)
			},
			//树过滤
			treeFilterNode(value, data){
				if (!value) return true;
				var targetText = data.name;
				return targetText.indexOf(value) !== -1;
			},
			//树拖拽
			async treeNodeDrop(draggingNode, dropNode, dropType) {
				treeUtils.treeNodeDrop(draggingNode, dropNode, dropType, async data => {
					this.loading = true;
					let res = data.id
						? await this.$API.file.fileCategory.update.put(data)
						: await this.$API.file.fileCategory.add.post(data);
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
				this.dialog.treeSave = true
				this.$nextTick(() => {
					this.$refs.treeSaveDialog.open('add')
				})
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
				var res = await this.$API.file.fileCategory.delete.delete(reqData)

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
				this.dialog.treeSave = true
				this.$nextTick(() => {
					this.$refs.treeSaveDialog.open('add').setData(form)
				})
			},
			treeNodeEdit(node, data){
				let row = data
				this.dialog.treeSave = true
				this.$nextTick(() => {
					this.$refs.treeSaveDialog.open('edit').setData(row)
				})
			},
			async treeNodeDel(node, data){
				this.$confirm(`确定删除 ${data.name??''} 吗？`, '提示', {
					type: 'warning'
				}).then(async () => {
					let row = data
					var reqData = {id: row.id}
					var res = await this.$API.file.fileCategory.delete.delete(reqData);
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

<style scoped lang="scss">
	.sc-file-select {display: flex;}
	.sc-file-select__files {flex: 1;}

	.sc-file-select__list {box-sizing: border-box;margin: 10px}
	.sc-file-select__item {display: inline-block;float: left;margin:0;width:100%;cursor: pointer;box-sizing: border-box;position: relative;overflow: hidden;}
	.sc-file-select__item__box::before{box-sizing: border-box;}
	.sc-file-select__item__file {width:100%;height:100px;position: relative;}
	.sc-file-select__item__file .el-image {width:100%;height:100px;}
	.sc-file-select__item__box {position: absolute;top:0;right:0;bottom:0;left:0;border: 2px solid var(--el-color-success);z-index: 1;display: none;}
	.sc-file-select__item__box::before {content: '';position: absolute;top:0;right:0;bottom:0;left:0;background: var(--el-color-success);opacity: 0.2;display: none;}
	.sc-file-select__item:hover .sc-file-select__item__box {display: block;}
	.sc-file-select__item.active .sc-file-select__item__box {display: block;}
	.sc-file-select__item.active .sc-file-select__item__box::before {display: block;}
	.sc-file-select__item p {margin-top: 5px;margin-bottom: 5px;padding: 0 5px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;-webkit-text-overflow:ellipsis;text-align: center;}
	.sc-file-select__item__checkbox {position: absolute;width: 20px;height: 20px;top:7px;right:7px;z-index: 2;background: rgba(0,0,0,0.2);border: 1px solid #fff;display: flex;flex-direction: column;align-items: center;justify-content: center;}
	.sc-file-select__item__checkbox i {font-size: 14px;color: #fff;font-weight: bold;display: none;}
	.sc-file-select__item__select {position: absolute;width: 20px;height: 20px;top:0px;right:0px;z-index: 2;background: var(--el-color-success);display: none;flex-direction: column;align-items: center;justify-content: center;}
	.sc-file-select__item__select i {font-size: 14px;color: #fff;font-weight: bold;}
	.sc-file-select__item.active .sc-file-select__item__checkbox {background: var(--el-color-success);}
	.sc-file-select__item.active .sc-file-select__item__checkbox i {display: block;}
	.sc-file-select__item.active .sc-file-select__item__select {display: flex;}
	.sc-file-select__item__file .item-file {width:100%;height:100px;display: flex;flex-direction: column;align-items: center;justify-content: center;}
	.sc-file-select__item__file .item-file i {font-size: 40px;}
	.sc-file-select__item__file .item-file.item-file-doc {color: #409eff;}

	.sc-file-select__item__upload {position: absolute;top:0;right:0;bottom:0;left:0;z-index: 1;background: rgba(255,255,255,0.7);display: flex;flex-direction: column;align-items: center;justify-content: center;}

	.sc-file-select__side {width: 200px;margin-right: 15px;border-right: 1px solid rgba(128,128,128,0.2);display: flex;flex-flow: column;box-sizing: border-box;}
	.sc-file-select__side-menu {flex: 1;}
	.sc-file-select__side-msg {height:32px;line-height: 32px;}

	.sc-file-select__top {margin-bottom: 15px;display: flex;justify-content: space-between;}
	.sc-file-select__upload {display: inline-block;}
	.sc-file-select__top .tips {font-size: 12px;margin-left: 10px;color: #999;}
	.sc-file-select__top .tips i {font-size: 14px;margin-right: 5px;position: relative;bottom: -0.125em;}
	.sc-file-select__pagination {margin:15px 0;}

	.sc-file-select__do {text-align: right;}

	/* 自定义样式 */
	.menu:deep(.el-tree-node__label) {display: flex;flex: 1;height:100%;}
	.custom-tree-node {display: flex;flex: 1;align-items: center;justify-content: space-between;font-size: 14px;padding-right: 24px;height:100%;}
	.custom-tree-node .code {font-size: 12px;color: #999;}
	.custom-tree-node .do {display: none;}
	.custom-tree-node:hover .code {display: none;}
	.custom-tree-node:hover .do {display: inline-block;}

	.el-checkbox__label{ width:100%; overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }

</style>
