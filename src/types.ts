export namespace Gelato {
  export interface Config {
    apiKey: string;
  }

  export interface ListResponse<T> {
    data: T[];
    pagination: { total: number; offset: number };
  }

  export interface ProductCatalog {
    catalogUid: string;
    title: string;
    productAttributes: ProductAttribute[];
  }
  export interface ProductAttribute {
    productAttributeUid: string;
    title: string;
    values: ProductAttributeValue[];
  }
  export interface ProductAttributeValue {
    productAttributeValueUid: string;
    title: string;
  }
  export interface MeasureUnit {
    value: number;
    measureUnit: string;
  }
  interface ProductBase {
    productUid: string;
    attributes: { [name: string]: string };
    weight: MeasureUnit;
    supportedCountries: string[];
  }
  export interface Product extends ProductBase {
    notSupportedCountries: string[];
    isStockable: boolean;
    isPrintable: boolean;
    validPageCounts?: number[];
  }
  export interface ProductSearch extends ProductBase {
    dimensions: {
      Width?: MeasureUnit;
      Height?: MeasureUnit;
      Thickness?: MeasureUnit;
      [size: string]: MeasureUnit | undefined;
    };
  }

  export interface ProductCoverDimension {
    productUid: string;
    pagesCount: number; // Renamed from pageCount to match Product API v3 docs
    measureUnit: string;
    wraparoundInsideSize?: ProductDimensionAttribute;
    wraparoundEdgeSize?: ProductDimensionAttribute;
    contentBackSize?: ProductDimensionAttribute;
    jointBackSize?: ProductDimensionAttribute;
    spineSize?: ProductDimensionAttribute;
    jointFrontSize?: ProductDimensionAttribute;
    contentFrontSize?: ProductDimensionAttribute;
    bleedSize?: ProductDimensionAttribute;
  }
  export interface ProductDimensionAttribute {
    width: number;
    height: number;
    left: number;
    top: number;
    thickness?: number;
  }
  export interface ProductPrice {
    productUid: string;
    country: string;
    currency: string;
    quantity: number;
    price: number;
    pageCount?: number;
  }
  export interface ProductAvailability {
    productUid: string;
    availability: Availability[];
  }
  export interface Availability {
    stockRegionUid: string;
    status: AvailabilityStatus;
    replenishmentDate?: string;
  }
  export type AvailabilityStatus =
    | 'in-stock'
    | 'out-of-stock-replenishable'
    | 'out-of-stock'
    | 'non-stockable'
    | 'not-supported';

  export interface ShipmentMethod {
    // Based on Shipment API v1
    shipmentMethodUid: string;
    type: ShipmentType; // "normal", "express", "pallet"
    name: string;
    isBusiness: boolean;
    isPrivate: boolean;
    hasTracking: boolean;
    supportedCountries: string[]; // ISO 3166-1 alpha-2
  }

  export type ShipmentType = 'normal' | 'express' | 'pallet';

  export type OrderType = 'draft' | 'order';

  export type OrderFulfillmentStatus =
    | 'created'
    | 'uploading'
    | 'passed'
    | 'in_production'
    | 'printed'
    | 'draft'
    | 'failed'
    | 'canceled'
    | 'pending_approval'
    | 'pending_personalization'
    | 'digitizing'
    | 'not_connected'
    | 'on_hold'
    | 'shipped'
    | 'in_transit'
    | 'delivered'
    | 'returned';

  export type OrderFinancialStatus =
    | 'draft'
    | 'pending'
    | 'invoiced'
    | 'to_be_invoiced'
    | 'paid'
    | 'canceled'
    | 'partially_refunded'
    | 'refunded'
    | 'refused';

  export interface OrderCreateRequest {
    // Aligned with v4 "Create order"
    orderType?: OrderType;
    orderReferenceId: string;
    customerReferenceId: string;
    currency: string;
    items: OrderItemRequest[];
    metadata?: Metadata[];
    shippingAddress: OrderShippingAddress;
    shipmentMethodUid?: string; // Can be general type like 'express' or specific UID, comma-separated for multiple fallbacks
    returnAddress?: OrderReturnAddress;
  }

  export interface Order extends OrderCreateRequest {
    // Aligned with v4 "Get order" response
    id: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    financialStatus: OrderFinancialStatus;
    channel: string;
    storeId?: string;
    createdAt: string;
    updatedAt: string;
    orderedAt: string;
    items: OrderItem[];
    shipment?: OrderShipment;
    billingEntity?: OrderBillingEntity;
    receipts: OrderReceipt[];
    connectedOrderIds?: string[];
    iossNumber?: string;
    refusalReasonCode?: string;
    refusalReason?: string; // This was in old SDK, and v4 example for create order has refusalReason/refusalReasonCode in response
    // @ts-ignore - discounts is in example response but not formal spec
    discounts?: any[];
  }

  export interface OrderItemRequest {
    // Aligned with v4 "Create order" -> "ItemObject"
    itemReferenceId: string;
    productUid: string;
    quantity: number;
    pageCount?: number;
    files?: FileObject[];
    adjustProductUidByFileTypes?: boolean;
  }

  export interface OrderItem extends OrderItemRequest {
    // Aligned with v4 "Get order" -> "ItemObject"
    id: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    processedFileUrl: string; // Can be null initially
    previews: OrderItemPreview[];
    options?: OrderItemOptions[];
    metadata?: Metadata[]; // In Order Create response example, not Get Order ItemObject spec, but often useful.
  }

  export interface FileObject {
    // Aligned with v4 "Create order" -> "File" and "Get order" -> "File"
    id?: string;
    type: string; // e.g., "default", "back", "neck-inner"
    url: string;
    threadColors?: string[];
    isVisible?: boolean;
  }

  export interface OrderItemPreview {
    // Aligned with v4 "Get order" -> "ItemPreview"
    type: string; // "preview_default", "preview_thumbnail"
    url: string;
  }

  export interface OrderItemOptions {
    // Aligned with v4 "Get order" -> "ItemOption"
    id: string;
    type: string; // e.g., "envelope"
    productUid: string;
    quantity: number;
  }

  export interface Metadata {
    // Aligned with v4 "Create order" -> "MetadataObject"
    key: string; // Max 100 chars
    value: string; // Max 100 chars
  }

  export interface OrderShippingAddress {
    // Aligned with v4 "ShippingAddressObject" (Create/Get Order)
    id?: string; // Only in Get Order response, not for Create
    firstName: string;
    lastName: string;
    companyName?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    state?: string;
    country: string; // ISO 3166-1 alpha-2
    email: string;
    phone?: string;
    isBusiness?: boolean;
    federalTaxId?: string;
    stateTaxId?: string;
    registrationStateCode?: string;
  }

  export interface OrderReturnAddress {
    // Aligned with v4 "ReturnAddressObject" (Create/Get Order)
    id?: string; // Only in Get Order response, not for Create
    companyName?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    postCode?: string;
    state?: string;
    country?: string; // ISO 3166-1 alpha-2
    email?: string;
    phone?: string;
  }

  export interface OrderBillingEntity {
    // Aligned with v4 "Get order" -> "BillingEntityObject"
    id: string;
    companyName: string;
    companyNumber?: string;
    companyVatNumber?: string;
    country: string;
    recipientName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    state?: string;
    email: string;
    phone?: string;
  }

  export interface OrderShipment {
    // Aligned with v4 "Get order" -> "ShipmentObject"
    id: string;
    shipmentMethodName: string;
    shipmentMethodUid: string;
    packagesCount: number; // Renamed from packageCount
    minDeliveryDays: number;
    maxDeliveryDays: number;
    minDeliveryDate: string; // Format YYYY-MM-DD
    maxDeliveryDate: string; // Format YYYY-MM-DD
    totalWeight: number; // In grams
    fulfillmentCountry: string; // ISO 3166-1 alpha-2
    packages: OrderShipmentPackage[];
  }

  export interface OrderShipmentPackage {
    // Aligned with v4 "Get order" -> "PackageObject"
    id: string;
    orderItemIds: string[];
    trackingCode: string;
    trackingUrl: string;
  }

  export interface OrderReceipt {
    // Aligned with v4 "Get order" -> "ReceiptObject"
    id: string;
    orderId: string;
    transactionType: string;
    currency: string;
    items: OrderReceiptItem[];
    productsPriceInitial: number;
    productsPriceDiscount: number;
    productsPrice: number;
    productsPriceVat: number;
    productsPriceInclVat: number;
    packagingPriceInitial: number;
    packagingPriceDiscount: number;
    packagingPrice: number;
    packagingPriceVat: number;
    packagingPriceInclVat: number;
    shippingPriceInitial: number;
    shippingPriceDiscount: number;
    shippingPrice: number;
    shippingPriceVat: number;
    shippingPriceInclVat: number;
    discount: number;
    discountVat: number;
    discountInclVat: number;
    totalInitial: number;
    total: number;
    totalVat: number;
    totalInclVat: number;
    // Optional fields from example, not in formal spec table but common:
    createdAt?: string;
    updatedAt?: string;
    receiptNumber?: string;
    billingEntity?: OrderBillingEntity;
    billingTag?: string;
  }

  export interface OrderReceiptItem {
    // Aligned with v4 "Get order" -> "ReceiptItemObject"
    id: string;
    receiptId: string;
    referenceId: string;
    type: string; // "product", "shipment", "packaging"
    title: string;
    currency: string;
    priceBase: string; // Spec: string
    amount: string; // Spec: string
    priceInitial: number;
    discount: number;
    price: number;
    vat: number;
    priceInclVat: number;
    createdAt: string;
    updatedAt: string;
  }

  export interface OrderSearchRequest {
    // Aligned with v4 "Search orders" -> Request
    ids?: string[];
    orderReferenceId?: string;
    orderReferenceIds?: string[];
    orderTypes?: OrderType[];
    fulfillmentStatuses?: OrderFulfillmentStatus[];
    financialStatuses?: OrderFinancialStatus[];
    channels?: string[];
    countries?: string[];
    currencies?: string[];
    search?: string;
    startDate?: string; // ISO 8601
    endDate?: string; // ISO 8601
    offset?: number;
    limit?: number;
    storeIds?: string[];
  }

  export interface OrderSearchResultItem {
    // Aligned with v4 "Search orders" -> Response -> OrderObject
    id: string;
    orderReferenceId: string;
    fulfillmentStatus: OrderFulfillmentStatus;
    financialStatus: OrderFinancialStatus;
    channel: string;
    currency?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    createdAt: string;
    updatedAt: string;
    orderedAt?: string;
    orderType: OrderType;
    connectedOrderIds?: string[];
    storeId?: string;
    totalInclVat?: string;
    itemsCount?: number;
  }

  export interface OrderSearchListResponse {
    // Aligned with v4 "Search orders" -> Response
    orders: OrderSearchResultItem[];
    // Pagination not specified in V4 Search Orders response doc.
  }

  export interface OrderQuoteRequest {
    // Aligned with v4 Quote structure (from "Search orders" example)
    // orderReferenceId: string; // Not in the POST body of /v4/orders:quote, but was in old SDK. Removed for strict V4.
    // customerReferenceId: string; // Not in V4 structure example for quote request.
    currency: string; // Required
    recipient: OrderShippingAddress; // Required. Maps to ShippingAddressObject
    products: OrderItemRequest[]; // Required. Maps to ItemObject[]
    // allowMultipleQuotes?: boolean; // Not in V4 structure example.
  }

  export interface OrderQuoteResponse {
    // Aligned with v4 Quote structure (from "Search orders" example)
    orderReferenceId: string; // The orderReferenceId sent in the original request (though not in body)
    quotes: OrderQuote[];
  }

  export interface OrderQuote {
    // Represents one quote option
    id: string; // Quote ID
    itemReferenceIds: string[];
    fulfillmentCountry: string;
    shipmentMethods: OrderQuoteShipment[];
    products: OrderQuoteProduct[];
  }

  export interface OrderQuoteShipment {
    // Aligned with v4 Quote structure -> ShipmentMethods
    name: string;
    shipmentMethodUid: string;
    price: number;
    currency: string;
    minDeliveryDays: number;
    maxDeliveryDays: number;
    minDeliveryDate: string; // Format YYYY-MM-DD
    maxDeliveryDate: string; // Format YYYY-MM-DD
    type: ShipmentType;
    isPrivate: boolean;
    isBusiness: boolean;
    totalWeight: number;
    numberOfParcels: number;
    incoTerms?: string; // Added as per V4 example
  }

  export interface OrderQuoteProduct {
    // Aligned with v4 Quote structure -> Products
    itemReferenceId: string;
    productUid: string;
    quantity: number;
    currency: string;
    price: number;
    // pageCount removed, not in V4 quote product example
  }

  export interface OrderPatchRequest {
    // Aligned with v4 "Patch draft order"
    orderType: 'order'; // Must be 'order'
    items?: OrderPatchItem[];
  }

  export interface OrderPatchItem {
    // Item for OrderPatchRequest
    id: string; // Existing order item ID
    files?: FileObject[];
  }
  // Response for Patch Order is the full `Order` object.
}
