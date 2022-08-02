export const reducer = (state, action) => {
    console.log(state, action)
    if(action.type === 'CLOSE_ITEM'){
      return {...state, isModalOpen: false}
    }

    throw new Error('no matching action type');
  };