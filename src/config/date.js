//日期配置
export default {
	// https://element-plus.gitee.io/zh-CN/component/date-picker.html#选择一段时间
    shortcuts: [
        {
            text: '1天',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setHours(end.getHours() + 24)
                return [start, end]
            },
        },
        {
            text: '1周',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setHours(end.getHours() + 24 * 7)
                return [start, end]
            },
        },
        {
            text: '1个月',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 1)
                return [start, end]
            },
        },
        {
            text: '3个月',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 3)
                return [start, end]
            },
        },
        {
            text: '6个月',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 6)
                return [start, end]
            },
        },
        {
            text: '1年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12)
                return [start, end]
            },
        },
        {
            text: '2年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 2)
                return [start, end]
            },
        },
        {
            text: '3年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 3)
                return [start, end]
            },
        },
        {
            text: '5年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 5)
                return [start, end]
            },
        },
        {
            text: '10年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 10)
                return [start, end]
            },
        },
        {
            text: '20年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 20)
                return [start, end]
            },
        },
        {
            text: '30年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 30)
                return [start, end]
            },
        },
        {
            text: '100年',
            value: () => {
                const start = new Date(new Date().toLocaleDateString())
                const end = new Date(new Date().toLocaleDateString())
                end.setMonth(end.getMonth() + 12 * 100)
                return [start, end]
            },
        },
    ],
}
