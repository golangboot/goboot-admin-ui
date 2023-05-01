<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="110px" label-position="left">
			<el-form-item label="文件名称" prop="filename">
				<el-input v-model="form.filename" clearable></el-input>
			</el-form-item>
			<el-form-item label="原始文件名" prop="originalFilename">
				<el-input v-model="form.originalFilename" clearable></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="文件URL" prop="url">
						<el-input v-model="form.url" :rows="6" clearable type="textarea"></el-input>
						<div class="el-form-item-msg">* 非必要请勿修改</div>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="form.contentType && form.contentType.indexOf('image') != -1">
					<el-form-item label="图片预览" prop="url">
						<sc-upload v-model="form.url" title="请上传文件"></sc-upload>
					</el-form-item>
				</el-col>
				<el-col :span="12" v-if="form.contentType && form.contentType.indexOf('video') != -1">
					<el-form-item label="视频预览" prop="url">
						<sc-video :src="form.url" :options="{poster: null, pip: true}"></sc-video>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="文件路径" prop="path">
						<el-input v-model="form.path" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="文件大小" prop="size">
						<el-input v-model="form.size" clearable>
							<template #append>Byte</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="文件扩展名" prop="ext">
						<el-input v-model="form.ext" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="文件MIME类型" prop="contentType">
						<el-input v-model="form.contentType" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="存储平台" prop="platform">
						<el-input v-model="form.platform" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="基础存储路径" prop="basePath">
						<el-input v-model="form.basePath" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="文件对象ID" prop="objectId">
						<el-input v-model="form.objectId" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="文件对象类型" prop="objectType">
						<el-input v-model="form.objectType" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="附加属性参数" prop="attrParams">
				<el-input v-model="form.attrParams" clearable type="textarea"></el-input>
				<div class="el-form-item-msg">JSON格式</div>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="文件分类" prop="categoryId">
						<el-cascader v-model="form.categoryId" :options="categoryOptions" :props="categoryProps" :show-all-levels="true" size="large" style="width:100%" placeholder="请选择所属文件分类" filterable clearable></el-cascader>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="用户ID" prop="userId">
						<sc-select-plus v-model="form.userId"
										:apiObj="userSelect.apiObj"
										:params="userSelect.params"
										:props="userSelect.props"
										:parseDataField="userSelect.parseDataField"
										clearable filterable style="width: 100%;">
						</sc-select-plus>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="是否有效" prop="status">
						<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import scVideo from '@/components/scVideo'
	import scSelectPlus from '@/components/scSelectPlus'

	export default {
		emits: ['success', 'closed'],
		components: {
			scVideo,
			scSelectPlus,
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
					label: "",
					sort: null,
					isGlobal: 0,
					status: 1,
					remark: ""
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入文件名称'}
					],
				},
				categoryOptions: [],
				categoryProps: {
					value: 'id',
					label: 'name',
					// multiple: true,
					checkStrictly: true,
					emitPath: false,
					expandTrigger: "hover",
				},
				globalOptions: [
					{label: "指定分类", value: 0,},
					{label: "全部分类", value: 1,},
				],
				userSelect: {
					// api接口
					apiObj: this.$API.user.user.list,
					// 搜索参数(搜索关键词为空时生效)
					params: {},
					// 属性字段
					props: {
						keyword: 'keyword',
					},
					// 解析数据
					parseData: function (res) {
						return {
							data: res.data.records || res.data,
							msg: res.message,
							code: res.code
						}
					},
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
			this.getCategoryList()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			async getCategoryList(){
				var res = await this.$API.file.fileCategory.tree.get();
				this.categoryOptions = res.data
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.file.file.update.put(this.form)
						} else {
							res = await this.$API.file.file.add.post(this.form)
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
					let res = await this.$API.file.file.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				if (this.form.userId){
					this.userSelect.params.id = this.form.userId
				}
			}
		}
	}
</script>

<style>
</style>
