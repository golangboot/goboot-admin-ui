<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" :width="'80%'" :top="'5vh'" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
			<el-form-item label="模板名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否包邮" prop="isFreeShipping">
				<el-radio-group v-model="form.isFreeShipping">
					<el-radio v-for="(item, index) in isFreeShippingOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="计费方式" prop="type">
				<el-radio-group v-model="form.type">
					<el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="配送区域" prop="shippingArea">
				<sc-form-table ref="shippingAreaFormTable" v-model="form.shippingArea" :addTemplate="shippingAreaAddTemplate" placeholder="暂无数据">
					<el-table-column prop="area" label="可配送区域" fixed min-width="150">
						<template #default="scope">
							<el-input v-model="scope.row.area" placeholder="请输入区域"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="firstNum" label="首件" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.firstNum" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="price" label="运费（元）" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.price" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="renewNum" label="续件" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.renewNum" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="renewPrice" label="续费（元）" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.renewPrice" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="80">
						<template #default="scope">
							<el-button-group>
								<el-button type="primary" icon="el-icon-menu" size="small" @click="tableOperation(scope.row, scope.$index)"></el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</sc-form-table>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="商家" prop="merchantId">
						<select-remote v-model="form.merchantId" :apiObj="merchantSelect.apiObj" :params="merchantSelect.params" :search="merchantSelect.search" :props="merchantSelect.props" clearable filterable style="width:100%"></select-remote>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" clearable type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	import SelectRemote from "@/components/SelectRemote";

	export default {
		emits: ['success', 'closed'],
		components:{
			SelectRemote,
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
					merchantId: "",
					userId: "",
					type: 1,
					isFreeShipping: 0,
					shippingArea: [],
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入模板名称'}
					],
				},
				typeOptions: [
					{label: "按件数", value: 1,},
					{label: "按重量", value: 2,},
					{label: "按体积", value: 3,},
				],
				isFreeShippingOptions: [
					{label: "自定义运费", value: 0,},
					{label: "包邮", value: 1,},
				],
				shippingAreaAddTemplate: {
					"label": "",
					"value": "",
					"type": "input",
					"required": true,
				},
				merchantSelect: {
					// api接口
					apiObj: this.$API.store.merchant.list,
					// 参数(搜索关键字为空时生效)
					params: {},
					// 搜索参数(搜索关键字不为空时生效)
					search: {},
					// 属性字段
					props: {
						keyword: 'keyword',
					},
				},
			}
		},
		watch: {
			'form.shippingArea': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined' || !newValue) {
						this.form.shippingArea = []
					}
				},
				deep: true
			},
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
							res = await this.$API.store.shippingTemplate.update.put(this.form)
						} else {
							res = await this.$API.store.shippingTemplate.add.post(this.form)
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
					let res = await this.$API.store.shippingTemplate.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
					// this.form.shippingArea = this.form.shippingArea || []
				}
			}
		}
	}
</script>

<style>
</style>
