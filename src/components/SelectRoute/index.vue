<template>
	<el-dialog :title="'API接口选择器'" v-model="dialogVisible" :width="'80%'" :top="'1vh'" destroy-on-close append-to-body @closed="$emit('closed')">
		<div class="select-route">
			<div class="select-route-header">
				<el-input v-model="searchText" placeholder="请输入关键词搜索" clearable @keyup.enter="search"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button type="default" @click="clear">重置</el-button>
			</div>
			<div class="select-route-list">
				<div
					class="select-route-item"
					v-show="!filterData.length || filterData.includes(index)"
					:class="{ 'select-active-discard': filterData.includes(index) }"
					v-for="(item, index) in data"
					:key="index"
					@click="select(item)"
				>
					<div>接口类名称：{{ item.className }}</div>
					<div>方法名称：{{ item.methodName }}</div>
					<div>请求方式：{{ item.methods }}</div>
					<div>接口地址：{{ item.patterns }}</div>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			<!-- <el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button> -->
		</template>
	</el-dialog>

</template>

<script>
export default {
	name: "SelectRoute",
	emits: ['success', 'closed'],
	data() {
		return {
			dialogVisible: false,
			isSaving: false,
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
			data: [],
			filterData: [],
			searchText: ""
		}
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
			// this.form.url = "/api/sys/test"
			// this.form.method = "GET"
			// this.form.code = "api:sys:test"

			// 处理标识
			if (this.form.url){
				const regex = /\/|{|}/g;
				const regexTrim = /^:|:$/g;
				this.form.code = this.form.url.replace(regex, ":").replace(regexTrim, "")
			}

			this.$emit('submit', this.form);
			this.$nextTick(() => {
				this.dialogVisible = false
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
		select(data) {
			console.log('select:', data)

			if (data.patterns && data.patterns.length > 1){
				this.selectData()
				return
			}
			if (data.methods && data.methods.length > 1){
				this.selectData()
				return
			}

			this.form.url = data.patterns[0] || ''
			this.form.method = data.methods[0] || ''
			this.form.code = data.patterns[0] || ''

			this.submit()
		},
		selectData(data){
			console.log('selectData:', data)
			this.$message("请选择数据...")

			// this.submit()
		},
		clear(){
			this.searchText = ""
			this.filterData = []
		},
		search(){
			if (this.searchText.trim()) {
				this.filterData = [];
				for (let i = 0; i < this.data.length; i++) {
					let flag = false;
					let item = this.data[i];
					// console.log('item:', item)
 					if (item.className.indexOf(this.searchText) !== -1 || item.methodName.indexOf(this.searchText) !== -1) {
						flag = true
					}
					if (item.patterns && item.patterns.length > 0){
						item.patterns.forEach((itemI) => {
							if (itemI.indexOf(this.searchText) !== -1){
								flag = true
							}
						});
					}
					if (item.methods && item.methods.length > 0){
						item.methods.forEach((itemI) => {
							if (itemI.indexOf(this.searchText) !== -1){
								flag = true
							}
						});
					}
					if (flag){
						this.filterData.push(i);
					}
				}
			} else {
				this.filterData = [];
			}
		},
	},
}
</script>

<style lang="scss" scoped>

.select-route-header {
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: #f2f2f2;
}

.select-route-list {
	display: flex;
	flex-wrap: wrap;
	max-height: 700px;
	max-height: 75vh;
	overflow: scroll;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
.select-route-list::-webkit-scrollbar {
	width: 10px;
	height: 10px;
	background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
.select-route-list::-webkit-scrollbar-track {
	border-radius: 4px;
	background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
.select-route-list::-webkit-scrollbar-thumb {
	border-radius: 4px;
	background-color: #555;
}

.select-route-item {
	background-color: #f2f2f2;
	width: 32%;
	margin: 5px;
	border-radius: 3px;
	padding: 10px;
	color: #333;
	cursor: pointer;
	transition: all 0.1s;
	overflow: hidden;
}

.select-route-item:hover {
	background-color: #c5d1dd;
}

.select-route-item div {
	white-space: nowrap;
	white-space: normal;
	word-break: break-all;
}

.select-active {
	background-color: #c5d1dd;
}

</style>
