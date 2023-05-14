<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="150px" label-position="right">
			<el-form-item label="商品属性名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="销售属性" prop="isSaleAttribute">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
								<el-tooltip>
									<template #content>是否销售属性：销售属性为SKU属性（影响商品价格）</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.isSaleAttribute">
							<el-radio :key="0" :label="0">否</el-radio>
							<el-radio :key="1" :label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<template v-if="form.isSaleAttribute == 1">
				<el-form-item label="支持新增属性" prop="canAddAttribute">
					<template #label="{ label }">
						<span>{{ label }}</span>
						<span>
						<el-tooltip>
							<template #content>是否支持手动新增属性值</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
					</template>
					<el-radio-group v-model="form.canAddAttribute">
						<el-radio :key="0" :label="0">不支持</el-radio>
						<el-radio :key="1" :label="1">支持</el-radio>
					</el-radio-group>
				</el-form-item>
			</template>
			<template v-else>
				<el-form-item label="属性选择类型" prop="selectType">
					<template #label="{ label }">
						<span>{{ label }}</span>
						<span>
						<el-tooltip>
							<template #content>属性选择类型为唯一或文本时，属性值录入为用户手工录入</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
					</template>
					<el-radio-group v-model="form.selectType">
						<el-radio v-for="(item, index) in selectTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="form.selectType == 1 || form.selectType == 2 || form.selectType == 4 ? '是否必选' : '是否必填'" prop="optionType">
					<template #label="{ label }">
						<span>{{ label }}</span>
						<span>
						<el-tooltip>
							<template #content>属性值是否可以留空或不选择</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
					</template>
					<el-radio-group v-model="form.optionType">
						<el-radio :key="0" :label="0">否</el-radio>
						<el-radio :key="1" :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
			</template>
			<el-form-item label="属性值可选值列表" prop="optionsFormat" v-if="form.isSaleAttribute == 1 || form.selectType == 1 || form.selectType == 2">
				<template #label="{ label }">
					<span>{{ label }}</span>
					<span>
						<el-tooltip>
							<template #content>属性值可选值列表, 多个属性值可选值使用Enter确认键换行</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-input ref="optionsFormat" v-model="optionsFormat" :autosize="{ minRows: 3, maxRows: 6 }" :maxlength="65535" :show-word-limit="true" type="textarea"></el-input>
				<div class="el-form-item-msg">多个属性值可选值使用Enter确认键换行</div>
			</el-form-item>
			<el-form-item label="搜索类型" prop="searchType">
				<template #label="{ label }">
					<span>{{ label }}</span>
					<span>
						<el-tooltip>
							<template #content>默认选择不需要检索即可</template>
							<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
						</el-tooltip>
					</span>
				</template>
				<el-radio-group v-model="form.searchType">
					<el-radio :key="0" :label="0">不需要进行检索</el-radio>
					<el-radio :key="1" :label="1">关键字检索</el-radio>
					<el-radio :key="2" :label="2">范围检索</el-radio>
				</el-radio-group>
			</el-form-item>
			<!--<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="筛选样式" prop="filterType">
						<template #label="{ label }">
							<span>{{ label }}</span>
							<span>
								<el-tooltip>
									<template #content>预留字段</template>
									<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
								</el-tooltip>
							</span>
						</template>
						<el-radio-group v-model="form.filterType">
							<el-radio :key="0" :label="0">普通</el-radio>
							<el-radio :key="1" :label="1">颜色</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>-->
			<el-form-item label="所属商品规格" prop="productSpecId">
				<select-remote v-model="form.productSpecId" :apiObj="productSpecSelect.apiObj" :params="productSpecSelect.params" :props="productSpecSelect.props" clearable filterable style="width: 100%;"></select-remote>
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
	import SelectRemote from '@/components/SelectRemote'

	export default {
		emits: ['success', 'closed'],
		components: {
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
					sort: null,
					isGlobal: 0,
					status: 1,
					selectType: 3,
					// inputType: 0,
					canAddAttribute: 0,
					options: "",
					isSaleAttribute: 0,
					optionType: 0,
					searchType: 0,
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
					// {label: "唯一", value: 0,},
					{label: "单选", value: 1,},
					{label: "多选", value: 2,},
					{label: "文本", value: 3,},
					{label: "布尔值", value: 4,},
				],
				inputTypeOptions: [
					{label: "手工录入", value: 0,},
					{label: "从列表中选取", value: 1,},
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
				optionsFormat: "",
			}
		},
		watch: {
			optionsFormat(val) {
				val = val.replace(/\n/g, ',')
				this.form.options = val
				/*this.$nextTick(() => {
					this.$refs.optionsFormat.resizeTextarea();
				});*/
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
				if (this.form.options){
					this.optionsFormat = this.form.options.replace(/,/g, '\n')
				}
			}
		}
	}
</script>

<style>
</style>
