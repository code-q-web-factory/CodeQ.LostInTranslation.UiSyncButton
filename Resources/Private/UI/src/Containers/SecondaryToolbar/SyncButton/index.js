import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {IconButton} from '@neos-project/react-ui-components';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import style from './style.module.css';
import {neos} from '@neos-project/neos-ui-decorators';
import {actions} from '../../../actions'
import {$get, $transform} from "plow-js";

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

@connect($transform({
    languages: $get('cr.contentDimensions.byName.language.presets'),
    currentDocumentNodePath: $get('cr.nodes.documentNode')
}),
{
    toggleAction: actions.toggleSyncModal
})
export default class SyncButton extends PureComponent {
    static propTypes = {
        toggleAction: PropTypes.func,
        i18nRegistry: PropTypes.object.isRequired,
        languages: PropTypes.object,
        currentDocumentNodePath: PropTypes.string
    };

    isInTranslatableLanguage = () => {
        try {
            const {currentDocumentNodePath, languages} = this.props;
            let currentLanguageDimension = currentDocumentNodePath.match(/(language=)[a-zA-Z_]+;?/)[0];
            currentLanguageDimension = currentLanguageDimension.replace('language=', '').replace(';', '');
            return languages[currentLanguageDimension]?.options?.translationStrategy === 'once';
        } catch (e) {
            return false
        }
    }

    handleClick = () => {
        const {toggleAction} = this.props;
        toggleAction({open: true});
    }

    render() {
        const {i18nRegistry} = this.props;

        const buttonClassNames = mergeClassNames({
            [style.secondaryToolbar__buttonLink]: true
        });

        return (
            <IconButton
                icon="globe"
                className={buttonClassNames}
                onClick={this.handleClick}
                aria-label={i18nRegistry.translate('CodeQ.LostInTranslation.UiSyncButton:Main:translate', 'Translate')}
                title={i18nRegistry.translate('CodeQ.LostInTranslation.UiSyncButton:Main:translate', 'Translate')}
                disabled={!this.isInTranslatableLanguage()}
            />
        );
    }
}
