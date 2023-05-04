<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="left">
			<el-form-item label="商品属性名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
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
						{required: true, message: '请输入商品属性名称'}
					],
					productSpecId: [
						{required: true, message: '请选择商品规格'}
					],
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
				isGlobalOptions: [
					{label: "指定分类", value: 0,},
					{label: "全部分类", value: 1,},
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
							res = await this.$API.store.attribute.update.put(this.form)
						} else {
							res = await this.$API.store.attribute.add.post(this.form)
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
					let res = await this.$API.store.attribute.detail.get(reqData)
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
