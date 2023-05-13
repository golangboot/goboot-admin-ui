<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'90%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="120px" label-position="right">
					<el-card shadow="never">
						<el-tabs tab-position="top">
							<el-tab-pane label="基础信息">

								<el-form-item label="商品分类" prop="categoryId">
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>请先选择商品分类后，再编辑商品信息</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<el-cascader v-model="form.categoryId" :options="treeOptions" :props="treeProps" :show-all-levels="true" style="width:100%" placeholder="请选择商品分类" clearable filterable></el-cascader>
								</el-form-item>

								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品品牌" prop="brandId">
											<select-remote v-model="form.brandId" :apiObj="brandSelect.apiObj" :params="brandSelect.params" :search="brandSelect.search" :props="brandSelect.props" clearable filterable style="width:100%"></select-remote>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="销售单位" prop="saleUnitId">
											<select-remote v-model="form.saleUnitId" :apiObj="saleUnitSelect.apiObj" :params="saleUnitSelect.params" :search="saleUnitSelect.search" :props="saleUnitSelect.props" clearable filterable style="width:100%"></select-remote>
										</el-form-item>
									</el-col>
								</el-row>

								<el-form-item label="商品名称" prop="name">
									<el-input v-model="form.name" clearable></el-input>
								</el-form-item>
								<el-form-item label="商品描述" prop="description">
									<el-input v-model="form.description" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
								</el-form-item>

								<el-form-item label="商品图片" prop="image">
									<sc-upload v-model="form.image" title="请上传商品图片"></sc-upload>
								</el-form-item>

								<el-form-item label="商品相册" prop="images">
									<sc-upload-multiple v-model="form.images" draggable :limit="5" tip="最多上传5个文件,单个文件不要超过10M,请上传图像格式文件"></sc-upload-multiple>
								</el-form-item>

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
											<sku-form ref="skuForm"
													 v-model:sourceAttributes="sourceAttributes"
													 v-model:structures="structures"
													 v-model:attributes="attributes"
													 v-model:skus="skus"
											>
												<!--<template #score="slotProps">
													<div>
														<el-rate v-model="slotProps.row.score" />
													</div>
												</template>-->
												<template #status="slotProps">
													<div style="margin: 0 auto;">
														<el-switch
															v-model="slotProps.row.status"
															class="ml-2"
															inline-prompt
															style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
															:active-value="1" :inactive-value="0"
															active-text="上架" inactive-text="下架"
															@change="slotProps.row.status = $event"
														/>
													</div>
												</template>
												<template #image="slotProps">
													<div class="image-upload-container" style="margin: 0 auto;">
														<div v-if="slotProps.row.image" style="margin: 0 auto;display: flex; align-items: center;justify-content: center; max-width: 35px; height: 35px;overflow: hidden;margin-bottom: 5px;">
															<el-image class="image" v-if="slotProps.row.image" :src="slotProps.row.image" :preview-src-list="[slotProps.row.image]" fit="cover" title="点击预览" hide-on-click-modal preview-teleported />
														</div>
														<div style="margin: 0 auto;display: flex; align-items: center;justify-content: center;">
															<el-popconfirm v-if="slotProps.row.image" title="确定删除图片吗？" @confirm="slotProps.row.image = ''">
																<template #reference>
																	<el-button type="default" size="small" icon="el-icon-delete">删除图片</el-button>
																</template>
															</el-popconfirm>
															<el-upload v-else :show-file-list="false" :action="$API.file.upload.url" :data="{type: 'image'}" name="file" :accept="'image/jpg,image/jpeg,image/png,image/gif,'" :before-upload="beforeUpload" :on-success="res => slotProps.row.image = res.data.url" class="images-upload">
																<el-button type="default" size="small" icon="el-icon-upload">{{ slotProps.row.image ? '重新上传' : '上传图片' }}</el-button>
															</el-upload>
														</div>
													</div>
												</template>
												<template #totalPrice="slotProps">
													<div style="margin: 0 0 0 auto;">
														{{ skuFormTotalPrice(slotProps.row) }}
													</div>
												</template>
												<template #operation="slotProps">
													<div class="operation-container" style="margin: 0 auto;">
														<el-popconfirm title="确定删除吗？" @confirm="skuFormTableRowDelete(slotProps.row, slotProps.index)">
															<template #reference>
																<el-button type="default" size="small" icon="el-icon-delete">删除</el-button>
															</template>
														</el-popconfirm>
													</div>
												</template>
											</sku-form>
											<el-row type="flex" :gutter="20">
												<el-col :span="12">
													<el-divider content-position="left">attributes 数据</el-divider>
													<pre><code>{{ attributes }}</code></pre>
												</el-col>
												<el-col :span="12">
													<el-divider content-position="left">skus 数据</el-divider>
													<pre><code>{{ skus }}</code></pre>
												</el-col>
											</el-row>
										</div>
									</el-col>
								</el-row>
							</el-tab-pane>

							<el-tab-pane label="商品详情">
								<el-form-item label="商品内容" prop="content">
									<sc-editor v-model="form.content" :disabled="mode=='show'" placeholder="请输入内容" :height="500"></sc-editor>
									<!--<el-input v-model="form.content" clearable type="textarea"></el-input>-->
								</el-form-item>
							</el-tab-pane>

							<el-tab-pane label="物流设置">

							</el-tab-pane>

							<el-tab-pane label="营销设置">

							</el-tab-pane>

							<el-tab-pane label="其他设置">

							</el-tab-pane>

							<el-tab-pane label="平台操作">
								<el-form-item label="商家" prop="merchantId">
									<select-remote v-model="form.merchantId" :apiObj="merchantSelect.apiObj" :params="merchantSelect.params" :search="merchantSelect.search" :props="merchantSelect.props" clearable filterable style="width:100%"></select-remote>
								</el-form-item>
								<el-form-item label="审核状态" prop="auditStatus">
									<el-radio-group v-model="form.auditStatus">
										<el-radio v-for="(item, index) in auditStatusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="备注" prop="remark">
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>商品备注信息，一般填写：审核驳回、商品下架等原因</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<el-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
								</el-form-item>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="虚拟销量" prop="virtualSaleCount">
											<el-input-number v-model="form.virtualSaleCount" controls-position="right" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
								</el-row>
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
	import { defineAsyncComponent } from 'vue';
	const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));

	export default {
		emits: ['success', 'closed'],
		components:{
			SkuForm,
			SelectRemote,
			scEditor,
		},
		data() {
			return {
				loading: false,
				mode: "add",
				titleMap: {
					add: '新增商品',
					edit: '编辑商品',
					show: '查看商品'
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
					auditStatus: 1,
					image: "",
					images: "",
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
				auditStatusOptions: [
					{label: "待审核", value: 0},
					{label: "审核通过", value: 1},
					{label: "审核驳回", value: 2},
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
				saleUnitSelect: {
					// api接口
					apiObj: this.$API.store.saleUnit.list,
					// 参数(搜索关键字为空时生效)
					params: {},
					// 搜索参数(搜索关键字不为空时生效)
					search: {},
					// 属性字段
					props: {
						keyword: 'keyword',
					},
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
				//原始规格数据
				sourceAttributes: [
					{
						label: '颜色', value: 1,
						options: [
							{label: '黑色', value: 1, checked: false},
							{label: '白色', value: 2, checked: false},
							{label: '银色', value: 3, checked: false},
							{label: '金色', value: 4, checked: false},
						],
						canAddAttribute: true,
					},
					{
						label: '内存', value: 2,
						options: [
							{label: '128G', value: 11, checked: false},
							{label: '512G', value: 12, checked: false},
							{label: '1T', value: 13, checked: false},
						],
						canAddAttribute: true,
					},
					{
						label: '运营商', value: 3,
						options: [
							{label: '全网通', value: 21, checked: false},
							{label: '电信', value: 22, checked: false},
							{label: '移动', value: 23, checked: false},
							{label: '联通', value: 24, checked: false},
						],
						canAddAttribute: false,
					},
				],
				//已使用的规格数据
				// attributes: [],
				attributes: [
					{
						"label": "颜色",
						"value": 1,
						"options": [
							{
								"label": "黑色",
								"value": 1
							},
							{
								"label": "白色",
								"value": 2
							}
						]
					},
					{
						"label": "内存",
						"value": 2,
						"options": [
							{
								"label": "128G",
								"value": 11
							},
							{
								"label": "512G",
								"value": 12
							}
						]
					},
					{
						"label": "运营商",
						"value": 3,
						"options": [
							{
								"label": "全网通",
								"value": 21
							},
							{
								"label": "电信",
								"value": 22
							}
						]
					}
				],
				//用于复原sku数据
				// skus: [],
				skus: [
					{
						"sku": "黑色;128G;全网通",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "黑色",
									"value": 1
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "128G",
									"value": 11
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "全网通",
									"value": 21
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 2000,
						"productId": 1000,
						"merchantId": 100000,
					},
					{
						"sku": "黑色;128G;电信",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "黑色",
									"value": 1
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "128G",
									"value": 11
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "电信",
									"value": 22
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 2
					},
					{
						"sku": "黑色;512G;全网通",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "黑色",
									"value": 1
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "512G",
									"value": 12
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "全网通",
									"value": 21
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 3
					},
					{
						"sku": "黑色;512G;电信",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "黑色",
									"value": 1
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "512G",
									"value": 12
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "电信",
									"value": 22
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 4
					},
					{
						"sku": "白色;128G;全网通",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "白色",
									"value": 2
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "128G",
									"value": 11
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "全网通",
									"value": 21
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 5
					},
					{
						"sku": "白色;128G;电信",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "白色",
									"value": 2
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "128G",
									"value": 11
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "电信",
									"value": 22
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 6
					},
					{
						"sku": "白色;512G;全网通",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "白色",
									"value": 2
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "512G",
									"value": 12
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "全网通",
									"value": 21
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 7
					},
					{
						"sku": "白色;512G;电信",
						"attributeParams": [
							{
								"attribute": {
									"label": "颜色",
									"value": 1
								},
								"attributeValue": {
									"label": "白色",
									"value": 2
								}
							},
							{
								"attribute": {
									"label": "内存",
									"value": 2
								},
								"attributeValue": {
									"label": "512G",
									"value": 12
								}
							},
							{
								"attribute": {
									"label": "运营商",
									"value": 3
								},
								"attributeValue": {
									"label": "电信",
									"value": 22
								}
							}
						],
						"price": "10",
						"marketPrice": "",
						"costPrice": "",
						"stock": "1000",
						"code": "",
						"barcode": "",
						"image": "",
						"status": 1,
						"id": 8
					}
				],
				//表格结构
				structures: [
					{
						name: 'price',
						type: 'input',
						label: '销售价',
						tip: '商品售价',
						required: true,
						validate: (data, index, callback) => {
							if (data[index].price && parseFloat(data[index].price) < 0) {
								callback(new Error('价格不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'marketPrice',
						type: 'input',
						label: '市场价',
						tip: '划线参考价格',
						required: false,
						validate: (data, index, callback) => {
							if (data[index].marketPrice && parseFloat(data[index].marketPrice) < 0) {
								callback(new Error('市场价不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'costPrice',
						type: 'input',
						label: '成本价',
						required: false,
						validate: (data, index, callback) => {
							if (data[index].costPrice && parseFloat(data[index].costPrice) < 0) {
								callback(new Error('成本价不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'stock',
						type: 'input',
						label: '库存',
						required: true,
						// data: 完整 sku 数据，index: 当前 sku 在 data 中的下标，callback: 验证结果回调函数
						validate: (data, index, callback) => {
							if (data[index].stock && parseInt(data[index].stock) < 0) {
								callback(new Error('库存不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'code',
						type: 'input',
						label: '商家编码',
						tip: '商家编码请保持唯一性，可以使用商品货号或内部商品唯一标识等，留空时系统自动生成',
						required: false,
					},
					{
						name: 'barcode',
						type: 'input',
						label: '商品条形码',
						tip: '请填写正确条码，将有助于平台准确识别您的商品，消费者能更方便找到您的商品，也可以提供更准确、全面的信息导购。',
						required: false,
					},
					{
						name: 'image',
						type: 'slot',
						label: '图片',
						tip: 'SKU图片',
						required: false,
					},
					{
						name: 'status',
						type: 'slot',
						defaultValue: 1,
						label: '状态',
						required: true,
					},
					{
						name: 'totalPrice',
						type: 'slot',
						// 如果该字段无需记录到 sku 数据里，则设置为 false
						skuProperty: false,
						label: '总价',
						tip: '总价 = 价格 * 库存，如果价格或库存为空时，则不计算'
					},
					/*{
						name: 'score',
						type: 'slot',
						defaultValue: 0,
						label: '评分',
					},*/
					{
						name: 'operation',
						type: 'slot',
						label: '操作',
						required: false,
						skuProperty: false,
					},
				],
			}
		},
		watch: {
			form: {
				handler(){
					// 处理品牌搜索条件
					if (this.form.categoryId){
						this.brandSelect.params.categoryId = this.form.categoryId
						this.brandSelect.search.categoryId = this.form.categoryId
					}
					// 处理销售单位搜索条件
					if (this.form.categoryId){
						this.saleUnitSelect.params.categoryId = this.form.categoryId
						this.saleUnitSelect.search.categoryId = this.form.categoryId
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
			//Sku表单表格行删除
			skuFormTableRowDelete(row, index) {
				// console.log('skuFormTableRowDelete.row:', row)
				// console.log('skuFormTableRowDelete.row.sku:', row.sku)
				// console.log('skuFormTableRowDelete.index:', index)
				// console.log('this.$refs.skuForm:', this.$refs.skuForm.form.skuData)
				this.$nextTick(() => {
					let i = 0
					for(let idx in this.$refs.skuForm.form.skuData){
						// console.log('skuFormTableRowDelete.idx:', idx)
						// console.log('skuFormTableRowDelete.i == index:', i == index)
						if (i === index){
							// delete this.$refs.skuForm.form.skuData[idx] // delete删除方式会导致数组下标错乱
							this.$refs.skuForm.form.skuData.splice(idx, 1)
							this.$message.success("删除成功")
						}
						i++
					}
				})
			},
			//Sku表单表格行删除
			skuFormTotalPrice(data) {
				let totalPrice = ''
				if (data.price && data.stock) {
					totalPrice = (parseFloat(data.price) * parseFloat(data.stock)).toFixed(2)
					totalPrice += ' 元'
				}
				return totalPrice
			},
			//Sku表单校验
			skuFormValidate(){
				this.$refs.skuForm.validate(valid => {
					if (valid) {
						this.$message.success('验证通过')
						return true
					} else {
						this.$message.warning('验证失败')
						return false
					}
				})
				return false
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
