import React,{ Component } from 'react'
import { View,StyleSheet,ART,Animated,Text } from 'react-native'
//import MapView from 'react-native-maps'
import { Icon,Avatar,Card } from 'react-native-elements'

class FadeInView extends Component {
    constructor(props){
        super(props)
        this.state = {
            fadeAnim: new Animated.Value(0) //Initial value for it 0
        }
    }
    componentDidMount(){
        this.infiniteAnimate()
    }

    infiniteAnimate(){
        Animated.timing( //Animate over time
            this.state.fadeAnim, //The animated value to drive
            { 
                duration: 2000, //Make it take while
                toValue: 1  //Target animated value
            }
        ).start() //Start animation
    }
    render() {
        let { fadeAnim } = this.state
        return (
            <Animated.View
                style = {{
                    //...this.props.style,
                    opacity:fadeAnim //Bind opacity to animated value
                }}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}

export default class DrawScreen extends Component {
    render() {
        return (
            <View style = {styles.container}>
                <FadeInView style = {styles.fadeView}>
                    <Avatar rounded icon = {{name:"bluetooth" }} 
                        size = "xlarge" 
                        containerStyle = {styles.avatar}
                        overlayContainerStyle = {{backgroundColor:"#3366ff"}}
                    />
                    <Text style = {styles.fadeText}>
                        Welcome
                    </Text>
                </FadeInView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff"
    },
    fadeView: {
        width: 250, height: 50, 
        backgroundColor: 'powderblue'
    },
    fadeText: {
        fontSize: 28, textAlign: 'center'
    },
    avatar: {
        marginLeft: 100, marginRight: 100
    }   
})