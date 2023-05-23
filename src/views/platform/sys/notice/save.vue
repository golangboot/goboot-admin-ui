<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'60%'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="100px" label-position="right">
					<el-form-item label="标题" prop="title">
						<el-input v-model="form.title" clearable></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="description">
						<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="图片" prop="image">
								<sc-upload :width="80" :height="80" v-model="form.image" title="请上传图片"></sc-upload>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="内容" prop="content">
						<sc-editor v-model="form.content" placeholder="请输入内容" :height="500"></sc-editor>
					</el-form-item>
					<el-form-item label="用户" prop="userId">
						<select-remote v-model="form.userId"
									   :apiObj="$API.platform.user.user.list"
									   :params="{id: form.userId}"
									   :searchClearParams="['id']"
									   :request="{name: 'keyword'}"
									   :props="{label: 'label', value: 'value'}"
									   :parseData="userSelect.parseData"
									   :parseDataField="userSelect.parseDataField"
									   clearable filterable style="width:100%">
						</select-remote>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="是否有效" prop="status">
						<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
				</el-form>
			</el-main>
			<el-footer>
				<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit">保存</el-button>
				<el-button @click="visible=false">取消</el-button>
			</el-footer>
		</el-container>
	</el-drawer>
</template>

<script>
	import selectRemote from "@/components/selectRemote";
	import { defineAsyncComponent } from 'vue';
	const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));

	export default {
		emits: ['success', 'closed'],
		components:{
			selectRemote,
			scEditor,
		},
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增',
					edit: '编辑',
					show: '查看'
				},
				loading: false,
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
					remark: ""
				},
				//验证规则
				rules: {
					title: [
						{required: true, message: '请输入标题'}
					],
				},
				userSelect: {
					// 解析数据字段
					parseDataField: function (item) {
						return {
							label: item.username || item.nickname || item.mobile || item.email,
							value: item.id,
						}
					},
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
						let res;
						if (this.form.id) {
							res = await this.$API.platform.sys.notice.update.put(this.form)
						} else {
							res = await this.$API.platform.sys.notice.add.post(this.form)
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
				this.loading = true
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.platform.sys.notice.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				this.loading = false
			}
		}
	}
</script>

<style>
</style>
