import { ADD_BLE, Add_Ble } from '../action/action'

export const ble_device = (state = [], action) => {
    switch (action.type) {
        case ADD_BLE :
            return [
                ...state,
                action.device
            ]
        default :
            return state
    }
}