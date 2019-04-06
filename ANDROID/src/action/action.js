import React,{Component} from 'react'

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const ADD_BLE = 'ADD_BLE'

export const Visibility_filters = {
    SHOW_ALL:'SHOW_ALL',
    SHOW_COMPLETE:'SHOW_COMPLETE',
    SHOW_ACTIVE:'SHOW_ACTIVE'
}

export const Add_Todo = (text) => {
    return { type: ADD_TODO, text }
}

export const Toggle_Todo = (index) => {
    return { type: TOGGLE_TODO, index }
}

export const SetVisibility = (filter) => {
    return { type: SET_VISIBILITY_FILTER, filter }
}

export const Add_Ble = (device) => {
    return {
        type: ADD_BLE,
        device
    }
}