<template>
  <component
    :is="tagName"
    :data="data"
    :colors="colors"
    :settings="settingsAs"
    :grid="gridAs"
    :title="titleAs"
    :extend="extendAs"
    :mark-line="markLineAs"
    :height="height"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
<script>
export default {
  name: 'HistogramChart',
  props: {
    tagName: {
      type: String,
      default: 've-histogram'
    },
    data: {
      type: Object,
      default: () => {
        return {
          columns: [],
          rows: []
        }
      }
    },
    colors: {
      type: Array,
      default: () => ['#fd7e14', '#739AFF', '#61a0a8', '#d48265', '#91c7ae']
    },
    title: {
      type: Object,
      default: () => ({})
    },
    extend: {
      type: Object,
      default: () => ({})
    },
    settings: {
      type: Object,
      default: () => ({})
    },
    grid: {
      type: Object,
      default: () => ({})
    },
    markLine: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: String,
      default: '350px'
    },
    percentage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: Object.freeze({
        grid: {
          // 图列位置
          show: true,
          top: 80,
          bottom: 20,
          left: '3%',
          right: '3%',
          containLabel: true,
          backgroundColor: 'transparent',
          borderColor: 'transparent'
        },
        // dataZoom: [{
        //   show: true,
        //   type: 'slider',
        //   realtime: true,
        //   start: 0,
        //   end: 0
        // }],
        markLine: {
          // 刻度线位置
          symbol: 'none',
          precision: 2, // 标线数值的精度
          label: {
            show: true,
            position: 'start',
            // fontWeight: 'bold',
            fontSize: 14,
            formatter: ({ value }) =>
              this.percentage ? value.toFixed(2) + '%' : value
          },
          lineStyle: {
            color: '#1e90ff'
          },
          data: [
            // {
            //   type: 'average',
            //   name: '平均值'
            // }
          ]
        },
        title: {
          // 标题样式
          show: true,
          text: '',
          subtext: '',
          x: 'left',
          top: 20,
          textStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        extend: {
          // 扩展样式
          legend: {
            show: false,
            x: 'center',
            y: 'bottom',
            orient: 'horizontal'
          },
          xAxis: {
            name: '', // 坐标轴名称。
            nameLocation: 'end', // 坐标轴名称显示位置。
            axisLabel: {
              // 坐标轴刻度标签的相关设置。
              interval: 0,
              rotate: this.tagName === 've-bar' ? 0 : 45
            },
            axisLine: {
              // 设置轴线的属性
              show: false,
              lineStyle: {
                color: '#000',
                width: 1
              }
            }
          },
          yAxis: {
            nameLocation: 'end', // 坐标轴名称显示位置。
            axisLine: {
              // 设置轴线的属性
              show: false,
              lineStyle: {
                color: '#000',
                width: 1
              }
            }
          },
          // series: {
          //   barGap: '40%',
          //   barCategoryGap: '40%',
          //   barMaxWidth: 20
          // },
          animationEasing: 'elasticOut',
          animationDelayUpdate: idx => idx * 5,
          series(v) {
            v &&
              v.forEach(i => {
                i.barGap = '40%'
                i.barCategoryGap = '40%'
                i.barMaxWidth = 20
                i.animationDelay = idx => idx * 10 + 100
              })
            return v
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          }
        },
        settings: {
          yAxisType: ['normal'],
          yAxisName: [],
          label: {
            // 设置图形上的文本标签样式
            show: true,
            position: this.tagName === 've-bar' ? 'right' : 'top',
            color: '#666',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 14,
            formatter: ({ value }) =>
              this.percentage ? value.toFixed(2) + '%' : value
          },
          labelMap: {}, // 设置指标的别名，同时作用于提示框和图例
          legendName: {} // 设置图表上方图例的别名
        }
      })
    }
  },
  computed: {
    extendAs() {
      return Object.assign({}, this.options.extend, this.extend)
    },
    titleAs() {
      return Object.assign({}, this.options.title, this.title)
    },
    // dataRoomAs() {
    //   return Object.assign({}, this.options.dataZoom, this.dataZoom)
    // },
    markLineAs() {
      return Object.assign({}, this.options.markLine, this.markLine)
    },
    settingsAs() {
      return Object.assign({}, this.options.settings, this.settings)
    },
    gridAs() {
      return Object.assign({}, this.options.grid, this.grid)
    }
  }
}
</script>
