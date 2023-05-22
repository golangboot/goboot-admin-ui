<template>
	<el-drawer :title="titleMap[mode]" v-model="visible" :size="'90%'" :close-on-click-modal="mode=='show'" destroy-on-close @closed="$emit('closed')">
		<el-container v-loading="loading">
			<el-main style="padding:0 20px 20px 20px;">
				<el-form :model="form" :rules="rules" :disabled="mode=='show'" ref="form" label-width="130px" label-position="right">
					<el-steps :active="stepFormActive" finish-status="success" align-center style="margin-bottom: 20px;">
						<el-step title="选择商品分类"></el-step>
						<el-step title="填写商品信息"></el-step>
						<el-step title="完成"></el-step>
					</el-steps>
					<el-row :gutter="20" v-if="stepFormActive === 0">
						<el-col :span="24">
							<el-form-item label="商品分类" prop="categoryId">
								<el-cascader-panel v-model="form.categoryId" :options="treeOptions" :props="treeProps" :show-all-levels="true" style="width:100%" placeholder="请选择商品分类" clearable filterable></el-cascader-panel>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20" v-if="stepFormActive === 1">
						<el-col :span="24">
							<el-card shadow="never" header="基础信息">
								<el-form-item label="商品类型" prop="type">
									<el-radio-group v-model="form.type">
										<el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>

								<!--<el-form-item label="商品分类" prop="categoryId">
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
								</el-form-item>-->

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

								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品品牌" prop="brandId">
											<select-remote v-model="form.brandId"
														   :apiObj="$API.platform.store.brand.list"
														   :params="{id: form.brandId, categoryId: form.categoryId}"
														   :searchClearParams="['id']"
														   :request="{name: 'keyword'}"
														   :props="{label: 'name', value: 'id',}"
														   clearable filterable style="width: 100%;">
											</select-remote>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="销售单位" prop="saleUnitId">
											<select-remote v-model="form.saleUnitId"
														   :apiObj="$API.platform.store.saleUnit.list"
														   :params="{id: form.saleUnitId, categoryId: form.categoryId}"
														   :searchClearParams="['id']"
														   :request="{name: 'keyword'}"
														   :props="{label: 'name', value: 'id',}"
														   clearable filterable style="width: 100%;">
											</select-remote>
										</el-form-item>
									</el-col>
								</el-row>

								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商品编码" prop="productSn">
											<el-input v-model="form.productSn" clearable></el-input>
										</el-form-item>
									</el-col>
									<el-col :span="12">
										<el-form-item label="商品产地" prop="productArea">
											<el-input v-model="form.productArea" clearable></el-input>
										</el-form-item>
									</el-col>
								</el-row>

								<el-form-item label="商品状态" prop="status">
									<el-radio-group v-model="form.status">
										<el-radio v-for="(item, index) in statusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-card>

							<el-card shadow="never" header="规格属性">
								<div ref="skuFormContainer">
								<!--<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="规格操作">
											<el-button type="primary" icon="el-icon-plus" @click="skuFormAddAttribute">添加SKU规格属性</el-button>
											<el-button type="primary" icon="el-icon-plus" @click="skuFormSyncUpdateHandler">更新SKU规格属性</el-button>
										</el-form-item>
									</el-col>
								</el-row>-->
								<sku-form ref="skuForm"
										  v-model:source-attributes="form.saleAttributes"
										  v-model:attributes="form.skuAttributes"
										  v-model:skus="form.skus"
										  :structures="skuFormStructures"
										  :table-props="skuFormTableProps"
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
												inline-prompt
												style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
												:active-value="1" :inactive-value="0"
												active-text="上架" inactive-text="下架"
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
							</el-card>

							<el-card shadow="never" header="规格参数" v-if="form.specAttributes && form.specAttributes.length > 0">
								<sc-form-table ref="specAttributesFormTable" v-model="form.specAttributes" :addTemplate="specAttributesAddTemplate" placeholder="暂无数据" hideDelete hideAdd>
									<el-table-column prop="label" label="参数名称">
										<template #default="scope">
											<span>{{ scope.row.label }}</span>
										</template>
									</el-table-column>
									<el-table-column prop="param" label="参数值">
										<template #default="scope">
											 <!-- :rules="specAttributesRules[scope.row.value]" :required="scope.row.required" :inline-message="true" :error="`${scope.row.label}不能为空`" -->
											<el-form-item :key="`specAttributes-param-${scope.$index}`" :prop="`specAttributes.${scope.$index}.${scope.column.property}`" :rules="specAttributesRules[scope.row.value]" :inline-message="true" style="margin-bottom: 0;">
												<template v-if="scope.row?.selectType == 1 || scope.row?.selectType == 2">
													<el-select v-model="scope.row.param" placeholder="" style="width: 100%;">
														<el-option v-for="(item, index) in scope.row.options" :key="index" :label="item.label" :value="item.value"/>
													</el-select>
												</template>
												<template v-else-if="scope.row?.selectType == 4">
													<el-switch
														v-model="scope.row.param"
														inline-prompt
														style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
														:active-value="'是'" :inactive-value="'否'"
														active-text="是" inactive-text="否"
													/>
												</template>
												<template v-else>
													<el-input v-model="scope.row.param" placeholder="请输入参数值"></el-input>
												</template>
											</el-form-item>
										</template>
									</el-table-column>
								</sc-form-table>

							</el-card>

							<el-card shadow="never" header="商品详情">
								<el-form-item label="商品内容" prop="content">
									<sc-editor v-model="form.content" :disabled="mode=='show'" placeholder="请输入内容" :height="500"></sc-editor>
								</el-form-item>
							</el-card>

							<el-card shadow="never" header="物流设置">
								<el-form-item label="物流方式" prop="logisticsType">
									<el-radio-group v-model="form.logisticsType">
										<el-radio v-for="(item, index) in logisticsTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
									</el-radio-group>
								</el-form-item>
								<template v-if="form.logisticsType == 1">
									<el-form-item label="运费类型" prop="freightType">
										<el-radio-group v-model="form.freightType">
											<el-radio v-for="(item, index) in freightTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
										</el-radio-group>
									</el-form-item>
									<el-row :gutter="20" v-if="form.freightType == 1">
										<el-col :span="12">
											<el-form-item label="运费价格" prop="freightPrice">
												<el-input-number v-model="form.freightPrice" placeholder="请输入运费价格（元）" controls-position="right" :min="0" style="width: 50%;"></el-input-number>
											</el-form-item>
										</el-col>
									</el-row>
									<el-row :gutter="20" v-if="form.freightType == 2">
										<el-col :span="12">
											<el-form-item label="运费模板" prop="shippingTemplateId" :rules="shippingTemplateRules">
												<select-remote v-model="form.shippingTemplateId" ref="shippingTemplateSelectRemote"
															   :apiObj="$API.platform.store.shippingTemplate.list"
															   :params="{id: form.shippingTemplateId, merchantId: form.merchantId}"
															   :searchClearParams="['id']"
															   :request="{name: 'keyword'}"
															   :props="{label: 'name', value: 'id',}"
															   clearable filterable style="width: 100%;">
												</select-remote>
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-button type="default" @click="shippingTemplateAdd">新建运费模板</el-button>
										</el-col>
									</el-row>
								</template>
							</el-card>

							<el-card shadow="never" header="营销设置">
								<el-alert title="开发中，待上线..." type="info" show-icon style="margin-bottom: 15px;"/>
							</el-card>

							<el-card shadow="never" header="其他设置">
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
									<sc-form-table ref="customFormTable" v-model="form.customFormParams" :addTemplate="customFormParamAddTemplate" placeholder="暂无数据" dragSort>
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
													v-model="scope.row.required" inline-prompt
													style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
													:active-value="true" :inactive-value="false"
													active-text="必填" inactive-text="选填"
												/>
											</template>
										</el-table-column>
									</sc-form-table>
								</el-form-item>
							</el-card>

							<el-card shadow="never" header="平台操作">
								<el-row :gutter="20">
									<el-col :span="12">
										<el-form-item label="商家" prop="merchantId">
											<select-remote v-model="form.merchantId"
														   :apiObj="$API.platform.store.merchant.list"
														   :params="{id: form.merchantId}"
														   :searchClearParams="['id']"
														   :request="{name: 'keyword'}"
														   :props="{label: 'name', value: 'id',}"
														   clearable filterable style="width: 100%;">
											</select-remote>
										</el-form-item>
									</el-col>
									<el-col :span="12">
									</el-col>
								</el-row>

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
							</el-card>

							<!--<el-card shadow="never" header="更多设置"></el-card>-->
						</el-col>
					</el-row>
					<el-row :gutter="20" v-if="stepFormActive === 2">
						<el-col :span="24">
							<el-result icon="success" title="操作成功" sub-title="商品保存成功">
								<template #extra>
									<el-button type="primary" @click="resetForm()">继续添加商品</el-button>
									<el-button @click="mode = 'show'; stepFormActive = 0">查看商品</el-button>
									<el-button type="warning" @click="mode = 'add'; stepFormActive = 0; form.id = ''">复制商品</el-button>
								</template>
							</el-result>
						</el-col>
					</el-row>
				</el-form>
			</el-main>
			<el-footer>
				<el-button v-if="stepFormActive>0 && stepFormActive<2" @click="pre" :disabled="isSaving">上一步</el-button>
				<el-button v-if="stepFormActive<1" type="primary" @click="next">下一步</el-button>
				<el-button v-if="mode!='show' && stepFormActive==1" type="primary" :loading="isSaving" @click="submit">保存</el-button>
				<el-button @click="visible=false">返回</el-button>
			</el-footer>
		</el-container>

		<shipping-template-save-dialog v-if="dialog.shippingTemplateSave" ref="shippingTemplateSaveDialog" @success="shippingTemplateHandleSaveSuccess" @closed="dialog.shippingTemplateSave=false"></shipping-template-save-dialog>
	</el-drawer>
