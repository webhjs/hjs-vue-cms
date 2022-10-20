import { mapActions } from "vuex";
export default {
	inject: {
		appMainTheme: {
			//函数式组件取值不一样
			default: () => ({})
		}
	},
	methods: {
		...mapActions([
			"delVisitedTabsView"
		]),
		goBackDataPage(routeName) {
			/* 删除当前页 */
			const { name, path, fullpath, params, query, meta } = this.$route
			const tag = {
				name, path, fullpath, params, query,
				label: meta.title
			}
			this.appMainTheme.removeCache(tag.path)
			this.delVisitedTabsView(tag).then(() => {
				this.$router.push({
					name: routeName
				})
			});
			/* 删除当前页 */
		}
	}
}
