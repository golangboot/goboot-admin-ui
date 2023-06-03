<template>
	<el-dialog :title="title" v-model="dialogVisible" :width="'80%'" :top="'1vh'" destroy-on-close append-to-body @closed="$emit('closed')">
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

		<el-dialog :title="'请确认API接口'" v-model="visible" destroy-on-close>
			<el-form :model="form" ref="dialogForm" label-width="100px" label-position="right">
				<el-form-item label="接口地址" prop="url">
					<el-select v-model="form.url" filterable style="width: 100%">
						<el-option v-for="(item, index) in selectData.patterns" :key="index" :label="item" :value="item"/>
					</el-select>
				</el-form-item>
				<el-form-item label="请求方式" prop="method" v-if="selectData.methods && selectData.methods.length > 0">
					<el-radio-group v-model="form.method">
						<el-radio v-for="(item, index) in selectData.methods" :key="index" :label="item">{{ item }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="权限标识" prop="code">
					<el-input v-model="form.code" clearable placeholder="请输入权限标识"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="visible=false" >取 消</el-button>
				<el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button>
			</template>
		</el-dialog>

		<template #footer>
			<el-button @click="dialogVisible=false" >取 消</el-button>
			<!-- <el-button type="primary" :loading="isSaving" @click="submit()">确 定</el-button> -->
		</template>
	</el-dialog>
</template>

<script>
export default {
	name: "selectApiRoute",
	emits: ['success', 'closed'],
	props: {
		title: {
			type: String,
			default: 'API接口选择器'
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
			data: [],
			filterData: [],
			searchText: "",
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
			// this.form.url = "/api/sys/test"
			// this.form.method = "GET"
			// this.form.code = "api:sys:test"

			let str = this.form.url
			if (typeof str !== "undefined" && str !== null && typeof str.trim === "function" && str.trim() === "") {
				// console.log("str is empty");
				this.$alert("URL为空，请选择正确的API接口", "提示", {type: 'error'})
			}

			// 处理标识
			if (this.form.url){
				this.form.code = this.handleCode(this.form.url)
			}

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
		//处理CODE标识
		handleCode(url) {
			if (url) {
				// const regex = /\/|{|}/g;
				const regex = /\/|{|}|\.|-/g;
				const regexTrim = /^:|:$/g;
				return url.replace(regex, ":").replace(regexTrim, "")
			}
			return url
		},
		//获取列表数据
		async getData(){
			this.isSaving = true

			let reqData = {}
			let res = await this.$API.backend.sys.route.list.get(reqData);
			this.data = res.data;

			this.isSaving = false
		},
		select(data) {
			// console.log('select:', data)
			this.form.url = data.patterns[0] || ''
			this.form.method = data.methods[0] || ''
			this.form.code = data.patterns[0] || ''
			if (data.patterns && data.patterns.length > 1){
				this.selectDataDialog(data)
				return
			}
			if (data.methods && data.methods.length > 1){
				this.selectDataDialog(data)
				return
			}
			this.submit()
		},
		selectDataDialog(data){
			// console.log('selectDataDialog:', data)
			// this.$message("请选择数据...")
			this.selectData = data
			this.$nextTick(() => {
				this.visible = true
			});
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
	/*white-space: nowrap;*/
	white-space: normal;
	word-break: break-all;
}

.select-active {
	background-color: #c5d1dd;
}

</style>
