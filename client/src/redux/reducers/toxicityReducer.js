import { GLOBALTYPES } from '../actions/globalTypes'

const toxicityReducer = (state = true, action) => {
    switch (action.type){
        case GLOBALTYPES.TOXIC:
            return action.payload;
        default:
            return state;
    }
}


export default toxicityReducer