import {
    ADD_TODO,
    TOGGLE_TODO
} from '../action/action'

export const to_dos = (state = [], action) => {
    switch (action.type) {    
        case ADD_TODO :
            return [
                ...state,
                {
                    text:action.text,
                    completed:false
                }
            ]
        case TOGGLE_TODO :
            return state.map((todo, index) => {
                if(index === action.index){
                    return Object.assign({}, state, {
                        completed:!todo.completed
                    })
                }
                return todo
            })
        default:
            return state
    }
}