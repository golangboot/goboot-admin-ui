<template>
	<el-main>
		<el-card shadow="never">
			<el-tabs tab-position="top">

				<el-tab-pane label="系统设置">
					<el-form ref="form" :model="form" :rules="rules" label-width="100px" style="margin-top: 20px;">
						<el-form-item label="系统名称" prop="name">
							<el-input v-model="form['app.name']" clearable></el-input>
						</el-form-item>
						<el-form-item label="版本号" prop="version">
							<el-input v-model="form['app.version']" clearable></el-input>
						</el-form-item>
						<el-form-item label="开发者" prop="author" clearable>
							<el-input v-model="form['app.author']"></el-input>
						</el-form-item>
						<el-form-item label="调试模式" prop="debug">
							<template #label="{ label }">
								<span>{{ label }}</span>
								<span>
									<el-tooltip>
										<template #content>系统调试模式</template>
										<el-icon style="vertical-align: middle;"><el-icon-question-filled /></el-icon>
									</el-tooltip>
								</span>
							</template>
							<el-switch v-model="form['app.debug']" :active-value="'true'" :inactive-value="'false'"></el-switch>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
							<el-button @click="visible=false" >取 消</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'platformSysSetting',
		data() {
			return {
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					"app.name": "",
					"app.version": "",
					"app.author": "",
					"app.debug": "false",
				},
				//验证规则
				rules: {
					"app.name": [
						{required: true, message: '请输入系统名称'}
					],
				},
				configGroup: 'app',
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			async getData(){
				let reqData = {group: this.configGroup}
				let res = await this.$API.platform.sys.setting.list.get(reqData);
				if (res.data){
					let items = res.data;
					// console.log(items)
					for (let key in items){
						let item = items[key]
						// console.log(item)
						this.form[item.code] = item.value;
					}
					// console.log(this.form)
				}
			},
			//表单提交方法
			submit(){
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						let res = await this.$API.platform.sys.setting.update.post(this.form)
						this.isSaving = false;
						if(res.code == 200){
							// this.form = res.data
							// this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
		}
	}
</script>

<style>
</style>
