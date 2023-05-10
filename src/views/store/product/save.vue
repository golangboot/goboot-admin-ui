<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'60%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="right">
					<el-card shadow="never">
						<el-tabs tab-position="top">
							<el-tab-pane label="基础信息">

								<el-form-item label="商品分类" prop="categoryId">
									<el-cascader v-model="form.categoryId" :options="treeOptions" :props="treeProps" :show-all-levels="true" style="width:100%" placeholder="请选择商品分类" clearable filterable></el-cascader>
								</el-form-item>
								<el-form-item label="商品品牌" prop="brandId">
									<select-remote v-model="form.brandId" :apiObj="brandSelect.apiObj" :params="brandSelect.params" :search="brandSelect.search" :props="brandSelect.props" clearable filterable style="width:100%"></select-remote>
								</el-form-item>

								<el-form-item label="商品名称" prop="name">
									<el-input v-model="form.name" clearable></el-input>
								</el-form-item>
								<el-form-item label="商品描述" prop="remark">
									<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
								</el-form-item>

								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品图片" prop="image">
											<sc-upload v-model="form.image" title="请上传商品图片"></sc-upload>
										</el-form-item>
									</el-col>
								</el-row>

								<el-form-item label="排序" prop="sort">
									<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
								</el-form-item>

								<el-form-item label="商品状态" prop="status">
									<el-radio-group v-model="form.status">
										<el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-tab-pane>

							<el-tab-pane label="规格库存">
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
							</el-tab-pane>

							<el-tab-pane label="商品详情">
								<el-form-item label="商品内容" prop="content">
									<el-input v-model="form.content" clearable type="textarea"></el-input>
								</el-form-item>
							</el-tab-pane>

							<el-tab-pane label="物流设置">

							</el-tab-pane>

							<el-tab-pane label="营销设置">

							</el-tab-pane>

							<el-tab-pane label="其他设置">

							</el-tab-pane>
						</el-tabs>
					</el-card>
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
	import SelectRemote from "@/components/SelectRemote";

	export default {
		emits: ['success', 'closed'],
		components:{
			SkuForm,
			SelectRemote,
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
					sort: null,
					status: 1,
					remark: "",
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入商品名称'}
					],
					categoryId: [
						{ required: true, message: '请选择商品分类', trigger: 'change'}
					],
				},
				statusOptions: [
					{label: "上架", value: 1,},
					{label: "下架", value: 0,},
				],
				treeOptions: [],
				treeProps: {
					value: 'id',
					label: 'name',
					// checkStrictly: true,
					checkStrictly: false, // 只能选择叶子节点(最后一级分类)
					emitPath: false,
					expandTrigger: "hover",
				},
				brandSelect: {
					// api接口
					apiObj: this.$API.store.brand.list,
					// 参数(搜索关键字为空时生效)
					params: {},
					// 搜索参数(搜索关键字不为空时生效)
					search: {},
					// 属性字段
					props: {
						keyword: 'keyword',
					},
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
		watch: {
			form: {
				handler(){
					// 处理标识
					if (this.form.categoryId){
						this.brandSelect.search.categoryId = this.form.categoryId
					}
				},
				deep: true
			},
		},
		mounted() {
			this.getTreeList()
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
			},
			async getTreeList() {
				let res = await this.$API.store.category.tree.get();
				this.treeOptions = res.data
			},
		}
	}
</script>

<style>
</style>
