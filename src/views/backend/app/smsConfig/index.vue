<template>
  <el-main>
    <el-card shadow="never">
      <el-tabs tab-position="top">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="margin-top: 20px">
          <el-tab-pane label="短信设置">
			  <el-form-item label="短信服务商" prop="platform">
				  <el-radio-group v-model="form.platform">
					  <el-radio v-for="(item, index) in platformOptions" :key="index" :label="item.value">{{item.label }}</el-radio>
				  </el-radio-group>
			  </el-form-item>
          </el-tab-pane>

			<el-tab-pane label="阿里云">
				<el-row :gutter="20">
					<el-col :span="12">
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane label="腾讯云">
				<el-row :gutter="20">
					<el-col :span="12">
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane label="云片网">
				<el-row :gutter="20">
					<el-col :span="12">
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane label="短信宝">
				<el-row :gutter="20">
					<el-col :span="12">
					</el-col>
					<el-col :span="12">
					</el-col>
				</el-row>
			</el-tab-pane>

          <el-form-item>
            <el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
            <el-button @click="visible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-tabs>
    </el-card>
  </el-main>
</template>

<script>
export default {
  name: "smsConfigAppBackend",
  data() {
    return {
      visible: false,
      isSaving: false,
      //表单数据
      form: {
		  platform: "",
      },
      //验证规则
      rules: {
        // "store.name": [{ required: true, message: "请输入网站名称" }],
      },
		platformOptions: [
			{ label: "默认", value: "default", },
			{ label: "阿里云", value: "aliyun", },
			{ label: "腾讯云", value: "tengxunyun", },
			{ label: "云片网", value: "yunpianwang", },
			{ label: "短信宝", value: "duanxinbao", },
		],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let reqData = {};
      let res = await this.$API.backend.app.smsConfig.getConfig.get(reqData);
		if (res.code == 200) {
			this.form = res.data;
		}
    },
    //表单提交方法
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.isSaving = true;
          let res = await this.$API.backend.app.smsConfig.setConfig.post(this.form);
          this.isSaving = false;
          if (res.code == 200) {
            this.form = res.data
            // this.$emit('success', this.form, this.mode)
            this.visible = false;
            this.$message.success("操作成功");
          } else {
            await this.$alert(res.message, "提示", { type: "error" });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
