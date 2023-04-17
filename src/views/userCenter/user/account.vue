<template>
	<!-- <el-alert title="异步组件动态加载使用了正处于试验阶段的<Suspense>组件, 其API和使用方式可能会改变. <Suspense> is an experimental feature and its API will likely change." type="warning" show-icon style="margin-bottom: 15px;"/> -->

	<el-card shadow="never" header="个人信息">
		<el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px;">
			<el-form-item label="用户名">
				<el-input v-model="form.username" disabled></el-input>
				<div class="el-form-item-msg">账号信息用于登录，系统不允许修改</div>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-col :span="12">
					<el-input v-model="form.email"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="昵称">
				<el-col :span="12">
					<el-input v-model="form.nickname"></el-input>
				</el-col>
			</el-form-item>
			<el-form-item label="头像" prop="avatar">
				<sc-upload v-model="form.avatar" title="上传头像"></sc-upload>
			</el-form-item>
			<el-form-item label="个性签名">
				<el-input v-model="form.intro" type="textarea"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="form.gender" placeholder="请选择">
					<el-option label="保密" :value="0"></el-option>
					<el-option label="男" :value="1"></el-option>
					<el-option label="女" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="生日" prop="birthday">
				<el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :loading="isSaving" @click="submit()">保存</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				isSaving: false,
				form: {
					username: "",
					email: "",
					nickname: "",
					avatar: "",
					intro: "",
					gender: "",
					birthday: "",
				},
				//验证规则
				rules: {
					username: [
						{required: true, message: '请输入用户名'}
					],
					email: [
						{required: false, message: '请输入邮箱'}
					],
					nickname: [
						{required: false, message: '请输入昵称'}
					],
					avatar:[
						{required: false, message: '请上传头像'}
					],
					intro: [
						{required: false, message: '请输入个性签名'}
					],
					gender: [
						{required: false, message: '请选择性别'}
					],
					birthday: [
						{required: false, message: '请选择生日'}
					],
				},
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			async getData() {
				this.isSaving = true;
				const res = await this.$API.user.userCenter.getUserInfo.get();
				this.isSaving = false;
				this.form = res.data;
			},
			submit() {
				this.$refs.form.validate(async (valid) => {
					// console.log(`valid:${valid}`)
					if (valid) {
						this.isSaving = true;
						const res = await this.$API.user.userCenter.setUserInfo.post(this.form);
						this.isSaving = false;
						if (res.code == 200) {
							this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						} else {
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					} else {
						return false;
					}
				})
			},
		},
	}
</script>

<style>
</style>
