<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="分类名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="分类图标" prop="icon">
						<sc-upload :width="80" :height="80" v-model="form.icon" title="请上传分类图标"></sc-upload>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="分类图片" prop="image">
						<sc-upload :width="80" :height="80" v-model="form.image" title="请上传分类图片"></sc-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="上级分类" prop="parentId">
				<el-cascader v-model="form.parentId" :options="treeOptions" :props="treeProps" :show-all-levels="true" style="width:100%" placeholder="请选择分类" filterable clearable></el-cascader>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
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
					name: [
						{required: true, message: '请输入文章分类名称'}
					],
				},
				treeOptions: [],
				treeProps: {
					value: 'id',
					label: 'name',
					checkStrictly: true,
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
			async getTreeList(){
				var res = await this.$API.backend.cms.articleCategory.tree.get();
				this.treeOptions = res.data
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.backend.cms.articleCategory.update.put(this.form)
						} else {
							res = await this.$API.backend.cms.articleCategory.add.post(this.form)
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
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.backend.cms.articleCategory.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
