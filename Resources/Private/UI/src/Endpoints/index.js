import {fetchWithErrorHandling} from "@neos-project/neos-ui-extensibility/dist/shims/neosProjectPackages/neos-ui-backend-connector";

export default (routes) => {
    const translate = (nodeContextPath, sourceLanguage) => fetchWithErrorHandling.withCsrfToken(csrfToken => ({
        url: '/codeq/translation-service/translate',

        method: 'POST',
        credentials: 'include',
        headers: {
            'X-Flow-Csrftoken': csrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            node: nodeContextPath,
            sourceLanguage: sourceLanguage
        })
    })).then(response => fetchWithErrorHandling.parseJson(response))
    .catch(reason => fetchWithErrorHandling.generalErrorHandler(reason));

    return {
        translate
    }
}
