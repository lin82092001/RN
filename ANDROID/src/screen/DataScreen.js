import React,{ Component } from 'react'
import { View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ScrollView,
    TextInput,
    FlatList,
    Platform } from 'react-native'
import { connect } from 'react-redux'
import  todoApp from '../reducers/reducers'
import {
    Add_Todo,
    Toggle_Todo,
    SetVisibility,
    Visibility_filters
} from '../action/action'
import { Characteristic } from 'react-native-ble-plx'
import { Button,Card } from 'react-native-elements'
import HomeScreen from './HomeScreen'

export default class DataScreen extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            readData:'',
            receiveData:'',
            writeData:'',
            text:'01',
            isMonitoring:false,
            isDisconnected:false,
        }
        this.bluetoothReceiveData = []
    }

    alert = (text) => {
        Alert.alert('Hint',text,[{ text:'OK',onPress:()=>{ } }]);
    }
    
    onDisconnect = () => {
        BluetoothManager.disconnect()
            .then(res => {
                this.setState({isDisconnected:true})
            })
            .catch(err => {
                this.setState({isDisconnected:true})
            })     
    }

    read = () => {
        BluetoothManager.read()
            .then(value => {
                this.setState({readData:value})
                this.bluetoothReceiveData.push(value)
                this.setState({receiveData:this.bluetoothReceiveData.join('')})
            })
            .catch(err => {
                
            })
    }
    write = () => {
        // if(this.state.text.length == 0){
        //     this.alert('Please input message.')
        //     return
        // }

        BluetoothManager.write('01')
            .then(characteristic => {
                this.setState({
                    writeData:this.state.text,
                    text:'',
                    wrote:true
                })
            })
            .catch(err => {
                
            })
    }
    writeWithoutResponse = (index,type) => {
        if(this.state.text.length == 0){
            this.alert('Please input message.')
            return
        }

        BluetoothManager.writeWithoutResponse(this.state.text,index,type)
            .then(characteristic => {
                this.bluetoothReceiveData = []
                this.setState({
                    writeData:this.state.text,
                    text:''
                })
            })
            .catch(err => {
                console.log('writeWithoutResponse fail: ',err)
            })
    }
    //Monitor bluetooth data
    monitor = () => {
        let transactionId = 'monitor';
        this.monitorListener = BluetoothManager.manager.monitorCharacteristicForDevice(BluetoothManager.peripheralId,
            BluetoothManager.notifyServiceUUID,BluetoothManager.notifyCharacteristicUUID,
            (error, characteristic) => {
                if (error) {
                    this.setState({isMonitoring:false})
                    console.log('monitor fail:',error)
                    this.alert('monitor fail: ' + error.reason) 
                }else{
                    this.setState({isMonitoring:true})
                    this.bluetoothReceiveData.push(characteristic.value) //Add new item to the end of an array.
                    this.setState({receiveData:this.bluetoothReceiveData.join('')})
                    console.log('monitor success',characteristic.value)
                }

            }, transactionId)
    }
    
    renderWriteView = (label,buttonText,characteristics,onPress,state) => {
        if(characteristics.length == 0){
            return null
        }
        return(
            <View style={{marginHorizontal:10,marginTop:30}} behavior='padding'>
                <Text style={{color:'black'}}>{label}</Text>
                    <Text style={styles.content}>
                        {this.state.writeData}
                    </Text>                        
                    {characteristics.map((item,index)=>{
                        return(
                            <TouchableOpacity 
                                key={index}
                                activeOpacity={0.7} 
                                style={styles.buttonView} 
                                onPress={()=>{onPress(index)}}>
                                <Text style={styles.buttonText}>{buttonText} ({item})</Text>
                            </TouchableOpacity>
                        )
                    })}      
                    <TextInput
                        style={[styles.textInput]}
                        value={this.state.text}
                        placeholder='Please input message'
                        onChangeText={(text)=>{
                            this.setState({text:text})
                        }}
                    />
            </View>
        )
    }
    renderReceiveView = (label,buttonText,characteristics,onPress,state) => {
        if(characteristics.length == 0){
            return null
        }
        return(
            <View style={{marginHorizontal:10,marginTop:30}}>
                <Text style={{color:'black',marginTop:5}}>{label}</Text>               
                
                {characteristics.map((item,index)=>{
                    return(
                        <TouchableOpacity 
                            activeOpacity={0.7} 
                            style={styles.buttonView} 
                            onPress={()=>{onPress(index)}} 
                            key={index}>
                            <Text style={styles.buttonText}>{buttonText} ({item})</Text>
                        </TouchableOpacity>
                    )
                })}        
            </View>
        )
    }

    renderHeader = () => {
            return(
                <View style={{marginBottom:30}}>
                    
                    <View>
                    {this.renderWriteView('write：','send',
                            BluetoothManager.writeWithResponseCharacteristicUUID,this.write)}
                    {this.renderReceiveView('read data：','read',
                            BluetoothManager.readCharacteristicUUID,this.read,this.state.readData)}
                    {this.renderReceiveView(`monitor's data：${this.state.isMonitoring?'monitor opened':'monitor close'}`,'open',
                            BluetoothManager.notifyCharacteristicUUID,this.monitor,this.state.receiveData)}
                    </View>    
                </View> 
            )
    }

    componentDidMount(){
            this.time_id = setInterval(()=>{
                    if (!this.state.isDisconnected) {
                        this.write()
                        this.read()
                    }
            },2000)
    }
    componentWillUnmount(){   
        BluetoothManager.destroy()
        clearInterval(this.time_id)
    }

    render() {
        return (
           <View style={styles.container}>
                {
                    this.state.isDisconnected?
                        <HomeScreen/>
                    :
                    <View>
                        <Button 
                                title = 'Disconnect'
                                type = 'outline'
                                onPress = {this.onDisconnect.bind(this)}
                                buttonStyle = {styles.button}
                        />
                        <Text style={styles.content}>
                            Read: {this.bluetoothReceiveData.join(' ')}
                        </Text>
                    </View>
                }
           </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        //marginTop:Platform.OS == 'ios'?20:0,
    },
    item:{
        flexDirection:'column',
        borderColor:'rgb(235,235,235)',
        borderStyle:'solid',
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingLeft:10,
        paddingVertical:8,       
    },
    buttonView:{
        height:30,
        backgroundColor:'rgb(33, 150, 243)',
        paddingHorizontal:10,
        borderRadius:5,
        justifyContent:"center",   
        alignItems:'center',
        alignItems:'flex-start',
        marginTop:10
    },
    buttonText:{
        color:"white",
        fontSize:14,
    },
    content:{        
        marginTop:15,
        marginLeft:15,        
    },
    textInput:{       
		paddingLeft:5,
		paddingRight:5,
		backgroundColor:'white',
		height:50,
        fontSize:16,
        flex:1,
    },
    noData:{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff"
    },
    noDataText:{
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    button:{
        marginTop: 10, 
        marginLeft: 10, 
        marginRight: 10
    }
})