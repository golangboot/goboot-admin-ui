<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="'80%'" :top="'5vh'" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="商品分类" prop="categoryId">
						<select-remote v-model="form.categoryId" ref="selectRemote"
									   :apiObj="$API.backend.store.category.list"
									   :params="{id: form.categoryId}"
									   :searchClearParams="['id']"
									   :request="{name: 'keyword'}"
									   :props="{label: 'name', value: 'id',}"
									   @change="onSelectChange($event)"
									   clearable filterable style="width: 100%;">
						</select-remote>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-form-item label="标题" prop="title">
				<template #label="{ label }">
					<span>{{ label }}</span>
					<span>
						<el-tooltip>
							<template #content>标题一般使用商品分类名称，便于用户区分，也可以自定义，留空时默认使用分类名称</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-input v-model="form.title" clearable></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="description">
				<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="位置" prop="position">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
								<el-tooltip>
									<template #content>分类装修位置编码</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<!--<el-input v-model="form.position" clearable></el-input>-->
            <select-dict v-model="form.position" dict="BANNER_POSITION" placeholder="" allow-create default-first-option clearable filterable style="width: 100%;"></select-dict>
          </el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="端点" prop="endpoint">
            <template #label="{ label }">
              <span>{{ label }}</span>
              <span>
								<el-tooltip>
									<template #content>端点编码</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
            </template>
            <select-dict v-model="form.endpoint" dict="ENDPOINT_LIST" placeholder="" allow-create default-first-option clearable filterable style="width: 100%;"></select-dict>
          </el-form-item>
        </el-col>
			</el-row>
			<!--<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="图片" prop="image">
						<sc-upload :width="80" :height="80" v-model="form.image" title="请上传图片"></sc-upload>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="链接" prop="url">
						<el-input v-model="form.url" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="500" :show-word-limit="true" type="textarea"></el-input>
					</el-form-item>
				</el-col>
			</el-row>-->
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="左侧图片" prop="leftImage">
						<sc-upload :width="80" :height="80" v-model="form.leftImage" title="请上传图片"></sc-upload>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="左侧链接" prop="leftLink">
						<el-input v-model="form.leftLink" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="500" :show-word-limit="true" type="textarea"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <!--<el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="顶部图片" prop="topImage">
            <sc-upload :width="80" :height="80" v-model="form.topImage" title="请上传图片"></sc-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顶部链接" prop="topLink">
            <el-input v-model="form.topLink" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="500" :show-word-limit="true" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="底部图片" prop="bottomImage">
						<sc-upload :width="80" :height="80" v-model="form.bottomImage" title="请上传图片"></sc-upload>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="底部链接" prop="bottomLink">
						<el-input v-model="form.bottomLink" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="500" :show-word-limit="true" type="textarea"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="数据获取方式" prop="dataSourceType">
				<template #label="{ label }">
					<span>{{ label }}</span>
					<span>
						<el-tooltip>
							<template #content>获取商品数据来源方式</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-radio-group v-model="form.dataSourceType">
					<el-radio v-for="(item, index) in dataSourceTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="数据限制数量" prop="dataLimitCount">
						<el-input-number v-model="form.dataLimitCount" controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import selectDict from "@/components/selectDict";
	import selectRemote from "@/components/selectRemote";

	export default {
		emits: ['success', 'closed'],
		components:{
			selectDict,
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
					dataSourceType: 1,
					dataLimitCount: 8,
				},
				//验证规则
				rules: {
					/*title: [
						{required: true, message: '请输入标题'}
					],*/
					categoryId: [
						{ required: true, message: '请选择商品分类', trigger: ['change', 'blur']}
					],
				},
				dataSourceTypeOptions: [
					{label: "自动", value: 0},
					{label: "按商品排序", value: 1},
					{label: "按商品销量", value: 2},
					{label: "按商品创建时间", value: 3},
					// {label: "指定商品", value: 4},
				],
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
							res = await this.$API.backend.store.deviseCategory.update.put(this.form)
						} else {
							res = await this.$API.backend.store.deviseCategory.add.post(this.form)
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
					let res = await this.$API.backend.store.deviseCategory.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			},
			// eslint-disable-next-line
			onSelectChange(val){
				// console.log(this.$refs.selectRemote.selectedLabel)
				// console.log(this.$refs.selectRemote.options)
				/*this.$refs.selectRemote.options.forEach(option => {
					// console.log(option)
					if (option.id == val){
						this.form.title = option.name
					}
				})*/
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
