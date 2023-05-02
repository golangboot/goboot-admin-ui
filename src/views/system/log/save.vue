<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="left">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="form.username" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="用户ID" prop="userId">
						<el-input v-model="form.userId" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="执行操作" prop="operation">
						<el-input v-model="form.operation" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="业务类型" prop="businessType">
						<el-input v-model="form.businessType" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="请求网址(URL)" prop="url">
						<el-input v-model="form.url" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="请求方法" prop="method">
						<el-input v-model="form.method" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="执行时间(ms)" prop="time">
						<el-input-number v-model="form.time" clearable controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="请求参数" prop="params">
						<el-input v-model="form.params" clearable type="textarea" :rows="5"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="响应结果" prop="result">
						<el-input v-model="form.result" clearable type="textarea" :rows="5"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="浏览器" prop="browser">
						<el-input v-model="form.browser" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="引擎" prop="engine">
						<el-input v-model="form.engine" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="平台" prop="platform">
						<el-input v-model="form.platform" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="设备" prop="device">
						<el-input v-model="form.device" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="IP" prop="ip">
						<el-input v-model="form.ip" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="IP地址" prop="ipAddress">
						<el-input v-model="form.ipAddress" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="模块" prop="module">
						<el-input v-model="form.module" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="系统版本号" prop="sysVersion">
						<el-input v-model="form.sysVersion" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="请求类名称" prop="className">
				<el-input v-model="form.className" clearable></el-input>
			</el-form-item>
			<el-form-item label="请求类方法名称" prop="classMethodName">
				<el-input v-model="form.classMethodName" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" clearable type="textarea"></el-input>
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
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					id:"",
					name: "",
					code: "",
					label: "",
					sort: null,
					status: 1,
					remark: "",
				},
				//验证规则
				rules: {
					/*name: [
						{required: true, message: '请输入日志名称'}
					],*/
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
							res = await this.$API.system.log.update.put(this.form)
						} else {
							res = await this.$API.system.log.add.post(this.form)
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
					let res = await this.$API.system.log.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style>
</style>
