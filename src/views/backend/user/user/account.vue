<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="formParams" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
			<el-form-item label="用户ID" prop="id">
				<el-input v-model="form.id" disabled placeholder="用户ID" clearable></el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="username">
				<el-input v-model="form.username" disabled placeholder="用户名" clearable></el-input>
			</el-form-item>
			<el-form-item label="账户类型" prop="account">
				<el-radio-group v-model="formParams.accountType">
					<el-radio v-for="(item, index) in accountTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="操作类型" prop="changeType">
				<el-radio-group v-model="formParams.changeType">
					<el-radio v-for="(item, index) in changeTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="余额" prop="number" v-if="formParams.accountType == 1">
				<el-input-number v-model="formParams.number" placeholder="请输入改变余额" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="积分" prop="number" v-if="formParams.accountType == 2">
				<el-input-number v-model="formParams.number" placeholder="请输入改变积分" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="信用额度" prop="number" v-if="formParams.accountType == 3">
				<el-input-number v-model="formParams.number" placeholder="请输入改变信用额度" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="formParams.remark" clearable type="textarea"></el-input>
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
			mode: "balance",
			titleMap: {
				balance: '余额',
				integral: '积分',
				virtualCoin: '信用额度'
			},
			visible: false,
			isSaving: false,
			//表单数据
			form: {
				id:"",
				username: "",
				email: "",
				mobile: "",
				balance: 0,
				integral: 0,
				virtualCoin: 0,
			},
			formParams: {
				userId: null,
				accountType: 1,
				changeType: 1,
				number: null,
				remark: null,
			},
			//验证规则
			rules: {
				number: [
					{required: true, message: '请输入改变数值'}
				],
			},
			accountTypeOptions: [
				{label: "余额", value: 1, code: "balance",},
				{label: "积分", value: 2, code: "integral",},
				{label: "信用额度", value: 3, code: "virtualCoin",},
			],
			changeTypeOptions: [
				{label: "增加", value: 1,},
				{label: "减少", value: 0,},
			],
		}
	},
	watch: {
		formParams: {
			handler(val){
				for (let i = 0; i < this.accountTypeOptions.length; i++) {
					let accountType = this.accountTypeOptions[i]
					if (val.accountType == accountType.value) {
						this.mode = accountType.code;
					}
				}
			},
			deep: true
		},
	},
	mounted() {
	},
	methods: {
		//显示
		open(mode='balance'){
			this.mode = mode;
			this.visible = true;
			return this
		},
		//表单提交方法
		submit(){
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaving = true;
					let res = await this.$API.backend.user.user.changeAccount.post(this.formParams)
					this.isSaving = false;
					if(res.code == 200){
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
			Object.assign(this.form, data)
			if (data.id){
				this.formParams.userId = data.id
			}
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
