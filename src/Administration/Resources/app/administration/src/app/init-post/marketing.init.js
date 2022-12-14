// eslint-disable-next-line sw-deprecation-rules/private-feature-declarations
export default function initMarketing() {
    Shopware.Application.viewInitialized.then(() => {
        const marketingService = Shopware.Service('marketingService');

        marketingService.getActiveDiscountCampaigns().then((campaign) => {
            Shopware.State.commit('marketing/setCampaign', campaign);
        });
    });
}
