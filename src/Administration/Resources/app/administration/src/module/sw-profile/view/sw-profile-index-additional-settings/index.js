import template from './sw-profile-index-additional-settings.html.twig';
import './sw-profile-index-additional-settings.scss';

const { Component, Module, State, Mixin } = Shopware;

// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
Component.register('sw-profile-index-additional-settings', {
    template,

    inject: ['additionalSettingsService'],

    mixins: [
        Mixin.getByName('notification'),
    ],

    data() {
        return {
            isLoading: false,
        };
    },

    computed: {
        additionalSettings: {
            get() {
                return State.get('swProfile').additionalSettings;
            },
            set(additionalSettings) {
                State.commit('swProfile/setAdditionalSettings', additionalSettings);
            },
        },

        userAdditionalSettings: {
            get() {
                return State.get('swProfile').userAdditionalSettings;
            },
            set(userAdditionalSettings) {
                State.commit('swProfile/setUserAdditionalSettings', userAdditionalSettings);
            },
        },

        defaultAdditionalSettings() {
            const defaultAdditionalSettings = this.additionalSettingsService.getDefaultAdditionalSettings();

            if (this.userAdditionalSettings === null) {
                return defaultAdditionalSettings;
            }

            return defaultAdditionalSettings.reduce((accumulator, currentValue) => {
                const value = this.userAdditionalSettings.find((item) => {
                    return Object.keys(item)[0] === Object.keys(currentValue)[0];
                });

                accumulator.push(value || currentValue);

                return accumulator;
            }, []);
        },
    },

    created() {
        this.createdComponent();
    },

    beforeDestroy() {
    },

    methods: {
        createdComponent() {
            this.getDataSource();
            // this.addEventListeners();
        },

        async getDataSource() {
            console.log('loading');
            this.isLoading = true;

            try {
                this.userAdditionalSettings = await this.additionalSettingsService.getUserAdditionalSettings();
                this.additionalSettings = this.additionalSettingsService.processAdditionalSettings(
                    this.defaultAdditionalSettings,
                );
            } catch (error) {
                this.createNotificationError({ message: error.message });
                this.additionalSettings = [];
                this.userAdditionalSettings = null;
            } finally {
                this.isLoading = false;
            }
        },

        onChangeAdditionalSettings(additionalSettings) {
            if (additionalSettings._colourchange && additionalSettings.fields.every((field) => !field._colourchange)) {
                additionalSettings.fields.forEach((field) => {
                    field._colourchange = true;
                    console.log('change? ' .field._colourchange);
                });
            }
        },

        onSelect(event) {
            this.additionalSettings.forEach((additionalSettings) => {
                additionalSettings._colourchange = event;
                additionalSettings.fields.forEach((field) => {
                    field._colourchange = event;
                });
            });
        },

        //maybe add onReset

        resetAdditionalSettings(toReset, additionalSettings) {
            additionalSettings._colourchange = toReset._colourchange;
            additionalSettings.fields = additionalSettings.fields.map((field) => {
                return toReset.fields.find((item) => item.fieldName === field.fieldName) || field;
            });
        },
    },
});
