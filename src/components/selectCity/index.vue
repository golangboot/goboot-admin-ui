<template>
	<el-dialog :title="title" v-model="dialogVisible" :width="'80%'" :top="'5vh'" destroy-on-close append-to-body @closed="$emit('closed')">
		<div class="select-city-container">
			城市列表
		</div>
		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			 <el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button>
		</template>
	</el-dialog>
</template>

<script>
export default {
	name: "selectCity",
	emits: ['success', 'closed'],
	props: {
		title: {
			type: String,
			default: '城市选择器'
		},
	},
	data() {
		return {
			dialogVisible: false,
			isSaving: false,
			visible: false,
			//表单数据
			form: {
				url: "",
				method: "",
				code: "",
			},
			//验证规则
			rules: {
				name: [
					{required: true, message: '请输入名称'}
				],
			},
			filterData: [],
			selectData: {},
		}
	},
	watch: {
		form: {
			// eslint-disable-next-line
			handler(newValue, oldValue){
				// 处理标识
				if (this.form.url){
					this.form.code = this.handleCode(this.form.url)
				}
			},
			deep: true
		},
	},
	mounted() {
		this.getData()
	},
	methods: {
		open(){
			this.dialogVisible = true
			return this
		},
		submit(){
			this.$emit('submit', this.form);
			this.$nextTick(() => {
				this.dialogVisible = false
				this.visible = false
				this.clear()
			});
		},
		setData(data){
			Object.assign(this.form, data)
		},
		//获取列表数据
		async getData(){
			this.isSaving = true

			let reqData = {}
			let res = await this.$API.system.route.list.get(reqData);
			this.data = res.data;

			this.isSaving = false
		},
		clear(){
			this.filterData = []
		},
		select(data) {
			console.log(data)
		},
	},
}
</script>

<style scoped>

</style>
