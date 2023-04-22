<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="1000" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form ref="dialogForm" :model="form" :rules="rules" :disabled="mode=='show'" label-width="100px" label-position="top">
					<el-tabs tab-position="top">
						<el-tab-pane label="基础信息">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="用户名" prop="username">
										<el-input v-model="form.username" placeholder="用户名" clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="密码" prop="password">
										<el-input type="password" v-model="form.password" placeholder="留空则不修改密码" clearable show-password></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="邮箱" prop="email">
										<el-input v-model="form.email" placeholder="电子邮箱" clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="手机号" prop="mobile">
										<el-input v-model="form.mobile" placeholder="手机号" clearable></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="昵称" prop="nickname">
										<el-input v-model="form.nickname" placeholder="请输入昵称" clearable></el-input>
									</el-form-item>
									<el-form-item label="个性签名" prop="signature">
										<el-input v-model="form.signature" clearable type="textarea"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="头像" prop="avatar">
										<sc-upload v-model="form.avatar" title="上传头像"></sc-upload>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="用户状态" prop="status">
										<el-radio-group v-model="form.status">
											<el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-col>
								<el-col :span="12">
								</el-col>
							</el-row>
							<!-- <el-divider>系统</el-divider>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="系统用户" prop="isSystem">
										<el-switch v-model="form.isSystem" :active-value="1" :inactive-value="0"></el-switch>
									</el-form-item>
								</el-col>
							</el-row> -->
						</el-tab-pane>
						<el-tab-pane label="个人信息">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="姓名" prop="realName">
										<el-input v-model="form.realName" placeholder="请输入完整的真实姓名" clearable></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="性别" prop="gender">
										<el-radio-group v-model="form.gender">
											<el-radio v-for="(item, index) in genderOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
										</el-radio-group>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="生日" prop="birthday">
										<el-date-picker type="date" placeholder="选择日期" v-model="form.birthday" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="年龄" prop="age">
										<el-input-number v-model="form.age" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="证件类型" prop="identityCardType">
										<el-select v-model="form.identityCardType" filterable style="width: 100%">
											<el-option v-for="(item, index) in identityCardTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="证件号码" prop="identityCard">
										<el-input v-model="form.identityCard" placeholder="请输入完整的证件号码" clearable></el-input>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="证件正面" prop="identityCardFront">
										<sc-upload v-model="form.identityCardFront" title="请上传证件正面"></sc-upload>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="证件背面" prop="identityCardBack">
										<sc-upload v-model="form.identityCardBack" title="请上传证件背面"></sc-upload>
									</el-form-item>
								</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane label="账户信息">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="余额" prop="balance">
										<el-input-number v-model="form.balance" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="积分" prop="integral">
										<el-input-number v-model="form.integral" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
									</el-form-item>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="虚拟币" prop="virtualCoin">
										<el-input-number v-model="form.virtualCoin" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="12">
								</el-col>
							</el-row>
						</el-tab-pane>
					</el-tabs>
				</el-form>
			</el-main>
			<el-footer>
				<el-button type="primary" :loading="isSaving" @click="submit">保存</el-button>
				<el-button @click="visible=false">取消</el-button>
			</el-footer>
		</el-container>

	</el-drawer>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				loading: false,
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看',
				},
				form: {
					id: null,
					username: "",
					email: "",
					mobile: "",
					nickname: "",
					avatar: "",
					realName: "",
					gender: 0,
					identityCardType: 0,
					identityCard: "",
					identityCardFront: "",
					identityCardBack: "",
					status: 1,
				},
				rules: {
					username: [
						{required: true, message: '请输入用户名'}
					],
				},
				visible: false,
				isSaving: false,
				genderOptions: [
					{label: "保密", value: 0,},
					{label: "男", value: 1,},
					{label: "女", value: 2,},
				],
				statusOptions: [
					{label: "正常", value: 1,},
					{label: "禁用", value: 0,},
				],
				identityCardTypeOptions: [
					{label: "身份证", value: 0,},
					{label: "护照", value: 1,},
					{label: "军官证（军人身份证）", value: 2,},
					{label: "港澳通行证", value: 3,},
					{label: "台湾居民来往大陆通行证", value: 4,},
					{label: "营业执照", value: 10,},
				],
			}
		},
		mounted() {
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
						var res;
						if (this.form.id) {
							res = await this.$API.system.user.update.put(this.form)
						} else {
							res = await this.$API.system.user.add.post(this.form)
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
				Object.assign(this.form, data)

				if (data.id){
					this.loading = true
					const params = {
						id: data.id
					}
					setTimeout(async ()=>{
						var res = await this.$API.system.user.show.get(params)
						this.loading = false
						this.form = res.data
					},100)
				}
			},
		}
	}
</script>

<style>
</style>
