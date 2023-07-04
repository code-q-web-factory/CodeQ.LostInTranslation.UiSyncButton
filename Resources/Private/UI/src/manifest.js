import manifest from '@neos-project/neos-ui-extensibility';
import SyncButton from "./Containers/SecondaryToolbar/SyncButton";
import {actions, reducer, selectors} from "./actions"
import SyncModal from "./Containers/SecondaryToolbar/SyncModal";
import * as sagas from './Sagas'

manifest('CodeQ.LostInTranslation.UiSyncButton:DoesSomethingHere', {}, globalRegistry => {
    globalRegistry.get('reducers').set('CodeQ.LostInTranslation.UiSyncButton', { reducer });

    const containerRegistry = globalRegistry.get('containers');
    containerRegistry.set('SecondaryToolbar/Right/SyncButton', SyncButton);
    containerRegistry.set('Modals/TranslationSyncModal', SyncModal);

    const sagasRegistry = globalRegistry.get('sagas');
    sagasRegistry.set('CodeQ.LostInTranslation.UiSyncButton/translateDocument', {saga: sagas.translateDocument})
});
