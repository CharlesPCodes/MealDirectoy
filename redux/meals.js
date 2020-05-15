import * as ActionTypes from './ActionTypes';

export const meals = (state = { isLoading: true,
                                     errMess: null,
                                     meals: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_MEALS:
            return {...state, isLoading: false, errMess: null, meals: action.payload};

        case ActionTypes.ADD_MEALS_LOADING = 'MEALS_LOADING':
            return {...state, isLoading: true, errMess: null, meals: []}

        case ActionTypes.ADD_MEALS_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
          return state;
      }
};