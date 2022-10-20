<!--
 * @Author: your name
 * @Date: 2021-02-20 17:29:16
 * @LastEditTime: 2021-03-22 17:01:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mandalat.frame\src\layout\sidebar\item.vue
-->
<script>
  export default {
    name: 'menuItem',
    functional: true,
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      }
    },
    render(h, context) {
      const { icon, title } = context.props
      const vnodes = []
      if(icon) {
        // 在路由中，如果 `icon` 是以 `svg-` 开头的话，就加载 svg 图标
        // 否则就默认使用 `Element-UI` 图标
        if(icon.startsWith('svg-')) {
          const _icon = icon.substr(4)
          vnodes.push(<svg-icon class="sidebar-icon" src={_icon}/>)
        } else if(icon.startsWith('fa-')) {
          vnodes.push(<i class={'sidebar-icon fa ' + icon}></i>)
        } else if(icon.startsWith('el-icon-')) {
          const _icon = icon.substr(8)
          vnodes.push(<i class={'sidebar-icon el-icon-' + _icon}></i>)
        }
      }
      if(title) {
        vnodes.push(<span class="title" slot="title">{title}</span>)
      }
      return vnodes
    }
  }
</script>

<style scoped lang="stylus">
.sidebar-icon
  font-size 1.1em
  margin-right 8px
  margin-left 4px
  display inline-block
</style>
