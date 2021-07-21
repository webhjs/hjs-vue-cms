<!--
 * @Descripttion: 
 * @version: 
 * @Author: morning
 * @Date: 2021-01-05 10:58:24
 * @LastEditors: 金苏
 * @LastEditTime: 2021-07-20 16:29:09
-->
<template>
  <div style="display: flex;height: 100%; width: 100%;flex-flow: column;">
    <div class="language" v-show="isShowLanguage" style="margin-bottom: 10px;">
      语言：
      <el-select
        v-model="langValue"
        placeholder="请选择"
        @change="changeLanguage"
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
    <div style="flex: 1">
      <div ref="container" style="height: 100%; width: 100%" />
    </div>
  </div>
</template>

<script>
import * as monaco from 'monaco-editor'

export default {
  name: 'Monaco',
  model: {
    prop: 'content',
    event: 'on-code-change'
  },
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isShowLanguage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      langValue: 'json',
      langOptions: [
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
  mounted() {
    this.initEditor()
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
      this.monacoEditor = monaco.editor.create(this.$refs.container, {
        value: JSON.stringify(this.content, null, 4),
        // readOnly: true,
        language: this.langValue,
        theme: 'vs', // vs hc-black vs-dark
        formatOnPaste: true,
        fontSize: 14,
        automaticLayout: true, //自动布局
        autoIndent: true, //自动布局

        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 85,
        wordWrapMinified: true,

        scrollBeyondLastLine: false, // 是否启用滚动可以在最后一行之后一个屏幕大小

        wrappingIndent: 'indent',

        scrollbar: {
          verticalScrollbarSize: 5 // scroll大小
        }
      })
      // this.$emit('on-mounted', () => {
      //   console.log('on-mounted---------------------')
      //   window.addEventListener('resize', this.initEditor)
      // }) //编辑器创建完成回调
      this.monacoEditor.onDidChangeModelContent((event) => {
        //编辑器内容changge事件
        this.$emit('on-code-change', JSON.parse(this.monacoEditor.getValue()))
      })
    },
    /**
     * @name:
     * @Descripttion:
     * @param {*}
     * @return {*}
     */
    getValue() {
      this.monacoEditor.getValue() //获取编辑器中的文本
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
    },
    /**
     * @description: 切换模板
     * @param {*}
     * @return {*}
     */
    setValue(item) {
      this.monacoEditor.setValue(item)
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
