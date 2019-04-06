import {
    Visibility_filters
} from '../action/action'

const { SHOW_ALL } = Visibility_filters

export const visibility_filters = (state = SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER' :
            return action.filter
        default :
            return state
    }
}