</template>

<script>
	import skuForm from "@/components/skuForm";
	import selectRemote from "@/components/selectRemote";
	import { defineAsyncComponent } from 'vue';
	const scEditor = defineAsyncComponent(() => import('@/components/scEditor'));
	import shippingTemplateSaveDialog from '../shippingTemplate/save'

	export default {
		emits: ['success', 'closed'],
		components:{
			skuForm,
			selectRemote,
			scEditor,
			shippingTemplateSaveDialog,
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
				dialog: {
					shippingTemplateSave: false,
				},
				visible: false,
				isSaving: false,
				stepFormActive: 0,
				sourceForm: {},
				//表单数据
				form: {
					id:"",
					name: "",
					sort: null,
					status: 1,
					remark: "",
					categoryId: null,
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
					//规格属性原始Sku属性数据
					saleAttributes: [],
					//规格参数
					specAttributes: [],
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
					images: [
						{ required: true, message: '请上传至少1张商品相册图片', trigger: ['change', 'blur']}
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
					// {label: "自提点自提", value: 2,}, // 预留功能未实现, 暂时隐藏
					// {label: "到店核销", value: 3,}, // 预留功能未实现, 暂时隐藏
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
					apiObj: this.$API.platform.store.brand.list,
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
					apiObj: this.$API.platform.store.saleUnit.list,
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
					apiObj: this.$API.platform.store.merchant.list,
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
					apiObj: this.$API.platform.store.shippingTemplate.list,
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
				specAttributesAddTemplate: {
					"label": "",
					"value": "",
					"required": false,
					"selectType": null,
					"options": [],
					"param": "",
				},
				//分类属性集合
				categoryAttributes: [],
				//sku表格结构
				skuFormStructures: [
					{
						name: 'price',
						type: 'input-number',
						label: '销售价',
						tip: '商品售价',
						required: true,
						validate: (data, index, callback) => {
							if (data[index].price && parseFloat(data[index].price) < 0) {
								callback(new Error('商品价格不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'marketPrice',
						type: 'input-number',
						label: '市场价',
						tip: '划线参考价格',
						required: false,
						validate: (data, index, callback) => {
							if (data[index].marketPrice && parseFloat(data[index].marketPrice) < 0) {
								callback(new Error('商品市场价不能小于0'))
							}
							callback()
						}
					},
					{
						name: 'costPrice',
						type: 'input-number',
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
						type: 'input-number',
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
						required: false,
						tip: '商家编码请保持唯一性，可以使用商品货号或内部商品唯一标识等，留空时系统自动生成',
					},
					{
						name: 'barCode',
						type: 'input',
						label: '商品条形码',
						required: false,
						tip: '请填写正确条码，将有助于平台准确识别您的商品，消费者能更方便找到您的商品，也可以提供更准确、全面的信息导购。',
					},
					{
						name: 'weight',
						type: 'input-number',
						label: '重量(KG)',
						required: false,
						tip: '商品重量，单位：KG',
					},
					{
						name: 'volume',
						type: 'input-number',
						label: '体积(m³)',
						required: false,
						tip: '商品体积，单位：m³',
					},
					{
						name: 'image',
						type: 'slot',
						label: '图片',
						required: false,
						tip: '商品SKU属性图片',
					},
					{
						name: 'status',
						type: 'slot',
						label: '状态',
						required: true,
						tip: '商品SKU上下架状态',
						defaultValue: 0,
					},
					{
						name: 'totalPrice',
						type: 'slot',
						label: '总价',
						tip: '总价 = 价格 * 库存，如果价格或库存为空时，则不计算',
						// 如果该字段无需记录到 sku 数据里，则设置为 false
						skuProperty: false,
					},
					/*{
						name: 'score',
						type: 'slot',
						label: '评分',
						defaultValue: 0,
					},*/
					{
						name: 'operation',
						type: 'slot',
						label: '操作',
						required: false,
						skuProperty: false,
					},
				],
				//sku表格属性
				skuFormTableProps: {
					// height: `calc(100vh - 5vh - 180px )`,
				},
			}
		},
		computed: {
			specAttributesRules() {
				// 重新生成验证规则
				let rules = {}
				this.form?.specAttributes.forEach(v => {
					// let name = v.name || 'param'
					let name = v.value
					rules[name] = []
					if (v.required) {
						rules[name].push({ required: true, message: `${v.label}不能为空`, trigger: ['change', 'blur'] })
					}
				})
				return rules
			},
			shippingTemplateRules() {
				// 重新生成验证规则
				let rules = []
				if (this.form.freightType == 2){
					rules.push({ required: true, message: `运费模板不能为空`, trigger: ['change', 'blur'] })
				}
				return rules
			},
		},
		watch: {
			form: {
				// eslint-disable-next-line
				handler(newValue, oldValue){
				},
				deep: true
			},
			'form.categoryId': {
				handler(newValue,oldValue){
					if (newValue && newValue !== oldValue){
						// 处理 品牌 搜索条件
						// this.brandSelect.params.categoryId = newValue
						// this.brandSelect.search.categoryId = newValue
						// 处理 销售单位 搜索条件
						// this.saleUnitSelect.params.categoryId = newValue
						// this.saleUnitSelect.search.categoryId = newValue
						// 处理 分类属性
						// this.getCategoryAttributes()
					}
				},
				deep: true
			},
			'form.merchantId': {
				// eslint-disable-next-line
				handler(newValue,oldValue){
					if (newValue && newValue !== oldValue){
						// 处理 运费模板 搜索条件
						// this.shippingTemplateSelect.params.merchantId = this.form.merchantId
						// this.shippingTemplateSelect.search.merchantId = this.form.merchantId
						// 商家ID发生改变时, 运费模板需要重置
						this.form.shippingTemplateId = ''
					}
				},
				deep: true
			},
			'form.customFormParams': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined') {
						this.form.customFormParams = []
					}
				},
				deep: true
			},
			'form.skus': {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (typeof newValue == 'undefined') {
						this.form.skus = []
					}
					if(newValue && newValue.length > 10) {
						// 调整Sku表单组件中表格的高度
						this.skuFormTableProps.height = `calc(100vh - 5vh - 180px )`
					}
				},
				deep: true
			},
			stepFormActive: {
				// eslint-disable-next-line
				handler(newValue, oldValue) {
					if (newValue === 1){
						// 处理 分类属性
						this.getCategoryAttributes()
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
			if (Object.keys(this.sourceForm).length <= 0) {
				this.sourceForm = Object.assign({}, this.form)
			}
			this.getTreeList()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this
			},
			//下一步
			next(){
				if (this.stepFormActive === 0){
					this.$refs.form.validateField(['categoryId'], (valid) => {
						// console.log('valid:', valid)
						// console.log('form:', this.form)
						if (valid) {
							this.stepFormActive += 1
						} else {
							this.$message.warning("商品分类不能为空")
							return false
						}
					})
				}
			},
			//上一步
			pre(){
				this.stepFormActive -= 1
			},
			//再来一次
			again(){
				this.stepFormActive = 0
			},
			resetForm(){
				this.mode = 'add'
				this.stepFormActive = 0
				this.$nextTick(() => {
					this.form = this.sourceForm
					this.$refs.form.resetFields()
				})
			},
			//表单提交方法
			async submit() {
				//Sku表单校验
				if (!await this.skuFormValidate()) {
					this.$message.warning('商品规格属性验证失败')
					this.$refs.skuFormContainer.scrollIntoView()
					return
				}
				await this.$refs.form.validate(async (valid, val) => {
					if (valid) {
						this.isSaving = true;
						let res;
						if (this.form.id) {
							res = await this.$API.platform.store.product.update.put(this.form)
						} else {
							res = await this.$API.platform.store.product.add.post(this.form)
						}
						this.isSaving = false;
						if (res.code == 200) {
							this.form = res.data
							this.$emit('success', this.form, this.mode)
							// this.visible = false;
							this.$message.success("操作成功")
							this.stepFormActive += 1
						} else {
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					}else {
						this.$message.warning('商品参数验证失败，请检查您填写的商品参数')
						let obj = Object.keys(val)
						this.$refs.form.scrollToField(obj[0])
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
						let res = await this.$API.platform.store.product.detail.get(reqData)
						this.isSaving = false
						this.form = res.data
					}
					this.loading = false
					// this.form.customFormParams = this.form.customFormParams || []
					// this.form.skus = this.form.skus || []
					// console.log('setData -> form:', this.form)
				})
			},
			async getTreeList() {
				let res = await this.$API.platform.store.category.tree.get();
				this.treeOptions = res.data
			},
			async getCategoryAttributes() {
				let reqData = {categoryId: this.form.categoryId}
				let res = await this.$API.platform.store.category.getCategoryAttributes.get(reqData);
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
			async skuFormValidate() {
				return await this.$refs.skuForm.validate()
					.then(() => {
						return true
					})
					.catch(() => {
						return false
					})
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
					//规格属性(销售属性)
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
									// value: "",
									// checked: false,
								}
								attribute.options.push(attributeItem)
							})
						}
						attribute.value = categoryAttribute.id
						saleAttributes.push(attribute)
					}

					//规格参数
					if (!categoryAttribute.isSaleAttribute) {
						let attribute = {
							label: categoryAttribute.name,
							value: categoryAttribute.id,
							param: "",
							options: [],
							required: categoryAttribute.optionType == 1,
							selectType:  categoryAttribute.selectType,
						}
						if (categoryAttribute.options){
							categoryAttribute.options.split(',').forEach(attributeValue => {
								let attributeItem = {
									label: attributeValue,
									value: attributeValue,
								}
								attribute.options.push(attributeItem)
							})
						}
						specAttributes.push(attribute)
					}
				})

				this.form.saleAttributes = Object.assign(this.form.saleAttributes || [], saleAttributes)
				// this.$refs.skuForm?.init() // skuForm初始化
				// console.log('handleCategoryAttributes -> skuForm.isInit:', this.$refs.skuForm.isInit)

				// this.form.specAttributes = Object.assign(this.form.specAttributes || [], specAttributes)
				specAttributes.forEach(specAttribute => {
					this.form.specAttributes.forEach(specAttr => {
						if (specAttribute.value == specAttr.value){
							specAttribute.param = specAttr.param
						}
					})
				})
				this.form.specAttributes = specAttributes
			},
			shippingTemplateAdd(){
				this.dialog.shippingTemplateSave = true
				this.$nextTick(() => {
					let form = {}
					if (this.form.merchantId){
						form.merchantId = this.form.merchantId
					}
					this.$refs.shippingTemplateSaveDialog.open('add').setData(form)
				})
			},
			shippingTemplateHandleSaveSuccess(){
			},
		}
	}
</script>

<style lang="scss" scoped>
.el-cascader-panel{
	height: 60vh;
	:deep(.el-cascader-menu__wrap).el-scrollbar__wrap {
		height: 100%;
	}
}
</style>
