import { hasOwnProperty } from 'src/core/service/utils/object.utils';

/**
 * @deprecated tag:v6.5.0 - will be removed, use `sw-promotion-v2` instead
 */
// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export const DiscountTypes = {
    PERCENTAGE: 'percentage',
    ABSOLUTE: 'absolute',
    FIXED: 'fixed',
    FIXED_UNIT: 'fixed_unit',
};

/**
 * @deprecated tag:v6.5.0 - will be removed, use `sw-promotion-v2` instead
 */
// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export const DiscountScopes = {
    CART: 'cart',
    DELIVERY: 'delivery',
    SET: 'set',
    SETGROUP: 'setgroup',
};

/**
 * @deprecated tag:v6.5.0 - will be removed, use `sw-promotion-v2` instead
 */
// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export const PromotionPermissions = {
    isEditingAllowed,
};


/**
 * Gets if the editing of the promotion is allowed,
 * or if its forbidden to change anything because
 * it has already been used.
 *
 * @param {Object} promotion
 */
function isEditingAllowed(promotion) {
    if (promotion === null) {
        return false;
    }

    if (promotion === undefined) {
        return false;
    }

    if (!hasOwnProperty(promotion, 'hasOrders')) {
        throw new Error('Promotion Property hasOrders does not exist. Please use the Hydrator before!');
    }

    return !promotion.hasOrders;
}

