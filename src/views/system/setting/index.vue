<template>
	<el-main>
		<el-card shadow="never">
			<el-tabs tab-position="top">

				<el-tab-pane label="系统设置">
					<el-form ref="form" :model="app" label-width="100px" style="margin-top: 20px;">
						<el-form-item label="系统名称">
							<el-input v-model="app.name"></el-input>
						</el-form-item>
						<el-form-item label="版本号">
							<el-input v-model="app.version"></el-input>
						</el-form-item>
						<el-form-item label="开发者">
							<el-input v-model="app.author"></el-input>
						</el-form-item>
						<el-form-item label="调试模式">
							<el-switch v-model="sys.debug"></el-switch>
							<div class="el-form-item-msg">系统调试模式</div>
						</el-form-item>
						<el-form-item>
							<el-button type="primary">保存</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'setting',
		data() {
			return {
				app: {
					name: "GoUI",
					version: "",
					author: "",
					debug: false,
				},
			}
		},
		methods: {

		}
	}
</script>

<style>
</style>
