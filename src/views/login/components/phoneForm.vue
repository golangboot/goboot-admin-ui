<template>
	<el-form ref="loginForm" :model="form" :rules="rules" label-width="0" size="large" @keyup.enter="login">
		<el-form-item prop="phone">
			<el-input v-model="form.phone" prefix-icon="el-icon-iphone" clearable :placeholder="$t('login.mobilePlaceholder')">
				<template #prepend>+86</template>
				<template #append>
					<el-select v-model="userType" style="width: 120px;">
						<el-option :label="$t('login.user')" value="user"></el-option>
						<el-option :label="$t('login.merchant')" value="merchant"></el-option>
						<el-option :label="$t('login.enterprise')" value="enterprise"></el-option>
						<el-option :label="$t('login.organization')" value="organization"></el-option>
						<el-option :label="$t('login.admin')" value="admin"></el-option>
					</el-select>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="yzm"  style="margin-bottom: 35px;">
			<div class="login-msg-yzm">
				<el-input v-model="form.yzm" prefix-icon="el-icon-unlock" clearable :placeholder="$t('login.smsPlaceholder')"></el-input>
				<el-button @click="getYzm" :disabled="disabled">{{this.$t('login.smsGet')}}<span v-if="disabled"> ({{time}})</span></el-button>
			</div>
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
				userType: 'user',
				form: {
					phone: "",
					yzm: "",
				},
				rules: {
					phone: [
						{required: true, message: this.$t('login.mobileError')}
					],
					yzm: [
						{required: true, message: this.$t('login.smsError')}
					]
				},
				disabled: false,
				time: 0,
				isLogin: false,
			}
		},
		mounted() {

		},
		methods: {
			async getYzm(){
				var validate = await this.$refs.loginForm.validateField("phone").catch(()=>{})
				if(!validate){ return false }

				this.$message.success(this.$t('login.smsSent'))
				this.disabled = true
				this.time = 60
				var t = setInterval(() => {
					this.time -= 1
					if(this.time < 1){
						clearInterval(t)
						this.disabled = false
						this.time = 0
					}
				},1000)
			},
			async login(){
				var validate = await this.$refs.loginForm.validate().catch(()=>{})
				if(!validate){ return false }
			}
		}
	}
</script>

<style>

</style>
