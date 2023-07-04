import {takeLatest, put, call} from 'redux-saga/effects';

import {actions, actionTypes} from '../actions'
import {actions as neosActions} from '@neos-project/neos-ui-redux-store';

import initializeEndpoints from '../Endpoints'

export function * translateDocument() {
    const endpoints = initializeEndpoints()
    yield takeLatest(actionTypes.TRANSLATE_DOCUMENT, function * performPropertyChange(action) {
        const {nodeContextPath, sourceLanguage} = action.payload;
        yield put(actions.toggleSyncModalLoading({loading: true}))
        const feedback = yield call(endpoints.translate, nodeContextPath, sourceLanguage)
        yield put(actions.resetSyncModal())
        yield put(neosActions.ServerFeedback.handleServerFeedback(feedback));
    });
}
