import { GLOBALTYPES } from '../actions/globalTypes'

const speechReducer = (state = false, action) => {
    switch (action.type){
        case GLOBALTYPES.SPEECH:
            return action.payload;
        default:
            return state;
    }
}


export default speechReducer