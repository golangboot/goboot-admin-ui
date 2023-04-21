<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="500" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="left">
			<el-alert title="请注意：当选择留空时进行提交数据，该操作会删除选中用户已分配的对应数据！" type="warning" show-icon style="margin-bottom: 15px;"/>
			<template v-if="mode == 'group'">
				<el-form-item label="所属用户组" prop="groupIds">
					<el-select v-model="form.groupIds" multiple filterable style="width: 100%">
						<el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id"/>
					</el-select>
				</el-form-item>
			</template>
			<template v-if="mode == 'role'">
				<el-form-item label="所属角色" prop="roleIds">
					<el-select v-model="form.roleIds" multiple filterable style="width: 100%">
						<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"/>
					</el-select>
				</el-form-item>
			</template>
			<template v-if="mode == 'department'">
				<el-form-item label="所属部门" prop="departmentIds">
					<el-cascader v-model="form.departmentIds" :options="departments" :props="departmentsProps" clearable @change="handleChange" style="width: 100%;"></el-cascader>
				</el-form-item>
			</template>
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
				mode: "group",
				titleMap: {
					group: '分配用户组',
					role: '分配角色',
					department: '分配部门',
				},
				visible: false,
				isSaving: false,
				selectedItems: [],
				//表单数据
				form: {
					userIds: [],
					groupIds: [],
					roleIds: [],
					departmentIds: [],
				},
				//验证规则
				rules: {
				},
				//所需数据选项
				groups: [],
				groupsProps: {
					value: "id",
					multiple: true,
					checkStrictly: true
				},
				roles: [],
				rolesProps: {
					value: "id",
					multiple: true,
					checkStrictly: true
				},
				departments: [],
				departmentsProps: {
					value: "id",
					label: 'name',
					multiple: true,
					checkStrictly: true
				},
			}
		},
		mounted() {
			this.getGroup();
			this.getRole();
			this.getDepartment();
		},
		methods: {
			//显示
			open(mode='group'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载所需数据
			async getGroup(){
				var res = await this.$API.user.userGroup.list.get();
				this.groups = res.data.records;
			},
			async getRole(){
				var res = await this.$API.system.role.list.get();
				this.roles = res.data.records;
			},
			async getDepartment(){
				var res = await this.$API.system.department.tree.get();
				this.departments = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;

						var res;
						if (this.mode == 'group'){
							res = await this.$API.system.user.assignGroups.post(this.form)
						}
						if (this.mode == 'role'){
							res = await this.$API.system.user.assignRoles.post(this.form)
						}
						if (this.mode == 'department'){
							res = await this.$API.system.user.assignDepartments.post(this.form)
						}

						this.isSaving = false;
						if(res.code == 200){
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							this.$alert(res.message, "提示", {type: 'error'})
						}
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
