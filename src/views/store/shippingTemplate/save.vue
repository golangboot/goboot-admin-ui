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
			<el-form-item label="默认运费">
				<template #label="{ label }">
					<span>{{ label }}</span>
					<span>
						<el-tooltip>
							<template #content>当配送区域未单独设置运费时，则采用默认运费设置</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item :label="`首${unit}`" prop="firstNum">
							<el-input-number v-model="form.firstNum" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`首费（${priceUnit}）`" prop="firstPrice">
							<el-input-number v-model="form.firstPrice" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`续${unit}`" prop="renewNum">
							<el-input-number v-model="form.renewNum" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`续费（${priceUnit}）`" prop="renewPrice">
							<el-input-number v-model="form.renewPrice" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item label="配送区域及运费" prop="shippingArea">
				<sc-form-table ref="shippingAreaFormTable" v-model="form.shippingArea" :addTemplate="shippingAreaAddTemplate" placeholder="暂无数据">
					<el-table-column prop="areaOptions" label="可配送区域" fixed min-width="150">
						<template #default="scope">
							<el-input v-model="scope.row.areaOptions" placeholder="请点击最右侧[编辑区域]按钮设置配送区域" :autosize="{ minRows: 1, maxRows: 999 }" :maxlength="65535" disabled :show-word-limit="true" type="textarea"></el-input>
						</template>
					</el-table-column>
					<!--<el-table-column prop="shippingMethod" label="配送方式" width="135">
						<template #default="scope">
							<el-select v-model="scope.row.shippingMethod" :valie="shippingMethodOptions[0].value" placeholder="" filterable>
								<el-option v-for="(item, index) in shippingMethodOptions" :key="index" :label="item.label" :value="item.value"/>
							</el-select>
						</template>
					</el-table-column>-->
					<el-table-column prop="firstNum" :label="`首${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.firstNum" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="firstPrice" :label="`首费（${priceUnit}）`" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.firstPrice" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="renewNum" :label="`续${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.renewNum" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="renewPrice" :label="`续费（${priceUnit}）`" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.renewPrice" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="100">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="tableOperation(scope.row, scope.$index)">编辑区域</el-button>
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
				shippingMethodOptions: [
					{label: "快递", value: 1,},
					{label: "同城配送", value: 2,},
					{label: "EMS", value: 3,},
					{label: "平邮", value: 4,},
				],
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
		computed: {
			unit() {
				let unit = '件'
				if (this.form.type == 1){
					unit = '件'
				}
				if (this.form.type == 2){
					unit = '重量(KG)'
				}
				if (this.form.type == 3){
					unit = '体积(m³)'
				}
				return unit
			},
			priceUnit() {
				let unit = '元'
				return unit
			},
		},
		watch: {
			'form.type': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined' || !newValue || newValue < 1) {
						this.form.type = 1
					}
				},
				deep: true
			},
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
