import React, {Component} from "react"
import {
    Platform, 
    StyleSheet, 
    Text, 
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    Alert
} from "react-native"
import BleModule from "./BleModule"
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button,ListItem,Divider } from 'react-native-elements'
import DataScreen from "./DataScreen"

global.BluetoothManager = new BleModule()

export default class HomeScreen extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            isConnected:false,
            scanning:false,
            text:'',
            writeData:'',
            readData:'',
            receiveData:'',
            deviceData:[],
            isMonitoring:false,
            device:'Not found'
        }
        this.bluetoothReceiveData = []
        this.deviceMap = new Map()
    }

    componentWillUnMount(){   
        BluetoothManager.destroy()
    }

    alert = (text) => {
        Alert.alert('Hint',text,[{ text:'OK',onPress:()=>{ } }]);
    }

    onScan = () => {
        this.onStateChangeListener = BluetoothManager.manager.onStateChange((state) => {
            console.log("onStateChange: ", state)
            if(state == 'PoweredOn'){
                this.scan()
            }               
        }, true)
    }

    componentDidMount(){
        // this.onStateChangeListener = BluetoothManager.manager.onStateChange((state) => {
        //     console.log("onStateChange: ", state)
        //     if(state == 'PoweredOn'){
        //         this.scan()
        //     }               
        // }, true)
    }

    scan = () => {
        if(!this.state.scanning){
            console.log('Enter scan')
            this.setState({scanning:true})
            this.deviceMap.clear()
            
            BluetoothManager.manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log('startDeviceScan error:',error)
                    if(error.errorCode == 102){
                        this.alert('Please open BLE and then scan!')
                    }
                    this.setState({scanning:false})       
                }else{
                    this.deviceMap.set(device.id, device)
                    this.setState({ deviceData : [...this.deviceMap.values()] }) 
                }              
            })
            this.scanTimer && clearTimeout(this.scanTimer)
            this.scanTimer = setTimeout(() => {
                    if(this.state.scanning){
                        BluetoothManager.stopScan()
                        this.setState({ scanning : false })
                    }              
            },5000)
        }else{
            BluetoothManager.stopScan()
            this.setState({ scanning : false })
        }
    }

    onConnect = (item) => {
        if(this.state.scanning){ 
            BluetoothManager.stopScan()
            this.setState({ scanning : false })
        }
        if(BluetoothManager.isConnecting){
            return
        }
        let newData = [...this.deviceMap.values()]
        newData[item.index].isConnecting = true
        this.setState({ deviceData : newData })

        BluetoothManager.connect(item.item.id)
            .then(device => { //connect function 的 resolve 回傳結果,這裡也可以有多個then,只會有一個catch
                newData[item.index].isConnecting = false
                this.setState({ deviceData : [newData[item.index]], isConnected:true })
            })
            .catch(err=>{
                newData[item.index].isConnecting = false;
                this.setState({ deviceData : [...newData] })
                this.alert(err)
            })
    }

    renderItem = (item) => {
        let dataDevice = item.item

        return(

            <ListItem
                title = {<Text style = {{color:'black', fontWeight:"bold"}}>{dataDevice.name?dataDevice.name:"Null"}</Text>}
                subtitle = {<Text style = {{fontStyle:"italic"}}>{dataDevice.id}</Text>}
                leftAvatar = {{
                    title:JSON.stringify(dataDevice.rssi),
                    overlayContainerStyle:{backgroundColor: '#66b2ff'},
                    size:'medium'
                }}
                rightElement = {<Button title = "Connect"
                                    buttonStyle = {{backgroundColor:"#66cc00"}}
                                    onPress = {() => { this.onConnect(item) }}
                                    disabled = { this.state.isConnected?true:false }
                                    activeOpacity = {0.1}
                                    />}
            >
            </ListItem>
        )
    }

    renderHeader = () => {
        return(
            <View style={{marginTop:20}}>
            {this.state.scanning?<Button loading type = "outline"/>
            : <Button
                    title = 'Scan'
                    type = "outline"
                    onPress = {this.onScan.bind(this)}
                    buttonStyle = {{marginLeft: 10, marginRight: 10}}
                />}
                <Text style={{marginLeft:20, marginTop:10, fontSize:14, color:'black', fontWeight:"bold"}}>
                    Available device
                </Text>
            </View>
        )
    }

    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.isConnected?
                            <DataScreen/>
                        : 
                            <FlatList 
                                    renderItem={this.renderItem}
                                    keyExtractor={item => item.id}
                                    data={this.state.deviceData}
                                    ListHeaderComponent={this.renderHeader}
                                    extraData={[this.state.isConnected,this.state.text,this.state.receiveData,this.state.readData,this.state.writeData,this.state.isMonitoring,this.state.scanning]}
                                    keyboardShouldPersistTaps='handled'
                            />
                }      
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
        marginTop:Platform.OS == 'ios'?20:0,
    },
    item: { 
        flexDirection:'column',
        borderColor:'rgb(235,235,235)',
        borderStyle:'solid',
        borderBottomWidth:StyleSheet.hairlineWidth,
        paddingLeft:10,
        paddingVertical:8, 
    },
    buttonView:{
        height:30,
        backgroundColor:'#66b2ff',
        paddingHorizontal:10,
        borderRadius:5,
        justifyContent:"center",   
        alignItems:'center',
        alignItems:'flex-start',
        marginTop:10
    },
    buttonText:{
        color:"white",
        fontSize:16,
        fontWeight:'bold'
    },
    textInput:{       
		paddingLeft:5,
		paddingRight:5,
		backgroundColor:'white',
		height:50,
        fontSize:16,
        flex:1,
    },
    content:{        
        marginTop:5,
        marginBottom:15,        
    },
  })