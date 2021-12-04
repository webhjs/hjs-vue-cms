/**
 * @Description:
 * @Author bianpengfei
 * @create 2021/5/18 15:43
 */
const wheelFn = (e, el, binding, vnode, oldNode) => {
  e.preventDefault()
  const { context } = vnode
  let wheelDelta = e.wheelDelta || -e.detail * 24
  if (wheelDelta) {
    const unit = 0.05 // 每次缩小或者放大比例
    let scale = 1
    let initialScale = 1 // 初始化大小

    const efContainer = el.querySelector('div:first-child')

    if (efContainer.dataset.scale) {
      scale = Number(efContainer.dataset.scale.replace(/scale\(|\)|\s|/g, '') || initialScale)
    }
    if (wheelDelta > 0) {
      if (scale >= 2.5) return
      scale = Number(scale) + unit
    } else {
      if (scale <= 0.1) return
      scale = Number(scale) - unit
    }
    efContainer.dataset.scale = `scale(${scale})`
    if (!efContainer.dataset.translate3d) {
      efContainer.dataset.translate3d = 'translate3d(0px, 0px, 0px)'
    }

    efContainer.style.transform = `${efContainer.dataset.translate3d} scale(${scale})`
    context.jsPlumb?.setZoom?.(scale)
    context.zoom = scale * 100
  }
}

import Vue from 'vue'
export default {
  flowWheel: {
    bind: (el, binding, vnode, oldNode) => {
      if (!binding) {
        return
      }
      el.onmousewheel = e => {
        wheelFn(e, el, binding, vnode, oldNode)
      }
      el.wheel = e => {
        wheelFn(e, el, binding, vnode, oldNode)
      }

      // 解决火狐不兼容问题
      el.addEventListener('DOMMouseScroll', e => {
        wheelFn(e, el, binding, vnode, oldNode)
      })
    },
    unbind(el) {
      el.removeEventListener('DOMMouseScroll', wheelFn)
    }
  },

  flowDrag: {
    bind: (el, binding) => {
      if (!binding) {
        return
      }
      el.onmousedown = e => {
        e.preventDefault()
        if (e.button == 2) {
          // 右键不管
          return
        }
        //  鼠标按下，计算当前原始距离可视区的高度
        let startX = e.clientX
        let startY = e.clientY
        el.style.cursor = 'grab'

        let originX = 0
        let originY = 0

        const efContainer = el.querySelector('div:first-child')
        if (efContainer.dataset.translate3d) {
          const translate3d = efContainer.dataset.translate3d.replace(/translate3d\(|\)|\s|px/g, '')
          if (translate3d) {
            originX = Number(translate3d.split(',').slice(0).shift())
            originY = Number(translate3d.split(',').slice(1).shift())
          }
        }

        document.onmousemove = event => {
          // 移动时禁止默认事件
          event.preventDefault()
          const translateX = event.clientX - startX + originX

          const translateY = event.clientY - startY + originY
          efContainer.dataset.translate3d = `translate3d(${translateX}px, ${translateY}px, 0)`
          if (!efContainer.dataset.scale) {
            efContainer.dataset.scale = 'scale(1)'
          }
          efContainer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) ${efContainer.dataset.scale}`
        }

        document.onmouseup = e => {
          efContainer.style.cursor = 'auto'
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },

  placeholder: {
    // 指令的定义
    bind: function (el, binding) {
      const iconElement = structureIcon(binding.value, binding.arg)
      // el.insertAdjacentHTML("afterend", iconElement); 追加同级元素无效
      el.appendChild(iconElement)
    }
  }
}

function structureIcon(msg, arg) {
  const str =
    `<el-popover placement="bottom" width="${arg || 340}" trigger="hover">
      <div>${msg}</div>
      <i slot="reference" class="fa fa-info border border-gray-400 rounded-full w-4 h-4 text-base ml-2 leading-4 cursor-pointer text-gray-400 flex items-center justify-center" style="display: flex;"></i>
    </el-popover>`;
  // 创建构造器
  const tooltip = Vue.extend({
    template: str
  })
  // 创建一个 tooltip 实例并返回 dom 节点
  const component = new tooltip().$mount()
  return component.$el
}
