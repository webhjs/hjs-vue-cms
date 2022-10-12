<!--
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-07-14 14:14:22
 * @LastEditors: 金苏
 * @LastEditTime: 2021-09-22 15:21:14
-->
<template>
  <div class="containers flex flex-col">
    <JsplumbdtargetViewCircular id="jsSource" :sourceList="sourceList" :targetList="targetList" :relationArray="relationArray" />
    <JsplumbdtargetView id="js1" percent/>
    <Jsplumbdrag id="js3" percent/>
    <Jsplumbdtarget id="js2" percent/>
    <Jsplumblist :sourceList="sourceList" :targetList="targetList" :relationArray="relationArray" />
  </div>
</template>
<script>
import Jsplumblist from './Jsplumblist'
import Jsplumbdrag from './Jsplumbdrag'
import Jsplumbdtarget from './Jsplumbdtarget'
import JsplumbdtargetView from './JsplumbdtargetView'
import JsplumbdtargetViewCircular from '@/views/simple-template/jsplumb/JsplumbdtargetViewCircular'
export default {
  name: 'Js-plumb',
  components: {
    Jsplumblist,
    Jsplumbdrag,
    Jsplumbdtarget,
    JsplumbdtargetView,
    JsplumbdtargetViewCircular
  },
  data() {
    return {
      sourceList: [{
        name: 'source1',
        id: '1'
      },{
        name: 'source2',
        id: '2'
      },{
        name: 'source3',
        id: '3'
      },{
        name: 'source4',
        id: '4'
      },{
        name: 'source5',
        id: '5'
      },{
        name: 'source6',
        id: '6'
      },{
        name: 'source7',
        id: '7'
      },{
        name: 'source8',
        id: '8'
      },{
        name: 'source9',
        id: '9'
      },{
        name: 'source10',
        id: '10'
      },{
        name: 'source11',
        id: '11'
      },{
        name: 'source12',
        id: '12'
      }],
      targetList: [{
        name: 'target1',
        id: '1'
      }],
      relationArray: []
    };
  }
};
</script>