import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native'
import axios from 'axios'

const axiosInst = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/'
})

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      persons:[],
      status:0,
      method:'',
      response:'',
      delete:'',
      put:'',
      id:1
    }

  }
  componentDidMount(){
    axiosInst.get('users/')
      .then(res => {
        const persons = res.data
        const status = res.status
        const method = res.request._method

        this.setState({
          persons:persons,
          status:status,
          method:method
        })
      })
      .catch(err => {
        console.error(err)
      })

    axiosInst.post('users',{name:'Wistron'})
      .then(res => {
        this.setState({response:JSON.stringify(res.data)})
      })
      .catch(err => {
        console.error(err)
      })

    axiosInst.delete('users/${this.state.id}')
      .then(res => {
        // console.warn(res)
        // console.warn(res.data)
        this.setState({delete:JSON.stringify(res.data)})
      })
      .catch(err => {
        console.error(err)
      })
    
    axiosInst.put('users/1',{name:'Wiwynn'})
      .then(res => {
        this.setState({put:JSON.stringify(res.data)})
      })
      .catch(err => {
        console.error(err)
      })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{this.state.persons.map(person => person.name)}</Text>
        <Text style={styles.welcome}>{this.state.status}</Text>
        <Text style={styles.welcome}>{this.state.method}</Text>
        <Text style={styles.welcome}>{this.state.response}</Text>
        <Text style={styles.welcome}>{this.state.delete}</Text>
        <Text style={styles.welcome}>{this.state.put}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
