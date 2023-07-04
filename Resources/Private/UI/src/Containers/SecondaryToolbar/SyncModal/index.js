import React, {Fragment, PureComponent} from "react";
import {connect} from "react-redux";
import {actions} from "../../../actions";
import {$transform, $get} from "plow-js";
import {Button, CheckBox, Dialog, Label, SelectBox} from '@neos-project/react-ui-components'
import PropTypes from "prop-types";
import {neos} from '@neos-project/neos-ui-decorators';
import I18n from '@neos-project/neos-ui-i18n';
import style from './style.module.css'

@neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}))

@connect($transform({
    isOpen: $get('plugins.translationSyncModal.open'),
    isLoading: $get('plugins.translationSyncModal.loading'),
    selectedSourceLanguage: $get('plugins.translationSyncModal.selectedSourceLanguage'),
    confirmed: $get('plugins.translationSyncModal.confirm'),
    availableLanguages: $get('cr.contentDimensions.byName.language.presets'),
    currentDocumentNodePath: $get('cr.nodes.documentNode')
}),
{
    setSelectedSourceLanguageAction: actions.setSelectedSourceLanguage,
    setConfirmAction: actions.setConfirm,
    resetAction: actions.resetSyncModal,
    translateDocumentAction: actions.translateDocument,
    toggleLoading: actions.toggleSyncModalLoading
})
export default class SyncModal extends PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        resetAction: PropTypes.func.isRequired,
        setSelectedSourceLanguageAction: PropTypes.func.isRequired,
        setConfirmAction: PropTypes.func.isRequired,
        translateDocumentAction: PropTypes.func.isRequired,
        i18nRegistry: PropTypes.object.isRequired,
        currentDocumentNodePath: PropTypes.string,
        confirmed: PropTypes.bool,
        selectedSourceLanguage: PropTypes.string,
        toggleLoading: PropTypes.func.isRequired
    }

    getAvailableSourceLanguages = () => {
        let {availableLanguages} = this.props;
        availableLanguages = Object.entries(availableLanguages || {}).filter(([key, value]) => (value?.options?.translationStrategy !== 'once' && value?.options?.translationStrategy !== 'sync'))
        return availableLanguages.map(([key, value]) => {
            return {
                value: key,
                label: value.label
            }
        })
    }

    setConfirm = (value) => {
        const {setConfirmAction} = this.props;
        setConfirmAction(value)
    }

    setSourceLanguage = (value) => {
        const {setSelectedSourceLanguageAction} = this.props;
        setSelectedSourceLanguageAction(value)
    }

    handleBack = () => {
        const {resetAction, isLoading} = this.props;

        if (isLoading) {
            return
        }

        resetAction();
    }

    handleTranslate = () => {
        const {translateDocumentAction, currentDocumentNodePath, selectedSourceLanguage} = this.props;
        translateDocumentAction({nodeContextPath: currentDocumentNodePath, sourceLanguage: selectedSourceLanguage})
    }

    renderTitle() {
        return (
            <I18n id="CodeQ.LostInTranslation.UiSyncButton:Main:translateDocument" fallback="Translate document" />
        );
    }

    renderBackAction() {
        const {isLoading} = this.props;
        return (
            <Button
                id="codeq-lostInTranslation-uiSyncButton-dialog-Back"
                key="back"
                style="lighter"
                hoverStyle="brand"
                onClick={this.handleBack}
                disabled={isLoading}
            >
                <I18n id="Neos.Neos:Main:back" fallback="Back"/>
            </Button>
        );
    }

    renderTranslateAction() {
        const {confirmed, selectedSourceLanguage, isLoading} = this.props;
        return (
            <Button
                id="codeq-lostInTranslation-uiSyncButton-dialog-Translate"
                key="translate"
                style="success"
                hoverStyle="brand"
                onClick={this.handleTranslate}
                disabled={!confirmed || !selectedSourceLanguage || isLoading}
            >
                <I18n id="CodeQ.LostInTranslation.UiSyncButton:Main:translate" fallback="Translate" />
            </Button>
        );
    }

    renderSourceLanguageSelectBox() {
        const {i18nRegistry, selectedSourceLanguage, isLoading} = this.props;
        return (
            <div className={style.select}>
                <I18n id="CodeQ.LostInTranslation.UiSyncButton:Main:sourceLanguage" fallback="Source language" className={style.select__label} />
                <SelectBox
                    options={this.getAvailableSourceLanguages()}
                    value={selectedSourceLanguage}
                    onValueChange={this.setSourceLanguage}
                    placeholderIcon="language"
                    placeholder={i18nRegistry.translate('CodeQ.LostInTranslation.UiSyncButton:Main:chooseLanguage', 'Please select a language…')}
                    disabled={isLoading}
                />
            </div>
        )
    }

    render() {
        const {isOpen, isLoading, confirmed} = this.props;
        if (!isOpen) {
            return null;
        }
        return (
            <Dialog
                actions={[this.renderBackAction(), this.renderTranslateAction()]}
                title={this.renderTitle()}
                onRequestClose={this.handleBack}
                type="success"
                isOpen
            >
                <div className={style.body}>
                    {this.renderSourceLanguageSelectBox()}

                    <Label className={style.confirm__label}>
                        <CheckBox
                            isChecked={confirmed}
                            disabled={isLoading}
                            onChange={this.setConfirm}
                        />
                        <I18n id="CodeQ.LostInTranslation.UiSyncButton:Main:confirmDeletingOfCurrentContent" />
                    </Label>
                </div>
            </Dialog>
        );
    }
}
