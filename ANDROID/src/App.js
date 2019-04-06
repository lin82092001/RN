import React,{ Component } from 'react'
import { createAppContainer } from 'react-navigation'
import {
  createBottomTabNavigator
} from 'react-navigation-tabs'
import HomeScreen from './screen/HomeScreen'
import DataScreen from './screen/DataScreen'
import DrawScreen from './screen/DrawScreen'
import AxiosScreen from './screen/AxiosScreen'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class App extends Component{

    constructor(props){
      super(props)
      this.state = {
        viewChange:false
      }
    }
    componentWillMount(){
      setTimeout(() => {
         this.setState({viewChange:true}) 
      },2200)
    }
    render(){
        return(
            // <AppContainer/>
               this.state.viewChange ? <HomeScreen/> : <DrawScreen/>
        )
    }
}

const Navigator = createBottomTabNavigator({ 
    Scan: { screen: HomeScreen,}, 
    Data: { screen: DataScreen,}, 
    // Draw: {screen: DrawScreen,},
    // Axios: {screen: AxiosScreen,}, 
  },{
    initialRouteName: "Scan",
    tabBarOptions: {
      activeTintColor: 'blue',
      labelStyle: {
        fontSize: 14,
      }
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Scan') {
          iconName = 'rss'
        }else if (routeName === 'Data') {
          iconName = 'star'
        }else if (routeName === 'Draw'){
          iconName = 'pencil'
        }else if (routeName === 'Axios') {
          iconName = 'qq'
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (<Icon name={iconName} size={horizontal ? 20 : 25} color={tintColor} />)
      }
    })
  })
  const AppContainer = createAppContainer(Navigator)