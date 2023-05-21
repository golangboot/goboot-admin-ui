<template>
	<el-main>
		<el-card shadow="never">
			<el-tabs tab-position="top">

				<el-tab-pane label="基础信息">
					<el-container>
						<el-header>Header</el-header>
						<el-main class="nopadding">
							<el-result icon="info" title="Tip" sub-title="基础信息"></el-result>
						</el-main>
						<el-footer>Footer</el-footer>
					</el-container>
				</el-tab-pane>

				<el-tab-pane label="更多信息">
					<el-container>
						<el-header>Header</el-header>
						<el-main class="nopadding">
							<el-result icon="info" title="Tip" sub-title="更多信息"></el-result>
						</el-main>
						<el-footer>Footer</el-footer>
					</el-container>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</el-main>

</template>

<script>
export default {
	name: 'storeProductDetail',
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
				id: this.$route.query.id || null,
				name: "",
				sort: null,
				status: 1,
				remark: "",
			},
			//验证规则
			rules: {
				name: [
					{required: true, message: '请输入商品名称'}
				],
			},
		}
	},
	mounted() {
	},
	methods: {
		//显示
		open(mode='add'){
			this.mode = mode;
			this.visible = true;
			return this
		},
		//表单提交方法
		submit(){
			this.$refs.dialogForm.validate(async (valid) => {
				if (valid) {
					this.isSaving = true;
					var res;
					if (this.form.id) {
						res = await this.$API.platform.store.product.update.put(this.form)
					} else {
						res = await this.$API.platform.store.product.add.post(this.form)
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
				let res = await this.$API.platform.store.product.detail.get(reqData)
				this.isSaving = false
				this.form = res.data
			}
		}
	}
}
</script>

<style scoped>
</style>
