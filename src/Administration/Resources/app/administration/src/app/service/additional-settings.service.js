// import { KEY_USER_SEARCH_PREFERENCE } from 'src/app/service/search-ranking.service';

/**
* @description Exposes an user additional settings
* @constructor
* @param {Object} Object.userConfigRepository
*/
// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export default function AdditionalSettingsService({ userConfigRepository: _userConfigRepository }) {
    return {
        getDefaultAdditionalSettings,
        getUserAdditionalSettings,
        createUserAdditionalSettings,
        processAdditionalSettings,
        processAdditionalSettingsFields,
    };

    /**
    * @description Get default additional settings
    * @returns {Array}
    */
    function getDefaultAdditionalSettings() {
        const defaultAdditionalSettings = [];

        Shopware.Module.getModuleRegistry().forEach(({ manifest }) => {
            if (
                manifest.entity &&
                Shopware.Service('acl').can(`${manifest.entity}.editor`) //&&
                // manifest.defaultSearchConfiguration
            ) {
                defaultAdditionalSettings.push({
                    // [manifest.entity]: manifest.defaultSearchConfiguration,
                });
            }
        });

        return defaultAdditionalSettings;
    }

    /**
    * @description Get user search preferences
    * @returns {Promise}
    */
    function getUserAdditionalSettings() {
        // return new Promise(async (resolve) => {
        //     const response = await Shopware.Service('userConfigService').search([KEY_USER_SEARCH_PREFERENCE]);
        //
        //     resolve(response.data[KEY_USER_SEARCH_PREFERENCE] || null);
        // });
    }

    /**
    * @description Define user search preferences
    * @returns {Object}
    */
    function createUserAdditionalSettings() {
        const userAdditionalSettings = _userConfigRepository.create();

        _getUserConfigCriteria().filters.forEach(({ field, value }) => {
            userAdditionalSettings[field] = value;
        });

        return userAdditionalSettings;
    }

    /**
    * @description Process additional settings
    * @param {Array} tempAdditionalSettings
    * [{
    *     customer: {
    *         _colourchange: false
    *     }
    * }]
    * @returns {Array}
    * [{
    *     entityName: 'customer'
    *     _colourchange: false
    * }]
    */
    function processAdditionalSettings(tempAdditionalSettings) {
        const additionalSettings = [];

        tempAdditionalSettings = Object.assign({}, ...tempAdditionalSettings);
        Object.entries(tempAdditionalSettings).forEach(([entityName, { _colourchange, ...rest }]) => {
            const fields = _getFields(rest);
            additionalSettings.push({ entityName, _colourchange, fields });
        });
        additionalSettings.sort((a, b) => b.fields.length - a.fields.length);

        return additionalSettings;
    }

    /**
    * @description Process additional settings fields
    * @param {Array} tempAdditionalSettingsFields
    * [{
    *     fieldName: 'company',
    *     _colourchange: true,
    *     _score: 500
    * }]
    * @returns {Object}
    * {
    *     company: {
    *         _score: 500,
    *         _colourchange: true
    *     }
    * }
    */
    function processAdditionalSettingsFields(tempAdditionalSettingsFields) {
        let additionalSettingsFields = {};

        tempAdditionalSettingsFields.forEach((field) => {
            field.group.forEach((group) => {
                const additionalSettingsField = Shopware.Utils.object.set({}, group.fieldName, {
                    _colourchange: field._colourchange,
                    _score: field._score,
                });
                additionalSettingsFields = Shopware.Utils.object.deepMergeObject(
                    additionalSettingsFields,
                    additionalSettingsField,
                );
            });
        });

        return additionalSettingsFields;
    }

    /**
     * @private
     */
    function _getUserConfigCriteria() {
        const criteria = new Shopware.Data.Criteria();

        // criteria.addFilter(Shopware.Data.Criteria.equals('key', KEY_USER_SEARCH_PREFERENCE));
        criteria.addFilter(Shopware.Data.Criteria.equals('userId', _getCurrentUser()?.id));

        return criteria;
    }

    /**
     * @private
     */
    function _getCurrentUser() {
        return Shopware.State.get('session').currentUser;
    }

    /**
     * @private
     */
    function _getFields(data) {
        const fieldsGroup = {};

        Object.entries(data).forEach(([key, value]) => {
            const fields = _flattenFields(value, `${key}.`);
            _groupFields(fields, fieldsGroup);
        });

        return Object.values(fieldsGroup);
    }

    /**
     * @private
     */
    function _flattenFields(fields, prefix = '') {
        return Object.keys(fields).reduce((accumulator, currentValue) => {
            if (typeof fields[currentValue] === 'object') {
                return [...accumulator, ..._flattenFields(fields[currentValue], `${prefix + currentValue}.`)];
            }

            if (typeof fields[currentValue] === 'number') {
                return accumulator;
            }

            const fieldName = prefix.substring(0, prefix.length - 1);
            return [...accumulator, { fieldName, ...fields }];
        }, []);
    }

    /**
     * @private
     */
    function _groupFields(fields, fieldsGroup) {
        [...fields].forEach((item) => {
            let lastFieldName = item.fieldName.slice(item.fieldName.lastIndexOf('.') + 1);
            if (item.fieldName.includes('tags.name')) {
                lastFieldName = 'tagsName';
            }
            if (item.fieldName.includes('country.name')) {
                lastFieldName = 'countryName';
            }
            if (item.fieldName.includes('mediaFolder.name')) {
                lastFieldName = 'mediaFolderName';
            }

            fieldsGroup[lastFieldName] ??= {
                group: [],
                fieldName: lastFieldName,
                _colourchange: item._colourchange,
                _score: item._score,
            };

            fieldsGroup[lastFieldName].group.push(item);
        });
    }
}
