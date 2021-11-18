<!--
 * @Descripttion: 
 * @version: 
 * @Author: morning
 * @Date: 2021-01-05 10:58:24
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-07 16:15:03
-->
<template>
  <div style="display: flex;height: 100%; width: 100%;flex-flow: column;">
    <div class="language" v-show="isShowLanguage" style="margin-bottom: 10px;">
      转换脚本：
      <el-select
        v-model="langValue"
        placeholder="请选择"
        @change="changeLanguage"
        filterable
      >
        <el-option
          v-for="item in langOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div style="flex: 1" class="border-solid border-gray-300 border rounded">
      <div :ref="id" :id="id" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'Monaco',
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    id: {
      type: String,
      default: 'monacoId'
    },
    defLangValue: {
      type: String,
      default: 'json'
    },
    content: {
      type: Object | String | Array,
      default: () => {
        return ''
      }
    },
    isShowLanguage: {
      type: Boolean,
      default: false
    },
    langOptions: {
      type: Array,
      default: () => {
        return [
          {
            value: 'json',
            label: 'json'
          },
          {
            value: 'xml',
            label: 'xml'
          },
          {
            value: 'java',
            label: 'java'
          }
        ]
      }
    },
    theme: {
      type: String,
      default: 'vs-dark'
    },
    readnowrite: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    content: {
      handler(newValue) {
        const value = this.monacoEditor.getValue()
        if (newValue !== value) this.setValue(newValue)
      },
      deep: true
    }
  },
  data() {
    return {
      langValue: this.defLangValue
    }
  },
  mounted() {
    this.initEditor()
    const element = document.querySelector(`#${this.id}`);
    let resizeTimer = null;
    const callback = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
        // 重新适配屏幕
        this.monacoEditor && this.monacoEditor.layout()
      }, 100);
    };
    this.observer = new ResizeObserver(callback);
    this.observer.observe(element);
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
  beforedestroy() {
    // 销毁编辑器
    this.monacoEditor.dispose()
    // window.removeEventListener('resize', this.initEditor)
  },
  methods: {
    initEditor() {
      this.monacoEditor && this.monacoEditor.dispose()
      // 初始化编辑器，确保dom已经渲染，dialog中要写在opened中
      this.monacoEditor = monaco.editor.create(this.$refs[this.id], {
        value: this.formatData(this.content),
        readOnly: this.readnowrite,
        language: this.langValue,
        theme: this.theme, // vs hc-black vs-dark
        formatOnPaste: true,
        fontSize: 14,
        automaticLayout: true, //自动布局
        autoIndent: true, //自动布局

        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 85,
        wordWrapMinified: true,

        scrollBeyondLastLine: false, // 是否启用滚动可以在最后一行之后一个屏幕大小

        wrappingIndent: 'indent',
        availableLanguages: {'*':'zh-cn'},
        contextmenu: false, // 关闭右击菜单

        scrollbar: {
          verticalScrollbarSize: 5 // scroll大小
        }
      })

      // this.$emit('on-mounted', () => {
      //   console.log('on-mounted---------------------')
      //   window.addEventListener('resize', this.initEditor)
      // }) //编辑器创建完成回调
      this.monacoEditor.onDidChangeModelContent((_) => {
        //编辑器内容changge事件
        this.$emit('change', this.monacoEditor.getValue())
      })
    },
    /**
     * @name:
     * @Descripttion:
     * @param {*}
     * @return {*}
     */
    getValue() {
      return this.monacoEditor.getValue() //获取编辑器中的文本
    },
    changeLanguage(lang) {
      const oldModel = this.monacoEditor.getModel() //获取旧模型
      const value = this.monacoEditor.getValue() //获取旧的文本
      //创建新模型，value为旧文本，id为modeId，即语言（language.id）
      //modesIds即为支持语言
      //var modesIds = monaco.languages.getLanguages().map(function(lang) { return lang.id; });
      const newModel = monaco.editor.createModel(value, lang)
      //将旧模型销毁
      if (oldModel) {
        oldModel.dispose()
      }
      //设置新模型
      this.monacoEditor.setModel(newModel)
      this.$emit('update:defLangValue', lang)
    },
    formatData(Data) {
      if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(Data))) {
        return JSON.stringify(Data, null, 4)
      } else {
        try {
          return JSON.stringify(JSON.parse(Data), null, 4)
        } catch(_) {
          return Data
        }
      }
    },
    /**
     * @description: 切换模板
     * @param {*}
     * @return {*}
     */
    setValue(Data) {
      this.monacoEditor.setValue(this.formatData(Data))
    },
    allowWrite() {
      this.monacoEditor.updateOptions({ readOnly: false })
    },
    readOnly() {
      this.monacoEditor.updateOptions({ readOnly: true })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
