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
							<template #content>当配送区域未单独设置运费时，则采用默认运费设置</template>
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
				<div class="el-form-item-msg">除指定配送地区外，其余地区的运费采用“默认运费”</div>
			</el-form-item>
			<el-form-item label="配送区域及运费" prop="shippingAreas">
				<sc-form-table ref="shippingAreaFormTable" v-model="form.shippingAreas" :addTemplate="shippingAreaAddTemplate" placeholder="暂无数据">
					<el-table-column label="指定配送地区" fixed min-width="150">
						<template #default="scope">
							<el-input :value="Object.values(scope.row.areas).join('\n')" placeholder="请编辑地区" :autosize="{ minRows: 4, maxRows: 8 }" :maxlength="65535" disabled :show-word-limit="true" type="textarea"></el-input>
						</template>
					</el-table-column>
					<!--<el-table-column prop="shippingMethod" label="配送方式" width="135">
						<template #default="scope">
							<el-select v-model="scope.row.shippingMethod" :valie="shippingMethodOptions[0].value" placeholder="" filterable>
								<el-option v-for="(item, index) in shippingMethodOptions" :key="index" :label="item.label" :value="item.value"/>
							</el-select>
						</template>
					</el-table-column>-->
					<el-table-column prop="startStandard" :label="`首${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.startStandard" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="startFee" :label="`首费（${priceUnit}）`" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.startFee" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="addStandard" :label="`续${unit}`" width="125">
						<template #default="scope">
							<el-input-number v-model="scope.row.addStandard" controls-position="right" :min="0" style="width: 100px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column prop="addFee" :label="`续费（${priceUnit}）`" width="135">
						<template #default="scope">
							<el-input-number v-model="scope.row.addFee" controls-position="right" :min="0" style="width: 110px;"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="操作" fixed="right" align="center" width="100">
						<template #default="scope">
							<el-button-group>
								<el-button text type="primary" size="small" @click="tableRowOperation(scope.row, scope.$index)">编辑地区</el-button>
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

		<select-area ref="selectArea" :limitLevel="2" @submit="selectAreaSubmit"></select-area>

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
					code: "",
					label: "",
					sort: null,
					status: 1,
					remark: "",
					merchantId: "",
					userId: "",
					type: 1,
					isFreeShipping: 0,
					shippingAreas: [],
					startStandard: null,
					startFee: null,
					addStandard: null,
					addFee: null,
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
					areaIds: [],
					areas: {},
					startStandard: null,
					startFee: null,
					addStandard: null,
					addFee: null,
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
			tableRowOperation(row, index) {
				// console.log('tableRowOperation:', row, index)
				this.$nextTick(() => {
					let ignoreAreas = {}
					this.form.shippingAreas?.forEach((item, itemI) => {
						if (index != itemI) {
							Object.assign(ignoreAreas, item.areas)
						}
					})
					let data = {
						row: row,
						index: index,
						areas: row.areas,
						areaIds: row.areaIds,
						ignoreAreas: ignoreAreas,
					}
					this.$refs.selectArea.open().setData(data)
				})
			},
			selectAreaSubmit(data){
				console.log('selectAreaSubmit:', data)
				// console.log('selectAreaSubmit Object.keys(data.areas):', Object.keys(data.areas))
				// console.log('selectAreaSubmit Object.values(data.areas):', Object.values(data.areas))
				// Object.assign(this.form, data)
				let index = data.index
				let row = data.row
				// row.areaNames = data.areaLabels.join(',').replace(/,/g, '\n')
				// row.areaNames = Object.values(data.areas).join('\n')
				// let arr = [].concat.apply([], Object.values(data.areas));
				// let areaList = arr.filter(val => val)
				row.areas = data.areas
				row.areaIds = data.areaIds
				Object.assign(this.form.shippingAreas[index], row)
				// console.log(`selectAreaSubmit -> form.shippingAreas[${index}]:`, this.form.shippingAreas[index])
			},
		}
	}
</script>

<style>
</style>
