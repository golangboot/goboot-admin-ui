<template>
	<el-main>
		<el-card shadow="never">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="margin-top: 20px;">
        <el-tabs tab-position="top">

          <el-tab-pane label="商城设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="显示商家店铺" prop="isShowMerchant">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
                      <el-tooltip>
                        <template #content>开启时商城正常展示店铺信息，关闭则隐藏店铺信息</template>
                        <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                      v-model="form['store.isShowMerchant']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="开启" inactive-text="关闭"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="金额设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="金额小数点位数" prop="money.scale">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
									<el-tooltip>
										<template #content>全局设置商城中跟金额有关的数字保留小数点的位数，默认保留小数点后2位</template>
										<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
									</el-tooltip>
								</span>
                  </template>
                  <el-input-number v-model="form['store.money.scale']" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="商品设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="商品评价显示状态" prop="product.openCommentStatus">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
                      <el-tooltip>
                        <template #content>商品评价显示状态，开启后会展示商品评价</template>
                        <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                      v-model="form['store.product.openCommentStatus']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="显示" inactive-text="隐藏"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机端购买方式" prop="product.mobileBuyType">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>电脑端商品详情页，手机购买展示的二维码，支持网址和二维码图片</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <el-radio-group v-model="form['store.product.mobileBuyType']">
                    <el-radio v-for="(item, index) in mobileBuyTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form['store.product.mobileBuyType'] == 'IMAGE'">
                <el-form-item label="手机端购买二维码" prop="product.mobileBuyQrCodeUrl" clearable>
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>二维码可以上传公众号二维码、小程序二维码、APP下载二维码等图片</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <sc-upload :width="80" :height="80" v-model="form['store.product.mobileBuyQrCodeUrl']" title="请上传图片"></sc-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-else>
                <el-form-item label="手机端购买网址" prop="product.mobileBuyUrl">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
									<el-tooltip>
										<template #content>手机端跳转网址模板，例如：<code>${domain}/#/pages/goods/index?id=${id}</code></template>
										<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
									</el-tooltip>
								</span>
                  </template>
                  <el-input v-model="form['store.product.mobileBuyUrl']" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="订单设置">
            <el-form-item label-width="180px" label="订单自动关闭时间(分钟)" prop="order.autoCloseOrderTimer">
              <el-input-number v-model="form['store.order.autoCloseOrderTimer']" controls-position="right"></el-input-number>
              <div class="el-form-item-msg">订单提交后待支付时长</div>
            </el-form-item>
            <el-form-item label-width="180px" label="订单自动收货时间(天)" prop="order.autoTakeOrderTimer">
              <el-input-number v-model="form['store.order.autoTakeOrderTimer']" controls-position="right"></el-input-number>
              <div class="el-form-item-msg">订单自动收货时间(天) 自发货日算起；当设置为0时，默认自动收货时间是15天。</div>
            </el-form-item>
            <el-form-item label-width="180px" label="订单售后时长(天)" prop="order.orderRefundTimer">
              <el-input-number v-model="form['store.order.orderRefundTimer']" controls-position="right"></el-input-number>
              <div class="el-form-item-msg">例如：设置10天指用户确认收货10天内可以退货；如未设置，默认用户在确认收货后15天就不能退货了。</div>
            </el-form-item>
            <el-form-item label-width="auto" label="自动处理商户退款订单期限（天）" prop="order.autoRefundTimer">
              <el-input-number v-model="form['store.order.autoRefundTimer']" controls-position="right"></el-input-number>
              <div class="el-form-item-msg">申请退款的订单超过期限，将自动退款处理。</div>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label-width="180px" label="订单自动好评状态" prop="order.openAutoComment">
                  <el-switch
                      v-model="form['store.order.openAutoComment']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="开启" inactive-text="关闭"
                  />
                  <div class="el-form-item-msg">开启后，会自动对n天内未评价的订单默认五星好评</div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="180px" label="订单自动好评触发时间(天)" prop="order.autoCommentTimer">
                  <el-input-number v-model="form['store.order.autoCommentTimer']" controls-position="right"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label-width="180px" label="订单退款理由" prop="order.orderRefundReason">
              <el-input v-model="form['store.order.orderRefundReason']" :autosize="{ minRows: 6, maxRows: 12 }" :maxlength="65535" :show-word-limit="true" type="textarea"></el-input>
              <div class="el-form-item-msg">每行表示一个退款理由选项，多个退款理由使用Enter确认键换行</div>
            </el-form-item>

          </el-tab-pane>

          <el-tab-pane label="商家设置">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label-width="180px" label="开启商家入驻" prop="merchant.enabled">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
                      <el-tooltip>
                        <template #content>关闭后前端将隐藏商家相关界面</template>
                        <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-switch
                      v-model="form['store.merchant.enabled']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="开启" inactive-text="关闭"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label-width="180px" label="商家资质是否必传" prop="merchant.certificationRequired">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>商家资质是否必传</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <el-switch
                      v-model="form['store.merchant.certificationRequired']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="开启" inactive-text="关闭"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label-width="180px" label="店铺保证金图标状态" prop="merchant.depositIconShowStatus">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>店铺保证金图标显示状态</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <el-switch
                      v-model="form['store.merchant.depositIconShowStatus']"
                      class="form-switch"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                      :active-value="'1'" :inactive-value="'0'"
                      active-text="显示" inactive-text="隐藏"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="180px" label="店铺保证金图标" prop="merchant.depositIcon" clearable>
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>店铺保证金图标</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <sc-upload :width="80" :height="80" v-model="form['store.merchant.depositIcon']" title="请上传图片"></sc-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>

        </el-tabs>
        <el-form-item>
          <el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
          <el-button @click="visible=false" >取 消</el-button>
        </el-form-item>
      </el-form>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'storeSetting',
		data() {
			return {
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					"store.name": "",
					"'store.product.mobileBuyType'": "URL",
				},
				//验证规则
				rules: {
					"store.name": [
						{required: true, message: '请输入网站名称'}
					],
				},
				configGroup: 'store',
        mobileBuyTypeOptions: [
          {label: "网址", value: "URL",},
          {label: "图片", value: "IMAGE",},
        ],
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			async getData(){
				let reqData = {group: this.configGroup}
				let res = await this.$API.platform.sys.setting.list.get(reqData);
				if (res.data){
					let items = res.data;
					// console.log(items)
					for (let key in items){
						let item = items[key]
						// console.log(item)
						this.form[item.code] = item.value;
					}
					// console.log(this.form)
				}
			},
			//表单提交方法
			submit(){
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						let res = await this.$API.platform.sys.setting.update.post(this.form)
						this.isSaving = false;
						if(res.code == 200){
							// this.form = res.data
							// this.$emit('success', this.form, this.mode)
							this.visible = false;
							this.$message.success("操作成功")
						}else{
							await this.$alert(res.message, "提示", {type: 'error'})
						}
					}
				})
			},
		}
	}
</script>

<style>
</style>
