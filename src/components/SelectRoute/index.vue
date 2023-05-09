<template>
	<el-dialog :title="'API接口选择器'" v-model="dialogVisible" destroy-on-close append-to-body @closed="$emit('closed')">
		<div class="select-route">选择接口内容</div>
		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button>
		</template>
	</el-dialog>

</template>

<script>
export default {
	name: "SelectRoute",
	emits: ['success', 'closed'],
	data() {
		return {
			dialogVisible: false,
			isSaving: false,
			//表单数据
			form: {
				url: "",
				method: "",
				code: "",
			},
			//验证规则
			rules: {
				name: [
					{required: true, message: '请输入职位名称'}
				],
			},
		}
	},
	methods: {
		open(){
			this.dialogVisible = true
			return this
		},
		submit(){
			this.$emit('submit', this.form);
			this.dialogVisible = false
		},
		setData(data){
			Object.assign(this.form, data)
		},
	},
}
</script>

<style lang="scss" scoped>

</style>
