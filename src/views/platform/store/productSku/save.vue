<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
			<el-form-item label="商品Sku名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="图片" prop="image">
						<sc-upload :width="80" :height="80" v-model="form.image" title="请上传图片"></sc-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="商家编码" prop="code">
						<el-input v-model="form.code" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="商品条形码" prop="barCode">
						<el-input v-model="form.barCode" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="价格" prop="price">
				<el-input-number v-model="form.price" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="市场价" prop="marketPrice">
						<el-input-number v-model="form.marketPrice" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="成本价" prop="costPrice">
						<el-input-number v-model="form.costPrice" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="12">
					<el-form-item label="重量(KG)" prop="weight">
						<el-input-number v-model="form.weight" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="体积(m³)" prop="volume">
						<el-input-number v-model="form.volume" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
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
	export default {
		emits: ['success', 'closed'],
		components:{
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
					startTime: '',
					endTime: '',
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入商品Sku名称'}
					],
				},
			}
		},
		watch: {
			form: {
				// eslint-disable-next-line
				handler: function (newVal, oldVal) {
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
						let res;
						if (this.form.id) {
							res = await this.$API.platform.store.productSku.update.put(this.form)
						} else {
							res = await this.$API.platform.store.productSku.add.post(this.form)
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
					let res = await this.$API.platform.store.productSku.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			},
		}
	}
</script>

<style>
</style>
