<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="right">
			<el-form-item label="销售单位名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="是否全局" prop="isGlobal">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
								<el-tooltip>
									<template #content>是否关联全部分类</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.isGlobal">
							<el-radio v-for="(item, index) in isGlobalOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-form-item label="所属商品分类" prop="categoryIds">
				<el-cascader v-model="form.categoryIds" :options="categoryOptions" :props="categoryProps" :show-all-levels="true" style="width:100%" placeholder="请选择所属商品分类" filterable clearable></el-cascader>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
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
					isGlobal: 0,
					status: 1,
					remark: ""
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入销售单位名称'}
					],
				},
				categoryOptions: [],
				categoryProps: {
					value: 'id',
					label: 'name',
					multiple: true,
					// checkStrictly: true,
					checkStrictly: false, // 只能选择叶子节点(最后一级分类)
					emitPath: false,
					expandTrigger: "hover",
				},
				isGlobalOptions: [
					{label: "指定", value: 0,},
					{label: "全部", value: 1,},
				],
			}
		},
		mounted() {
			this.getCategoryList()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			async getCategoryList(){
				var res = await this.$API.backend.store.category.tree.get();
				this.categoryOptions = res.data
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						let res;
						if (this.form.id) {
							res = await this.$API.backend.store.saleUnit.update.put(this.form)
						} else {
							res = await this.$API.backend.store.saleUnit.add.post(this.form)
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
					let res = await this.$API.backend.store.saleUnit.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				// this.form.isGlobal = this.form.isGlobal || 0
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
