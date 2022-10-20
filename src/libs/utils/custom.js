/*
 * @Descripttion: 
 * @version: 
 * @Author: 金苏
 * @Date: 2021-08-17 11:28:56
 * @LastEditors: 金苏
 * @LastEditTime: 2021-08-17 11:29:45
 */
// 唯一id
function guid() {
  return Number(
    Math.random()
      .toString()
      .substr(3, 3) + Date.now()
  ).toString(36);
}

function dateFormat(fmt, date) {
  if(!date) return
  date = new Date(date)
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}

function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}



//数字对应汉子转换
function numberENFun(num) {
  const numberCN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  let string = num.toString();
  let resultStr = '';
  string.split('').forEach(function (item, i) {
    if (i == 1) {
      if (item * 1 != 0) {
        resultStr += '十' + numberCN[item * 1 - 1]
      } else {
        resultStr += '十'
      }
    } else {
      resultStr += numberCN[item * 1 - 1]
    }
  })
  if (resultStr == '一十') {
    resultStr = '十';
  }
  return resultStr;
}

function converter(value) {
  // A-Z计数器转换器
  const type = typeof value;
  let finaly = null;
  switch (type) {
    case "number":
      finaly = "";
      let divisor = Math.floor(value / 26), remainder = value % 26 ? [value % 26] : value <= 26 ? [value] : [];
      while (divisor > 26) {
        divisor = Math.floor(divisor / 26);
        remainder.unshift(divisor % 26);
      }
      value > 26 && remainder.unshift(divisor);
      for (let val of remainder) {
        finaly += String.fromCharCode(val + 64);
      }
      break;
    case "string":
      finaly = 0;
      const length = value.length;
      for (let len = 0; len < length; len++) {
        finaly +=
          (value.charAt(len).charCodeAt() - 64) *
          Math.pow(26, length - len - 1);
      }
      break;
  }
  return finaly;
}

function clickTitle(mark) {
  document.querySelector(`#${mark.questioncode}`).scrollIntoView(true)
}

// 异步加载路由给路由配置routename
const Lazy = async function (component = Promise.resolve(), routerConfig = {}, _path) {
  const isFunction = Object.prototype.toString.call(component) === '[object Function]'
  const _component = isFunction ? await component() : await component
  const componentName = routerConfig.name || _path
  isFunction ? (_component.default.name = componentName) : (routerConfig.name = componentName)
  return Promise.resolve(_component)
}

/*
 * 根据身份证获取出生日期
 * */
function idCardParse(cardNum = '') {
  // 获取输入身份证号码
  //获取出生日期
  const birthDate = cardNum.substring(6, 10) + '-' + cardNum.substring(10, 12) + '-' + cardNum.substring(12, 14)
  let sex = 2 // 默认 女
  // 获取性别
  if (parseInt(cardNum.substr(16, 1)) % 2 == 1) {
    sex = 1
  }
  //获取年龄
  let myDate = new Date()
  let month = myDate.getMonth() + 1
  let day = myDate.getDate()
  let age = myDate.getFullYear() - cardNum.substring(6, 10) - 1
  if (cardNum.substring(10, 12) < month || (cardNum.substring(10, 12) == month && cardNum.substring(12, 14) <= day)) {
    age++
  }
  //年龄 age
  return {
    birthDate,
    sex,
    age
  }
}

function requireContext(modulesFiles, name) {
  const apiMap = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = name ? value[name] : value
    return modules
  }, {})
  return apiMap
}

export { guid, requireContext, dateFormat, isJSON, converter, numberENFun, clickTitle, idCardParse, Lazy }