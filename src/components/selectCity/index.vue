<template>
	<el-dialog :title="title" v-model="dialogVisible" :width="'80%'" :top="'5vh'" destroy-on-close append-to-body @closed="$emit('closed')">
		<div class="select-city-container">
			<el-cascader-panel v-model="form.options" :options="selectOptions" :props="cascaderPanelProps" />
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
				options: [],
			},
			//验证规则
			rules: {
				name: [
					{required: true, message: '请输入名称'}
				],
			},
			filterData: [],
			selectData: {},
			selectOptions: [],
			cascaderPanelOptions: [
				{
					value: 'guide',
					label: 'Guide',
					children: [
						{
							value: 'disciplines',
							label: 'Disciplines',
							children: [
								{
									value: 'consistency',
									label: 'Consistency',
								},
								{
									value: 'feedback',
									label: 'Feedback',
								},
								{
									value: 'efficiency',
									label: 'Efficiency',
								},
								{
									value: 'controllability',
									label: 'Controllability',
								},
							],
						},
						{
							value: 'navigation',
							label: 'Navigation',
							children: [
								{
									value: 'side nav',
									label: 'Side Navigation',
								},
								{
									value: 'top nav',
									label: 'Top Navigation',
								},
							],
						},
					],
				},
				{
					value: 'component',
					label: 'Component',
					children: [
						{
							value: 'basic',
							label: 'Basic',
							children: [
								{
									value: 'layout',
									label: 'Layout',
								},
								{
									value: 'color',
									label: 'Color',
								},
								{
									value: 'typography',
									label: 'Typography',
								},
								{
									value: 'icon',
									label: 'Icon',
								},
								{
									value: 'button',
									label: 'Button',
								},
							],
						},
						{
							value: 'form',
							label: 'Form',
							children: [
								{
									value: 'radio',
									label: 'Radio',
								},
								{
									value: 'checkbox',
									label: 'Checkbox',
								},
								{
									value: 'input',
									label: 'Input',
								},
								{
									value: 'input-number',
									label: 'InputNumber',
								},
								{
									value: 'select',
									label: 'Select',
								},
								{
									value: 'cascader',
									label: 'Cascader',
								},
								{
									value: 'switch',
									label: 'Switch',
								},
								{
									value: 'slider',
									label: 'Slider',
								},
								{
									value: 'time-picker',
									label: 'TimePicker',
								},
								{
									value: 'date-picker',
									label: 'DatePicker',
								},
								{
									value: 'datetime-picker',
									label: 'DateTimePicker',
								},
								{
									value: 'upload',
									label: 'Upload',
								},
								{
									value: 'rate',
									label: 'Rate',
								},
								{
									value: 'form',
									label: 'Form',
								},
							],
						},
						{
							value: 'data',
							label: 'Data',
							children: [
								{
									value: 'table',
									label: 'Table',
								},
								{
									value: 'tag',
									label: 'Tag',
								},
								{
									value: 'progress',
									label: 'Progress',
								},
								{
									value: 'tree',
									label: 'Tree',
								},
								{
									value: 'pagination',
									label: 'Pagination',
								},
								{
									value: 'badge',
									label: 'Badge',
								},
							],
						},
						{
							value: 'notice',
							label: 'Notice',
							children: [
								{
									value: 'alert',
									label: 'Alert',
								},
								{
									value: 'loading',
									label: 'Loading',
								},
								{
									value: 'message',
									label: 'Message',
								},
								{
									value: 'message-box',
									label: 'MessageBox',
								},
								{
									value: 'notification',
									label: 'Notification',
								},
							],
						},
						{
							value: 'navigation',
							label: 'Navigation',
							children: [
								{
									value: 'menu',
									label: 'Menu',
								},
								{
									value: 'tabs',
									label: 'Tabs',
								},
								{
									value: 'breadcrumb',
									label: 'Breadcrumb',
								},
								{
									value: 'dropdown',
									label: 'Dropdown',
								},
								{
									value: 'steps',
									label: 'Steps',
								},
							],
						},
						{
							value: 'others',
							label: 'Others',
							children: [
								{
									value: 'dialog',
									label: 'Dialog',
								},
								{
									value: 'tooltip',
									label: 'Tooltip',
								},
								{
									value: 'popover',
									label: 'Popover',
								},
								{
									value: 'card',
									label: 'Card',
								},
								{
									value: 'carousel',
									label: 'Carousel',
								},
								{
									value: 'collapse',
									label: 'Collapse',
								},
							],
						},
					],
				},
				{
					value: 'resource',
					label: 'Resource',
					children: [
						{
							value: 'axure',
							label: 'Axure Components',
						},
						{
							value: 'sketch',
							label: 'Sketch Templates',
						},
						{
							value: 'docs',
							label: 'Design Documentation',
						},
					],
				},
			],
			cascaderPanelProps: {
				// value: 'id',
				// label: 'name',
				// 是否多选
				multiple: true,
				// checkStrictly: true,
				// 只能选择叶子节点(最后一级分类)
				checkStrictly: false,
				// 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
				// emitPath: false,
				// 次级菜单的展开方式
				expandTrigger: "hover",
				// 动态加载
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node
					let id = 0
					setTimeout(() => {
						// eslint-disable-next-line
						const nodes = Array.from({ length: level + 10 }).map((item) => ({
							value: ++id,
							label: `Option - ${id}`,
							leaf: level >= 2,
						}))
						// Invoke `resolve` callback to return the child nodes data and indicate the loading is finished.
						resolve(nodes)
					}, 100)
				},
			},
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
