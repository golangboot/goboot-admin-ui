<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="150px" label-position="right">
			<el-form-item label="商品属性名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>

			<el-form-item label="属性选择类型" prop="selectType">
				<template #label="{ label }">
					<span>{{ label }}&nbsp;</span>
					<span>
						<el-tooltip>
							<template #content>属性选择类型为唯一或文本时，属性录入方式需要设置为手工录入</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-radio-group v-model="form.selectType">
					<el-radio v-for="(item, index) in selectTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="属性录入方式" prop="inputType">
						<template #label="{ label }">
							<span>{{ label }}&nbsp;</span>
							<span>
						<el-tooltip>
							<template #content>属性录入方式为从列表选择时，请在可选值列表中添加可选值</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
						</template>
						<el-radio-group v-model="form.inputType">
							<el-radio v-for="(item, index) in inputTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否支持添加属性" prop="canAddAttribute">
						<template #label="{ label }">
							<span>{{ label }}&nbsp;</span>
							<span>
								<el-tooltip>
									<template #content>是否支持用户手动新增属性</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.canAddAttribute">
							<el-radio :key="0" :label="0">不支持</el-radio>
							<el-radio :key="1" :label="1">支持</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="可选值列表" prop="inputList">
				<template #label="{ label }">
					<span>{{ label }}&nbsp;</span>
					<span>
						<el-tooltip>
							<template #content>可选值列表, 多个可选值使用Enter确认键换行</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-input v-model="form.inputList" :rows="5" clearable type="textarea"></el-input>
				<div class="el-form-item-msg">多个可选值使用Enter确认键换行</div>
			</el-form-item>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="是否销售属性" prop="isSaleAttribute">
						<template #label="{ label }">
							<span>{{ label }}&nbsp;</span>
							<span>
								<el-tooltip>
									<template #content>销售属性表示为SKU属性</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.isSaleAttribute">
							<el-radio :key="0" :label="0">否</el-radio>
							<el-radio :key="1" :label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否必填" prop="optionType">
						<template #label="{ label }">
							<span>{{ label }}&nbsp;</span>
							<span>
								<el-tooltip>
									<template #content>是否可以不用填写</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.optionType">
							<el-radio :key="0" :label="0">否</el-radio>
							<el-radio :key="1" :label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="是否全局" prop="isGlobal">
						<template #label="{ label }">
							<span>{{ label }}&nbsp;</span>
							<span>
								<el-tooltip>
									<template #content>是否关联全部商品规格</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.isGlobal">
							<el-radio :key="0" :label="0">否</el-radio>
							<el-radio :key="1" :label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
				</el-col>
			</el-row>
			<el-form-item label="商品规格" prop="productSpecId">
				<sc-select-plus v-model="form.productSpecId"
								:apiObj="productSpecSelect.apiObj"
								:params="productSpecSelect.params"
								:props="productSpecSelect.props"
								:parseDataField="productSpecSelect.parseDataField"
								clearable filterable style="width: 100%;">
				</sc-select-plus>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
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
	import scSelectPlus from '@/components/scSelectPlus'

	export default {
		emits: ['success', 'closed'],
		components: {
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
					sort: null,
					isGlobal: 0,
					status: 1,
					selectType: 0,
					inputType: 0,
					canAddAttribute: 0,
					inputList: "",
					isSaleAttribute: 0,
					optionType: 0,
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入商品属性名称'}
					],
					/*productSpecId: [
						{required: true, message: '请选择商品规格'}
					],*/
				},
				categoryOptions: [],
				categoryProps: {
					value: 'id',
					label: 'name',
					multiple: true,
					checkStrictly: true,
					emitPath: false,
					expandTrigger: "hover",
				},
				selectTypeOptions: [
					{label: "唯一", value: 0,},
					{label: "单选", value: 1,},
					{label: "多选", value: 2,},
					{label: "文本", value: 3,},
					{label: "布尔值", value: 4,},
				],
				inputTypeOptions: [
					{label: "手工录入", value: 0,},
					{label: "从列表选择", value: 1,},
				],
				isGlobalOptions: [
					{label: "指定", value: 0,},
					{label: "全部", value: 1,},
				],
				productSpecSelect: {
					// api接口
					apiObj: this.$API.store.productSpec.list,
					// 搜索参数(搜索关键词为空时生效)
					params: {},
					// 属性字段
					props: {
						keyword: 'keyword',
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
				var res = await this.$API.store.category.tree.get();
				this.categoryOptions = res.data
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.store.productAttribute.update.put(this.form)
						} else {
							res = await this.$API.store.productAttribute.add.post(this.form)
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
					let res = await this.$API.store.productAttribute.detail.get(reqData)
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
