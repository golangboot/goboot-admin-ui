<template>
	<el-main>
		<el-card shadow="never">
			<el-tabs tab-position="top">

				<el-tab-pane label="网站设置">
					<el-form ref="form" :model="form" :rules="rules" label-width="110px" style="margin-top: 20px;">
						<el-form-item label="网站名称" prop="name">
							<el-input v-model="form['site.name']" clearable></el-input>
						</el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="电脑端网址" prop="pcUrl">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
                      <el-tooltip>
                        <template #content>电脑端网址，例如：https://www.example.com</template>
                        <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="form['site.pcUrl']" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机端网址" prop="h5Url">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
                      <el-tooltip>
                        <template #content>手机端网址，例如：https://h5.example.com</template>
                        <el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-input v-model="form['site.h5Url']" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="服务端网址" prop="url">
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
									<el-tooltip>
										<template #content>服务器后端Api接口网址，例如：https://api.example.com ，留空时系统会自动获取网址</template>
										<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
									</el-tooltip>
								</span>
                  </template>
                  <el-input v-model="form['site.url']" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="网站LOGO" prop="logo" clearable>
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>请上网站LOGO（长方形）</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<sc-upload :width="80" :height="80" v-model="form['site.logo']" title="请上网站LOGO图片"></sc-upload>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="网站LOGO（正方形）" prop="logoSquare" clearable>
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>请上网站LOGO（正方形）</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<sc-upload :width="80" :height="80" v-model="form['site.logoSquare']" title="请上网站LOGO图片"></sc-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="12">
								<el-form-item label="网站图标" prop="favicon" clearable>
									<template #label="{ label }">
										<span>{{ label }}</span>
										<span>
											<el-tooltip>
												<template #content>浏览器标签上的网站小图标</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
									</template>
									<sc-upload :width="80" :height="80" v-model="form['site.favicon']" title="请上网站图标"></sc-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="网站标题" prop="title" clearable>
							<el-input v-model="form['site.title']"></el-input>
							<div class="el-form-item-msg">首页显示，浏览器标签上的标题</div>
						</el-form-item>
						<el-form-item label="网站关键词" prop="keywords" clearable>
							<el-input v-model="form['site.keywords']" clearable type="textarea"></el-input>
						</el-form-item>
						<el-form-item label="网站描述" prop="description" clearable>
							<el-input v-model="form['site.description']" clearable type="textarea"></el-input>
						</el-form-item>
						<el-form-item label="网站版权" prop="copyright" clearable>
							<el-input v-model="form['site.copyright']" clearable type="textarea"></el-input>
						</el-form-item>
						<el-form-item label="网站ICP备案号" prop="icp" clearable>
							<el-input v-model="form['site.icp']"></el-input>
						</el-form-item>
						<el-form-item label="联系电话" prop="telephone" clearable>
							<el-input v-model="form['site.telephone']"></el-input>
						</el-form-item>
						<el-form-item label="联系地址" prop="address" clearable>
							<el-input v-model="form['site.address']" clearable type="textarea"></el-input>
						</el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="二维码" prop="qrCode" clearable>
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span>
											<el-tooltip>
												<template #content>二维码可以上传公众号关注二维码、微信客服二维码、微信群二维码等图片</template>
												<el-icon style="vertical-align: middle;margin-top: -3px;margin-left: 3px;"><el-icon-question-filled /></el-icon>
											</el-tooltip>
										</span>
                  </template>
                  <sc-upload :width="80" :height="80" v-model="form['site.qrCode']" title="请上传图片"></sc-upload>
                </el-form-item>
              </el-col>
            </el-row>
						<el-form-item>
							<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
							<el-button @click="visible=false" >取 消</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>

			</el-tabs>
		</el-card>
	</el-main>
</template>

<script>
	export default {
		name: 'siteSetting',
		data() {
			return {
				visible: false,
				isSaving: false,
				//表单数据
				form: {
					"site.name": "",
					"site.url": "",
					"site.logo": "",
					"site.title": "",
					"site.keywords": "",
					"site.description": "",
					"site.copyright": "",
					"site.icp": "",
					"site.index": "",
				},
				//验证规则
				rules: {
					"site.name": [
						{required: true, message: '请输入网站名称'}
					],
				},
				configGroup: 'site',
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
