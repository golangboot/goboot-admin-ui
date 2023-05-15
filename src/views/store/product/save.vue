<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'90%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="dialogForm" label-width="130px" label-position="right">
					<el-card shadow="never">
						<el-tabs tab-position="top">
							<el-tab-pane label="基础信息">

								<el-form-item label="商品类型" prop="type">
									<el-radio-group v-model="form.type">
										<el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>

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
									<div class="el-form-item-msg" v-if="!form.categoryId">请选择商品分类后，再编辑商品信息</div>
								</el-form-item>

								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品品牌" prop="brandId">
											<select-remote v-model="form.brandId" :apiObj="brandSelect.apiObj" :params="brandSelect.params" :search="brandSelect.search" :props="brandSelect.props" clearable filterable></select-remote>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="销售单位" prop="saleUnitId">
											<select-remote v-model="form.saleUnitId" :apiObj="saleUnitSelect.apiObj" :params="saleUnitSelect.params" :search="saleUnitSelect.search" :props="saleUnitSelect.props" clearable filterable></select-remote>
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
									<sc-upload v-model="form.image" title="请上传图片" :width="80" :height="80"></sc-upload>
								</el-form-item>

								<el-form-item label="商品相册" prop="images">
									<sc-upload-multiple v-model="form.images" :width="80" :height="80" draggable :limit="10" title="请上传图片" tip="建议尺寸：800*800，可拖拽改变图片顺序，默认首张图为主图，最多上传10张"></sc-upload-multiple>
								</el-form-item>

								<el-form-item label="商品状态" prop="status">
									<el-radio-group v-model="form.status">
										<el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-tab-pane>

							<el-tab-pane label="规格库存">
								<!--<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="规格操作">
											<el-button type="primary" icon="el-icon-plus" @click="skuFormAddAttribute">添加SKU规格属性</el-button>
											<el-button type="primary" icon="el-icon-plus" @click="skuFormSyncUpdateHandler">更新SKU规格属性</el-button>
										</el-form-item>
									</el-col>
								</el-row>-->
								<el-row :gutter="20">
									<el-col :span="24">
										<div>
											<sku-form ref="skuForm"
													 v-model:source-attributes="form.skuSourceAttributes"
													 v-model:structures="skuFormStructures"
													 v-model:attributes="form.skuAttributes"
													 v-model:skus="form.skus"
													  :sku-total-count-limit="100"
													  :formDisabled="mode=='show'"
											>
												<!--<template #score="slotProps">
													<div>
														<el-rate v-model="slotProps.row.score" />
													</div>
												</template>-->

												<!--<template #image="slotProps">
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
												</template>-->
												<template #image="slotProps">
													<div class="image-upload-container" style="margin: 0 auto;">
														<sc-upload v-model="slotProps.row.image" title="请上传图片" :width="80" :height="80"></sc-upload>
													</div>
												</template>
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
											<!--<el-row type="flex" :gutter="20">
												<el-col :span="12">
													<el-divider content-position="left">attributes 数据</el-divider>
													<pre><code>{{ form.skuAttributes }}</code></pre>
												</el-col>
												<el-col :span="12">
													<el-divider content-position="left">skus 数据</el-divider>
													<pre><code>{{ form.skus }}</code></pre>
												</el-col>
											</el-row>-->
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
								<el-form-item label="物流方式" prop="logisticsType">
									<el-radio-group v-model="form.logisticsType">
										<el-radio v-for="(item, index) in logisticsTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-row :gutter="20" v-if="form.logisticsType == 1">
									<el-col :span="12">
										<el-form-item label="运费类型" prop="freightType">
											<el-radio-group v-model="form.freightType">
												<el-radio v-for="(item, index) in freightTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
											</el-radio-group>
										</el-form-item>
									</el-col>
									<el-col :span="12" v-if="form.freightType == 1">
										<el-form-item label="运费价格" prop="freightPrice">
											<el-input-number v-model="form.freightPrice" placeholder="请输入运费价格" controls-position="right" :min="0" style="width: 50%;"></el-input-number>
										</el-form-item>
									</el-col>
									<el-col :span="12" v-if="form.freightType == 2">
										<el-form-item label="运费模板" prop="shippingTemplateId">
											<select-remote v-model="form.shippingTemplateId" :apiObj="shippingTemplateSelect.apiObj" :params="shippingTemplateSelect.params" :search="shippingTemplateSelect.search" :props="shippingTemplateSelect.props" clearable filterable></select-remote>
										</el-form-item>
									</el-col>
								</el-row>
							</el-tab-pane>

							<el-tab-pane label="营销设置">
								<el-alert title="开发中，待上线..." type="info" show-icon style="margin-bottom: 15px;"/>
							</el-tab-pane>

							<el-tab-pane label="其他设置">
								<el-form-item label="商品关键词" prop="keywords">
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>商品关键词不影响搜索排序，请按照建议结构客观准确描述商品信息，避免带来商品转化或消费者投诉风险。</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<el-input v-model="form.keywords" :autosize="{ minRows: 2, maxRows: 4 }" :maxlength="255" :show-word-limit="true" type="textarea"></el-input>
								</el-form-item>
								<el-form-item label="自定义表单状态" prop="customFormStatus">
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>用户下单时需填写的信息，最多可设置10条。一般可以用来收集：真实姓名、身份证号码等参数</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<el-switch
										v-model="form.customFormStatus"
										class="ml-2"
										inline-prompt
										style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
										:active-value="1" :inactive-value="0"
										active-text="开启" inactive-text="关闭"
									/>
								</el-form-item>
								<el-form-item label="自定义表单参数" prop="customFormParams" v-if="form.customFormStatus == 1">
									<sc-form-table ref="customForm" v-model="form.customFormParams" :addTemplate="customFormParamAddTemplate" placeholder="暂无数据">
										<el-table-column prop="label" label="标题">
											<template #default="scope">
												<el-input v-model="scope.row.label" placeholder="请输入标题"></el-input>
											</template>
										</el-table-column>
										<!--<el-table-column prop="value" label="默认值">
											<template #default="scope">
												<el-input v-model="scope.row.value" placeholder="默认留空"></el-input>
											</template>
										</el-table-column>-->
										<el-table-column prop="type" label="类型">
											<template #default="scope">
												<el-select v-model="scope.row.type" placeholder="">
													<el-option v-for="(item, index) in customFormTypeOptions" :key="index" :label="item.label" :value="item.value"/>
												</el-select>
											</template>
										</el-table-column>
										<el-table-column prop="required" label="是否必填">
											<template #default="scope">
												<el-switch
													v-model="scope.row.required"
													class="ml-2"
													inline-prompt
													style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
													:active-value="true" :inactive-value="false"
													active-text="必填" inactive-text="选填"
												/>
											</template>
										</el-table-column>
									</sc-form-table>
								</el-form-item>
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
								<el-divider>特殊参数</el-divider>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="虚拟销量" prop="virtualSaleCount">
											<template #label="{ label }">
												<span>{{ label }}</span>
												<span>
											<el-tooltip>
												<template #content>虚拟销量不会计入商品真实销量中</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
											</template>
											<el-input-number v-model="form.virtualSaleCount" controls-position="right" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="赠送积分" prop="giveIntegral">
											<el-input-number v-model="form.giveIntegral" placeholder="请输入赠送积分" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
									<el-col :span="12">
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品排序" prop="sort">
											<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
								</el-row>
								<el-divider>系统自动维护参数</el-divider>
								<el-alert title="以下参数为系统内部参数，一般由系统自动计算，如非必要，请勿改动！" type="warning" show-icon style="margin-bottom: 15px;"/>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="销量" prop="saleCount">
											<template #label="{ label }">
												<span>{{ label }}</span>
												<span>
											<el-tooltip>
												<template #content>商品真实销量，商品SKU所有销量总和</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
											</template>
											<el-input-number v-model="form.saleCount" controls-position="right" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="评价数" prop="commentCount">
											<el-input-number v-model="form.commentCount" placeholder="" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="收藏数" prop="favoriteCount">
											<el-input-number v-model="form.favoriteCount" placeholder="" controls-position="right" :min="0" style="width: 100%;"></el-input-number>
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
					type: 0,
					logisticsType: 0,
					freightType: 0,
					customFormStatus: 0,
					customFormParams: [],
					//用于复原sku数据
					skus: [],
					//已使用的Sku属性数据
					skuAttributes: [],
					//原始Sku属性数据
					skuSourceAttributes: [],
				},
				//验证规则
				rules: {
					name: [
						{required: true, message: '请输入商品名称'}
					],
					type: [
						{ required: true, message: '请选择商品类型', trigger: ['change', 'blur']}
					],
					categoryId: [
						{ required: true, message: '请选择商品分类', trigger: ['change', 'blur']}
					],
				},
				statusOptions: [
					{label: "上架", value: 1,},
					{label: "下架", value: 0,},
				],
				typeOptions: [
					{label: "实物商品（物流发货）", value: 0,},
					{label: "虚拟商品（无需物流）", value: 1,},
				],
				auditStatusOptions: [
					{label: "待审核", value: 0},
					{label: "审核通过", value: 1},
					{label: "审核驳回", value: 2},
				],
				logisticsTypeOptions: [
					{label: "无需发货", value: 0,},
					{label: "快递物流", value: 1,},
					{label: "到店核销", value: 2,},
				],
				freightTypeOptions: [
					{label: "免费包邮", value: 0,},
					{label: "固定运费", value: 1,},
					{label: "运费模板", value: 2,},
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
				shippingTemplateSelect: {
					// api接口
					apiObj: this.$API.store.shippingTemplate.list,
					// 参数(搜索关键字为空时生效)
					params: {},
					// 搜索参数(搜索关键字不为空时生效)
					search: {},
					// 属性字段
					props: {
						keyword: 'keyword',
					},
				},
				customFormParamAddTemplate: {
					"label": "",
					"value": "",
					"type": "input",
					"required": true,
				},
				customFormTypeOptions: [
					{label: "输入框", value: "input",},
				],
				//分类属性集合
				categoryAttributes: [],
				//sku表格结构
				skuFormStructures: [
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
						name: 'weight',
						type: 'input',
						label: '重量(KG)',
						tip: '商品重量，单位：KG',
						required: false,
					},
					{
						name: 'volume',
						type: 'input',
						label: '体积(m³)',
						tip: '商品体积，单位：m³',
						required: false,
					},
					{
						name: 'image',
						type: 'slot',
						label: '图片',
						tip: 'SKU属性图片',
						required: false,
					},
					{
						name: 'status',
						type: 'slot',
						defaultValue: 0,
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
					/*if (this.form.categoryId){
						this.brandSelect.params.categoryId = this.form.categoryId
						this.brandSelect.search.categoryId = this.form.categoryId
					}*/
					// 处理销售单位搜索条件
					/*if (this.form.categoryId){
						this.saleUnitSelect.params.categoryId = this.form.categoryId
						this.saleUnitSelect.search.categoryId = this.form.categoryId
					}*/
				},
				deep: true
			},
			'form.categoryId': {
				handler(newValue,oldValue){
					if (newValue && newValue !== oldValue){
						// 处理 品牌 搜索条件
						this.brandSelect.params.categoryId = newValue
						this.brandSelect.search.categoryId = newValue
						// 处理 销售单位 搜索条件
						this.saleUnitSelect.params.categoryId = newValue
						this.saleUnitSelect.search.categoryId = newValue
						// 处理 分类属性
						this.getCategoryAttributes()
					}
				},
				deep: true
			},
			'form.merchantId': {
				handler(newValue,oldValue){
					if (newValue && newValue !== oldValue){
						// 处理 运费模板 搜索条件
						this.shippingTemplateSelect.params.merchantId = newValue
						this.shippingTemplateSelect.search.merchantId = newValue
					}
				},
				deep: true
			},
			categoryAttributes: {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					// console.log('watch -> categoryAttributes.newValue:', newValue)
					// console.log('watch -> categoryAttributes.oldValue:', oldValue)
					this.handleCategoryAttributes()
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
				this.$nextTick(async () => {
					if (data.id) {
						this.isSaving = true
						let reqData = {id: data.id}
						let res = await this.$API.store.product.detail.get(reqData)
						this.isSaving = false
						this.form = res.data
					}
					this.loading = false
					this.form.customFormParams = this.form.customFormParams || []
					this.form.skus = this.form.skus || []
					// console.log('setData -> form:', this.form)
				})
			},
			async getTreeList() {
				let res = await this.$API.store.category.tree.get();
				this.treeOptions = res.data
			},
			async getCategoryAttributes() {
				let reqData = {categoryId: this.form.categoryId}
				let res = await this.$API.store.category.getCategoryAttributes.get(reqData);
				this.categoryAttributes = res.data
			},
			//Sku表单表格行删除
			skuFormTableRowDelete(row, index) {
				// console.log('skuFormTableRowDelete.row:', row)
				// console.log('skuFormTableRowDelete.row.sku:', row.sku)
				// console.log('skuFormTableRowDelete.index:', index)
				// console.log('this.$refs.skuForm:', this.$refs.skuForm.form.skuData)
				// this.$nextTick(() => {})
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
			},
			//更新Sku表单
			skuFormSyncUpdateHandler(){},
			//处理分类参数
			handleCategoryAttributes(){
				// console.log('handleCategoryAttributes -> categoryAttributes:', this.categoryAttributes)
				if (!this.categoryAttributes || this.categoryAttributes.length <= 0){
					return
				}
				// this.$nextTick(() => {})
				//销售属性
				let saleAttributes = []
				//规格参数
				let specAttributes = []

				// 处理属性参数 (新旧参数合并)
				this.categoryAttributes.forEach(categoryAttribute => {
					//销售属性
					if (categoryAttribute.isSaleAttribute) {
						let attribute = {
							label: categoryAttribute.name,
							value: categoryAttribute.id,
							options: [],
						}
						if (categoryAttribute.options){
							categoryAttribute.options.split(',').forEach(attributeValue => {
								let attributeItem = {
									label: attributeValue,
									value: "",
									checked: false,
								}
								attribute.options.push(attributeItem)
							})
						}
						saleAttributes.push(attribute)
					}

					//规格参数
					if (!categoryAttribute.isSaleAttribute) {
						specAttributes.push(categoryAttribute)
					}
				})

				this.form.skuSourceAttributes = Object.assign(this.form.skuSourceAttributes || [], saleAttributes)
				this.$refs.skuForm.init() // skuForm初始化
				// console.log('handleCategoryAttributes -> skuForm.isInit:', this.$refs.skuForm.isInit)
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
