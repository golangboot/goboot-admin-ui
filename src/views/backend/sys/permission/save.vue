<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="权限名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限标识" prop="code">
				<el-input v-model="form.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="请求接口" prop="url">
				<el-input v-model="form.url" clearable>
					<template #append>
						<el-button type="primary" icon="el-icon-menu" @click="select"></el-button>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item label="请求方法" prop="method">
				<el-input v-model="form.method" clearable></el-input>
			</el-form-item>
			<el-form-item label="父类" prop="parentId">
				<el-cascader v-model="form.parentId" :options="permissionOptions" :props="permissionProps" :show-all-levels="true" placeholder="请选择父类" style="width:100%" filterable clearable></el-cascader>
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

		<select-api-route ref="selectApiRoute" @submit="selectApiRouteSubmit"></select-api-route>

	</el-dialog>
</template>

<script>
	import selectApiRoute from '@/components/selectApiRoute'

	export default {
		emits: ['success', 'closed'],
		components: {
			selectApiRoute,
		},
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
					remark: "",
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入权限名称'}
					],
					code: [
						{required: true, message: '请输入权限标识'}
					],
				},
				permissionOptions: [],
				permissionProps: {
					value: 'id',
					label: 'name',
					checkStrictly: true,
					emitPath: false,
					expandTrigger: "hover",
				},
			}
		},
		mounted() {
			this.getPermissionTree()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			async getPermissionTree(){
				let res = await this.$API.backend.sys.permission.tree.get();
				this.permissionOptions = res.data
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.backend.sys.permission.update.put(this.form)
						} else {
							res = await this.$API.backend.sys.permission.add.post(this.form)
						}
						this.isSaving = false;
						if(res.code == 200){
							// this.form.id = res.data.id
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
					let res = await this.$API.backend.sys.permission.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			},
			select(){
				this.$nextTick(() => {
					let data = {}
					this.$refs.selectApiRoute.open().setData(data)
				})
			},
			selectApiRouteSubmit(data){
				// console.log('selectApiRouteSubmit:', data)
				Object.assign(this.form, data)
			},
		}
	}
</script>

<style>
</style>
