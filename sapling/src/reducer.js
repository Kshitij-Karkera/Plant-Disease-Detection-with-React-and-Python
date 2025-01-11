export const initialState = {
    image: [],
    myData: [],
}

const reducer = (state, action) => {
    switch(action.type) {
        case "UPLOAD_IMAGE":
            return {
                ...state,
                image: [state.image, action.item]
            }
        case "SET_DATA":
            return {
                ...state,
                myData: [state.myData, action.item]
            }
    
        default:
            return state
    }
}


export default reducer