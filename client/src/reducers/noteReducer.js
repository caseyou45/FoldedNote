// const initialState = {
//   user: "",
// };

// const userReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case "SET_USER":
//       // return action.data;
//       return { ...state, user: action.data };
//     default:
//       return state;
//   }
// };

// export const setStateUser = (user) => {
//   return async (dispatch) => {
//     dispatch({
//       type: "SET_USER",
//       data: user,
//     });
//   };
// };

// export default userReducer;

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
