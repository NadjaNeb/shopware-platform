<?php declare(strict_types=1);

namespace Shopware\Core\Checkout\Customer\SalesChannel;

use Doctrine\DBAL\Connection;
use OpenApi\Annotations as OA;
use Shopware\Core\Checkout\Cart\Exception\CustomerNotLoggedInException;
use Shopware\Core\Checkout\Customer\Event\WishlistMergedEvent;
use Shopware\Core\Checkout\Customer\Exception\CustomerWishlistNotActivatedException;
use Shopware\Core\Defaults;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\MultiFilter;
use Shopware\Core\Framework\Plugin\Exception\DecorationPatternException;
use Shopware\Core\Framework\Routing\Annotation\RouteScope;
use Shopware\Core\Framework\Routing\Annotation\Since;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Framework\Validation\DataBag\RequestDataBag;
use Shopware\Core\System\SalesChannel\Entity\SalesChannelRepositoryInterface;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Shopware\Core\System\SalesChannel\SuccessResponse;
use Shopware\Core\System\SystemConfig\SystemConfigService;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @internal (flag:FEATURE_NEXT_10549)
 *
 * @RouteScope(scopes={"store-api"})
 */
class MergeWishlistProductsRoute extends AbstractMergeWishlistProducts
{
    /**
     * @var EntityRepositoryInterface
     */
    private $wishlistRepository;

    /**
     * @var SalesChannelRepositoryInterface
     */
    private $productRepository;

    /**
     * @var SystemConfigService
     */
    private $systemConfigService;

    /**
     * @var EventDispatcherInterface
     */
    private $eventDispatcher;

    /**
     * @var Connection
     */
    private $connection;

    public function __construct(
        EntityRepositoryInterface $wishlistRepository,
        SalesChannelRepositoryInterface $productRepository,
        SystemConfigService $systemConfigService,
        EventDispatcherInterface $eventDispatcher,
        Connection $connection
    ) {
        $this->wishlistRepository = $wishlistRepository;
        $this->productRepository = $productRepository;
        $this->systemConfigService = $systemConfigService;
        $this->eventDispatcher = $eventDispatcher;
        $this->connection = $connection;
    }

    public function getDecorated(): AbstractMergeWishlistProducts
    {
        throw new DecorationPatternException(self::class);
    }

    /**
     * @Since("6.3.4.0")
     * @OA\Post(
     *      path="/customer/wishlist/merge",
     *      summary="Merge wishlist products from anonymous users to registered users",
     *      operationId="mergeProductOnWishlist",
     *      tags={"Store API", "Wishlist"},
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(
     *              @OA\Property(
     *                  property="productIds",
     *                  description="List product id",
     *                  type="array",
     *                  @OA\Items(type="string", format="uuid", description="product id"),
     *              )
     *          )
     *      ),
     *      @OA\Response(
     *          response="200",
     *          description="Success",
     *          @OA\JsonContent(ref="#/definitions/SuccessResponse")
     *     )
     * )
     * @Route("/store-api/v{version}/customer/wishlist/merge", name="store-api.customer.wishlist.merge", methods={"POST"})
     */
    public function merge(RequestDataBag $data, SalesChannelContext $context): SuccessResponse
    {
        if (!$this->systemConfigService->get('core.cart.wishlistEnabled', $context->getSalesChannel()->getId())) {
            throw new CustomerWishlistNotActivatedException();
        }

        $customer = $context->getCustomer();
        if ($customer === null) {
            throw new CustomerNotLoggedInException();
        }

        $wishlistId = $this->getWishlistId($context, $customer->getId());

        $upsertData = $this->buildUpsertProducts($data, $wishlistId, $context);

        $this->wishlistRepository->upsert([[
            'id' => $wishlistId,
            'customerId' => $customer->getId(),
            'salesChannelId' => $context->getSalesChannel()->getId(),
            'products' => $upsertData,
        ]], $context->getContext());

        $this->eventDispatcher->dispatch(new WishlistMergedEvent($upsertData, $context));

        return new SuccessResponse();
    }

    private function getWishlistId(SalesChannelContext $context, string $customerId): string
    {
        $criteria = new Criteria();
        $criteria->setLimit(1);
        $criteria->addFilter(new MultiFilter(MultiFilter::CONNECTION_AND, [
            new EqualsFilter('customerId', $customerId),
            new EqualsFilter('salesChannelId', $context->getSalesChannel()->getId()),
        ]));

        $wishlistIds = $this->wishlistRepository->searchIds($criteria, $context->getContext());

        return $wishlistIds->firstId() ?? Uuid::randomHex();
    }

    private function buildUpsertProducts(RequestDataBag $data, string $wishlistId, SalesChannelContext $context): array
    {
        $ids = array_unique(array_filter($data->get('productIds')->all()));

        $ids = $this->productRepository->searchIds(new Criteria($ids), $context)->getIds();

        $customerProducts = $this->loadCustomerProducts($wishlistId, $ids);

        $now = (new \DateTime())->sub(new \DateInterval('PT2H'));

        $upsertData = [];

        /** @var string $id * */
        foreach ($ids as $id) {
            if (array_key_exists($id, $customerProducts)) {
                $upsertData[] = [
                    'id' => $customerProducts[$id],
                ];

                continue;
            }

            $upsertData[] = array_filter([
                'id' => Uuid::randomHex(),
                'productId' => $id,
                'productVersionId' => Defaults::LIVE_VERSION,
                'createdAt' => $now->format(Defaults::STORAGE_DATE_TIME_FORMAT),
            ]);
        }

        return $upsertData;
    }

    private function loadCustomerProducts(string $wishlistId, array $productIds): array
    {
        $query = $this->connection->createQueryBuilder();
        $query->select([
            'LOWER(HEX(`product_id`)) as `product_id`',
            'LOWER(HEX(`id`)) as id',
        ]);
        $query->from('`customer_wishlist_product`');
        $query->where('`customer_wishlist_id` = :id');
        $query->andWhere('`product_id` IN (:productIds)');
        $query->setParameter('id', Uuid::fromHexToBytes($wishlistId));
        $query->setParameter('productIds', Uuid::fromHexToBytesList($productIds), Connection::PARAM_STR_ARRAY);

        return $query->execute()->fetchAll(\PDO::FETCH_KEY_PAIR);
    }
}
