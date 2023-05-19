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
				<div class="el-form-item-msg" v-if="form.isFreeShipping == 1">当前设置为包邮，将由卖家承担运费</div>
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
							<template #content>除指定配送地区外，其余地区的运费采用“默认运费”</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-row :gutter="20">
					<el-col :span="6">
						<el-form-item :label="`首${unit}`" prop="startStandard">
							<el-input-number v-model="form.startStandard" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`首费（${priceUnit}）`" prop="startFee">
							<el-input-number v-model="form.startFee" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`续${unit}`" prop="addStandard">
							<el-input-number v-model="form.addStandard" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item :label="`续费（${priceUnit}）`" prop="addFee">
							<el-input-number v-model="form.addFee" placeholder="" controls-position="right" :min="0"></el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="el-form-item-msg" style="margin-top: 10px;">默认运费：在 {{ form.startStandard || 0 }} {{ unit }}内 {{ form.startFee || 0 }} {{ priceUnit }}，每增加 {{ form.addStandard || 0 }} {{ unit }}，增加运费 {{ form.addFee || 0 }} {{ priceUnit }}。除指定配送地区外，其余地区的运费采用“默认运费”</div>
			</el-form-item>
			<el-form-item label="配送区域及运费" prop="shippingAreas">
				<sc-form-table ref="shippingAreasFormTable" v-model="form.shippingAreas" :addTemplate="shippingAreasAddTemplate" placeholder="暂无数据" dragSort>
					<el-table-column label="指定配送地区" min-width="150">
						<template #default="scope">
							<el-input :value="Object.values(scope.row.areas).join('\n')" placeholder="请编辑地区" :autosize="{ minRows: 4, maxRows: 8 }" :maxlength="65535" disabled :show-word-limit="true" type="textarea"></el-input>
						</template>
					</el-table-column>
					<!--<el-table-column prop="shippingMethod" label="配送方式" min-width="150">
						<template #default="scope">
							<el-select v-model="scope.row.shippingMethod" :valie="shippingMethodOptions[0].value" placeholder="" filterable>
								<el-option v-for="(item, index) in shippingMethodOptions" :key="index" :label="item.label" :value="item.value"/>
							</el-select>
						</template>
					</el-table-column>-->
					<el-table-column prop="startStandard" :label="`首${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.startStandard" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="startFee" :label="`首费（${priceUnit}）`" width="145">
						<template #default="scope">
							<el-input-number v-model="scope.row.startFee" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="addStandard" :label="`续${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.addStandard" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="addFee" :label="`续费（${priceUnit}）`" width="145">
						<template #default="scope">
							<el-input-number v-model="scope.row.addFee" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="条件说明" width="120">
						<template #default="scope">
							<div class="el-form-item-msg">在 {{ scope.row.startStandard || (form.startStandard || 0) }} {{ unit }}内 {{ scope.row.startFee || (form.startFee || 0) }} {{ priceUnit }}，每增加 {{ scope.row.addStandard || (form.addStandard || 0) }} {{ unit }}，增加运费 {{ scope.row.addFee || (form.addFee || 0) }} {{ priceUnit }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="100">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="tableRowOperation(scope.row, scope.$index, 'shippingAreas')">编辑地区</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</sc-form-table>
			</el-form-item>
			<el-form-item label="指定条件包邮" prop="freeShippingAreas">
				<sc-form-table ref="freeShippingAreasFormTable" v-model="form.freeShippingAreas" :addTemplate="freeShippingAreasAddTemplate" placeholder="暂无数据" dragSort>
					<el-table-column label="条件包邮地区" min-width="150">
						<template #default="scope">
							<el-input :value="Object.values(scope.row.areas).join('\n')" placeholder="请编辑地区" :autosize="{ minRows: 4, maxRows: 8 }" :maxlength="65535" disabled :show-word-limit="true" type="textarea"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="condition" label="包邮条件" width="145">
						<template #default="scope">
							<el-select v-model="scope.row.condition" placeholder="请选择条件" filterable>
								<el-option :key="1" :label="`${unit}`" :value="1"/>
								<el-option :key="2" :label="`金额`" :value="2"/>
								<el-option :key="3" :label="`${unit}+金额`" :value="3"/>
								<el-option :key="4" :label="`${unit}/金额`" :value="4"/>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="startStandard" :label="`${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-if="!(scope.row?.condition == 2)" v-model="scope.row.startStandard" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="startFee" :label="`金额（${priceUnit}）`" width="145">
						<template #default="scope">
							<el-input-number v-if="!(scope.row?.condition == 1)" v-model="scope.row.startFee" :placeholder="scope.column.label" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="条件说明" width="120">
						<template #default="scope">
							<div class="el-form-item-msg" v-if="scope.row?.condition == 1">在 {{ scope.row.startStandard || 0 }} {{ unit }}内包邮</div>
							<div class="el-form-item-msg" v-if="scope.row?.condition == 2">满 {{ scope.row.startFee || 0 }} {{ priceUnit }}包邮</div>
							<div class="el-form-item-msg" v-if="scope.row?.condition == 3">在 {{ scope.row.startStandard || 0}} {{ unit }}内，{{ scope.row.startFee || 0 }} {{ priceUnit }}以上包邮</div>
							<div class="el-form-item-msg" v-if="scope.row?.condition == 4">在 {{ scope.row.startStandard || 0}} {{ unit }}内，或 {{ scope.row.startFee || 0 }} {{ priceUnit }}以上包邮</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="100">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="tableRowOperation(scope.row, scope.$index, 'freeShippingAreas')">编辑地区</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</sc-form-table>
			</el-form-item>
			<el-form-item label="指定不送达" prop="nondeliveryAreas">
				<sc-form-table ref="nondeliveryAreasFormTable" v-model="form.nondeliveryAreas" :addTemplate="nondeliveryAreasAddTemplate" placeholder="暂无数据" dragSort>
					<el-table-column label="无法配送地区" min-width="150">
						<template #default="scope">
							<el-input :value="Object.values(scope.row.areas).join('\n')" placeholder="请编辑地区" :autosize="{ minRows: 4, maxRows: 8 }" :maxlength="65535" disabled :show-word-limit="true" type="textarea"></el-input>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="100">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="tableRowOperation(scope.row, scope.$index, 'nondeliveryAreas')">编辑地区</el-button>
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

		<select-area ref="selectArea" :limitLevel="3" @submit="selectAreaSubmit"></select-area>

	</el-dialog>
</template>

<script>
	import selectRemote from "@/components/selectRemote";
	import selectArea from "@/components/selectArea";

	export default {
		emits: ['success', 'closed'],
		components:{
			selectArea,
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
					sort: null,
					status: 1,
					remark: "",
					merchantId: "",
					userId: "",
					type: 1,
					isFreeShipping: 0,
					shippingAreas: [],
					freeShippingAreas: [],
					nondeliveryAreas: [],
					startStandard: null,
					startFee: null,
					addStandard: null,
					addFee: null,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入模板名称', trigger: ['change', 'blur']}
					],
					type: [
						{required: true, message: '请选择计费方式', trigger: ['change', 'blur']}
					],
					startStandard: [
						{required: true, message: '请输入首量', trigger: ['change', 'blur']}
					],
					startFee: [
						{required: true, message: '请输入首费', trigger: ['change', 'blur']}
					],
					addStandard: [
						{required: true, message: '请输入增加量', trigger: ['change', 'blur']}
					],
					addFee: [
						{required: true, message: '请输入续费', trigger: ['change', 'blur']}
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
				shippingAreasAddTemplate: {
					areas: {},
					province: [],
					city: [],
					district: [],
					startStandard: null,
					startFee: null,
					addStandard: null,
					addFee: null,
				},
				freeShippingAreasAddTemplate: {
					areas: {},
					province: [],
					city: [],
					district: [],
					startStandard: null,
					startFee: null,
					condition: 1,
				},
				nondeliveryAreasAddTemplate: {
					areas: {},
					province: [],
					city: [],
					district: [],
				},
				freeShippingConditionOptions: [
					{label: "件", value: 1,},
					{label: "金额", value: 2,},
					{label: "件+金额", value: 3,},
					{label: "件/金额", value: 4,},
				],
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
				categoryOptions: [],
				categoryProps: {
					value: 'id',
					label: 'name',
					multiple: true,
					// checkStrictly: true,
					checkStrictly: false, // 只能选择叶子节点(最后一级分类)
					emitPath: false,
					expandTrigger: "hover",
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
			'form.shippingAreas': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined' || !newValue) {
						this.form.shippingAreas = []
					}
				},
				deep: true
			},
			'form.freeShippingAreas': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined' || !newValue) {
						this.form.freeShippingAreas = []
					}
				},
				deep: true
			},
			'form.nondeliveryAreas': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined' || !newValue) {
						this.form.nondeliveryAreas = []
					}
				},
				deep: true
			},
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
					// this.form.shippingAreas = this.form.shippingAreas || []
				}
			},
			async getCategoryList(){
				let res = await this.$API.store.category.tree.get();
				this.categoryOptions = res.data
			},
			tableRowOperation(row, index, type) {
				// console.log('tableRowOperation:', row, index, type)
				this.$nextTick(() => {
					let ignoreAreas = {}
					if (type == 'shippingAreas' || type == 'nondeliveryAreas') {
						this.form.shippingAreas?.forEach((item, itemI) => {
							// console.log('tableRowOperation -> ignoreAreas:', index, itemI)
							if (!(type == 'shippingAreas' && index == itemI)) {
								Object.assign(ignoreAreas, item.areas)
							}
						})
						this.form.nondeliveryAreas?.forEach((item, itemI) => {
							if (!(type == 'nondeliveryAreas' && index == itemI)) {
								Object.assign(ignoreAreas, item.areas)
							}
						})
					}
					if (type == 'freeShippingAreas'){
						this.form.freeShippingAreas?.forEach((item, itemI) => {
							if (!(type == 'freeShippingAreas' && index == itemI)) {
								Object.assign(ignoreAreas, item.areas)
							}
						})
						// eslint-disable-next-line
						this.form.nondeliveryAreas?.forEach((item, itemI) => {
							Object.assign(ignoreAreas, item.areas)
						})
					}
					let data = {
						type: type,
						row: row,
						index: index,
						ignoreAreas: ignoreAreas,
						// selectedIds: Object.keys(row.areas).map(Number),
						areas: row.areas,
						province: row.province,
						city: row.city,
						district: row.district,
					}
					this.$refs.selectArea.open().setData(data)
				})
			},
			selectAreaSubmit(data){
				// console.log('selectAreaSubmit -> data:', data)
				// console.log('selectAreaSubmit Object.keys(data.areas):', Object.keys(data.areas))
				// console.log('selectAreaSubmit Object.values(data.areas):', Object.values(data.areas))
				// Object.assign(this.form, data)
				// row.areaNames = data.areaLabels.join(',').replace(/,/g, '\n')
				// row.areaNames = Object.values(data.areas).join('\n')
				// let arr = [].concat.apply([], Object.values(data.areas));
				// let areaList = arr.filter(val => val)
				let type = data.type
				let index = data.index
				let row = data.row
				row.areas = data.areas
				row.province = data.province
				row.city = data.city
				row.district = data.district
				if (type == 'shippingAreas'){
					Object.assign(this.form.shippingAreas[index], row)
				}
				if (type == 'freeShippingAreas'){
					Object.assign(this.form.freeShippingAreas[index], row)
				}
				if (type == 'nondeliveryAreas'){
					Object.assign(this.form.nondeliveryAreas[index], row)
				}
				// console.log(`selectAreaSubmit -> form.shippingAreas[${index}]:`, this.form.shippingAreas[index])
			},
		}
	}
</script>

<style>
</style>
