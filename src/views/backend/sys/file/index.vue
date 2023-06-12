<template>
	<el-main>
		<el-row :gutter="15">
			<el-col :lg="18">
				<el-card shadow="never">
					<sc-file-select v-model="file" :multiple="multiple" :hideUpload="hideUpload" :maxSize="10" :max="1000" @submit="submit">
						<template #do>
							<el-button @click="refreshPage()">刷新</el-button>
						</template>
					</sc-file-select>
				</el-card>
			</el-col>
			<el-col :lg="6">
				<el-card shadow="never" header="操作">
					<el-button type="primary" @click="multiple = !multiple">切换（单选/多选）</el-button>
					<el-button type="primary" @click="hideUpload = !hideUpload">上传按钮（显示/隐藏）</el-button>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
</template>

<script>
	import scFileSelect from '@/components/scFileSelectPlus'
	import useTabs from '@/utils/useTabs'

	export default {
		name: 'backendSysFile',
		components: {
			scFileSelect
		},
		data() {
			return {
				file: '',
				multiple: false,
				hideUpload: false,
				upload: '',
				upload2: ''
			}
		},
		mounted() {

		},
		methods: {
			submit(value){
				console.log(value)
				this.$message("返回值请查看F12控制台console.log()")
			},
			refreshPage(){
				useTabs.refresh()
			},
		}
	}
</script>

<style scoped>

</style>
