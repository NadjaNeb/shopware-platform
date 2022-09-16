import template from './sw-profile-index-additional-settings.html.twig';
import './sw-profile-index-additional-settings.scss';

const { Component, Module, State, Mixin } = Shopware;

// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
Component.register('sw-profile-index-additional-settings', {
    template,

    mixins: [
    ],

    data() {
        return {
            isLoading: false,
        };
    },

    computed: {
    },

    created() {
    },

    beforeDestroy() {
    },

    methods: {
    },
});
