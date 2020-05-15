import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

//fetchComments
export const fetchComments = () => dispatch => {
    return fetch(baseUrl + 'comments')
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    const error = new Error(`Error ${response.status}: ${response.statusText}`);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                const errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(comments => dispatch(addComments(comments)))
        .catch(error => dispatch(commentsFailed(error.message)));
};

export const commentsFailed = errMess => ({
    type: ActionTypes.COMMENTS_FAILED,
    payload: errMess
});

export const addComments = (comments) => ({
    type: ActionTypes.ADD_COMMENTS,
    payload: comments
});

//fetchmeals
export const fetchMeals = () => dispatch => {

    dispatch(mealsLoading());

    return fetch(baseUrl + 'meals')
        .then(response => {
                if (response.ok) {
                return response;
                } else {
                    const error = new Error(`Error ${response.status}: ${response.statusText}`);
                    error.response = response;
                throw error;
                }
            },
            error => {
                const errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(meals => dispatch(addmeals(meals)))
        .catch(error => dispatch(mealsFailed(error.message)));
};

export const mealsLoading = () => ({
    type: ActionTypes.MEALS_LOADING
});

export const mealsFailed = errMess => ({
    type: ActionTypes.MEALS_FAILED,
    payload: errMess
});

export const addmeals = meals => ({
    type: ActionTypes.ADD_MEALS,
    payload: meals
});

//fetchPromotions
export const fetchPromotions = () => dispatch => {
    
    dispatch(promotionsLoading());

    return fetch(baseUrl + 'promotions')
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    const error = new Error(`Error ${response.status}: ${response.statusText}`);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                const errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(promotions => dispatch(addPromotions(promotions)))
        .catch(error => dispatch(promotionsFailed(error.message)));
};

export const promotionsLoading = () => ({
    type: ActionTypes.PROMOTIONS_LOADING
});

export const promotionsFailed = errMess => ({
    type: ActionTypes.PROMOTIONS_FAILED,
    payload: errMess
});

export const addPromotions = promotions => ({
    type: ActionTypes.ADD_PROMOTIONS,
    payload: promotions
});

//fetchPartners
export const fetchPartners = () => dispatch => {
    
    dispatch(partnersLoading());

    return fetch(baseUrl + 'partners')
        .then(response => {
                if (response.ok) {
                    return response;
                } else {
                    const error = new Error(`Error ${response.status}: ${response.statusText}`);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                const errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(partners => dispatch(addPartners(partners)))
        .catch(error => dispatch(partnersFailed(error.message)));
};

export const partnersLoading = () => ({
    type: ActionTypes.PARTNERS_LOADING
});

export const partnersFailed = errMess => ({
    type: ActionTypes.PARTNERS_FAILED,
    payload: errMess
});

export const addPartners = partners => ({
    type: ActionTypes.ADD_PARTNERS,
    payload: partners
});

//postFavorite
export const postFavorite = mealId => dispatch => {
    setTimeout(() => {
        dispatch(addFavorite(mealId));
    }, 2000);
};

export const addFavorite = mealId => ({
    type: ActionTypes.ADD_FAVORITE,
    payload: mealId
});

//comment, addComment, postComment
export const postComment = (mealId, rating, author, text) => dispatch => {
    
    const newComment = {
        mealId: mealId,
        rating: rating,
        author: author,
        text: text
        /* date = new Date().toISOString(); */
    };

     newComment.date = new Date().toISOString(); 

        setTimeout(() => {
            dispatch(addComment(newComment));
        }, 2000);   
};

export const addComment = comment => ({
    type: ActionTypes.ADD_COMMENT,
    payload: comment
});

//deleteFavorite
export const deleteFavorite = mealId => ({
    type: ActionTypes.DELETE_FAVORITE,
    payload: mealId
}); 