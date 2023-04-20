<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="400" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="100px" label-position="left">
			<el-form-item label="所属字典" prop="parentId">
				<el-cascader v-model="form.parentId" :options="dict" :props="dictProps" :show-all-levels="false" clearable></el-cascader>
			</el-form-item>
			<el-form-item label="字典项名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="编码" prop="code">
				<el-input v-model="form.code" clearable placeholder="字典编码"></el-input>
			</el-form-item>
			<el-form-item label="键值" prop="value">
				<el-input v-model="form.value" clearable></el-input>
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
			<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
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
					add: '新增项',
					edit: '编辑项'
				},
				visible: false,
				isSaving: false,
				form: {
					id: "",
					parentId: 0,
					name: "",
					value: "",
					status: 1
				},
				rules: {
					parentId: [
						{required: true, message: '请选择所属字典'}
					],
					name: [
						{required: true, message: '请输入项名称'}
					],
					value: [
						{required: true, message: '请输入键值'}
					]
				},
				dict: [],
				dictProps: {
					value: "id",
					label: "name",
					emitPath: false,
					checkStrictly: true
				}
			}
		},
		mounted() {
			console.log('> this.params:', this.params)
			if(this.params){
				this.form.parentId = this.params.parentId
			}
			this.getDict()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this;
			},
			//获取字典列表
			async getDict(){
				var res = await this.$API.system.dict.tree.get();
				this.dict = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.system.dict.update.put(this.form)
						} else {
							res = await this.$API.system.dict.add.post(this.form)
						}
						this.isSaving = false;
						if(res.code == 200){
							// this.form.id = res.data.id
							this.form = res.data
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.id = data.id
				this.form.name = data.name
				this.form.value = data.value
				this.form.status = data.status || 1
				// this.form.dict = data.dict
				this.form.parentId = data.parentId

				console.log('> setData data', data)
				console.log('> setData form', this.form)

			}
		}
	}
</script>

<style>
</style>
