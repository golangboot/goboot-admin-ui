<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-dictItem="right">
			<el-form-item label="字典项名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="字典项值" prop="value">
            <el-input v-model="form.value" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="default" @click="form.value = String(form.value).toUpperCase()">编码转大写</el-button>
        </el-col>
      </el-row>
      <el-form-item label="字典项描述" prop="description">
        <el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
      </el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="字典项编码" prop="code">
						<el-input v-model="form.code" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-button type="default" @click="form.code = String(form.code).toUpperCase()">编码转大写</el-button>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="字典项类型" prop="type">
						<el-input v-model="form.type" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<select-dict v-model="form.type" dict="DICT_ITEM_TYPE" placeholder="" clearable filterable style="width: 100%;"></select-dict>
				</el-col>
			</el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属字典" prop="dictId">
            <select-remote v-model="form.dictId"
                           :apiObj="$API.backend.sys.dict.list"
                           :params="{id: form.dictId}"
                           :searchClearParams="['id']"
                           :request="{name: 'keyword'}"
                           :props="{label: 'name', value: 'id',}"
                           clearable filterable style="width:100%">
            </select-remote>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否锁定" prop="isLock">
            <el-switch
                v-model="form.isLock"
                class="form-switch"
                inline-prompt
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                :active-value="1" :inactive-value="0"
                active-text="已锁定" inactive-text="未锁定"
            >
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" controls-dictItem="right" style="width: 100%;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
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
	import selectDict from "@/components/selectDict";

	export default {
		emits: ['success', 'closed'],
		components:{
			selectRemote,
			selectDict,
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
					isGlobal: 0,
					sort: null,
					status: 1,
					remark: ""
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入字典项名称'}
					],
          value: [
            {required: true, message: '请输入字典项值'}
          ],
				},
				dictSelect: {
					// api接口
					apiObj: this.$API.backend.sys.dict.list,
					// 参数(搜索关键字为空时生效)
					params: {},
					// 搜索参数(搜索关键字不为空时生效)
					search: {},
					// 属性字段
					props: {
						// keyword: 'keyword',
						keyword: 'code',
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
						var res;
						if (this.form.id) {
							res = await this.$API.backend.sys.dictItem.update.put(this.form)
						} else {
							res = await this.$API.backend.sys.dictItem.add.post(this.form)
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
					let res = await this.$API.backend.sys.dictItem.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				// this.form.isGlobal = this.form.isGlobal || 0
			}
		}
	}
</script>

<style>
</style>
