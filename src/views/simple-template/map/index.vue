<!--
 * @Author: your name
 * @Date: 2021-02-22 10:53:23
 * @LastEditTime: 2021-05-07 10:00:41
 * @LastEditors: 金苏
 * @Description: In User Settings Edit
 * @FilePath: \vue-cms\src\views\home\index.vue
-->
<template>
  <div>
    <div id="main" style="width: 100%;height: 100%;"></div>
    <span
      type="text"
      @click="goback"
      v-if="adCodePathStack.length"
      class="absolute top-5 left-8 cursor-pointer rounded-full py-1 px-6 border border-indigo-300 text-indigo-300"
    >
      返回
    </span>
    <div class="absolute top-20 left-8 text-white text-xl">
      只支持安徽省六安市下钻
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      myChart: null,
      adCodePathStack: [],
      curData: {},
      observer: null
    };
  },
  mounted() {
    this.initMap();
    const element = document.querySelector("#main");
    let resizeTimer = null;
    const callback = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(() => {
        // 重新适配屏幕
        this.myChart.resize();
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
    this.myChart.dispose();
  },
  methods: {
    // 返回
    goback() {
      const path = [...this.adCodePathStack]
      try {
        this.adCodePathStack.pop();
        this.init({
          adcode: this.adCodePathStack[this.adCodePathStack.length - 1]
        });
      } catch {
        this.$message.warning("读取地图数据失败")
        this.adCodePathStack = path;
      }
    },
    option(map, pointData) {
      return {
        backgroundColor: "#020933",
        title: {
          // 标题位置
          top: 20,
          text: "地图",
          subtext: "",
          x: "center",
          textStyle: {
            color: "#ccc"
          }
        },
        geo: {
          map,
          show: true,
          aspectScale: 0.75, //长宽比
          layoutCenter: ["50%", "50%"], //地图位置
          layoutSize: "100%",
          zoom: 1,
          zlevel: 0,
          roam: true,
          label: {
            normal: {
              show: true,
              color: "rgb(249, 249, 249)" //省份标签字体颜色
            },
            emphasis: {
              show: true,
              color: "rgb(249, 249, 249)" //省份标签字体颜色
            }
          },
          data: pointData,
          itemStyle: {
            normal: {
              borderColor: "#2ab8ff",
              borderWidth: 1.5,
              areaColor: "#12235c",
              shadowColor: "#182f68",
              shadowOffsetX: 0,
              shadowOffsetY: 15,
              shadowBlur: 20
            },
            emphasis: {
              show: true,
              areaColor: "#2AB8FF",
              borderWidth: 0,
              color: "#FFF",
              label: {
                show: true
              }
            }
          }
        },
        series: [
          {
            // 用于监听地图点击层
            type: "map",
            roam: true,
            geoIndex: 0,
            coordinateSystem: "geo",
            map
          },
          {
            // 画点
            name: "散点",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: pointData,
            rippleEffect: {
              period: 3,
              scale: 3,
              brushType: "fill"
            },
            itemStyle: {
              normal: {
                color: "#F4E925",
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            symbolSize: params => {
              return Math.random() * 18; // 生成随机的
            },
            showEffectOn: "render" //加载完毕显示特效
          },
          {
            // 画线
            type: "lines",
            zlevel: 3, //设置轨迹线的小尾巴
            polyline: true,
            show: false,
            effect: {
              show: true,
              period: 10,
              trailLength: 0.7,
              color: "#ffdb5c", //流动点颜色
              symbol: "arrow",
              symbolSize: 6
            },
            lineStyle: {
              normal: {
                color: "#ffdb5c", //线条颜色
                width: 1,
                // opacity: 0.1, //尾迹线条透明度
                curveness: 0.3,
                shadowColor: "#ffdb5c"
              }
            },
            data:
              (this.adCodePathStack.length < 1 && [
                {
                  fromName: "北京",
                  toName: "深圳",
                  coords: [
                    [116.24, 39.55],
                    [114.271522, 22.753644]
                  ]
                },
                {
                  fromName: "北京",
                  toName: "浙江",
                  coords: [
                    [116.24, 39.55],
                    [120.19, 30.26]
                  ]
                },
                {
                  fromName: "北京",
                  toName: "重庆",
                  coords: [
                    [116.24, 39.55],
                    [106.54, 29.59]
                  ]
                }
              ]) ||
              []
          }
        ]
      };
    },
    // 渲染echarts
    renderEcharts(data) {
      const curData = data;
      const map = curData?.name == "100000_full" ? "china" : "map";
      // 地图随机黄点
      const pointData = [];
      data.features.forEach(item => {
        if (item.properties?.center) {
          let value = Math.random() * 3000;
          pointData.push({
            name: item.properties.name,
            value: [
              item?.properties?.center[0],
              item?.properties?.center[1],
              value
            ],
            cityCode: item.properties?.adcode
          });
        }
      });
      echarts.registerMap(map, curData);
      this.myChart.hideLoading();
      this.myChart.setOption(this.option(map, pointData));
    },
    // 将乡、县的地图数据转换成 统一的genjson数据
    transferData(val) {
      return (
        (Array.isArray(val.features) &&
          val.features.reduce((pre, cur) => {
            return [
              ...pre,
              {
                type: "Feature",
                properties: {
                  name: cur.attributes?.Name,
                  layer: cur.attributes?.Layer,
                  ...cur.attributes
                },
                isCity: false, // 区分是否是 省 市
                geometry: {
                  type: "MultiPolygon",
                  coordinates: [cur.geometry.rings || []]
                }
              }
            ];
          }, [])) ||
        []
      );
    },
    // 读取json数据
    requestJsonFn(adcode) {
      return new Promise(async (resolve, reject) => {
        try {
          fetch(`/static/maps/${adcode}_full.json`)
            .then(response => response.json())
            .then(geoJson => {
              let data = geoJson;
              if (data.hasOwnProperty("fieldAliases")) {
                data = {
                  type: "FeatureCollection",
                  features: this.transferData(data)
                };
              }
              resolve(data);
            })
            .catch(error => {
              this.$message.warning("只开放安徽六安地图数据")
              reject(error);
            });
        } catch (e) {
          reject(e);
        }
      });
    },
    // 初始化点击地图
    initOnMapClick() {
      this.myChart.on("click", "series", async e => {
        const curData = this.curData;
        const properties = curData.features[e.dataIndex]?.properties;
        if (properties.hasOwnProperty("adcode")) {
          this.adCodePathStack.push(properties.adcode);
          try {
            await this.init({ adcode: properties.adcode });
          } catch {
            this.adCodePathStack.pop();
          }
        } else if (properties.hasOwnProperty("FID")) {
          if (!~[...this.adCodePathStack].pop()) return;
          // 点击县镇 TODO：这里可以添加ajax请求服务端数据处理
          this.myChart && this.myChart.clear();
          this.adCodePathStack.push(-1);
          this.renderEcharts({
            type: "FeatureCollection",
            features: [curData.features[e.dataIndex]]
          });
        }
      });
    },
    // 重置地图
    init({ adcode = "100000" }) {
      return new Promise(async (resolve, reject) => {
        try {
          const curData = await this.requestJsonFn(adcode);
          this.curData = curData;
          this.myChart && this.myChart.clear();
          this.renderEcharts(curData);
          resolve(curData);
        } catch (e) {
          reject(false);
        }
      });
    },
    // 初始化地图
    async initMap() {
      this.myChart = echarts.init(document.getElementById("main"));
      this.myChart.showLoading();
      await this.init({ adcode: "100000" });
      this.initOnMapClick();
    }
  }
};
</script>
<style scoped lang="stylus"></style>
