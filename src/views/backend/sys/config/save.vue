<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="配置名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="配置编码" prop="code">
				<el-input v-model="form.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="配置值" prop="value">
				<el-input v-model="form.value" clearable></el-input>
			</el-form-item>
			<el-form-item label="配置类型" prop="type">
				<el-select v-model="form.type" filterable style="width: 100%">
					<el-option v-for="item in typeOptions" :key="item.id" :label="item.label" :value="item.value"/>
				</el-select>
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
					add: '新增',
					edit: '编辑',
					show: '查看',
				},
				form: {
					id:"",
					name: "",
					code: "",
					value: "",
					type: "string",
					sort: null,
					status: 1,
					remark: "",
				},
				rules: {
					name:[
						{required: true, message: '请输入配置名称'}
					],
					code:[
						{required: true, message: '请输入配置标识'}
					],
					value:[
						{required: true, message: '请输入配置值'}
					],
					type:[
						{required: true, message: '请选择配置类型', trigger: 'change'}
					],
				},
				visible: false,
				isSaving: false,
				typeOptions: [
					{label: "字符串", value: "string",},
					{label: "数字", value: "number",},
					{label: "布尔", value: "boolean",},
				],
			}
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						let res;
						if (this.form.id) {
							res = await this.$API.backend.sys.config.update.put(this.form)
						} else {
							res = await this.$API.backend.sys.config.add.post(this.form)
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
					let res = await this.$API.backend.sys.config.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
