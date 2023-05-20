<template>
	<el-dialog :title="titleMap[mode]" v-model="visible" destroy-on-close @closed="$emit('closed')">
		<el-form :model="form" :rules="rules" ref="dialogForm" label-width="80px" label-position="right">
			<el-form-item label="字典名称" prop="name">
				<el-input v-model="form.name" clearable placeholder="字典显示名称"></el-input>
			</el-form-item>
			<el-form-item label="字典编码" prop="code" v-if="form.parentId <= 0">
				<el-input v-model="form.code" clearable placeholder="字典编码"></el-input>
			</el-form-item>
			<el-form-item label="键值" prop="value" v-if="form.parentId > 0">
				<el-input v-model="form.value" clearable></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type" v-if="form.parentId > 0">
				<el-select v-model="form.type">
					<el-option v-for="(item, index) in dictTypeList" :key="index" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="父路径" prop="parentId">
				<el-cascader v-model="form.parentId" :options="dict" :props="dictProps" :show-all-levels="true" style="width:100%" filterable clearable></el-cascader>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input-number v-model="form.sort" controls-position="right" style="width: 100%;"></el-input-number>
			</el-form-item>
			<el-form-item label="是否有效" prop="status">
				<el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="visible=false" >取 消</el-button>
			<el-button type="primary" :loading="isSaving" @click="submit()">保 存</el-button>
		</template>
	</el-dialog>
</template>

<script>
	export default {
		emits: ['success', 'closed'],
		data() {
			return {
				mode: "add",
				titleMap: {
					add: '新增字典',
					edit: '编辑字典',
					show: '查看字典',
				},
				visible: false,
				isSaving: false,
				form: {
					id:"",
					name: "",
					code: "",
					parentId: "",
					status: 0
				},
				rules: {
					/*code: [
						{required: true, message: '请输入编码'}
					],*/
					name: [
						{required: true, message: '请输入字典名称'}
					]
				},
				dict: [],
				dictProps: {
					value: "id",
					label: "name",
					checkStrictly: true,
					emitPath: false,
					expandTrigger: "hover",
				},
				dictTypeList: [],
			}
		},
		mounted() {
			this.getDict()
			this.getDictTypeList()
		},
		methods: {
			//显示
			open(mode='add'){
				this.mode = mode;
				this.visible = true;
				return this;
			},
			//获取字典列表
			async getDict(){
				var res = await this.$API.system.dict.tree.get();
				this.dict = res.data;
			},
			//获取字典类型列表
			async getDictTypeList(){
				var res = await this.$API.system.dict.getDictType.get();
				this.dictTypeList = res.data;
			},
			//表单提交方法
			submit(){
				this.$refs.dialogForm.validate(async (valid) => {
					if (valid) {
						this.isSaving = true;
						var res;
						if (this.form.id) {
							res = await this.$API.system.dict.update.put(this.form)
						} else {
							res = await this.$API.system.dict.add.post(this.form)
						}
						this.isSaving = false;
						if(res.code == 200){
							// this.form.id = res.data.id
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
				Object.assign(this.form, data)
				if (data.id){
					this.isSaving = true
					let reqData = {id: data.id}
					let res = await this.$API.system.dict.detail.get(reqData)
					this.isSaving = false
					this.form = res.data
				}
			}
		}
	}
</script>

<style>
</style>
