<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
			<el-form-item label="轮播图名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="图片" prop="image">
						<sc-upload v-model="form.image" title="请上传图片"></sc-upload>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="编码" prop="code">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
						<el-tooltip>
							<template #content>广告位置编码</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
						</template>
						<el-input v-model="form.code" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="快捷选择" prop="code">
						<select-remote v-model="form.code" dict="banner_position" clearable filterable style="width: 100%;"></select-remote>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="时间">
				<el-date-picker v-model="dateTimeRangeModel" type="datetimerange"
								range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
								format="YYYY-MM-DD HH:mm:ss"
								value-format="YYYY-MM-DD HH:mm:ss"
								@change="dateTimeRangeChange"
								style="width: 100%;">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
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
	import selectRemote from "@/components/selectRemote";

	export default {
		emits: ['success', 'closed'],
		components:{
			selectRemote,
		},
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
					sort: null,
					status: 1,
					remark: "",
					startTime: '',
					endTime: '',
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入轮播图名称'}
					],
				},
				dateTimeRangeModel: [],
			}
		},
		watch: {
			form: {
				// eslint-disable-next-line
				handler: function (newVal, oldVal) {
					if (newVal.startTime || newVal.endTime) {
						this.dateTimeRangeModel[0] = newVal.startTime
						this.dateTimeRangeModel[1] = newVal.endTime
					}
				},
				deep: true
			},
			/*dateTimeRangeModel: {
				// eslint-disable-next-line
				handler: function (newVal, oldVal) {
					if (newVal === null || !newVal) {
						this.dateTimeRangeModel = []
						this.form.startTime = ''
						this.form.endTime = ''
					} else {
						this.form.startTime = newVal[0]
						this.form.endTime = newVal[1]
					}
				},
				deep: true
			},*/
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
							res = await this.$API.store.banner.update.put(this.form)
						} else {
							res = await this.$API.store.banner.add.post(this.form)
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
					let res = await this.$API.store.banner.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			},
			dateTimeRangeChange(dateTimeArray){
				this.form.startTime = dateTimeArray[0]
				this.form.endTime = dateTimeArray[1]
			}
		}
	}
</script>

<style>
</style>
