/*
 * @Description: 配置文件
 * @version:
 * @Author: 周子尧
 * @Date: 2021-03-16 15:24:51
 * @LastEditors: 周子尧
 * @LastEditTime: 2021-08-24 09:49:11
 */
// // 测试环境
// window.$config = {
//   client_id: 'family_doctor_id',
//   client_secret: '123456',
//   login_res_type: 'code',
//   login_api: 'http://192.168.8.18:41000',
//   ehr_url: 'http://192.168.8.18:30103',
//   ehr_clientId: 'jtysclient',
//   ehr_key: '7de141e5d9a8e2bab8d259eb3145281a',
//   ehr_orgId: 'init_hos',
//   ehr_userId: 'mandalatTest',
//   auth_url: 'http://192.168.8.18:41100/'
// }

// 公司开发环境
if(location.hostname === '61.177.141.230') {
  window.$config = {
    client_id: 'family_doctor_id',
    client_secret: '123456',
    login_res_type: 'code',
    login_api: 'http://61.177.141.230:8284', // 'http://192.168.11.94:9000', // 外网 'http://61.177.141.230:9000'
    ehr_url: 'http://192.168.8.18:30103',
    ehr_clientId: 'jtysclient',
    ehr_key: '7de141e5d9a8e2bab8d259eb3145281a',
    ehr_orgId: 'init_hos',
    ehr_userId: 'mandalatTest',
    auth_url: 'http://192.168.8.18:30107/'
  }
} else {
  window.$config = {
    client_id: 'family_doctor_id',
    client_secret: '123456',
    login_res_type: 'code',
    login_api: 'http://192.168.8.18:41000',
    // login_api: 'http://192.168.8.18:30000',
    ehr_url: 'http://192.168.8.18:30103',
    ehr_clientId: 'jtysclient',
    ehr_key: '7de141e5d9a8e2bab8d259eb3145281a',
    ehr_orgId: 'init_hos',
    ehr_userId: 'mandalatTest',
    auth_url: 'http://192.168.8.18:41100/'
  }
}

// // 卫计委部署环境
// window.$config = {
//   client_id: 'family_doctor_id',
//   client_secret: '123456',
//   login_res_type: 'code',
//   login_api: 'http://10.75.93.16:9000',
//   ehr_url: 'http://10.75.93.16:8025',
//   ehr_clientId: 'jtysclient',
//   ehr_key: '7de141e5d9a8e2bab8d259eb3145281a',
//   ehr_orgId: undefined,
//   ehr_userId: undefined,
//   auth_url: 'http://10.75.93.16:8001/'
// }
