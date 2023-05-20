<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'70%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
					<el-form-item label="文章分类" prop="categoryId">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
								<el-tooltip>
									<template #content>请选择分类</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-cascader v-model="form.categoryId" :options="treeOptions" :props="treeProps" :show-all-levels="true" style="width:100%" placeholder="请选择文章分类" clearable filterable></el-cascader>
					</el-form-item>
					<el-form-item label="文章标题" prop="title">
						<el-input v-model="form.title" clearable></el-input>
					</el-form-item>
					<el-form-item label="文章简介" prop="description">
						<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="封面图片" prop="image">
								<sc-upload v-model="form.image" title="请上传封面图片"></sc-upload>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="固定链接" prop="slug">
						<el-input v-model="form.slug" clearable></el-input>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="24">
						</el-col>
					</el-row>
					<el-form-item label="文章内容" prop="content">
						<sc-editor v-model="form.content" placeholder="请输入内容" :height="500"></sc-editor>
					</el-form-item>
					<el-form-item label="用户" prop="userId">
						<select-remote v-model="form.userId"
									   :apiObj="$API.user.user.list"
									   :params="{id: form.userId}"
									   :searchClearParams="['id']"
									   :request="{name: 'keyword'}"
									   :props="{label: 'label', value: 'value'}"
									   :parseData="userSelect.parseData"
									   :parseDataField="userSelect.parseDataField"
									   clearable filterable style="width:100%">
						</select-remote>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="是否有效" prop="status">
						<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
				</el-form>
			</el-main>
			<el-footer>
				<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit">保存</el-button>
				<el-button @click="visible=false">取消</el-button>
			</el-footer>
		</el-container>
	</el-drawer>
</template>

<script>
	import selectRemote from "@/components/selectRemote";
	import { defineAsyncComponent } from 'vue';
	const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));

	export default {
		emits: ['success', 'closed'],
		components:{
			selectRemote,
			scEditor,
		},
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				loading: false,
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					id:"",
					name: "",
					code: "",
					label: "",
					sort: null,
					status: 1,
					remark: ""
				},
				//验证规则
				rules: {
					title: [
						{required: true, message: '请输入文章标题'}
					],
					categoryId: [
						{ required: true, message: '请选择文章分类', trigger: 'change'}
					],
				},
				userSelect: {
					// 解析数据
					parseData: function (res) {
						return {
							data: res.data.records || res.data,
							msg: res.message,
							code: res.code
						}
					},
					// 解析数据字段
					parseDataField: function (item) {
						return {
							label: item.username || item.nickname || item.mobile || item.email,
							value: item.id,
						}
					},
				},
				treeOptions: [],
				treeProps: {
					value: 'id',
					label: 'name',
					// checkStrictly: true,
					checkStrictly: false, // 只能选择叶子节点(最后一级分类)
					emitPath: false,
					expandTrigger: "hover",
				},
			}
		},
		mounted() {
			this.getTreeList()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.cms.article.update.put(this.form)
						} else {
							res = await this.$API.cms.article.add.post(this.form)
						}
						this.isSaving = false;
						if(res.code == 200){
							this.form = res.data
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			async setData(data){
				this.loading = true
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.cms.article.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				this.loading = false
			},
			async getTreeList() {
				let res = await this.$API.cms.articleCategory.tree.get();
				this.treeOptions = res.data
			},
		}
	}
</script>

<style>
</style>
