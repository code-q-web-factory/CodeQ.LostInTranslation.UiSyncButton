import {createAction, handleActions} from 'redux-actions';

export const actionTypes = {
    TOGGLE_SYNC_MODAL: 'CodeQ.LostInTranslation.UiSyncButton/TOGGLE_SYNC_MODAL',
    TOGGLE_SYNC_MODAL_LOADING: 'CodeQ.LostInTranslation.UiSyncButton/TOGGLE_SYNC_MODAL_LOADING',
    SET_SELECTED_SOURCE_LANGUAGE: 'CodeQ.LostInTranslation.UiSyncButton/SET_SELECTED_SOURCE_LANGUAGE',
    SET_CONFIRM: 'CodeQ.LostInTranslation.UiSyncButton/SET_CONFIRM',
    TRANSLATE_DOCUMENT: 'CodeQ.LostInTranslation.UiSyncButton/TRANSLATE_DOCUMENT',
    RESET_SYNC_MODAL: 'CodeQ.LostInTranslation.UiSyncButton/RESET_MODAL'
};

const toggleSyncModal = createAction(actionTypes.TOGGLE_SYNC_MODAL);
const toggleSyncModalLoading = createAction(actionTypes.TOGGLE_SYNC_MODAL_LOADING);
const translateDocument = createAction(actionTypes.TRANSLATE_DOCUMENT);
const resetSyncModal = createAction(actionTypes.RESET_SYNC_MODAL);
const setSelectedSourceLanguage = createAction(actionTypes.SET_SELECTED_SOURCE_LANGUAGE);
const setConfirm = createAction(actionTypes.SET_CONFIRM);

export const actions = {
    toggleSyncModal,
    toggleSyncModalLoading,
    translateDocument,
    resetSyncModal,
    setSelectedSourceLanguage,
    setConfirm
};

export const reducer = handleActions(
    {
        [actionTypes.SET_SELECTED_SOURCE_LANGUAGE]: (state, action) => ({
            ...state,
            plugins: {
                ...state?.plugins,
                translationSyncModal: {
                    ...state?.plugins?.translationSyncModal,
                    selectedSourceLanguage: action.payload
                },
            },
        }),
        [actionTypes.SET_CONFIRM]: (state, action) => ({
            ...state,
            plugins: {
                ...state?.plugins,
                translationSyncModal: {
                    ...state?.plugins?.translationSyncModal,
                    confirm: action.payload
                },
            },
        }),
        [actionTypes.TOGGLE_SYNC_MODAL]: (state, action) => ({
            ...state,
            plugins: {
                ...state?.plugins,
                translationSyncModal: {
                    ...state.plugins?.translationSyncModal,
                    open: action.payload !== undefined ? action.payload.open : !(state.plugins?.translationSyncModal?.open || false),
                },
            },
        }),
        [actionTypes.TOGGLE_SYNC_MODAL_LOADING]: (state, action) => ({
            ...state,
            plugins: {
                ...state?.plugins,
                translationSyncModal: {
                    ...state.plugins?.translationSyncModal,
                    loading: action.payload !== undefined ? action.payload.loading : !(state.plugins?.translationSyncModal?.loading || false),
                },
            },
        }),
        [actionTypes.RESET_SYNC_MODAL]: (state, action) => ({
            ...state,
            plugins: {
                ...state?.plugins,
                translationSyncModal: {
                    open: false,
                    loading: false,
                    selectedSourceLanguage: null,
                    confirm: false
                }
            }
        })
    },
    {
        plugins: {
            translationSyncModal: {
                open: false,
                loading: false,
                selectedSourceLanguage: null,
                confirm: false
            },
        },
    }
);

export const selectors = {
    translationSyncModalOpen: (state) => state.plugins?.translationSyncModal?.open,
    translationSyncModalLoading: (state) => state.plugins?.translationSyncModal?.loading,
    translationSyncModalSelectedSourceLanguage: (state) => state.plugins?.translationSyncModal?.selectedSourceLanguage,
    translationSyncModalConfirmed: (state) => state.plugins?.translationSyncModal?.confirm
};
