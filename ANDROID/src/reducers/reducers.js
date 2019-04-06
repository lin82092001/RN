import { to_dos } from './to_dos'
import { visibility_filters } from './visibility_filters'
import { ble_device } from './ble_device'
import { combineReducers } from 'redux'

const todoApp = combineReducers({
    //to_dos,
    //visibility_filters,
    ble_device
})
export default todoApp