<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="user">
			<el-input v-model="form.user" prefix-icon="el-icon-user" clearable :placeholder="$t('login.userPlaceholder')">
				<!--<template #append>
					<el-select v-model="userType" style="width: 120px;">
						<el-option :label="$t('login.admin')" value="admin"></el-option>
						<el-option :label="$t('login.merchant')" value="merchant"></el-option>
						<el-option :label="$t('login.user')" value="user"></el-option>
					</el-select>
				</template>-->
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input v-model="form.password" prefix-icon="el-icon-lock" clearable show-password :placeholder="$t('login.PWPlaceholder')"></el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px;">
				<el-col :span="12">
					<el-checkbox :label="$t('login.rememberMe')" v-model="form.autoLogin"></el-checkbox>
				</el-col>
				<el-col :span="12" class="login-forgot">
					<router-link to="/resetPassword">{{ $t('login.forgetPassword') }}？</router-link>
				</el-col>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 100%;" :loading="isLogin" round @click="login" @keyup.enter="login">{{ $t('login.signIn') }}</el-button>
		</el-form-item>
		<div class="login-reg">
			{{$t('login.noAccount')}} <router-link to="/userRegister">{{$t('login.createAccount')}}</router-link>
		</div>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				userType: 'admin',
				form: {
					user: "",
					password: "",
					autoLogin: false,
				},
				rules: {
					user: [
						{required: true, message: this.$t('login.userError'), trigger: 'blur'}
					],
					password: [
						{required: true, message: this.$t('login.PWError'), trigger: 'blur'}
					]
				},
				isLogin: false,
			}
		},
		watch:{
			userType(val){
				if(val == 'admin'){
					this.form.user = ''
					this.form.password = ''
				}else if(val == 'user'){
					this.form.user = ''
					this.form.password = ''
				}else if(val == 'merchant'){
					this.form.user = ''
					this.form.password = ''
				}
			}
		},
		mounted() {

		},
		methods: {
			async login(){

				var validate = await this.$refs.loginForm.validate().catch(()=>{})
				if(!validate){ return false }

				this.isLogin = true
				var data = {
					username: this.form.user,
					// password: this.$TOOL.crypto.MD5(this.form.password)
					password: this.form.password
				}
				//获取token
				try {
					var user = await this.$API.auth.login.post(data)
				} catch (e) {
					this.isLogin = false
					return false
				}
				if(user.code == 200){
					this.$TOOL.cookie.set(this.$CONFIG.DATA_CODE.TOKEN, user.data.token, {
						expires: this.form.autoLogin? 24*60*60 : 0
					})
					this.$TOOL.data.set(this.$CONFIG.DATA_CODE.USER_INFO, user.data.userInfo || user.data.userinfo)
				}else{
					this.isLogin = false
					this.$message.warning(user.message)
					return false
				}
				//获取菜单
				var menu = null
				if(this.form.user == 'admin'){
					menu = await this.$API.backend.user.userCenter.myMenus.get()
				}else{
					menu = await this.$API.backend.user.userCenter.myMenus.get()
				}
				if(menu.code == 200){
					if(menu.data.menu.length==0){
						this.isLogin = false
						this.$alert("当前用户无任何菜单权限，请联系系统管理员", "无权限访问", {
							type: 'error',
							center: true
						})
						return false
					}
					this.$TOOL.data.set(this.$CONFIG.DATA_CODE.MENU, menu.data.menu)
					this.$TOOL.data.set(this.$CONFIG.DATA_CODE.ROLES, menu.data.roles)
					this.$TOOL.data.set(this.$CONFIG.DATA_CODE.PERMISSIONS, menu.data.permissions)
					this.$TOOL.data.set(this.$CONFIG.DATA_CODE.DASHBOARD_GRID, menu.data.dashboardGrid)
				}else{
					this.isLogin = false
					this.$message.warning(menu.message)
					return false
				}

				this.$router.replace({
					path: '/'
				})
				this.$message.success(this.$t('login.loginSuccess'))
				this.isLogin = false
			},
		}
	}
</script>

<style>
</style>
