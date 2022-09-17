// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export default {
    namespaced: true,

    state() {
        return {
            searchPreferences: [],
            userSearchPreferences: null,
            additionalSettings: [],
            userAdditionalSettings: null,
        };
    },

    mutations: {
        setSearchPreferences(state, searchPreferences) {
            state.searchPreferences = searchPreferences;
        },
        setUserSearchPreferences(state, userSearchPreferences) {
            state.userSearchPreferences = userSearchPreferences;
        },
        setAdditionalSettings(state, additionalSettings) {
            state.additionalSettings = additionalSettings;
        },
        setUserAdditionalSettings(state, userAdditionalSettings) {
            state.userAdditionalSettings = userAdditionalSettings;
        },
    },
};
