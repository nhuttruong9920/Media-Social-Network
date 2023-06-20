const initialState = {
  groupId: "",
  groupAdmin: "",
  groupName: "",
  data: [],
  groupConversations: [],
};

const groupMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_GROUP":
      return {
        ...state,
        groupId: action.payload.groupId,
        groupAdmin: action.payload.groupAdmin,
        groupName: action.payload.groupName,
        data: action.payload.groupMessage,
      };
    case "REMOVE_GROUP":
      return { ...state, data: [], groupName: "", groupAdmin: "", groupId: "" };
    case "ADD_GROUP_MESSAGE":
      return {
        ...state,
        data: state.data.concat(action.payload),
      };
    case "RENAME_GROUP":
      return { ...state, groupName: action.payload };
    case "FETCH_GROUP_CONVERSATION":
      return { ...state, groupConversations: action.payload };
    default:
      return state;
  }
};

export default groupMessageReducer;
