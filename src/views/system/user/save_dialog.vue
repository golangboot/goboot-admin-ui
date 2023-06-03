<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="头像" prop="avatar">
				<sc-upload :width="80" :height="80" v-model="form.avatar" title="上传头像"></sc-upload>
			</el-form-item>
			<el-form-item label="登录账号" prop="username">
				<el-input v-model="form.username" placeholder="用于登录系统" clearable></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" placeholder="电子邮箱" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="form.mobile" placeholder="手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="realName">
				<el-input v-model="form.realName" placeholder="请输入完整的真实姓名" clearable></el-input>
			</el-form-item>
			<template v-if="mode=='add'">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model="form.password" clearable show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input type="password" v-model="form.password2" clearable show-password></el-input>
				</el-form-item>
			</template>
			<el-form-item label="所属部门" prop="departmentIds">
				<el-cascader v-model="form.departmentIds" :options="departments" :props="departmentsProps" clearable @change="handleChange" style="width: 100%;"></el-cascader>
			</el-form-item>
			<el-form-item label="所属角色" prop="roleIds">
				<el-select v-model="form.roleIds" multiple filterable style="width: 100%">
					<el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
			</el-form-item>
			<el-form-item label="所属用户组" prop="groupIds">
				<el-select v-model="form.groupIds" multiple filterable style="width: 100%">
					<el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id"/>
				</el-select>
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
					add: '新增用户',
					edit: '编辑用户',
					show: '查看'
				},
				visible: false,
				isSaving: false,
				selectedItems: [],
				//表单数据
				form: {
					id:"",
					username: "",
					email: "",
					mobile: "",
					avatar: "",
					realName: "",
					departmentIds: [],
					roleIds: [],
					groupIds: [],
				},
				//验证规则
				rules: {
					/*avatar:[
						{required: true, message: '请上传头像'}
					],*/
					username: [
						{required: true, message: '请输入登录账号'}
					],
					/*name: [
						{required: true, message: '请输入真实姓名'}
					],*/
					password: [
						{required: true, message: '请输入登录密码'},
						{validator: (rule, value, callback) => {
							if (this.form.password2 !== '') {
								this.$refs.dialogForm.validateField('password2');
							}
							callback();
						}}
					],
					password2: [
						{required: true, message: '请再次输入密码'},
						{validator: (rule, value, callback) => {
							if (value !== this.form.password) {
								callback(new Error('两次输入密码不一致!'));
							}else{
								callback();
							}
						}}
					],
					/*department: [
						{required: true, message: '请选择所属部门'}
					],*/
					/*role: [
						{required: true, message: '请选择所属角色', trigger: 'change'}
					],*/
					/*group: [
						{required: true, message: '请选择所属用户组', trigger: 'change'}
					],*/
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
					checkStrictly: true,
					expandTrigger: "hover",
				},
			}
		},
		mounted() {
			this.getGroup()
			this.getRole()
			this.getDept()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//加载树数据
			async getGroup(){
				var res = await this.$API.backend.user.userGroup.list.get();
				this.groups = res.data?.records;
			},
			async getRole(){
				var res = await this.$API.backend.sys.role.list.get();
				this.roles = res.data?.records;
			},
			async getDept(){
				var res = await this.$API.backend.sys.department.tree.get();
				this.departments = res.data;
			},
			selectedNodes() {
				const nodes = [];
				this.selectedItems.forEach(item => {
					let node = this.options.find(option => option.value === item[0]);
					for (let i = 1; i < item.length; i++) {
						node = node.children.find(child => child.value === item[i]);
					}
					if (node) {
						nodes.push(node);
					}
				});
				return nodes;
			},
			handleChange(value) {
				if (value.length > 0) {
					const lastItems = value.map(item => item[item.length - 1]);
					console.log(lastItems);
					this.form.departmentIds = lastItems;
				}
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.backend.user.user.update.put(this.form)
						} else {
							res = await this.$API.backend.user.user.add.post(this.form)
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
					}else{
						return false;
					}
				})
			},
			//表单注入数据
			setData(data){
				this.form.id = data.id
				this.form.username = data.username
				this.form.email = data.email
				this.form.mobile = data.mobile
				this.form.avatar = data.avatar
				this.form.name = data.name
				this.form.groupIds = data.groupIds
				this.form.roleIds = data.roleIds
				this.form.departmentIds = data.departmentIds

				//可以和上面一样单个注入，也可以像下面一样直接合并进去
				//Object.assign(this.form, data)
			}
		}
	}
</script>

<style>
</style>
