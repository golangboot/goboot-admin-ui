<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
			<el-form-item label="店铺名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="店铺描述" prop="description">
				<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
			</el-form-item>
      <el-form-item label="店铺类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="营业执照" prop="image">
						<sc-upload :width="80" :height="80" v-model="form.image" title="请上传营业执照"></sc-upload>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="form.contact" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="form.telephone" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
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
			<!--<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>-->
			<el-form-item label="审核状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
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
					label: "",
					sort: null,
					status: 1,
					remark: "",
					isSelf: 0,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入名称'}
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
				typeOptions: [
					{label: "普通店铺", value: 0,},
					{label: "旗舰店", value: 1,},
				],
				isSelfOptions: [
					{label: "否", value: 0,},
					{label: "是", value: 1,},
				],
        statusOptions: [
          {label: "待审核", value: 0},
          {label: "审核通过", value: 1},
          {label: "审核驳回", value: 2},
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
						var res;
						if (this.form.id) {
							res = await this.$API.platform.store.merchantApply.update.put(this.form)
						} else {
							res = await this.$API.platform.store.merchantApply.add.post(this.form)
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
					let res = await this.$API.platform.store.merchantApply.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style>
</style>
