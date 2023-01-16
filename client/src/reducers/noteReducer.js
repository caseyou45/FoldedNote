const noteReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_NOTE":
      return action.data;
    default:
      return state;
  }
};

export const setStateNote = (note) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_NOTE",
      data: note,
    });
  };
};

export default noteReducer;
