/** @format */

import {AppRegistry} from 'react-native'; 	//從react native輸入AppRegistry
import App from './src/App'; 	//import App.js, App root component
import {name as appName} from './app.json';
//import {RCTEventEmitter}  from 'RCTEventEmitter'

AppRegistry.registerComponent(appName, () => App);
/*
AppRegistry是JS運行所有React Native應用的入口
應用的根組件通過 AppRegsitry.registerComponent 方法註冊自己
然後原生系統才可以加載應用的代碼包
並且在啟動完成後
順利調用AppRegistry.runApplication來運行程序
*/
