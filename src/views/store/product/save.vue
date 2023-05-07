<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'60%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="right">
					<el-form-item label="商品标题" prop="title">
						<el-input v-model="form.title" clearable></el-input>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="商品图片" prop="image">
								<sc-upload v-model="form.image" title="请上传商品图片"></sc-upload>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="商品内容" prop="content">
						<el-input v-model="form.content" clearable type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
					</el-form-item>
					<el-form-item label="是否有效" prop="status">
						<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="24">
							<div>
								<SkuForm
									ref="skuForm"
									:source-attribute="sourceAttribute"
									:structure="structure"
									:attribute="attribute"
									:sku="sku"
								>
									<template #score="slotProps">
										<div>
											<el-rate v-model="slotProps.row.score" />
										</div>
									</template>
									<template #image="slotProps">
										<div class="image-upload-container">
											<el-image v-if="slotProps.row.image" :src="slotProps.row.image" :preview-src-list="[slotProps.row.image]" fit="cover" title="点击预览" />
											<el-upload :show-file-list="false" action="http://scrm.1daas.com/api/upload/upload" :data="{token: 'TKD917339526087186'}" name="image" :before-upload="beforeUpload" :on-success="res => imageUpload(res, slotProps)" class="images-upload">
												<el-button size="small" icon="el-icon-upload2">{{ slotProps.row.image ? '重新上传' : '上传图片' }}</el-button>
											</el-upload>
											<el-button v-if="slotProps.row.image" size="small" icon="el-icon-delete" @click="imageRemove(slotProps)" />
										</div>
									</template>
								</SkuForm>
								<el-row type="flex" :gutter="20">
									<el-col>
										<el-divider content-position="left">attribute 数据</el-divider>
										<pre><code>{{ attribute }}</code></pre>
									</el-col>
									<el-col>
										<el-divider content-position="left">sku 数据</el-divider>
										<pre><code>{{ sku }}</code></pre>
									</el-col>
								</el-row>
							</div>
						</el-col>
					</el-row>
				</el-form>
			</el-main>
			<el-footer>
				<el-button v-if="mode!='show'" type="primary" :loading="isSaving" @click="submit">保存</el-button>
				<el-button @click="visible=false">取消</el-button>
			</el-footer>
		</el-container>
	</el-drawer>
</template>

<script>
	import SkuForm from "@/components/SkuForm";
	export default {
		emits: ['success', 'closed'],
		components:{
			SkuForm,
		},
		data() {
			return {
				loading: false,
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
					remark: ""
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入商品名称'}
					],
				},
				sourceAttribute: [
					{
						name: '颜色',
						item: ['黑', '金', '白']
					},
					{
						name: '内存',
						item: ['16G', '32G']
					}
				],
				structure: [
					{
						name: 'price',
						type: 'input',
						label: '现价'
					},
					{
						name: 'stock',
						type: 'input',
						label: '库存'
					},
					{
						name: 'score',
						type: 'slot',
						defaultValue: 0,
						label: '评分'
					},
					{
						name: 'image',
						type: 'slot',
						label: '图片',
						required: true
					}
				],
				attribute: [],
				sku: [],
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
							res = await this.$API.store.product.update.put(this.form)
						} else {
							res = await this.$API.store.product.add.post(this.form)
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
				this.loading = true
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.store.product.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
				this.loading = false
			}
		}
	}
</script>

<style>
</style>
