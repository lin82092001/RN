import React, { Component } from 'react'
import { 
    Platform, 
    PermissionsAndroid, 
    Alert 
} from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import { Buffer } from 'buffer'
import { createStore } from 'redux'
import  todoApp from '../reducers/reducers'
import {
    Add_Ble
} from '../action/action'
import { connect } from 'react-redux'

const store = createStore(todoApp)

export default class BleModule {

    constructor(){
        this.requestLocationPermission()
        this.isConnecting = false
        this.initUUID()
        this.peripheralId = ''
        this.manager = new BleManager()
        let bool = true
    }
    // Request location permission for Android
    async requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
              'title': 'LOCATION Permission',
              'message': 'LOCATION'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the LOCATION")
          } else {
            console.log("LOCATION permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
    }
    // fetch bluetooth uuid
    async fetchServicesAndCharacteristicsForDevice (device) {
        let servicesMap = {}
        let services = await device.services()

        for (let service of services) {
            let characteristicsMap = {}
            let characteristics = await service.characteristics()

            for (let characteristic of characteristics) {
                characteristicsMap[characteristic.uuid] = {
                    uuid: characteristic.uuid,
                    isReadable: characteristic.isReadable,
                    isWritableWithResponse: characteristic.isWritableWithResponse,
                    isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
                    isNotifiable: characteristic.isNotifiable,
                    isNotifying: characteristic.isNotifying,
                    value: characteristic.value
                  }
            }

            servicesMap[service.uuid] = {
                uuid: service.uuid,
                isPrimary: service.isPrimary,
                characteristicsCount: characteristics.length,
                characteristics: characteristicsMap
            }
        }
        return servicesMap
    }

    initUUID = () => {
        this.readService_UUID = '00001800-0000-1000-8000-00805f9b34fb'
        this.readCharacteristic_UUID = '00002a00-0000-1000-8000-00805f9b34fb'  
        this.writeWithResponseService_UUID = '00001800-0000-1000-8000-00805f9b34fb'
        this.writeWithResponseCharacteristic_UUID = '00002a00-0000-1000-8000-00805f9b34fb'
        this.writeWithoutResponseService_UUID = ''
        this.writeWithoutResponseCharacteristic_UUID = ''

        this.readServiceUUID = []
        this.readCharacteristicUUID = []  
        this.writeWithResponseServiceUUID = []
        this.writeWithResponseCharacteristicUUID = []
        this.writeWithoutResponseServiceUUID = []
        this.writeWithoutResponseCharacteristicUUID = []
        this.notifyServiceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
        this.notifyCharacteristicUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
    }
    //fetch Notify、Read、Write、WriteWithoutResponse's serviceUUID and characteristicUUID
    getUUID = (services) => {
        this.readServiceUUID = []
        this.readCharacteristicUUID = []
        this.writeWithResponseServiceUUID = []
        this.writeWithResponseCharacteristicUUID = []
        this.writeWithoutResponseServiceUUID = []
        this.writeWithoutResponseCharacteristicUUID = []
        this.notifyServiceUUID = []
        this.notifyCharacteristicUUID = []  

        for(let i in services) {
            let characteristic = services[i].characteristics;
            for(let j in characteristic) {               
                if(characteristic[j].isReadable){
                    this.readServiceUUID.push(services[i].uuid)
                    this.readCharacteristicUUID.push(characteristic[j].uuid)
                }
                if(characteristic[j].isWritableWithResponse){
                    this.writeWithResponseServiceUUID.push(services[i].uuid)
                    this.writeWithResponseCharacteristicUUID.push(characteristic[j].uuid)          
                }
                if(characteristic[j].isWritableWithoutResponse){
                    this.writeWithoutResponseServiceUUID.push(services[i].uuid)
                    this.writeWithoutResponseCharacteristicUUID.push(characteristic[j].uuid)      
                }
                if(characteristic[j].isNotifiable){
                    this.notifyServiceUUID.push(services[i].uuid)
                    this.notifyCharacteristicUUID.push(characteristic[j].uuid)  
                }            
            }  
        }

        // console.log('readServiceUUID: ',readServiceUUID)
        // console.log('readCharacteristicUUID: ',readCharacteristicUUID)
        // console.log('writeWithResponseServiceUUID: ',writeWithResponseServiceUUID)
        // console.log('writeWithResponseCharacteristicUUID: ',writeWithResponseCharacteristicUUID)
        // console.log('writeWithoutResponseServiceUUID: ',writeWithoutResponseServiceUUID)
        // console.log('writeWithoutResponseCharacteristicUUID: ',writeWithoutResponseCharacteristicUUID)
        // console.log('notifyServiceUUID: ',notifyServiceUUID)
        // console.log('notifyCharacteristicUUID: ',notifyCharacteristicUUID)
    }

    // scan = () => {
    //     console.log('Enter scan')
    //     return new Promise( (resolve, reject) => {
    //         this.manager.startDeviceScan(null, null, (error, device) => {
    //             if (error) {
    //                 console.log('startDeviceScan error:',error)
    //                 if(error.errorCode == 102){
    //                     this.alert('Please open BLE and then scan!');
    //                 }
    //                 reject(error);            
    //             }else{
    //                 resolve(device);
    //                 //this.deviceMap.set(device.id, device.name)
    //                 //console.log(this.deviceMap.values()._map._mapData)
    //                 //store.dispatch(Add_Ble( this.deviceMap.values()._map._mapData ))                
    //             }              
    //         })
    //         this.scanTimer && clearTimeout(this.scanTimer);
    //         this.scanTimer = setTimeout(() => {
    //                this.stopScan();              
    //         },3000)
    //     })
    // }

    stopScan = () => {
        this.manager.stopDeviceScan()
        console.log('Stop scan.')
    }
    
    connect = (id) => {
        console.log('Connecting...:',id)
        this.isConnecting = true;
        return new Promise( (resolve, reject) => {
            this.manager.connectToDevice(id)
                .then(device => {                           
                    console.log('connect success:',device.name,device.id)
                    this.peripheralId = device.id
                    //resolve(device)
                    return device.discoverAllServicesAndCharacteristics()
                })
                .then(device => {
                    return this.fetchServicesAndCharacteristicsForDevice(device)
                })
                .then(services => {
                    console.log('fetchServicesAndCharacteristicsForDevice',services)
                    this.isConnecting = false
                    bool = true
                    this.getUUID(services)
                    resolve() //當then 執行到 resolve 就會跳出到有調用到該 function 的 then 並回傳結果          
                })
                .catch(err => {
                    this.isConnecting = false
                    console.log('connect fail: ',err)
                    reject(err)              
                })
        })
    }

    disconnect = () => {
        return new Promise( (resolve, reject) => {
            this.manager.cancelDeviceConnection(this.peripheralId)
                .then(res => {
                    console.log('disconnect success',res)
                    resolve(res)
                    this.isConnected = false
                })
                .catch(err => {
                    reject(err)
                    console.log('disconnect fail',err)
                })     
        })
    }
    //Read data
    read = () => {
        return new Promise( (resolve, reject) =>{
            this.manager.readCharacteristicForDevice(this.peripheralId,this.readService_UUID, this.readCharacteristic_UUID)
                .then(characteristic => {                    
                    let buffer = Buffer.from(characteristic.value,'base64') 
                    let value = buffer.toString('hex');                 
                    console.log('read success',value)
                    // console.log('read success',characteristic.value);
                    resolve(value)
                },error => {
                    console.log('read fail: ',error)
                    //this.alert('read fail: ' + error.reason)
                    reject(error)
                })
        });
    }
    //Write data
    write = (value) => {
        // let asciiValue = new Buffer(value, "base64").toString('ascii'); //base64 to ascii
        // let hexValue = new Buffer(value, "base64").toString('hex');  //base64 to hex       
        let transactionId = 'write';
        return new Promise( (resolve, reject) =>{      
            this.manager.writeCharacteristicWithResponseForDevice(this.peripheralId,this.writeWithResponseService_UUID, 
                this.writeWithResponseCharacteristic_UUID,value,transactionId)
                .then(characteristic => {                    
                    console.log('write success',value)
                    resolve(characteristic)
                },error => {
                    console.log('write fail: ',error)
                    //this.alert('write fail: ',error.reason)
                    reject(error)
                })
        });
    }

    writeWithoutResponse = (value,index) => {
        // let asciiValue = new Buffer(value, "base64").toString('ascii'); //base64 to ascii
        // let hexValue = new Buffer(value, "base64").toString('hex'); //base64 to hex
        let transactionId = 'writeWithoutResponse'
        return new Promise( (resolve, reject) => {   
            this.manager.writeCharacteristicWithoutResponseForDevice(this.peripheralId, this.writeWithoutResponseServiceUUID[index], 
                this.writeWithoutResponseCharacteristicUUID[index],value,transactionId)
                .then(characteristic => {
                    console.log('writeWithoutResponse success',value)
                    resolve(characteristic)
                },error => {
                    console.log('writeWithoutResponse fail: ',error)
                    this.alert('writeWithoutResponse fail: ',error.reason)
                    reject(error)
                })
        });
    }

    destroy = () => {
        this.manager.destroy()
    }

    alert = (text) => {
        Alert.alert('Hint', text, [ { text:'OK', onPress:() => {} } ])
    }
    // Test = () => {
    //     console.log('BluetoothManager.writeWithResponseCharacteristicUUID:',this.writeWithResponseCharacteristicUUID)
    // }
}