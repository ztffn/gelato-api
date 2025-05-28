# Gelato API v.4 docs

The Gelato API is organized around REST. Our API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API errors. We use built-in HTTP features, like HTTP authentication and HTTP verbs, which are understood by off-the-shelf HTTP clients. JSON is returned by all API responses, including errors.

**Base URL:** https://order.gelatoapis.com

You authenticate your account by including your secret key in all API requests. Your API key carries privileges to create and manage your orders, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

To use your API key, you need to provide it in an `X-API-KEY` header with each call.

All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without a valid API key will also fail.

The Gelato API uses conventional HTTP response codes to indicate the success or failure of an API request. In general:
- Codes in the 2xx range indicate success.
- Codes in the 4xx range indicate a structural or data error in the request (e.g., a required parameter was omitted, shipment prices are not found, etc.).
- Codes in the 5xx range indicate an error with Gelato's API servers (these are rare).
---

# Orders

### How orders work

Gelato's Order APIs allow you to create and manage orders for fulfillment.Our version 4 APIs provide the full set of capabilities we offer. If you are using older versions of our APIs we highly recommend that you migrate to the latest version to benefit from our new developments.

### Order statuses lifecycle

The below figure illustrates how order statuses will change during a typical order lifecycle. An order can only be canceled using the [Cancel Order API](https://dashboard.gelato.com/docs/orders/v4/cancel) before it moves into production.

![alt_text](https://dashboard.gelato.com/docs/img/order-status-flow.png "Order statuses lifecycle")

Order statuses lifecycle

### Order statuses

An order will transiiton through several statuses while being processed. An order can have one of the following statuses at a point in time:

| Status | Description |
| --- | --- |
| **created** | This is the initial status of the order when it is created. |
| **uploading** | In this status Gelato is pre-processing and validating your order. |
| **passed** | The order is accepted by Gelato and will soon be sent to a print partner for fulfillment. |
| **in\_production** | Order has been accepted by the production partner successfully and the fulfillment process has started. This is a new order status introduced on March 21st, 2024. |
| **printed** | The order is printed by production partner. |
| **draft** | Orders that are not intended for immediate fulfillment will have status draft. |
| **failed** | An order will have status failed if order creation failed due to one of these reasons, such as: invalid shipping address, payment failure, one or more items in the order are not available for shipment (Out of Stock). |
| **canceled** | The order is canceled. No further actions can be taken towards the order by the merchant. |
| **pending\_approval** | The order awaits approval. The order will not be printed and sent to production if it is not approved in the Gelato dashboard. |
| **pending\_personalization** | The order is pending personalization. This is relevant for merchants using Etsy personalization and awaiting personalization of orders by end customer. |
| **digitizing** | The order is an embroidery order and is awaiting digitization. |
| **not\_connected** | These are orders imported from the merchant store for which Gelato does not have sufficient information to produce order items. To complete this order the items must be connected with Gelato. |
| **on\_hold** | The order is on hold until further action by merchant. The order gets this status after creation for various reasons. For example, one or more items are discontinued or become out of stock during the order processing. Merchant needs to take actions upon these orders to proceed towards fulfillment. This is a new order status introduced on March 21st, 2024. |
| **shipped** | The order has been passed to carrier. |
| **in\_transit** | Carrier is handling the order delivery. |
| **delivered** | The order has been delivered by carrier. |
| **returned** | The carrier tried to deliver the order but failed to do so. The order is returned to sender. |

### Split orders

Gelato optimizes the fulfillment and distribution of each of the order items in an order to ensure that your customers get their orders in the best way possible using Gelato’s global network of production hubs.

Depending on how many order items, the quantity for each of the order items, and the types of products that are included in the order the following scenarios may happen when a create order request is sent:

1.  An order is created with 1 package
2.  An order is created with multiple packages
3.  Multiple connected orders are created with one or multiple packages in each of the connected orders

Scenario 1 happens when all order items can be produced in one production hub and fit into one package.

Scenario 2 happens when all order items can be produced in one production hub but they don’t fit into one package and so require multiple packages. For example, 20 framed posters can’t be packaged together.

Scenario 3 happens when all order items can’t be produced in one production hub (more about this scenario below) or when it is more efficient to produce at multiple locations or in one location with different types of packaging and shipment needed. For example, apparel and framed posters may not be produced at the same location.

With production in 33 countries and across more than 100 hubs, there will be products that can be produced only in certain locations. When an order is placed with multiple order items, where more than one production hub is needed to fulfill the order, then the order will be split into multiple connected orders. An order can also be split into multiple connected orders due to packaging requirements such as different packaging types and stock availability. Such orders are referred to in the Gelato terminology as **Split** orders.

Available for Order Version 3 and above

`connectedOrderIds` are available from Order Version 3 and above.

When it happens you will see a non-empty array of connected order IDs returned as `connectedOrderIds` in order create/update/get API responses. Each of the connected orders will have the same `orderReferenceId` (your own system’s order ID) and unique gelato order ID. All order webhooks include `orderReferenceId`. Therefore you can aggregate the Gelato order information into your order in your system. Webhooks are sent on both the order level and order item level.

### Example of split orders

Below is an example of orders being split across multiple production hubs.

#### Example

Request to create an order with `orderReferenceId` 83831IAKD2 that contains:

*   1 poster. `itemReferenceId`: poster-13x18
*   1 phone case. `itemReferenceId`: phone-case
*   1 mug. `itemReferenceId`: mug-15-oz

The order is split into 2 connected orders:

*   Order 1: the poster will be produced in location 1
    *   `orderReferenceId`: 83831IAKD2
    *   `orderId`: c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8
    *   Items:
        *   `itemReferenceId`: poster-13x18
*   Order 2: the phone case and mug are produced in location 2.
    *   `orderReferenceId`: 83831IAKD2
    *   `orderId`: 2b8b2b0d-1383-44ac-a650-17619b30a0dc
    *   Items:
        *   `itemReferenceId`: phone-case
        *   `itemReferenceId`: mug-15-oz

![alt_text](https://dashboard.gelato.com/docs/img/connected-orders-flowchart.svg "Flowchart for connected orders")

**Order Create Request:**

```
{
        "orderReferenceId": "83831IAKD2",
        "customerReferenceId": "913818322",
        "currency": "USD",
        "items": [
            {
                "itemReferenceId": "poster-13x18",
                "productUid": "flat_130x180-mm-5r_170-gsm-65lb-uncoated_4-0_ver",
                "files": [ {
                    "type": "default",
                    "url": "https://www.dropbox.com/s/u9zyzxqhnzhwrea/sea-green-girl.png?dl=1"
                    }
                ],
                "quantity": 1
            },
            {
                "itemReferenceId": "phone-case",
                "productUid": "phonecase_apple_iphone-13promax_flexi_transparent_satin",
                "files": [ {
                    "type": "default",
                    "url": "https://www.dropbox.com/s/u9zyzxqhnzhwrea/sea-green-girl.png?dl=1"
                    }
                ],
                "quantity": 1
            },
            {
                "itemReferenceId": "mug-15-oz",
                "productUid": "mug_product_msz_15-oz_mmat_ceramic-white_cl_4-0",
                "files": [ {
                    "type": "default",
                    "url": "https://www.dropbox.com/s/u9zyzxqhnzhwrea/sea-green-girl.png?dl=1"
                    }
                ],
                "quantity": 1
            }
        ],        
        "shipmentMethodUid": "standard",
        "shippingAddress": {
            "companyName": "Paul's company",
            "firstName": "Paul",
            "lastName": "Smith",
            "addressLine1": "451 Clarkson Ave",
            "addressLine2": "Brooklyn",
            "state": "NY",
            "city": "New York",
            "postCode": "11203",
            "country": "US",
            "email": "paul.smith@email.com",
            "phone": "123456789"
        },
        "returnAddress": {
            "companyName": "Paul's company"
        }
    }
```

**Order Create Response:**

```
{
    "id": "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
    "clientId": "74bda7b0-779e-49c6-811d-c2e180222adc",
    "orderReferenceId": "83831IAKD2",
    "customerReferenceId": "913818322",
    "fulfillmentStatus": "created",
    "financialStatus": "pending",
    "currency": "USD",
    "shippingAddress": {
        "id": "e55ad1c4-b06b-4bfb-8edb-49c256819d07",
        "orderId": "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
        "country": "US",
        "firstName": "Paul",
        "lastName": "Smith",
        "companyName": "Paul's company",
        "addressLine1": "451 Clarkson Ave",
        "addressLine2": "Brooklyn",
        "city": "New York",
        "postCode": "11203",
        "state": "NY",
        "email": "paul.smith@email.com",
        "phone": "123456789",
        "isBusiness": false,
        "federalTaxId": null,
        "stateTaxId": null,
        "registrationState": null
    },
    "items": [
        {
            "id": "03fb1150-74db-45c7-ab08-e582cdd29817",
            "itemReferenceId": "poster-13x18",
            "productUid": "flat_130x180-mm-5r_170-gsm-65lb-uncoated_4-0_ver",
            "storeProductVariantId": null,
            "storeProductId": null,
            "files": [
                {
                    "type": "default",
                    "url": "https://www.dropbox.com/s/u9zyzxqhnzhwrea/sea-green-girl.png?dl=1"
                }
            ],
            "processedFileUrl": null,
            "quantity": 1,
            "options": [],
            "category": "Posters",
            "productCategoryUid": "wall-art",
            "productTypeUid": "poster",
            "productNameUid": "classic-matte-poster",
            "productName": "Classic Matte Poster",
            "fulfillmentStatus": "created",
            "pageCount": null,
            "printJobs": [],
            "eventLog": [],
            "previews": [],
            "designId": null,
            "productFileMimeType": "",
            "finalProductUid": "flat_product_pf_5r_pt_65-lb-cover-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
            "metadata": [],
            "retailPriceInclVat": null,
            "attributes": [
                {
                    "name": "size",
                    "title": "Size",
                    "value": "130x180-mm-5R",
                    "formattedValue": "13x18cm / 5x7\""
                },
                {
                    "name": "orientation",
                    "title": "Orientation",
                    "value": "ver",
                    "formattedValue": "Vertical (portrait) orientation"
                }
            ],
            "itemReferenceName": null,
            "isIgnored": false,
            "price": 5.56,
            "customTrim": null,
            "fileUrl": "https://www.dropbox.com/s/u9zyzxqhnzhwrea/sea-green-girl.png?dl=1"
        }
    ],
    "shipment": {
        "id": "9b062e1d-223a-4fd8-ae3c-ccd0af8a44c5",
        "orderProductId": null,
        "shippingAddressId": "e55ad1c4-b06b-4bfb-8edb-49c256819d07",
        "promiseUid": "d_0c64b4318dcbdb7b73cb75e0",
        "packageCount": 1,
        "shipmentMethodUid": "fed_ex_smart_post",
        "shipmentMethodName": "SmartPost",
        "isCheapest": true,
        "minDeliveryDays": 7,
        "maxDeliveryDays": 7,
        "minDeliveryDate": "2022-11-10",
        "maxDeliveryDate": "2022-11-10",
        "totalWeight": 149,
        "price": 4.28,
        "status": null,
        "packages": [],
        "fulfillmentCountry": "US",
        "fulfillmentFacilityId": "1342be08-6169-4163-95be-8ddabfc6e6c5",
        "retailShippingPriceInclVat": null
    },
    "receipts": [
        {
            "id": "51e0d059-de61-4e17-afc7-522b4fdce950",
            "orderId": "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
            "type": "contract",
            "currency": "USD",
            "items": [
                {
                    "id": "7f09eba1-4eee-4569-91cb-96a3bb7c7403",
                    "receiptId": "51e0d059-de61-4e17-afc7-522b4fdce950",
                    "orderId": null,
                    "clientId": "74bda7b0-779e-49c6-811d-c2e180222adc",
                    "type": "product",
                    "referenceId": "03fb1150-74db-45c7-ab08-e582cdd29817",
                    "title": "1x flat_130x180-mm-5r_170-gsm-65lb-uncoated_4-0_ver",
                    "currency": "USD",
                    "priceBase": 5.562871,
                    "amount": 1,
                    "priceInitial": 5.56,
                    "discount": 0,
                    "price": 5.56,
                    "vat": 0.49,
                    "priceInclVat": 6.05,
                    "pricePlanId": "f2d4a4c4-7183-412e-a3c9-ea39c9fca37e",
                    "createdAt": "2022-11-03T12:03:51+00:00",
                    "updatedAt": "2022-11-03T12:03:51+00:00"
                },
                {
                    "id": "32087216-dc42-4b18-b729-ecdd814d04f0",
                    "receiptId": "51e0d059-de61-4e17-afc7-522b4fdce950",
                    "orderId": null,
                    "clientId": "74bda7b0-779e-49c6-811d-c2e180222adc",
                    "type": "shipment",
                    "referenceId": "9b062e1d-223a-4fd8-ae3c-ccd0af8a44c5",
                    "title": "Delivery using SmartPost",
                    "currency": "USD",
                    "priceBase": 4.28,
                    "amount": 1,
                    "priceInitial": 4.28,
                    "discount": 1.28,
                    "price": 3,
                    "vat": 0.27,
                    "priceInclVat": 3.27,
                    "pricePlanId": null,
                    "createdAt": "2022-11-03T12:03:51+00:00",
                    "updatedAt": "2022-11-03T12:03:51+00:00"
                },
                {
                    "id": "8aba8818-fdac-4c3c-820d-30bf13cf7d5f",
                    "receiptId": "51e0d059-de61-4e17-afc7-522b4fdce950",
                    "orderId": null,
                    "clientId": "74bda7b0-779e-49c6-811d-c2e180222adc",
                    "type": "packaging",
                    "referenceId": "9b062e1d-223a-4fd8-ae3c-ccd0af8a44c5",
                    "title": "Packaging",
                    "currency": "USD",
                    "priceBase": 0,
                    "amount": 1,
                    "priceInitial": 0,
                    "discount": 0,
                    "price": 0,
                    "vat": 0,
                    "priceInclVat": 0,
                    "pricePlanId": null,
                    "createdAt": "2022-11-03T12:03:51+00:00",
                    "updatedAt": "2022-11-03T12:03:51+00:00"
                }
            ],
            "createdAt": "2022-11-03T12:03:51+00:00",
            "updatedAt": "2022-11-03T12:03:51+00:00",
            "receiptNumber": "005-0005435088",
            "billingEntity": {
                "id": 533,
                "companyName": "PineApple Print 14",
                "companyNumber": "",
                "companyVatNumber": "",
                "companyVatNumbers": [],
                "countryIsoCode": "NO",
                "country": "NO",
                "recipientName": "Styrbjörn Holmberg",
                "addressLine1": "Lindebergåsen 32A",
                "addressLine2": null,
                "city": "Oslo",
                "postCode": "1068",
                "stateCode": "",
                "state": "",
                "email": "styrbjorn+pa-print14@gelato.com",
                "phone": "+47 939 78 761",
                "currencyIsoCode": "EUR",
                "currency": "EUR",
                "status": 1,
                "iossNumber": null
            },
            "billingTag": "gelato-norway-us",
            "transactionType": "purchase",
            "productsPriceInitial": 5.56,
            "productsPriceDiscount": 0,
            "productsPrice": 5.56,
            "productsPriceVat": 0.49,
            "productsPriceInclVat": 6.05,
            "shippingPriceInitial": 4.28,
            "shippingPriceDiscount": 1.28,
            "shippingPrice": 3,
            "shippingPriceVat": 0.27,
            "shippingPriceInclVat": 3.27,
            "packagingPriceInitial": 0,
            "packagingPriceDiscount": 0,
            "packagingPrice": 0,
            "packagingPriceVat": 0,
            "packagingPriceInclVat": 0,
            "discount": 1.28,
            "discountVat": 0,
            "discountInclVat": 0,
            "totalInitial": 9.84,
            "total": 8.56,
            "totalVat": 0.76,
            "totalInclVat": 9.32
        }
    ],
    "createdAt": "2022-11-03T12:03:51+00:00",
    "refusalReason": null,
    "channel": "api",
    "storeId": null,
    "orderedByUserId": null,
    "orderType": "order",
    "metadata": [],
    "billingEntity": {
        "id": 533,
        "companyName": "PineApple Print 14",
        "companyNumber": "",
        "companyVatNumber": "",
        "companyVatNumbers": [],
        "countryIsoCode": "NO",
        "country": "NO",
        "recipientName": "Styrbjörn Holmberg",
        "addressLine1": "Lindebergåsen 32A",
        "addressLine2": null,
        "city": "Oslo",
        "postCode": "1068",
        "stateCode": "",
        "state": "",
        "email": "styrbjorn+pa-print14@gelato.com",
        "phone": "+47 939 78 761",
        "currencyIsoCode": "EUR",
        "currency": "EUR",
        "status": 1,
        "iossNumber": null
    },
    "retailCurrency": null,
    "paymentMethodType": null,
    "paymentMethodId": null,
    "orderedAt": "2022-11-03T12:03:48+00:00",
    "updatedAt": "2022-11-03T12:03:51+00:00",
    "connectedOrderIds": [
        "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
        "2b8b2b0d-1383-44ac-a650-17619b30a0dc"
    ],
    "discounts": [
        {
            "id": "017dfb40-bb97-4671-9ff6-33ac45c5a863",
            "type": "promotion",
            "code": null,
            "discountId": "promo_M1Gkvk1vRfpcdxBYYoxpKU0M",
            "title": "30% off shipping",
            "expireAt": null,
            "status": "validated"
        }
    ],
    "returnAddress": {
        "id": "986a143d-3e32-4c2d-9083-055f524cecdf",
        "country": null,
        "addressLine1": null,
        "addressLine2": null,
        "city": null,
        "postCode": null,
        "state": null,
        "email": null,
        "phone": null,
        "companyName": "Paul's company"
    },
    "iossNumber": null,
    "refusalReasonCode": null
}
```

### Webhooks

Webhooks are sent for each of the orders and each order item. Each webhook contains both the orderId (the order id generated by Gelato) and the `orderReferenceId` (your system’s order id).

**Order Status Updated Webhook**

The example above will result in 2 “order\_status\_updated” webhooks fired by Gelato for each of the connected orders.

1) For part 1 out of 2 (Order ID: c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8)

```
{
  "id": "os_3193599927",
  "event": "order_status_updated",
  "orderId": "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
  "storeId": null,
  "items": [
    {
      "itemReferenceId": "poster-13x18",
      "fulfillmentStatus": "passed",
      "fulfillments": []
    }
  ],
  "orderReferenceId": "83831IAKD2",
  "comment": "",
  "fulfillmentStatus": "passed"
}
```

2) For part 2 out of 2 (Order ID: 2b8b2b0d-1383-44ac-a650-17619b30a0dc)

```
{
  "id": "os_3193599928",
  "event": "order_status_updated",
  "orderId": "2b8b2b0d-1383-44ac-a650-17619b30a0dc",
  "storeId": null,
  "items": [
    {
      "itemReferenceId": "phone-case",
      "fulfillmentStatus": "passed",
      "fulfillments": []
    },
    {
      "itemReferenceId": "mug-15-oz",
      "fulfillmentStatus": "passed",
      "fulfillments": []
    }
  ],
  "orderReferenceId": "83831IAKD2",
  "comment": "",
  "fulfillmentStatus": "passed"
}
```

**Order Item Status Updated Webhook**

The **order\_item\_status\_updated** webhook event gives updates on item level. It includes the `orderReferenceId` (your system's order ID) and also `orderId` (Gelato's internal order ID). The `orderReferenceId` will be the same for all items that came from the original request. The `orderId` will be different based on which of the connected orders it is from.

1) For poster-13x18

```
{
  "id": "os_3193599925",
  "event": "order_item_status_updated",
  "itemReferenceId": "poster-13x18",
  "orderReferenceId": "83831IAKD2",
  "orderId": "c3c8f7f5-a0e8-4014-a3fb-38a5375d2af8",
  "storeId": null,
  "fulfillmentCountry": "US",
  "fulfillmentStateProvince": "NY",
  "fulfillmentFacilityId": "21315db8-e694-4ded-a72a-98f60814c6e8",
  "status": "passed",
  "comment": "",
  "created": "2018-08-03T07:26:52+00:00"
}
```

2) For phone-case

```
{
  "id": "os_3193599926",
  "event": "order_item_status_updated",
  "itemReferenceId": "phone-case",
  "orderReferenceId": "83831IAKD2",
  "orderId": "2b8b2b0d-1383-44ac-a650-17619b30a0dc",
  "storeId": null,
  "fulfillmentCountry": "US",
  "fulfillmentStateProvince": "NY",
  "fulfillmentFacilityId": "21315db8-e694-4ded-a72a-98f60814c6e8",
  "status": "passed",
  "comment": "",
  "created": "2018-08-03T07:26:52+00:00"
}
```

3) For mug-15-oz

```
{
  "id": "os_3193599927",
  "event": "order_item_status_updated",
  "itemReferenceId": "mug-15-oz",
  "orderReferenceId": "83831IAKD2",
  "orderId": "2b8b2b0d-1383-44ac-a650-17619b30a0dc",
  "storeId": null,
  "fulfillmentCountry": "US",
  "fulfillmentStateProvince": "NY",
  "fulfillmentFacilityId": "21315db8-e694-4ded-a72a-98f60814c6e8",
  "status": "passed",
  "comment": "",
  "created": "2018-08-03T07:26:52+00:00"
}

```
# API v.4 References

## Create order

Use the Order create API to create an order in 1 request.

`POST https://order.gelatoapis.com/v4/orders`

#### Request example

```
$ curl -X POST \
   https://order.gelatoapis.com/v4/orders \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}' \
   -d '{
        "orderType": "order",
        "orderReferenceId": "{{myOrderId}}",
        "customerReferenceId": "{{myCustomerId}}",
        "currency": "USD",
        "items": [
            {
                "itemReferenceId": "{{myItemId1}}",
                "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
                "files": [
                  {
                    "type": "default",
                    "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
                  },
                  {
                    "type":"back",
                    "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
                  }
                ],
                "quantity": 1
            }
        ],        
        "shipmentMethodUid": "express",
        "shippingAddress": {
            "companyName": "Example",
            "firstName": "Paul",
            "lastName": "Smith",
            "addressLine1": "451 Clarkson Ave",
            "addressLine2": "Brooklyn",
            "state": "NY",
            "city": "New York",
            "postCode": "11203",
            "country": "US",
            "email": "apisupport@gelato.com",
            "phone": "123456789"
        },
        "returnAddress": {
            "companyName": "My company",
            "addressLine1": "3333 Saint Marys Avenue",
            "addressLine2": "Brooklyn",
            "state": "NY",
            "city": "New York",
            "postCode": "13202",
            "country": "US",
            "email": "apisupport@gelato.com",
            "phone": "123456789"
        },
        "metadata": [
            {
                "key":"keyIdentifier1",
                "value":"keyValue1"
            },
            {
                "key":"keyIdentifier2",
                "value":"keyValue2"
            }
        ]
    }'
```

#### Response example

```
{
  "id": "37365096-6628-4538-a9c2-fbf9892deb85",
  "orderType": "order",
  "orderReferenceId": "{{myOrderId}}",
  "customerReferenceId": "{{myCustomerId}}",
  "fulfillmentStatus": "printed",
  "financialStatus": "paid",
  "currency": "USD",
  "channel": "api",
  "createdAt": "2021-01-14T12:30:03+00:00",
  "updatedAt": "2021-01-14T12:32:03+00:00",
  "orderedAt": "2021-01-14T12:32:03+00:00",
  "items": [
    {
      "id": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
      "itemReferenceId": "{{myItemId1}}",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
      "files": [
        {
          "type": "default",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        },
        {
          "type": "back",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        }
      ],
      "processedFileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_processed",
      "quantity": 1,
      "fulfillmentStatus": "printed",
      "previews": [
        {
          "type": "preview_default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/preview_default"
        }
      ]
    }
  ],
  "metadata": [
    {
      "key": "keyIdentifier1",
      "value": "keyValue1"
    },
    {
      "key": "keyIdentifier2",
      "value": "keyValue2"
    }
  ],
  "shipment": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "shipmentMethodName": "UPS Surepost",
    "shipmentMethodUid": "ups_surepost",
    "minDeliveryDays": 6,
    "maxDeliveryDays": 7,
    "minDeliveryDate": "2019-08-29",
    "maxDeliveryDate": "2019-08-30",
    "totalWeight": 613,
    "fulfillmentCountry": "US",
    "packagesCount": 1,
    "packages": [
      {
        "id": "4a771ca0-7de4-4f0b-a7d4-9c952093af6c",
        "orderItemIds": [
          "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "13c165fe-de51-4ea9-86e6-98503ae14486"
        ],
        "trackingCode": "12345678990",
        "trackingUrl": "http://test.tracking.url"
      }
    ]
  },
  "billingEntity": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "companyName": "Example",
    "companyNumber": "Example Number",
    "companyVatNumber": "Example VAT1234567890",
    "country": "US",
    "recipientName": "Paul Smith",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "shippingAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56a",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "country": "US",
    "firstName": "Paul",
    "lastName": "Smith",
    "companyName": "Example",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "returnAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56b",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "lastName": "Draker",
    "addressLine1": "3333 Saint Marys Avenue",
    "addressLine2": "Brooklyn",
    "state": "NY",
    "city": "New York",
    "postCode": "13202",
    "country": "US",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "receipts": [
    {
      "id": "c74447e5-c543-4baf-8239-3620422b8d81",
      "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
      "transactionType": "purchase",
      "currency": "USD",
      "items": [
        {
          "id": "b65bb8f3-c2a3-425e-a366-7e19c32c93e2",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "3126e362-8369-4900-bcd3-6990d373b69c",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "13c165fe-de51-4ea9-86e6-98503ae14486",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "762f3563-ff24-4d4e-b6c7-fee19bfc878b",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "shipment",
          "title": "Delivery using SmartPost",
          "currency": "USD",
          "priceBase": 4.91,
          "amount": 1,
          "priceInitial": 4.91,
          "discount": 0,
          "price": 4.91,
          "vat": 0.3,
          "priceInclVat": 5.21,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "bb4c9eee-91a0-44a1-8ee0-a3cef29820f1",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "packaging",
          "title": "Packaging",
          "currency": "USD",
          "priceBase": 1.7,
          "amount": 1,
          "priceInitial": 1.7,
          "discount": 0,
          "price": 1.7,
          "vat": 0.1,
          "priceInclVat": 1.8,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        }
      ],
      "productsPriceInitial": 24.94,
      "productsPriceDiscount": 0,
      "productsPrice": 24.94,
      "productsPriceVat": 1.5,
      "productsPriceInclVat": 26.44,
      "packagingPriceInitial": 1.7,
      "packagingPriceDiscount": 0,
      "packagingPrice": 1.7,
      "packagingPriceVat": 0.1,
      "packagingPriceInclVat": 1.8,
      "shippingPriceInitial": 4.91,
      "shippingPriceDiscount": 0,
      "shippingPrice": 4.91,
      "shippingPriceVat": 0.3,
      "shippingPriceInclVat": 5.21,
      "discount": 0,
      "discountVat": 0,
      "discountInclVat": 0,
      "totalInitial": 31.55,
      "total": 31.55,
      "totalVat": 1.9,
      "totalInclVat": 33.45
    }
  ]
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **orderType** _(optional)_ | string | Type of the order. Draft orders can be edited from the dashboard and they don't go into production until you decide to convert draft into a regular order via UI or programmatically via [Order Patch API](https://dashboard.gelato.com/docs/orders/v4/create/#patch). It can be `order` or `draft`.  <br>Default value: `order`. |
| **orderReferenceId** _(required)_ | string | Reference to your internal order id. |
| **customerReferenceId** _(required)_ | string | Reference to your internal customer id. |
| **currency** _(required)_ | string | Currency iso code in [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) standard. Currency that the order should be charged in.  <br>Supported currencies: EUR, USD, JPY, BGN, CZK, DKK, GBP, HUF, PLN, RON, SEK, CHF, ISK, NOK, HRK, RUB, TRY, AUD, BRL, CAD, CNY, HKD, IDR, ILS, INR, KRW, MXN, MYR, NZD, PHP, SGD, THB, ZAR, CLP, AED  <br>**Note**: It is applicable only for customers using wallets or credit cards for payments. |
| **items** _(required)_ | ItemObject\[\] | A list of line item objects, each containing information about an item in the order. |
| **metadata** _(optional)_ | MetadataObject\[\] | A list of key value pair objects used for storing additional, structured information on an order. (Max number of entries: 20). |
| **shippingAddress** _(required)_ | ShippingAddressObject | Shipping address information. |
| **shipmentMethodUid** _(optional)_ | string | This parameter specifies the preferred shipping method identifier. It accepts values such as `normal`, `standard`, `express`, or a shipmentMethodUid value returned in the [Quote API](https://dashboard.gelato.com/docs/orders/v4/quote) call response. You can also pass multiple values separated by commas. If multiple values are passed, the cheapest matching shipping method will be chosen by default. If no value is provided, the system will select the cheapest available shipping method. |
| **returnAddress** _(optional)_ | ReturnAddressObject | Return address information. |

`ItemObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **itemReferenceId** _(required)_ | string | Reference to your internal order item id. Must be unique within your order. |
| **productUid** _(required)_ | string | Type of printing product in [product uid](https://dashboard.gelato.com/docs/get-started/#product-uid) format. |
| **pageCount** _(optional)_ | integer | The page count for multipage products. This parameter is only needed for multi-page products. All pages in the product, including front and back cover are included in the count. For example for a Wire-o Notebook there are 112 inner pages (56 leaves), 2 front (outer and inside) and 2 back cover (outer and inside) pages, total 116 pages. The `pageCount` is 116. [Read more](https://apigelato.zendesk.com/hc/en-us/articles/360010280579-Multipage-formats) |
| **files** _(optional)_ | File\[\] | Files that would be used to generate product file. Files are required for printable products only. Supported file formats are: PDF, PNG, TIFF, SVG and JPEG. For PDF files, please use one of the compatible [PDF/X](https://en.wikipedia.org/wiki/PDF/X) standards, for example in [PDF/X-1a:2003](https://www.iso.org/standard/39938.html) or [PDF/X-4](https://www.iso.org/standard/42876.html) standard. |
| **quantity** _(required)_ | integer | The product quantity. Defines how many copies of product should be printed. _The minimum value is 1_ |
| **adjustProductUidByFileTypes** _(optional)_ | bool | If `true`, the productUid will automatically be adjusted based on the file types submitted. |

`File`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(optional)_ | string | When you order an embroidery product, the submitted files are assigned a unique ID. This ID enables you to easily reuse the file, ultimately helping you cut down on digitization costs. |
| **type** _(conditional)_ | FileType | Defines print area where file is supposed to fill. The field is required for _Embroidery_. For DTG, the default value is "default". |
| **url** _(conditional)_ | string | A URL from where the file can be downloaded. This field is optional, if a valid ID is provided. |
| **threadColors** _(optional)_ | string\[\] | This list contains hex color codes specifically for embroidery products. You can input up to six colors. If no colors are specified, a default palette will be applied, limiting the design to 6 colors.  <br>  <br>See supported colors. |
| **isVisible** _(optional)_ | bool | Indicates whether or not this file should appear in the list of Files in the dashboard. It only applies if an Embroidery product is ordered. |

`FileType`

| Parameter | Description |
| --- | --- |
| **default** | The design is printed on the primary area of the product. For apparel, it is the front, while for folded cards, it is the cover+back pages.  <br>  <br>If you provide a multipage PDF, the number of pages should match the print areas as it will be used to print on all of them.  <br>  <br>**Note:** that for apparel, only DTG production is supported for the default type. |
| **front** | Print the file on the front of the product. |
| **back** | Print the file on the back of the product. |
| **neck-inner** | Print the file on the inner neck of the apparel product. |
| **neck-outer** | Print the file on the outer neck of the apparel product. |
| **sleeve-left** | Print the file on the left sleeve of the apparel product. |
| **sleeve-right** | Print the file on the right sleeve of the apparel product. |
| **inside** | Print the file on the inner pages of folded cards. |
| **chest-left-embroidery** | Embroider the file on the left chest of the apparel product. |
| **chest-center-embroidery** | Embroider the file on the center chest of the apparel product. |
| **chest-large-embroidery** | Embroider the file on the front of the apparel product. |
| **sleeve-left-embroidery** | Embroider the file on the left sleeve of the apparel product. |
| **sleeve-right-embroidery** | Embroider the file on the right sleeve of the apparel product. |
| **wrist-left-embroidery** | Embroider the file on the left wrist of the apparel product. |
| **wrist-right-embroidery** | Embroider the file on the right wrist of the apparel product. |

`MetadataObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **key** _(required)_ | string | A reference value to identify the metadata entry. (Max character length: 100) |
| **value** _(required)_ | string | The value assigned to the metadata entry. (Max character length: 100) |

`ShippingAddressObject`

Please note that addresses for China (CN), Japan (JP), South Korea (KR) and Russia (RU) must be entered in local language due to shipping providers' requirements. Please see detailed requirements by field below

| Parameter | Type | Description |
| --- | --- | --- |
| **firstName** _(required)_ | string | The first name of the recipient at this address.  <br>_Maximum length is 25 characters. It can be any symbol or character._ |
| **lastName** _(required)_ | string | The last name of the recipient at this address.  <br>_Maximum length is 25 characters. It can be any symbol or character._ |
| **companyName** _(optional)_ | string | The company name of the recipient at this address.  <br>_Maximum length is 60 characters. It can be any symbol or character._ |
| **addressLine1** _(required)_ | string | The first line of the address. For example, number, street, and so on.  <br>_Maximum length is 35 characters. It must be in local language for Russia (RU), China (CN), Japan (JP) and South Korea (KR) and up to 10 Latin characters are allowed._ |
| **addressLine2** _(optional)_ | string | The second line of the address. For example, suite or apartment number.  <br>_Maximum length is 35 characters. It must be in local language for Russia (RU), China (CN), Japan (JP) and South Korea (KR) and up to 10 Latin characters are allowed._ |
| **city** _(required)_ | string | The city name.  <br>_Maximum length is 30 characters. It must be in local language for Russia (RU), China (CN), Japan (JP) and South Korea (KR)._ |
| **postCode** _(required)_ | string | The postal code, which is the zip code or equivalent. Typically required for countries with a postal code or an equivalent. See [postal code](https://en.wikipedia.org/wiki/Postal_code).  <br>_Maximum length is 15 characters_ |
| **state** _(optional)_ | string | The code for a US state or the equivalent for other countries. Required for requests if the address is in one of these countries: Australia, Canada or United States.  <br>_Maximum length is 35 characters_. See [list of state codes](https://apigelato.zendesk.com/hc/en-us/articles/360013540520-Country-and-State-Codes) |
| **country** _(required)_ | string | The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |
| **email** _(required)_ | string | The email address for the recipient.  <br>_Pattern: .+@\["-\].+$_ |
| **phone** _(optional)_ | string | The phone number, in [E.123 format](https://en.wikipedia.org/wiki/E.123).  <br>_Maximum length is 25 characters_ |
| **isBusiness** _(optional)_ | bool | Boolean value, declares the recipient being a business. Use if tax for recipient country is different for private and business customers (e.g. in Brazil) to change federalTaxId field type. Mandatory for Brazil if recipient is a company. |
| **federalTaxId** _(optional)_ | string | The Federal Tax identification number of recipient. Use to provide CPF/CNPJ of a Brazilian recipient. Mandatory for Brazil. _In order to supply CNPJ instead of CPF, set isBusiness field to true._ |
| **stateTaxId** _(optional)_ | string | The State Tax identification number of recipient. Use to provide IE of a Brazilian recipient. Mandatory for Brazil if recipient is a company. _In order to supply this field, set isBusiness field to true._ |
| **registrationStateCode** _(optional)_ | string | The code number for a US state or the equivalent for other countries that defines state where recipient company is registered. Mandatory for Brazil if recipient is a company. _In order to supply this field, set isBusiness field to true._ |

`ReturnAddressObject`

Return address object allows overriding one or multiple fields within sender address of the parcel.

| Parameter | Type | Description |
| --- | --- | --- |
| **companyName** _(optional)_ | string | The company name of the recipient at return address.  <br>_Maximum length is 60 characters. It can be any symbol or character._ |
| **addressLine1** _(optional)_ | string | The first line of the address. For example, number, street, and so on.  <br>_Maximum length is 35 characters._ |
| **addressLine2** _(optional)_ | string | The second line of the address. For example, suite or apartment number.  <br>_Maximum length is 35 characters._ |
| **city** _(optional)_ | string | The city name.  <br>_Maximum length is 30 characters._ |
| **postCode** _(optional)_ | string | The postal code, which is the zip code or equivalent. See [postal code](https://en.wikipedia.org/wiki/Postal_code).  <br>_Maximum length is 15 characters_ |
| **state** _(optional)_ | string | The code for a US state or the equivalent for other countries. Required for requests if the address is in one of these countries: Australia, Canada or United States.  <br>_Maximum length is 35 characters_. See [list of state codes](https://apigelato.zendesk.com/hc/en-us/articles/360013540520-Country-and-State-Codes) |
| **country** _(optional)_ | string | The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |
| **email** _(optional)_ | string | The email address for the recipient.  <br>_Pattern: .+@\["-\].+$_ |
| **phone** _(optional)_ | string | The phone number, in [E.123 format](https://en.wikipedia.org/wiki/E.123).  <br>_Maximum length is 25 characters_ |

### Response

Response has the same structure as on [Order Get API](https://dashboard.gelato.com/docs/orders/v4/get/)


---
## Get order

Use the Order Get API to retrieve order information

`GET https://order.gelatoapis.com/v4/orders/{{orderId}}`

#### Request example

`$ curl -X GET \    https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \    -H 'Content-Type: application/json' \    -H 'X-API-KEY: {{apiKey}}'`

#### Response example

```
{
  "id": "37365096-6628-4538-a9c2-fbf9892deb85",
  "orderType": "order",
  "orderReferenceId": "{{myOrderId}}",
  "customerReferenceId": "{{myCustomerId}}",
  "fulfillmentStatus": "printed",
  "financialStatus": "paid",
  "currency": "USD",
  "channel": "api",
  "storeId": "90365096-6628-4538-a9c2-fbf9892deb46",
  "createdAt": "2021-01-14T10:32:03+00:00",
  "updatedAt": "2021-01-14T12:32:03+00:00",
  "orderedAt": "2021-01-14T12:32:03+00:00",
  "items": [
    {
      "id": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
      "itemReferenceId": "{{myItemId1}}",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
      "files": [
        {
          "type": "default",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        },
        {
          "type": "back",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        }
      ],
      "processedFileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_processed",
      "quantity": 100,
      "fulfillmentStatus": "printed",
      "previews": [
        {
          "type": "preview_default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/preview_default"
        }
      ]
    },
    {
      "id": "13c165fe-de51-4ea9-86e6-98503ae14486",
      "itemReferenceId": "{{myItemId2}}",
      "productUid": "cards_pf_5r_pt_100-lb-cover-coated-silk_cl_4-4_hor",
      "fileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_original",
      "processedFileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_processed",
      "quantity": 100,
      "fulfillmentStatus": "printed",
      "previews": [
        {
          "type": "preview_default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/preview_default"
        }
      ],
      "options": [
        {
          "id": "68a91f44-2acd-4315-a64a-74a1c2c6c90a",
          "type": "envelope",
          "productUid": "blank-envelopes_pf_a7-env_pt_120-g-env",
          "quantity": 40
        }
      ]
    }
  ],
  "shipment": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "shipmentMethodName": "UPS Surepost",
    "shipmentMethodUid": "ups_surepost",
    "minDeliveryDays": 6,
    "maxDeliveryDays": 7,
    "minDeliveryDate": "2019-08-29",
    "maxDeliveryDate": "2019-08-30",
    "totalWeight": 613,
    "fulfillmentCountry": "US",
    "packagesCount": 1,
    "packages": [
      {
        "id": "4a771ca0-7de4-4f0b-a7d4-9c952093af6c",
        "orderItemIds": [
          "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "13c165fe-de51-4ea9-86e6-98503ae14486"
        ],
        "trackingCode": "12345678990",
        "trackingUrl": "http://test.tracking.url"
      }
    ]
  },
  "billingEntity": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "companyName": "Example",
    "companyNumber": "Example Number",
    "companyVatNumber": "Example VAT1234567890",
    "country": "US",
    "recipientName": "Paul Smith",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "shippingAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56a",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "country": "US",
    "firstName": "Paul",
    "lastName": "Smith",
    "companyName": "Example",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "returnAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56b",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "companyName": "My company",
    "addressLine1": "3333 Saint Marys Avenue",
    "addressLine2": "Brooklyn",
    "state": "NY",
    "city": "New York",
    "postCode": "13202",
    "country": "US",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "receipts": [
    {
      "id": "c74447e5-c543-4baf-8239-3620422b8d81",
      "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
      "transactionType": "purchase",
      "currency": "USD",
      "items": [
        {
          "id": "b65bb8f3-c2a3-425e-a366-7e19c32c93e2",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "3126e362-8369-4900-bcd3-6990d373b69c",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "13c165fe-de51-4ea9-86e6-98503ae14486",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "762f3563-ff24-4d4e-b6c7-fee19bfc878b",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "shipment",
          "title": "Delivery using SmartPost",
          "currency": "USD",
          "priceBase": 4.91,
          "amount": 1,
          "priceInitial": 4.91,
          "discount": 0,
          "price": 4.91,
          "vat": 0.3,
          "priceInclVat": 5.21,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "bb4c9eee-91a0-44a1-8ee0-a3cef29820f1",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "packaging",
          "title": "Packaging",
          "currency": "USD",
          "priceBase": 1.7,
          "amount": 1,
          "priceInitial": 1.7,
          "discount": 0,
          "price": 1.7,
          "vat": 0.1,
          "priceInclVat": 1.8,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        }
      ],
      "productsPriceInitial": 24.94,
      "productsPriceDiscount": 0,
      "productsPrice": 24.94,
      "productsPriceVat": 1.5,
      "productsPriceInclVat": 26.44,
      "packagingPriceInitial": 1.7,
      "packagingPriceDiscount": 0,
      "packagingPrice": 1.7,
      "packagingPriceVat": 0.1,
      "packagingPriceInclVat": 1.8,
      "shippingPriceInitial": 4.91,
      "shippingPriceDiscount": 0,
      "shippingPrice": 4.91,
      "shippingPriceVat": 0.3,
      "shippingPriceInclVat": 5.21,
      "discount": 0,
      "discountVat": 0,
      "discountInclVat": 0,
      "totalInitial": 31.55,
      "total": 31.55,
      "totalVat": 1.9,
      "totalInclVat": 33.45
    }
  ],
  "connectedOrderIds": []
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **orderId** _(required)_ | string | Gelato order id. |

### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Gelato order id. |
| **orderType** _(required)_ | string | Type of the order. It can be `order` or `draft`. Draft orders can be edited from the dashboard and they don't go into production until you decide to convert draft into a regular order via UI or programmatically via [Order Patch API](https://dashboard.gelato.com/docs/orders/v4/get/#patch). |
| **orderReferenceId** _(required)_ | string | Reference to your internal order id. |
| **customerReferenceId** _(required)_ | string | Reference to your internal customer id. |
| **fulfillmentStatus** _(required)_ | string | The current order fulfillment status can be one of the statuses described under [Order statuses](https://dashboard.gelato.com/docs/orders/order_details/#order-statuses). |
| **financialStatus** _(required)_ | string | The order current financial status. Can be: `draft`, `pending`, `invoiced`, `to_be_invoiced`, `paid`, `canceled`, `partially_refunded`, `refunded` and `refused`. |
| **currency** _(required)_ | string | The order currency in iso code standard [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217). |
| **channel** _(required)_ | string | The order channel. Can be: ui, api, shopify and etsy. |
| **storeId** | string | E-commerce store ID identifying which store the order was placed in. It will be null if the order was placed via UI or API. |
| **createdAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was created. |
| **updatedAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was updated. |
| **orderedAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was placed. |
| **items** _(required)_ | ItemObject | List of order items |
| **shipment** _(optional)_ | ShipmentObject | Information about shipment |
| **billingEntity** _(optional)_ | BillingEntityObject | Billing recipient |
| **shippingAddress** _(optional)_ | ShippingAddressObject | Shipping address |
| **returnAddress** _(optional)_ | ReturnAddressObject | Return address |
| **receipts** _(required)_ | ReceiptObject | List of order receipts |
| **connectedOrderIds** _(optional)_ | string\[\] | List of connected order IDs. Used when an order needs to be produced in multiple locations for example. [Read more here](https://dashboard.gelato.com/docs/orders/order_details/) |

`ItemObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Item Id. |
| **itemReferenceId** _(required)_ | string | Reference to your internal order item id. |
| **productUid** _(required)_ | string | Type of printing product in [product uid](https://dashboard.gelato.com/docs/get-started/#product-uid) format. |
| **pageCount** _(optional)_ | integer | The page count for multipage products. This parameter is only needed for multi-page products. All pages in the product, including front and back cover are included in the count. For example for a Wire-o Notebook there are 112 inner pages (56 leaves), 2 front (outer and inside) and 2 back cover (outer and inside) pages, total 116 pages. The `pageCount` is 116. [Read more](https://apigelato.zendesk.com/hc/en-us/articles/360010280579-Multipage-formats) |
| **quantity** _(required)_ | integer | The product quantity. |
| **fulfillmentStatus** _(required)_ | string | The current item fulfillment status can be one of the statuses described under [Order statuses](https://dashboard.gelato.com/docs/orders/order_details/#order-statuses) |
| **files** _(required)_ | File\[\] | The links to original file. |
| **processedFileUrl** _(required)_ | string | The link to processed file which was sent to production. |
| **previews** _(required)_ | ItemPreview\[\] | Array of [previews](https://dashboard.gelato.com/docs/orders/v4/get/#item-previews) |
| **options** _(optional)_ | ItemOption\[\] | Array of additional [item options](https://dashboard.gelato.com/docs/orders/v4/get/#item-options) |

`ItemPreview`

| Parameter | Type | Description |
| --- | --- | --- |
| **type** _(required)_ | string | Type of previews. Can be: preview\_default and preview\_thumbnail. |
| **url** _(required)_ | string | Url to preview file. |

`File`

| Parameter | Type | Description |
| --- | --- | --- |
| **type** _(optional)_ | FileType | Defines print area where file is supposed to fill. Default value = "default". |
| **url** _(required)_ | string | A URL from where the file can be downloaded. |

`FileType`

| Parameter | Description |
| --- | --- |
| **default** | Indicates that the file should be used for primary print area.  <br>For example for apparel products it will be front, for folded cards - cover + back pages.  <br>In case multipage PDF file is provided, then it is expected to have number of pages matching number of print areas and it will be used to print on all print areas. |
| **back** | Indicates that the file should be printed on a back of the product. |
| **neck-inner** | Indicates that the file should be printed on the inner neck of the apparel product. |
| **neck-outer** | Indicates that the file should be printed on the outer neck of the apparel product. |
| **sleeve-left** | Indicates that the file should be printed on the left sleeve of the apparel product. |
| **sleeve-right** | Indicates that the file should be printed on the right sleeve of the apparel product. |
| **inside** | Indicates that the file should be printed on inner pages of folded cards. |

`ItemOption`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Item option Id. |
| **type** _(required)_ | string | A valid option category (currently only `envelope`). |
| **productUid** _(required)_ | string | Specific option category product in [product uid](https://dashboard.gelato.com/docs/get-started/#product-uid) format. |
| **quantity** _(required)_ | integer | The option quantity. For example how many envelopes should be added to your product. |

`ShipmentObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Shipment Id. |
| **shipmentMethodName** _(required)_ | string | The shipment method name. |
| **shipmentMethodUid** _(required)_ | string | The shipment method uid. |
| **packageCount** _(required)_ | integer | Count of shipping packages. Depending on the product type and quantity ordered, the product might be split into packages if a weight of the product exceeds the available weight or size for the shipping method. |
| **minDeliveryDays** _(required)_ | integer | Minimum days estimate to produce and deliver the item. |
| **maxDeliveryDays** _(required)_ | integer | Maximum days estimate to produce and deliver the item. |
| **minDeliveryDate** _(required)_ | string | Minimum date estimate to produce and deliver the item. |
| **maxDeliveryDate** _(required)_ | string | Maximum date estimate to produce and deliver the item |
| **totalWeight** _(required)_ | integer | Total weight of the product in grams, including the weight of the packages. |
| **fulfillmentCountry** _(required)_ | string | Original of shipment country ISO code. The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). |
| **packages** _(required)_ | PackageObject\[\] | List of packages. |

`PackageObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Package Id. |
| **orderItemIds** _(required)_ | string\[\] | List of order item Ids. |
| **trackingCode** _(required)_ | string | The tracking code of the package. |
| **trackingUrl** _(required)_ | string | The tracking url. |

`ShippingAddressObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Shipment address id |
| **country** _(required)_ | string | The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. |
| **firstName** _(required)_ | string | The first name of the recipient at this address. |
| **lastName** _(required)_ | string | The last name of the recipient at this address. |
| **companyName** _(optional)_ | string | The company name of the recipient at this address. |
| **addressLine1** _(required)_ | string | The first line of the address. For example, number, street, and so on. |
| **addressLine2** _(optional)_ | string | The second line of the address. For example, suite or apartment number. |
| **city** _(required)_ | string | The city name. |
| **postСode** _(required)_ | string | The postal code, which is the zip code or equivalent. |
| **state** _(optional)_ | string | The code for a US state or the equivalent for other countries. |
| **email** _(required)_ | string | The email address for the recipient. |
| **phone** _(optional)_ | string | The phone number, in [E.123 format](https://en.wikipedia.org/wiki/E.123). |
| **isBusiness** _(optional)_ | bool | Boolean value, declares the recipient being a business. |
| **federalTaxId** _(optional)_ | string | The Federal Tax identification number of recipient. |
| **stateTaxId** _(optional)_ | string | The State Tax identification number of recipient. |
| **registrationStateCode** _(optional)_ | string | The code number for a US state or the equivalent for other countries that defines state where recipient company is registered. |

`BillingEntityObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Billing entity id |
| **companyName** _(required)_ | string | The company name |
| **companyNumber** _(optional)_ | string | The company number |
| **companyVatNumber** _(optional)_ | string | The company VAT number |
| **country** _(required)_ | string | The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. |
| **recipientName** _(required)_ | string | The recipient name of the billing entity |
| **addressLine1** _(required)_ | string | The first line of the address. For example, number, street, and so on. |
| **addressLine2** _(optional)_ | string | The second line of the address. For example, suite or apartment number. |
| **city** _(required)_ | string | The city name. |
| **postСode** _(required)_ | string | The postal code, which is the zip code or equivalent. |
| **state** _(optional)_ | string | The code for a US state or the equivalent for other countries. |
| **email** _(required)_ | string | The email address for the billing entity |
| **phone** _(optional)_ | string | The phone number, in [E.123 format](https://en.wikipedia.org/wiki/E.123). |

`ReceiptObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Receipt Id. |
| **orderId** _(required)_ | string | Gelato order id. |
| **transactionType** _(required)_ | string | The transaction type of receipt. Can be: purchase, refund. |
| **currency** _(required)_ | string | The currency of receipt. |
| **items** _(required)_ | ReceiptItemObject\[\] | List of receipt items. |
| **productsPriceInitial** _(required)_ | double | The initial products price. |
| **productsPriceDiscount** _(required)_ | double | The discount products price. |
| **productsPrice** _(required)_ | double | The products price. |
| **productsPriceVat** _(required)_ | double | The products VAT price. |
| **productsPriceInclVat** _(required)_ | double | The products price included VAT. |
| **packagingPriceInitial** _(required)_ | double | The initial packaging price. |
| **packagingPriceDiscount** _(required)_ | double | The discount packaging price. |
| **packagingPrice** _(required)_ | double | The packaging price. |
| **packagingPriceVat** _(required)_ | double | The packaging VAT price. |
| **packagingPriceInclVat** _(required)_ | double | The packaging price included VAT. |
| **shippingPriceInitial** _(required)_ | double | The initial shipping price. |
| **shippingPriceDiscount** _(required)_ | double | The discount shipping price. |
| **shippingPrice** _(required)_ | double | The shipping price. |
| **shippingPriceVat** _(required)_ | double | The shipping VAT price. |
| **shippingPriceInclVat** _(required)_ | double | The shipping price included VAT. |
| **discount** _(required)_ | double | The total discounts on the order. |
| **discountVat** _(required)_ | double | The total discounts VAT on the order. |
| **discountInclVat** _(required)_ | double | The total discounts on the order included VAT. |
| **totalInitial** _(required)_ | double | The initial total price of the order. |
| **total** _(required)_ | double | The total price of the order. |
| **totalVat** _(required)_ | double | The total VATs of the order. |
| **totalInclVat** _(required)_ | double | The total price of the order included VAT. |

`ReceiptItemObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Receipt item Id. |
| **receiptId** _(required)_ | string | Receipt Id. |
| **referenceId** _(required)_ | string | Reference to order item id or to shipment id. |
| **type** _(required)_ | string | The type of receipt item. Can be: product, shipment or packaging. |
| **title** _(required)_ | string | The title of receipt item. |
| **currency** _(required)_ | string | The currency of receipt item. |
| **priceBase** _(required)_ | string | The base price of item. |
| **amount** _(required)_ | string | The amount of item. |
| **priceInitial** _(required)_ | double | The initial item price |
| **discount** _(required)_ | double | The discount of the item |
| **price** _(required)_ | double | The item price |
| **vat** _(required)_ | double | The item VAT price |
| **priceInclVat** _(required)_ | double | The item price included VAT |
| **createdAt** _(required)_ | string | The receipt item created at date and time in format [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) |
| **updatedAt** _(required)_ | string | The receipt item updated at date and time in format [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) |


---
## Search orders

Use the Search API to retrieves a list of orders

`POST https://order.gelatoapis.com/v4/orders:search`

#### Request example

```
$ curl -X POST \    https://order.gelatoapis.com/v4/orders:search \    -H 'Content-Type: application/json' \    -H 'X-API-KEY: {{apiKey}}' \    -d '{         "orderTypes": [             "draft",             "order"         ],         "countries": [             "US",             "DE",             "CA"         ]     }'
```

#### Response example

```
{
  "orderReferenceId": "{{myOrderId}}",
  "quotes": [
    {
      "id": "c22cf4c2-0249-48d0-ac51-c47d24c01f02",
      "itemReferenceIds": [
        "{{myItemId1}}",
        "{{myItemId2}}"
      ],
      "fulfillmentCountry": "US",
      "shipmentMethods": [
        {
          "name": "UPS Surepost",
          "shipmentMethodUid": "ups_surepost",
          "price": 5.11,
          "currency": "EUR",
          "minDeliveryDays": 6,
          "maxDeliveryDays": 7,
          "minDeliveryDate": "2019-08-29",
          "maxDeliveryDate": "2019-08-30",
          "type": "normal",
          "isPrivate": true,
          "isBusiness": true,
          "totalWeight": 613,
          "numberOfParcels": 1,
          "incoTerms": "DDP"
        },
        {
          "name": "UPS Ground Commercial",
          "shipmentMethodUid": "ups_ground_commercial",
          "price": 5.11,
          "currency": "EUR",
          "minDeliveryDays": 5,
          "maxDeliveryDays": 6,
          "minDeliveryDate": "2019-08-28",
          "maxDeliveryDate": "2019-08-29",
          "type": "normal",
          "isPrivate": true,
          "isBusiness": true,
          "totalWeight": 613,
          "numberOfParcels": 1
        },
        {
          "name": "UPS Next Day Commercial",
          "shipmentMethodUid": "ups_next_day_commercial",
          "price": 25.11,
          "currency": "EUR",
          "minDeliveryDays": 4,
          "maxDeliveryDays": 4,
          "minDeliveryDate": "2019-08-27",
          "maxDeliveryDate": "2019-08-27",
          "type": "express",
          "isPrivate": true,
          "isBusiness": true,
          "totalWeight": 613,
          "numberOfParcels": 1
        }
      ],
      "products": [
        {
          "itemReferenceId": "{{myItemId1}}",
          "productUid": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "quantity": 100,
          "price": 25.11,
          "currency": "EUR"
        },
        {
          "itemReferenceId": "{{myItemId2}}",
          "productUid": "cards_pf_5r_pt_100-lb-cover-coated-silk_cl_4-4_hor",
          "quantity": 100,
          "price": 25.11,
          "currency": "EUR"
        }
      ]
    }
  ]
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **channels** _(optional)_ | string\[\] | List of order channels. |
| **countries** _(optional)_ | string\[\] | List of order countries (based on shipping address). |
| **currencies** _(optional)_ | string\[\] | List of order currencies. |
| **endDate** _(optional)_ | string\[\] | Show orders ordered at or created at before date (format: 2014-04-25T16:15:47-04:00). Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. |
| **financialStatuses** _(optional)_ | string\[\] | List of order financial statuses. |
| **fulfillmentStatuses** _(optional)_ | string\[\] | List of order fulfillment statuses. |
| **ids** _(optional)_ | string\[\] | List of Gelato order ids. |
| **limit** _(optional)_ | int | The maximum number of results to show on a page. (default: 50, maximum: 100) |
| **offset** _(optional)_ | int | Offset of search request (default = 0). |
| **orderReferenceId** _(optional)_ | string | Reference to your internal order id. |
| **orderReferenceIds** _(optional)_ | string\[\] | List of references to your internal order ids. |
| **orderTypes** _(optional)_ | string\[\] | List of order types. It can be `order` or `draft`. Draft orders can be edited from the dashboard and they don't go into production until you decide to convert draft into a regular order via UI or programmatically via [Order Patch API](https://dashboard.gelato.com/docs/orders/v4/search/#patch). |
| **search** _(optional)_ | string | Search string. Show orders contain value from search in fields - `shippingAddress.firstName`, `shippingAddress.lastName` or `orderReferenceId`. |
| **startDate** _(optional)_ | string\[\] | Show orders ordered at or created at after date (format: 2014-04-25T16:15:47-04:00). Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. |
| **storeIds** _(optional)_ | string\[\] | List of E-commerce store IDs identifying which store the order was placed in. |

### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **orders** _(required)_ | OrderObject | List of Orders matching to the search parameters |

`OrderObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **channel** _(required)_ | string | The order channel. Can be: ui, api, shopify and etsy. |
| **connectedOrderIds** _(optional)_ | string\[\] | List of connected order IDs. Used when an order needs to be produced in multiple locations for example. [Read more here](https://dashboard.gelato.com/docs/orders/order_details/) |
| **country** _(optional)_ | string | The two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. |
| **createdAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was created. |
| **currency** _(optional)_ | string | The order currency. |
| **financialStatus** _(required)_ | string | The order current financial status. Can be: draft, pending, invoiced, to\_be\_invoiced, paid, canceled, partially\_refunded, refunded and refused. |
| **firstName** _(optional)_ | string | The first name of the order recipient. |
| **fulfillmentStatus** _(required)_ | string | The order current fulfillment status. Can be: created, passed, failed, canceled, printed, shipped, draft, pending\_approval, not\_connected, on\_hold. |
| **id** _(required)_ | string | Gelato order id. |
| **itemsCount** _(optional)_ | int | The number of items in the order. |
| **lastName** _(optional)_ | string | The last name of the order recipient. |
| **orderReferenceId** _(required)_ | string | Reference to your internal order id. |
| **orderType** _(required)_ | string | Type of the order. It can be `order` or `draft`. Draft orders can be edited from the dashboard and they don't go into production until you decide to convert draft into a regular order via UI or programmatically via [Order Patch API](https://dashboard.gelato.com/docs/orders/v4/search/#patch). |
| **orderedAt** _(optional)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was placed. |
| **storeId** _(optional)_ | string | E-commerce store ID identifying which store the order was placed in. |
| **totalInclVat** _(optional)_ | string | The total amount of the order including VAT. |
| **updatedAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when order was updated. |

---
## Cancel order

Use the Cancel order API to stop the production and shipment process. Note: if the order has moved to status `printed` or `shipped` the order can't be canceled, please review the [Order get](https://dashboard.gelato.com/docs/orders/v4/cancel/#order-get) flowchart.

`POST https://order.gelatoapis.com/v4/orders/{{orderId}}:cancel`

#### Request example

`$ curl -X POST \    https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85:cancel \    -H 'Content-Type: application/json' \    -H 'X-API-KEY: {{apiKey}}'`

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **orderId** _(required)_ | string | Gelato order id. |

#### Response Statuses

| HTTP Status Code | Description |
| --- | --- |
| 200 | The order is canceled. |
| 409 | The order cannot be canceled, because at least one of the items is in 'printed' status. |
| 404 | Order not found. |

---
## Patch draft order

Use the Order patch API convert draft order into a regular one. Note: only orders having orderType equal to `draft` can be patched.

`PATCH https://order.gelatoapis.com/v4/orders/{{orderId}}`

#### Request example

Convert draft to order:
```
$ curl -X PATCH \
   https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}' \
   -d '{
        "orderType": "order"
    }'
```
Convert draft to order and order item file:
```
$ curl -X PATCH \
   https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}' \
   -d '{
        "orderType": "order",
        "items": [
          {
            "id": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
            "files": [
                {
                    "type": "default",
                    "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                },
                {
                    "type": "back",
                    "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                }
            ],
          },          
          {
            "id": "13c165fe-de51-4ea9-86e6-98503ae14486"
          }
        ]
    }'  
```

#### Response example

```
{
  "id": "37365096-6628-4538-a9c2-fbf9892deb85",
  "orderType": "order",
  "orderReferenceId": "{{myOrderId}}",
  "customerReferenceId": "{{myCustomerId}}",
  "fulfillmentStatus": "printed",
  "financialStatus": "paid",
  "currency": "USD",
  "channel": "api",
  "createdAt": "2021-01-14T12:30:03+00:00",
  "updatedAt": "2021-01-14T12:32:03+00:00",
  "orderedAt": "2021-01-14T12:32:03+00:00",
  "items": [
    {
      "id": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
      "itemReferenceId": "{{myItemId1}}",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-4",
      "files": [
        {
          "type": "default",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        },
        {
          "type": "back",
          "url": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/logo.png"
        }
      ],
      "processedFileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_processed",
      "quantity": 100,
      "fulfillmentStatus": "printed",
      "previews": [
        {
          "type": "preview_default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/preview_default"
        }
      ]
    },
    {
      "id": "13c165fe-de51-4ea9-86e6-98503ae14486",
      "itemReferenceId": "{{myItemId2}}",
      "productUid": "cards_pf_5r_pt_100-lb-cover-coated-silk_cl_4-4_hor",
      "files": [
        {
          "type": "default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_original"
        }
      ],
      "processedFileUrl": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/file_processed",
      "quantity": 100,
      "fulfillmentStatus": "printed",
      "previews": [
        {
          "type": "preview_default",
          "url": "https://gelato-api-live.s3.eu-west-1.amazonaws.com/order/order_product_file/preview_default"
        }
      ]
    }
  ],
  "shipment": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "shipmentMethodName": "UPS Surepost",
    "shipmentMethodUid": "ups_surepost",
    "minDeliveryDays": 6,
    "maxDeliveryDays": 7,
    "minDeliveryDate": "2019-08-29",
    "maxDeliveryDate": "2019-08-30",
    "totalWeight": 613,
    "fulfillmentCountry": "US",
    "packagesCount": 1,
    "packages": [
      {
        "id": "4a771ca0-7de4-4f0b-a7d4-9c952093af6c",
        "orderItemIds": [
          "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "13c165fe-de51-4ea9-86e6-98503ae14486"
        ],
        "trackingCode": "12345678990",
        "trackingUrl": "http://test.tracking.url"
      }
    ]
  },
  "billingEntity": {
    "id": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
    "companyName": "Example",
    "companyNumber": "Example Number",
    "companyVatNumber": "Example VAT1234567890",
    "country": "US",
    "recipientName": "Paul Smith",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "shippingAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56a",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "country": "US",
    "firstName": "Paul",
    "lastName": "Smith",
    "companyName": "Example",
    "addressLine1": "451 Clarkson Ave",
    "addressLine2": "Brooklyn",
    "city": "New York",
    "postCode": "11203",
    "state": "NY",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "returnAddress": {
    "id": "d6bcf17f-3a48-4ec8-888e-70766ae8b56b",
    "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
    "companyName": "My company",
    "addressLine1": "3333 Saint Marys Avenue",
    "addressLine2": "Brooklyn",
    "state": "NY",
    "city": "New York",
    "postCode": "13202",
    "country": "US",
    "email": "apisupport@gelato.com",
    "phone": "123456789"
  },
  "receipts": [
    {
      "id": "c74447e5-c543-4baf-8239-3620422b8d81",
      "orderId": "37365096-6628-4538-a9c2-fbf9892deb85",
      "transactionType": "purchase",
      "currency": "USD",
      "items": [
        {
          "id": "b65bb8f3-c2a3-425e-a366-7e19c32c93e2",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "0549170c-bd7d-4d43-b7a1-34c855e6aefb",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "3126e362-8369-4900-bcd3-6990d373b69c",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "13c165fe-de51-4ea9-86e6-98503ae14486",
          "type": "product",
          "title": "cards_pf_bx_pt_110-lb-cover-uncoated_cl_4-4_hor",
          "currency": "USD",
          "priceBase": 12.47,
          "amount": 1,
          "priceInitial": 12.47,
          "discount": 0,
          "price": 12.47,
          "vat": 0.75,
          "priceInclVat": 13.22,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "762f3563-ff24-4d4e-b6c7-fee19bfc878b",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "shipment",
          "title": "Delivery using SmartPost",
          "currency": "USD",
          "priceBase": 4.91,
          "amount": 1,
          "priceInitial": 4.91,
          "discount": 0,
          "price": 4.91,
          "vat": 0.3,
          "priceInclVat": 5.21,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        },
        {
          "id": "bb4c9eee-91a0-44a1-8ee0-a3cef29820f1",
          "receiptId": "c74447e5-c543-4baf-8239-3620422b8d81",
          "referenceId": "87cb3d74-de74-4bce-a682-e92f2652a4a2",
          "type": "packaging",
          "title": "Packaging",
          "currency": "USD",
          "priceBase": 1.7,
          "amount": 1,
          "priceInitial": 1.7,
          "discount": 0,
          "price": 1.7,
          "vat": 0.1,
          "priceInclVat": 1.8,
          "createdAt": "2021-01-14T12:30:03+00:00",
          "updatedAt": "2021-01-14T12:32:03+00:00"
        }
      ],
      "productsPriceInitial": 24.94,
      "productsPriceDiscount": 0,
      "productsPrice": 24.94,
      "productsPriceVat": 1.5,
      "productsPriceInclVat": 26.44,
      "packagingPriceInitial": 1.7,
      "packagingPriceDiscount": 0,
      "packagingPrice": 1.7,
      "packagingPriceVat": 0.1,
      "packagingPriceInclVat": 1.8,
      "shippingPriceInitial": 4.91,
      "shippingPriceDiscount": 0,
      "shippingPrice": 4.91,
      "shippingPriceVat": 0.3,
      "shippingPriceInclVat": 5.21,
      "discount": 0,
      "discountVat": 0,
      "discountInclVat": 0,
      "totalInitial": 31.55,
      "total": 31.55,
      "totalVat": 1.9,
      "totalInclVat": 33.45
    }
  ]
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **orderType** _(required)_ | string | The value should be `order` to convert draft order into a regular one. |
| **items** _(optional)_ | ItemObject\[\] | List of order items which should be modified. All existing items which aren't present in `items` array in the request will be removed. If `items` parameter isn't passed in the request, existing order items will stay without any changes. If you want to keep some items as is while updating other ones, pass item object with the only field `id` specified for the items which should stay as is. |

`ItemObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Existing order item ID which should be modified. |
| **files** _(optional)_ | File\[\] | Urls to the product file. Url is required for printable products only. Supported file formats are: PDF, PNG, TIFF, SVG and JPEG. For PDF files please use one of the compatible [PDF/X](https://en.wikipedia.org/wiki/PDF/X) standards, for example in [PDF/X-1a:2003](https://www.iso.org/standard/39938.html) or [PDF/X-4](https://www.iso.org/standard/42876.html) standard. |

### Response

Response has the same structure as on [Order Get API](https://dashboard.gelato.com/docs/orders/v4/get)

---

## Delete draft order

Use the Delete order API to delete draft orders. Note: only orders having orderType equal to `draft` can be deleted.

`DELETE https://order.gelatoapis.com/v4/orders/{{orderId}}`

#### Request example

`$ curl -X DELETE \    https://order.gelatoapis.com/v4/orders/37365096-6628-4538-a9c2-fbf9892deb85 \    -H 'Content-Type: application/json' \    -H 'X-API-KEY: {{apiKey}}'`

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **orderId** _(required)_ | string | Gelato order ID |

---

## products
---
## Catalog
### List catalogs

Gives a list of available catalogs

`GET https://product.gelatoapis.com/v3/catalogs`

#### Request example

`$  curl -X GET https://product.gelatoapis.com/v3/catalogs \     -H 'X-API-KEY: {{apiKey}}'`

#### Response example

```
[
    {
        "catalogUid": "cards",
        "title": "cards"
    },
    {
        "catalogUid": "posters",
        "title": "Posters"
    },
    {
        "catalogUid": "multipage-brochures",
        "title": "Multipage Brochures"
    }
]
```

#### Response parameters

Response is a collection `Catalog` objects.

`Catalog` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. |
| **title** _(required)_ | string | Title of the catalog. |

- - -

# Get catalog

Get information about a specific catalog. Includes a catalogs attributes which defines the products stored inside of the catalog.

`GET https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}`

#### Request example

`$ curl -X GET "https://product.gelatoapis.com/v3/catalogs/posters" \     -H 'X-API-KEY: {{apiKey}}'`

#### Response example

```
{
  "catalogUid": "posters",
  "title": "Posters",
  "productAttributes": [
    {
      "productAttributeUid": "Orientation",
      "title": "Orientation",
      "values": [
        {
          "productAttributeValueUid": "hor",
          "title": "Landscape"
        },
        {
          "productAttributeValueUid": "ver",
          "title": "Portrait"
        }
      ]
    },
    {
      "productAttributeUid": "PaperFormat",
      "title": "Paper Format",
      "values": [
        {
          "productAttributeValueUid": "A1",
          "title": "A1"
        },
        {
          "productAttributeValueUid": "A2",
          "title": "A2"
        },
        {
          "productAttributeValueUid": "A3",
          "title": "A3"
        }
      ]
    }
  ]
}
 ```

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. Value be taken as `catalogUid`field in Catalog list API call. |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. |
| **title** _(required)_ | string | Title of the catalog. |
| **productAttributes** _(required)_ | ProductAttribute\[\] | Array of product attributes and their possible values. All products in the catalog are defined by these attributes. |

`ProductAttribute` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productAttributeUid** _(required)_ | string | Attribute unique identifier. |
| **title** _(required)_ | string | Attribute title. |
| **values** _(required)_ | ProductAttributeValue\[\] | Array of possible values for the attribute. |

`ProductAttributeValue` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productAttributeValueUid** _(required)_ | string | Attribute value unique identifier. |
| **title** _(required)_ | string | Attribute title. |

- - -
## Product

### Search products

Use this endpoint to list products from a catalog. You can filter the list of products on the product attributes.

`POST https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}/products:search`

#### Request example

```
$ curl -X POST "https://product.gelatoapis.com/v3/catalogs/posters/products:search" \
    -H 'X-API-KEY: {{apiKey}}' \
    -H 'Content-Type: application/json' \
    -d '{
        "attributeFilters": {
            "Orientation": ["hor", "ver"],
            "CoatingType": ["none"]
        },
        "limit": 50,
        "offset": 0
    }'

```

#### Response example

```
{
  "products": [
    {
      "productUid": "8pp-accordion-fold_pf_dl_pt_100-lb-text-coated-silk_cl_4-4_ft_8pp-accordion-fold-ver_ver",
      "attributes": {
        "CoatingType": "none",
        "ColorType": "4-4",
        "FoldingType": "8pp-accordion-fold-ver",
        "Orientation": "ver",
        "PaperFormat": "DL",
        "PaperType": "100-lb-text-coated-silk",
        "ProductStatus": "activated",
        "ProtectionType": "none",
        "SpotFinishingType": "none",
        "Variable": "no"
      },
      "weight": {
        "value": 12.308,
        "measureUnit": "grams"
      },
      "dimensions": {
        "Thickness": {
          "value": 0.14629,
          "measureUnit": "mm"
        },
        "Width": {
          "value": 99,
          "measureUnit": "mm"
        },
        "Height": {
          "value": 210,
          "measureUnit": "mm"
        }
      }
    }
  ],
  "hits": {
    "attributeHits": {
      "CoverColorType": {
        "none": 106,
        "4-4": 3041
      },
      "ProtectionType": {
        "1-1": 1590,
        "1-0": 1971,
        "none": 2137
      },
      "CoatingType": {
        "glossy-protection": 1765,
        "matt-protection": 1592,
        "glossy-coating": 102,
        "glossy-lamination": 43,
        "matt-lamination": 44,
        "matt-coating": 10,
        "soft-touch-lamination": 5,
        "none": 2137
      },
      "CustomPaperFormat": {
        "custom": 13,
        "custom-flyers": 1
      },
      "BannerMaterial": {
        "polyester-fabric": 2
      },
      "ClosingType": {
        "tape-doublesided": 12
      },
      "BaseArea": {
        "80mm": 6
      }
    }
  }
}
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. Value be taken as `catalogUid`field in Catalog list API call. |
| **attributeFilters** _(optional)_ | AttributeFilters | Associative array of the product attribute based filters for filtering |
| **limit** _(optional)_ | int | Maximum amount of products within the response. Upper limit is 100. |
| **offset** _(optional)_ | int | Offset for the products list. Default value: 0 |

`AttributeFilters`

Associative array of the attribute filters for the search.

Keys represent attribute Uid. They can be taken from `productAttributeUid` parameter in Catalog info API response.

Values is an array of attribute values. They can be taken from `productAttributeValueUid` parameter in Catalog info API response.

```
{
    "Orientation": ["hor", "ver"],
    "CoatingType": ["none"]
}
```

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **products** _(required)_ | Product\[\] | List of the products. |
| **hits** _(required)_ | FilterHits | List of the attributes with their possible values and number of hits for each value. |

`Product` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product UID. |
| **attributes** _(required)_ | ProductAttributes | Associative array of product attributes. |
| **weight** _(required)_ | MeasureUnit | Weight of the product. |
| **dimensions** _(required)_ | MeasureUnit\[\] | Product dimensions depending on the product model. Possible values can be Width, Thickness, Height, etc. |
| **supportedCountries** _(required)_ | string\[\] | Codes array of supported countries. Each string is the two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |

`ProductAttributes`

Associative array of product attributes.

Keys represent attributes names. These are the same as `ProductAttributeUid` in Catalog info API response.

Values represent attribute values. These are the same as `ProductAttributeValueUid` in Catalog info API response.

```
{
    "CoatingType": "none",
    "ColorType": "4-4",
    "FoldingType": "8pp-accordion-fold-ver"
}
```

`MeasureUnit` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **value** _(required)_ | float | Value in a given units of measurement. |
| **measureUnit** _(required)_ | string | Name of the unit of measurement (grams, mm, etc). |

`FilterHits` parameters

| Parameter | Type |
| --- | --- |
| **attributeHits** _(required)_ | AttributeHits |

`AttributeHits`

Associative array of product attributes with the number of hits for each possible value.

The 1st level of keys represents attributes. These are the same as `ProductAttributeUid` in Catalog info API response.

The 2nd level of keys represents attribute values. These are the same as `ProductAttributeValueUid` in Catalog info API response. Array values represent number of hits for each value.

```
{
    "CoverColorType": {
        "none": 106,
        "4-4": 3041
    },
    "ProtectionType": {
        "1-1": 1590,
        "1-0": 1971,
        "none": 2137
    }
}
```

- - -

## Get product

Use this endpoint to get information about a single product.

`GET https://product.gelatoapis.com/v3/products/{{productUid}}`

#### Request example

```
$ curl -X GET "https://product.gelatoapis.com/v3/products/cards_pf_bb_pt_110-lb-cover-uncoated_cl_4-0_hor" \
    -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```
{
    "productUid": "8pp-accordion-fold_pf_dl_pt_100-lb-text-coated-silk_cl_4-4_ft_8pp-accordion-fold-ver_ver",
    "attributes": {
        "CoatingType": "none",
        "ColorType": "4-4",
        "FoldingType": "8pp-accordion-fold-ver",
        "Orientation": "ver",
        "PaperFormat": "DL",
        "PaperType": "100-lb-text-coated-silk",
        "ProductStatus": "activated",
        "ProtectionType": "none",
        "SpotFinishingType": "none",
        "Variable": "no"
    },
    "weight": {
        "value": 1.341,
        "measureUnit": "grams"
    },
    "supportedCountries": [
        "US",
        "CA"
    ],
    "notSupportedCountries": [
        "BD",
        "BM",
        "BR",
        "AI",
        "DO",
        "IS"
    ],
    "isStockable": false,
    "isPrintable": true,
    "validPageCounts": [5,10,20,30]
}
```

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Unique product identifier. It can be taken from `productUid` parameter in Products list API response. |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Unique product identifier. |
| **attributes** _(required)_ | ProductAttributes | Associative array of product attributes. |
| **weight** _(required)_ | WeightObject | Weight of the product. |
| **supportedCountries** _(required)_ | string\[\] | Codes array of supported countries. Each string is the two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |
| **notSupportedCountries** _(required)_ | string\[\] | Code array of countries that are not supported. Each string is the two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |
| **isStockable** _(required)_ | boolean | Describes if the product is a stockable item. A stockable item has a limited stock level which can be depleted. Example of stockable items are frames, hangers and framed posters. A non-stockable item can be regarded as having infinite stock. Examples of non-stockable items are cards, calendars and posters. Which products are stockable and non-stockable are subject to change in the future. |
| **isPrintable** _(required)_ | boolean | Describes if the product is a printable item. Example of non-printable items are frames or hangers. Examples of printable items are cards, calendars and posters. |
| **validPageCounts** _(optional)_ | int\[\] | The list of page counts which are supported for multi-page products. This parameter is returned only for multi-page products |

`ProductAttributes`

Associative array of product attributes.

Keys represent attributes names. These are the same as `ProductAttributeUid` in Catalog info API response.

Values represent attribute values. These are the same as `ProductAttributeValueUid` in Catalog info API response.

```
{
    "CoatingType": "none",
    "ColorType": "4-4",
    "FoldingType": "8pp-accordion-fold-ver"
}

```

`WeightObject` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **value** _(required)_ | double | Weight value. |
| **measureUnit** _(required)_ | string | Unit of measurement - grams or lbs. |

- - -

### Cover dimensions

Use this endpoint to get information about the dimensions of the cover of a product such as photo book or a multi-page brochure.

`GET https://product.gelatoapis.com/v3/products/{{productUid}}/cover-dimensions`

#### Request example

```
$ curl -X GET 'https://product.gelatoapis.com/v3/products/photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver/cover-dimensions?pageCount=34' \
    -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```
{
    "productUid": "photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver",
    "pagesCount": 38,
    "measureUnit": "mm",
    "wraparoundInsideSize": {
        "width": 468.0,
        "height": 325.0,
        "left": 0,
        "top": 0,
        "thickness": 17
    },
    "wraparoundEdgeSize": {
        "width": 434.0,
        "height": 291.0,
        "left": 17,
        "top": 17,
        "thickness": 3
    },
    "contentBackSize": {
        "width": 203.0,
        "height": 285.0,
        "left": 20,
        "top": 20
    },
    "jointBackSize": {
        "width": 8,
        "height": 285.0,
        "left": 223.0,
        "top": 20
    },
    "spineSize": {
        "width": 6,
        "height": 285.0,
        "left": 231.0,
        "top": 20
    },
    "jointFrontSize": {
        "width": 8,
        "height": 285.0,
        "left": 237.0,
        "top": 20
    },
    "contentFrontSize": {
        "width": 203.0,
        "height": 285.0,
        "left": 245.0,
        "top": 20
    }
}
```


Note that each product can contain a different list of dimensions.

Use [this example](https://dashboard.gelato.com/docs/images/cover-dimensions-preview.svg) to see what each area is. Hover over an area to see the name of it.  


#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Unique product identifier. It can be taken from `productUid` parameter in Products list API response. |
| **pageCount** _(required)_ | string | The page count for multi-page products. This parameter is only needed for multi-page products. All pages in the product, including front and back cover are included in the count. For example for a Wire-o Notebook there are 112 inner pages (56 leaves), 2 front (outer and inside) and 2 back cover (outer and inside) pages, total 116 pages. The `pageCount` is 116. [Read more](https://apigelato.zendesk.com/hc/en-us/articles/360010280579-Multipage-formats) |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Unique product identifier. |
| **pagesCount** _(required)_ | int | Count inner pages. |
| **measureUnit** _(required)_ | string | Unit of measurement - mm. |
| **wraparoundInsideSize** _(optional)_ | DimensionAttributes | The wraparound inside area. |
| **wraparoundEdgeSize** _(optional)_ | DimensionAttributes | The wraparound edge area. |
| **contentBackSize** _(optional)_ | DimensionAttributes | The content back area. |
| **jointBackSize** _(optional)_ | DimensionAttributes | The joint back size area. |
| **spineSize** _(optional)_ | DimensionAttributes | The spine area. |
| **jointFrontSize** _(optional)_ | DimensionAttributes | The joint front area. |
| **contentFrontSize** _(optional)_ | DimensionAttributes | The content front area. |
| **bleedSize** _(optional)_ | DimensionAttributes | The bleed area. |

`DimensionAttributes`

Associative array of dimension attributes.

| Parameter | Type | Description |
| --- | --- | --- |
| **width** _(required)_ | double | Width of the area. |
| **height** _(required)_ | string | Height of the area. |
| **left** _(required)_ | string | The area measured from the left. |
| **top** _(required)_ | string | The area measured from the top. |
| **thickness** _(optional)_ | string | Thickness of the area. |

#### Table of dimensions per product

| Product | Parameters |
| --- | --- |
| **Soft cover Photo book** | bleedSize, contentBackSize, spineSize, contentFrontSize |
| **Hard cover Photo book** | wraparoundInsideSize, wraparoundEdgeSize, contentBackSize, jointBackSize, spineSize, jointFrontSize, contentFrontSize |

- - -

## Price

Use this endpoint to get prices for all quantities of a product.

`GET https://product.gelatoapis.com/v3/products/{{productUid}}/prices`

#### Request example

```
$ curl -X GET "https://product.gelatoapis.com/v3/products/{{productUid}}/prices" \
    -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```
[
  {
    "productUid": "{{productUid}}",
    "country": "US",
    "quantity": 700,
    "price": 2151.28277,
    "currency": "USD",
    "pageCount": null
  },
  {
    "productUid": "{{productUid}}",
    "country": "US",
    "quantity": 20,
    "price": 87.883871,
    "currency": "USD",
    "pageCount": null
  },
  {
    "productUid": "{{productUid}}",
    "country": "US",
    "quantity": 400,
    "price": 1365.982879,
    "currency": "USD",
    "pageCount": null
  }
]
```

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product Uid |
| **country** _(optional)_ | string | Country ISO code |
| **currency** _(optional)_ | string | Currency ISO code |
| **pageCount** _(optional)_ | int | Page count. It is mandatory for multi-page products. |

#### Response Parameters

Response data is represented by an array of the `Price` object with these parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** | string | Product Uid |
| **country** | string | Country ISO code |
| **quantity** | int | Quantity of the product |
| **price** | float | Price of the product |
| **currency** | string | Currency ISO code |
| **pageCount** | int | Page count for multi-page products |

- - -

## Stock availability

Use this endpoint to get information about the availability of stock-able products in different regions.

`POST https://product.gelatoapis.com/v3/stock/region-availability`

#### Request example

```
$ curl --location --request POST 'https://product.gelatoapis.com/v3/stock/region-availability' \
-H 'X-API-KEY: {{apiKey}}' \
-H 'Content-Type: application/json' \
-d '{
  "products": [
    "wall_hanger_product_whs_290-mm_whc_white_whm_wood_whp_w14xt20-mm",
    "frame_and_poster_product_frs_300x400-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_300x400-mm_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_hor",
    "non-existing-product-uid"
  ]
}'
```

#### Response example

```
{
  "productsAvailability": [
    {
      "productUid": "wall_hanger_product_whs_290-mm_whc_white_whm_wood_whp_w14xt20-mm",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2022-02-13"
        },
        {
          "stockRegionUid": "OC",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "AS",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "in-stock",
          "replenishmentDate": null
        }
      ]
    },
    {
      "productUid": "frame_and_poster_product_frs_300x400-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_300x400-mm_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_hor",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "OC",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2022-04-21"
        },
        {
          "stockRegionUid": "AS",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2021-11-04"
        }
      ]
    },
    {
      "productUid": "non-existing-product-uid",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "OC",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "AS",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "not-supported",
          "replenishmentDate": null
        }
      ]
    }
  ]
}
```

#### Request parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **products** _(required)_ | string\[\] | Array of product UIDs to check availability for. Product UIDs can be taken from [Product Search API](https://dashboard.gelato.com/docs/products/product/search). Minimum number of requested products: 1. Max number of requested products: 250. |

## Successful response

#### Response parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productsAvailability** _(required)_ | ProductAvailability\[\] | Array of product's availability in region. |

`ProductAvailability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product UID from the request. |
| **availability** _(required)_ | Availability | Availability in region. |

`Availability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **stockRegionUid** _(required)_ | string | One of [defined stock region UIDs](https://dashboard.gelato.com/docs/products/stock/region-availability/#regions-definition). |
| **status** _(required)_ | string | One of the possible availability statuses. |
| **replenishmentDate** _(optional)_ | string\|null | Estimated replenishment date for `out-of-stock-replenishable` status. |

Parameter `status` can be one of 5 possible values:

*   `in-stock` - Product is in stock at one of Gelato Partners and can be be delivered to given region by at least one of the partners.

*   `out-of-stock-replenishable` - Product is temporarily out of stock at Gelato Partners but there are upcoming products that will replenish depleted stocks on an estimated `replenishmentDate`.

*   `out-of-stock` - Product is currently out of stock at both Gelato Partners and the Gelato Hub, thus cannot be delivered to the given region.

*   `non-stockable` - Product is not stock-able, thus an information if it is currently in stock or out of stock cannot be given. Example stock-able products are frames, wall hangers, envelopes and combined versions of them like framed poster. Example of non-stock-able products: printable mugs, posters, canvases, cards etc.

*   `not-supported` - Product is not recognized by Gelato.


Products are constantly being replenished at Gelato Partners and Gelato Hub, so availability can change frequently.

## Error response

#### Error response example:

```
{
  "code": "invalid_request_too_many_products",
  "message": "Too many products requested: 273 of maximum 250."
}
```

| HTTP Status Code | Code | Message |
| --- | --- | --- |
| 400 | invalid\_request\_too\_many\_products | Too many products requested: N of maximum 250. |
| 400 | invalid\_request\_products\_not\_provided | No products provided, at least one is required. |
| 401 | invalid\_api\_key\_provided | Access denied. Token is invalid. |
| 500 | internal\_server\_error | We had a problem with our server. Problem reported. Try again later. |

## Regions definition

Defined list of regions with countries that are included to them is the following.

**Region: US and Canada**

Stock region UID: `US-CA`

*   United States
*   Canada

**Region: South America**

Stock region UID: `SA`

*   Brazil
*   Argentina
*   Bolivia
*   Chile
*   Colombia
*   Ecuador
*   Guyana
*   Paraguay
*   Peru
*   Suriname
*   Uruguay
*   Venezuela

**Region: Oceania**

Stock region UID: `OC`

*   Australia
*   New Zealand

**Region: Asia**

Stock region UID: `AS`

*   Singapore
*   Vietnam
*   Brunei
*   Cambodia
*   China
*   Indonesia
*   Japan
*   Laos
*   Thailand
*   Taiwan
*   South Korea
*   Myanmar
*   Philippines
*   Malaysia

**Region: United Kingdom**

Stock region UID: `UK`

*   United Kingdom

**Region: Europe**

Stock region UID: `EU`

*   Albania
*   Andorra
*   Austria
*   Belarus
*   Belgium
*   Bosnia and Herzegovina
*   Bulgaria
*   Croatia
*   Cyprus
*   Czechia
*   Denmark
*   Estonia
*   Finland
*   France
*   Georgia
*   Germany
*   Greece
*   Hungary
*   Iceland
*   Ireland
*   Italy
*   Kosovo
*   Latvia
*   Liechtenstein
*   Lithuania
*   Luxembourg
*   Malta
*   Moldova
*   Monaco
*   Montenegro
*   Netherlands
*   North Macedonia
*   Norway
*   Poland
*   Portugal
*   Romania
*   Russia
*   San Marino
*   Serbia
*   Slovakia
*   Slovenia
*   Spain
*   Sweden
*   Switzerland
*   Turkey
*   Ukraine
*   Vatican City

**Region: Rest of the world**

Stock region UID: `ROW`

*   Afghanistan
*   Algeria
*   Angola
*   Anguilla
*   Antigua and Barbuda
*   Armenia
*   Aruba
*   Azerbaijan
*   Bahamas
*   Bahrain
*   Bangladesh
*   Barbados
*   Belize
*   Benin
*   Bermuda
*   Bhutan
*   Bonaire, Saint Eustatius and Saba
*   Botswana
*   Bouvet Island
*   Burkina Faso
*   Burundi
*   Cameroon
*   Cape Verde
*   Cayman Islands
*   Central African Republic
*   Chad
*   Christmas Island
*   Cocos (Keeling) Islands
*   Comoros
*   Congo
*   Congo, the Democratic Republic of the
*   Cook Islands
*   Costa Rica
*   Cuba
*   Ivory Coast
*   Djibouti
*   Dominica
*   Dominican Republic
*   Egypt
*   El Salvador
*   Equatorial Guinea
*   Eritrea
*   Ethiopia
*   Falkland Islands (Malvinas)
*   Faroe Islands
*   Federated States of Micronesia
*   Fiji
*   French Guiana
*   French Polynesia
*   Gabon
*   Gambia
*   Ghana
*   Gibraltar
*   Greenland
*   Grenada
*   Guadeloupe
*   Guatemala
*   Guernsey
*   Guinea
*   Guinea-Bissau
*   Haiti
*   Honduras
*   Hong Kong
*   India
*   Iran
*   Iraq
*   Israel
*   Jamaica
*   Jersey
*   Jordan
*   Kazakhstan
*   Kenya
*   Kiribati
*   Kuwait
*   Kyrgyzstan
*   Lebanon
*   Lesotho
*   Liberia
*   Libya
*   Macao
*   Madagascar
*   Malawi
*   Maldives
*   Mali
*   Marshall Islands
*   Martinique
*   Mauritania
*   Mauritius
*   Mayotte
*   Mexico
*   Mongolia
*   Montserrat
*   Morocco
*   Mozambique
*   Namibia
*   Nauru
*   Nepal
*   Netherlands Antilles
*   New Caledonia
*   Nicaragua
*   Niger
*   Nigeria
*   Niue
*   North Korea
*   Oman
*   Pakistan
*   Palau
*   Palestinian Territory, Occupied
*   Panama
*   Papua New Guinea
*   Pitcairn
*   Qatar
*   Rwanda
*   Réunion
*   Saint Helena, Ascension and Tristan da Cunha
*   Saint Kitts and Nevis
*   Saint Lucia
*   Saint Pierre and Miquelon
*   Samoa
*   Sao Tome and Principe
*   Saudi Arabia
*   Senegal
*   Seychelles
*   Sierra Leone
*   Solomon Islands
*   Somalia
*   South Africa
*   South Sudan
*   Sri Lanka
*   St. Vincent & the Grenadines
*   Sudan
*   Svalbard and Jan Mayen
*   Swaziland
*   Syria
*   Tajikistan
*   Tanzania, United Republic of
*   Timor-Leste
*   Togo
*   Tonga
*   Trinidad and Tobago
*   Tunisia
*   Turkmenistan
*   Turks and Caicos Islands
*   Tuvalu
*   Uganda
*   United Arab Emirates (UAE)
*   Uzbekistan
*   Vanuatu
*   Virgin Islands, British
*   Wallis and Futuna
*   Western Sahara
*   Yemen
*   Zambia
*   Zimbabwe

**Countries currently not supported by Gelato**

*   Åland Islands
*   British Indian Ocean Territory
*   French Southern Territories
*   Heard Island and McDonald Islands
*   Isle of Man
*   Norfolk Island
*   South Georgia and the South Sandwich Islands
*   Tokelau
*   United States Minor Outlying Islands

- - -

# Shipment

Use this endpoint to get information on each shipment method that Gelato provides. The shipping methods can be filtered on shipment destination country.

`GET https://shipment.gelatoapis.com/v1/shipment-methods`

#### Request example

```
$  curl -X GET https://shipment.gelatoapis.com/v1/shipment-methods \
    -H 'X-API-KEY: {{apiKey}}'

```

#### Response example

```
{
    "shipmentMethods": [
        {
            "shipmentMethodUid": "dhl_global_parcel",
            "type": "normal",
            "name": "DHL Global Parcel",
            "isBusiness": true,
            "isPrivate": true,
            "hasTracking": true,
            "supportedCountries": [
                "AT",
                "BE",
                "BG",
                "CH",
                "CY",
                "CZ",
                "DK",
                "EE",
                "FI",
                "FO",
                "FR",
                "GB",
                "GI",
                "GL",
                "GR",
                "HR",
                "HU",
                "IE",
                "IT",
                "LT",
                "LU",
                "LV",
                "MT",
                "NG",
                "NL",
                "NO",
                "PL",
                "PT",
                "RO",
                "SE",
                "SI",
                "SK"
            ]
        },
        {
            "shipmentMethodUid": "dhl_parcel",
            "type": "normal",
            "name": "DHL Parcel",
            "isBusiness": true,
            "isPrivate": true,
            "hasTracking": true,
            "supportedCountries": [
                "DE"
            ]
        },
        {
            "shipmentMethodUid": "tnt_parcel",
            "type": "normal",
            "name": "PostNL Standard",
            "isBusiness": true,
            "isPrivate": true,
            "hasTracking": true,
            "supportedCountries": [
                "NL"
            ]
        },
        {
            "shipmentMethodUid": "tnt_global_pack",
            "type": "normal",
            "name": "PostNL Global Pack",
            "isBusiness": true,
            "isPrivate": true,
            "hasTracking": true,
            "supportedCountries": [
                "AT",
                "AU",
                "AX",
                "BE",
                "BG",
                "BR",
                "CA",
                "CH",
                "CN",
                "CY",
                "CZ",
                "DE",
                "DK",
                "EE",
                "ES",
                "FI",
                "FR",
                "GR",
                "HK",
                "HR",
                "HU",
                "IE",
                "IN",
                "IT",
                "JP",
                "LT",
                "LU",
                "LV",
                "MT",
                "NO",
                "NZ",
                "PL",
                "PT",
                "RO",
                "RU",
                "SE",
                "SI",
                "SK",
                "TR",
                "US",
                "ZA"
            ]
        }
    ]
}
```

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **country** _(optional)_ | string | Destination country ISO code |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **shipmentMethods** _(required)_ | Method\[\] | Array of Method objects. |

`MethodObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **shipmentMethodUid** _(required)_ | string | Unique Shipment method identifier. |
| **type** _(required)_ | string | Shipping service type. Can be: normal, express or pallet. |
| **name** _(required)_ | string | The name of the Shipment method. |
| **isBusiness** _(required)_ | bool | Indicates if the shipment method is suitable for shipping to business addresses. |
| **isPrivate** _(required)_ | bool | Indicates if the shipment method is suitable for shipping to residential addresses. |
| **hasTracking** _(required)_ | bool | Defines if the shipment method is tracked, i.e. you will receive a tracking code and URL when the order is shipped with the shipment method. |
| **supportedCountries** _(required)_ | string\[\] | List of destination country ISO codes where the method is available as a delivery option. |

- - -

# Templates

## Create product (from template)

Use this endpoint to create product from template.

Read more about creating a template [here](https://dashboard.gelato.com/docs/guides/create-product-from-template/)

`POST https://ecommerce.gelatoapis.com/v1/stores/{{storeId}}/products:create-from-template`

#### Request example

```
$ curl -X POST "https://ecommerce.gelatoapis.com/v1/stores/{{storeId}}/products:create-from-template" \
    -H 'X-API-KEY: {{apiKey}}' \
    -H 'Content-Type: application/json' \
    -d '{
            "templateId": "c12a363e-0d4e-4d96-be4b-bf4138eb8743",
            "title": "Classic Unisex Crewneck T-shirt",
            "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>",
            "isVisibleInTheOnlineStore": true,
            "salesChannels": [
                "web"
            ],
            "tags": [
                "tshirt",
                "unisex"
            ],
            "variants": [
                {
                    "templateVariantId": "83e30e31-0aee-4eca-8a8f-dceb2455cdc1",
                    "imagePlaceholders": [
                        {
                            "name": "ImageFront",
                            "fileUrl": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                        }
                    ]
                },
                {
                    "templateVariantId": "d7c3241e-db88-40f1-9862-3d145b29dfef",
                    "imagePlaceholders": [
                        {
                            "name": "ImageFront",
                            "fileUrl": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                        }
                    ]
                },
                {
                    "templateVariantId": "582fe1ea-7f4e-4507-9e3d-7f49a38aa2d7",
                    "imagePlaceholders": [
                        {
                            "name": "ImageFront",
                            "fileUrl": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                        }
                    ]
                },
                {
                    "templateVariantId": "49f54e49-2ac5-466b-9938-473b1cc82a8b",
                    "imagePlaceholders": [
                        {
                            "name": "ImageFront",
                            "fileUrl": "https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech/docs/sample-print-files/business_card_empty.pdf"
                        }
                    ]
                }
            ],
            "productType": "Printable Matrial",
            "vendor": "Gelato"
        }'
```

#### Response example

```
{
  "id": "2e856a12-2f83-4a1f-ac50-4d63c57bc233",
  "storeId": "6ada0d2f-73f4-41f4-af92-91911c22171d",
  "externalId": null,
  "title": "Classic Unisex Crewneck T-shirt",
  "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>",
  "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/448b66a9-b7bb-410f-a6ae-50ba2474fcf8/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230613%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230613T123555Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=d3a39af4fc89cf2e1c63d0292bf963fabfad77a370d5c76678bf55f81a35ff80",
  "status": "created",
  "tags": [
    "tshirt",
    "unisex"
  ],
  "productType": "Printable Matrial",
  "vendor": "Gelato",
  "publishedAt": "2023-06-14T11:02:47+0000",
  "createdAt": "2023-06-13T11:02:47+0000",
  "updatedAt": "2023-06-13T11:02:47+0000"
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **storeId** _(required)_ | string | Store id. |
| **templateId** _(required)_ | string | Template id. |
| **title** _(required)_ | string | Product title. |
| **description** _(required)_ | string | Product description. |
| **isVisibleInTheOnlineStore** _(optional)_ | boolean | Indicates whether the product is visible in the online store. By default - false. |
| **salesChannels** _(optional)_ | string\[\] | Whether the product is published to the Point of Sale channel. Possible values: `web`, `global`. By default - `web`. `web` - The product isn't published to the Point of Sale channel. `global` - The product is published to the Point of Sale channel. We support it only for Shopify stores. |
| **variants** _(optional)_ | VariantObject\[\] | Array of product variants, each containing information about the variant placeholders which need to be updated. If you do not provide variants in the request, the product will be created with variants as per variants in template. If only a few variants are provided, the product will be created with those variants only. For example if template has three variants Small, Medium and Large and you provide only Small and Medium variant information then the product will include Small and Medium variants only. |
| **tags** _(optional)_ | string\[\] | List of tags that are used for filtering and search. A product can have up to 13 tags. Each tag can have up to 255 characters. In the case of `Etsy` tag length is limited to 20 characters. |
| **productType** _(optional)_ | string | Product type for the shop's products that are published to your app. |
| **vendor** _(optional)_ | string | Product Vendor is designed to present the vendor (the provider of products) |

`VariantObject`

**Note**: If no variants are specified, the product will be created with all the variants from the template. Alternatively, if you provide a subset of variants, the product will be generated with only those specified variants.

| Parameter | Type | Description |
| --- | --- | --- |
| **templateVariantId** _(required)_ | string | Template Variant Id. |
| **position** _(optional)_ | number | Variant position. By default - 0. |
| **imagePlaceholders** _(optional)_ | ImagePlaceholderObject\[\] | Array of image placeholders which need to be updated. |

`ImagePlaceholderObject`

**Note**: Please make sure that the image placeholder name is the same as you have set in the template

| Parameter | Type | Description |
| --- | --- | --- |
| **name** _(required)_ | string | Image placeholder name. |
| **fileUrl** _(required)_ | string | Image placeholder file URL. Supported file types: `jpg`, `jpeg`, `png`, `pdf`. |
| **fitMethod** _(optional)_ | string | A way how image should be inserted. Possible values: `slice`, `meet`. Default value: `slice`. `slice` - Fill the whole placeholder and cut content which goes outside. `meet` - Make the whole content stay in the placeholder, keep not filled areas of the placeholder transparent. |

#### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **id** _(required)_ | string | Store product id. |
| **storeId** _(required)_ | string | Store id. |
| **externalId** _(optional)_ | string | Product id on external store. |
| **title** _(required)_ | string | Product title. |
| **description** _(required)_ | string | Product description. |
| **previewUrl** _(required)_ | string | Product preview url. |
| **status** _(required)_ | string | Product status. Possible values: `created`, `publishing`, `active`, `publishing_error`. |
| **tags** _(optional)_ | string\[\] | List of product tags |
| **productType** _(optional)_ | string | Product type. |
| **vendor** _(optional)_ | string | Product's vendor. |
| **publishedAt** _(optional)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was published. |
| **createdAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was created. |
| **updatedAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was updated. |

- - -
## Get product

Use the Product Get API to retrieve product information

`GET https://ecommerce.gelatoapis.com/v1/stores/{{storeId}}/products/{{productId}}`

#### Request example

```
$ curl -X GET \
   https://ecommerce.gelatoapis.com/v1/stores/6ada0d2f-73f4-41f4-af92-91911c22171d/products/2e856a12-2f83-4a1f-ac50-4d63c57bc233 \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```
{
  "id": "2e856a12-2f83-4a1f-ac50-4d63c57bc233",
  "storeId": "6ada0d2f-73f4-41f4-af92-91911c22171d",
  "externalId": "7647344525468",
  "title": "Classic Unisex Crewneck T-shirt",
  "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>\n<br><br>\n<p><strong>Size guide</strong></p>\n\n<br><br>\n<table>\n<tr>\n<td>&nbsp;</td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (cm)</strong></td>\n<td>70.99</td>\n<td>73.66</td>\n<td>76.00</td>\n<td>78.74</td>\n<td>81.00</td>\n<td>83.82</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (cm)</strong></td>\n<td>45.72</td>\n<td>50.80</td>\n<td>55.88</td>\n<td>60.96</td>\n<td>65.99</td>\n<td>70.99</td>\n</tr>\n</table>\n\n\n<br><br>\n<table>\n<tr>\n<td>&nbsp;</td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (inches)</strong></td>\n<td>27.95</td>\n<td>29.00</td>\n<td>29.92</td>\n<td>31.00</td>\n<td>31.89</td>\n<td>33.00</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (inches)</strong></td>\n<td>18.00</td>\n<td>20.00</td>\n<td>22.00</td>\n<td>24.00</td>\n<td>25.98</td>\n<td>27.95</td>\n</tr>\n</table>\n\n\n<br><br>\n<p><strong>Care instructions</strong></p>\n<table><tr><td>Wash</td><td>Machine, warm, inside out, similar colors</td>\n<tr><td>Tumble Dry</td><td>Low</td>\n<tr><td>Bleach</td><td>Only non-chlorine</td>\n<tr><td>Dry Clean</td><td>Do not dry clean</td>\n<tr><td>Iron</td><td>Do not iron</td>\n</table>",
  "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230622%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230622T090654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=b0739d7d29a71dce5dd4cc831f3f8e6b337ca86da6fbf9f0b5dc912eb8784540",
  "externalPreviewUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21.png?v=1687340653",
  "externalThumbnailUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21_medium.png?v=1687340653",
  "publishingErrorCode": null,
  "status": "active",
  "publishedAt": "2023-06-21T09:44:03+0000",
  "createdAt": "2023-06-21T09:43:24+0000",
  "updatedAt": "2023-06-21T09:44:14+0000",
  "variants": [
    {
      "id": "70dbc3c5-5ca7-48f9-8b2f-b928b3d7cd19",
      "productId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
      "title": "Navy - S",
      "externalId": "42533218025628",
      "connectionStatus": "connected",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_navy_gpr_4-0"
    },
    {
      "id": "4c87c248-71d5-451c-810e-a0ecbc1ef04d",
      "productId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
      "title": "Navy - M",
      "externalId": "42533218058396",
      "connectionStatus": "connected",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_m_gco_navy_gpr_4-0"
    },
    {
      "id": "b64ea434-e022-4824-9b3b-edcfd4dee21c",
      "productId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
      "title": "White - M",
      "externalId": "42533217992860",
      "connectionStatus": "connected",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_m_gco_white_gpr_4-0"
    },
    {
      "id": "0b78ebd3-a05f-4714-bc75-3349339bd1f6",
      "productId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
      "title": "White - S",
      "externalId": "42533217960092",
      "connectionStatus": "connected",
      "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-0"
    }
  ],
  "productVariantOptions": [
    {
      "name": "Color",
      "values": [
        "White",
        "Navy"
      ]
    },
    {
      "name": "Size",
      "values": [
        "S",
        "M"
      ]
    }
  ]
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **storeId** _(required)_ | string | Store id. |
| **productId** _(required)_ | string | Product id. |

#### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Product id. |
| **storeId** | string | Store id. |
| **externalId** | string | Product id from your store. |
| **title** | string | Product title. |
| **description** | string | Product description. |
| **previewUrl** | string | Product preview url. |
| **externalPreviewUrl** | string | Product preview url from your store. |
| **externalThumbnailUrl** | string | Product thumbnail url from your store. |
| **publishingErrorCode** | string | Publishing error code. |
| **status** | string | Product status. Can be `created`, `publishing`, `publishing_error`, `active`. |
| **publishedAt** | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was published. |
| **createdAt** | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was created. |
| **updatedAt** | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when product was updated. |
| **variants** | VariantObject\[\] | Product variants. |
| **productVariantOptions** | ProductVariantOption\[\] | Product variant options. |

`VariantObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Variant id. |
| **productId** | string | Product id. |
| **title** | string | Variant title. |
| **externalId** | string | Variant id from your store. |
| **connectionStatus** | string | Variant connection status. Can be `connected`, `not_connected`, `ignored`. |
| **productUid** | string | Type of printing product in [product uid](https://dashboard.gelato.com/docs/get-started/#product-uid) format. |

`ProductVariantOption`

| Parameter | Type | Description |
| --- | --- | --- |
| **name** | string | Variant option name. |
| **values** | string\[\] | Variant option values. |

---

## List products

Use the Product List API to retrieves a list of products

`GET https://ecommerce.gelatoapis.com/v1/stores/{{storeId}}/products`

#### Request example

```
$ curl -X GET \
   https://ecommerce.gelatoapis.com/v1/stores/{{storeId}}/products \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}' \
   -d '{
        "order": "desc",
        "orderBy": "createdAt",
        "offset": 0,
        "limit": 100
    }'
```

#### Response example

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **order** _(optional)_ | string | Sorting by orderBy field. Could be `desc` or `asc`. By default - `desc`. |
| **orderBy** _(optional)_ | string | Sorting field. Could be `createdAt` or `updatedAt`. By default - `createdAt`. |
| **offset** _(optional)_ | integer | Offset for pagination (default: 0). |
| **limit** _(optional)_ | integer | Limit for pagination (default: 100, maximum: 100). |

#### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **products** | ProductObject\[\] | List of products. |

`ProductObject` Response has the same structure as on [Product Get API](https://dashboard.gelato.com/docs/ecommerce/products/get/)

---

# Templates

## Get template

Use the Template Get API to retrieve template information

`GET https://ecommerce.gelatoapis.com/v1/templates/{{templateId}}`

#### Request example

```
$ curl -X GET \
   https://ecommerce.gelatoapis.com/v1/templates/c12a363e-0d4e-4d96-be4b-bf4138eb8743 \
   -H 'Content-Type: application/json' \
   -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```

    "id": "c12a363e-0d4e-4d96-be4b-bf4138eb8743",
    "templateName": "Template For Unisex Crewneck T-shirt",
    "title": "Classic Unisex Crewneck T-shirt",
    "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>",
    "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/448b66a9-b7bb-410f-a6ae-50ba2474fcf8/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230613%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230613T110715Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=62b2c3ac545dc64e3cff87ae66dac7b3edb2740ec1c18380ec4b5a4e5db2470a",
    "variants": [
        {
            "id": "83e30e31-0aee-4eca-8a8f-dceb2455cdc1",
            "title": "White - M",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_m_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "M"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        },
        {
            "id": "d7c3241e-db88-40f1-9862-3d145b29dfef",
            "title": "White - S",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_s_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "S"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        },
        {
            "id": "582fe1ea-7f4e-4507-9e3d-7f49a38aa2d7",
            "title": "White - L",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_l_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "L"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        },
        {
            "id": "49f54e49-2ac5-466b-9938-473b1cc82a8b",
            "title": "White - XL",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_xl_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "XL"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        },
        {
            "id": "0dd2f060-3c6c-4e89-a1c3-f972da34cd79",
            "title": "White - 2XL",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_2xl_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "2XL"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        },
        {
            "id": "dd6e61c0-6709-4642-90b6-6270b4cd903c",
            "title": "White - 3XL",
            "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_3xl_gco_white_gpr_4-0",
            "variantOptions": [
                {
                    "name": "Size",
                    "value": "3XL"
                }
            ],
            "imagePlaceholders": [
                {
                    "name": "ImageFront",
                    "printArea": "front",
                    "height": 137.25,
                    "width": 244
                }
            ]
        }
    ],
    "productType": "Printable Matrial",
    "vendor": "Gelato",
    "createdAt": "2023-06-13T11:02:47+0000",
    "updatedAt": "2023-06-13T11:02:47+0000"
}
```

#### Request

| Parameter | Type | Description |
| --- | --- | --- |
| **templateId** _(required)_ | string | Template id. |

#### Response

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Template id. |
| **templateName** | string | Template name. |
| **title** | string | Product title. |
| **description** | string | Product description. |
| **previewUrl** | string | Main product preview url. |
| **productType** _(optional)_ | string | Product type for the shop's products that are published to your app. |
| **vendor** _(optional)_ | string | Product Vendor is designed to present the vendor (the provider of products) |
| **variants** | VariantObject\[\] | Array of variants in product template. |
| **createdAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when template was created. |
| **updatedAt** _(required)_ | string | Date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format when template was updated. |

`VariantObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Variant id. |
| **title** | string | Variant title. |
| **productUid** | string | Type of printing product in [product uid](https://dashboard.gelato.com/docs/get-started/#product-uid) format. |
| **variantOptions** | VariantOptionObject\[\] | Array of variant options. Fields distinguishing on which properties variant is being split |
| **imagePlaceholders** | ImagePlaceholderObject\[\] | Array of image placeholders for variant. |

`VariantOptionObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **name** | string | Variant option name. |
| **value** | string | Variant option value. |

`ImagePlaceholderObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **name** | string | Image placeholder name. |
| **printArea** | string | Image placeholder print area. Values: `front`, `back`, `neck-inner`, `neck-outer`, `sleeve-left`, `sleeve-right`. |
| **height** | number | Printable area height in mm. |
| **width** | number | Printable area width in mm. |

---
>End of API
- - -
# Webhooks

## Overview

The Gelato API can be configured to send webhook events to notify your application any time that an event happens on your order.  
The Gelato API sends the Event object, via a HTTP request, to any endpoint URLs that you have provided us.  
The Event object contains all the relevant information about what just happened, including the type of event and the data associated with that event. Please refer to the [API Portal](https://cdn-origin.gelato-api-dashboard.ie.live.gelato.tech) to configure your account with a webhook URL.

### Webhook URL

Your Webhook URL endpoint must be RESTful. All calls must be implemented as a HTTP post and with TLS encrypted. The HTTP response code 2xx is expected on positive calls, all other response codes will be considered as an error.

### Request data

All events will be posted as JSON objects to your [Webhook URL](https://dashboard.gelato.com/docs/webhooks/#webhook-url) endpoint. The documentation for each webhook request is described below.

### Response data

No response content is expected, any content will be ignored.

### Retries

Webhooks will try to send the [request data](https://dashboard.gelato.com/docs/webhooks/#request-data) 3 times, with 5 seconds delay between each try, if an HTTP status 2xx is not returned.

## Events

### Order Status Updated

It is triggered when order status is changed. This event provides information about the new status of the order and its items, as well as its tracking codes if they are available.

> Order status object example:

```
{
    "id": "os_5e5680ce494f6",
    "event": "order_status_updated",
    "orderId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df0e24d9",
    "storeId": null,
    "orderReferenceId": "{{MyOrderId}}",
    "fulfillmentStatus": "shipped",
    "items": [
        {
            "itemReferenceId": "{{MyItemId}}",
            "fulfillmentStatus": "shipped",
            "fulfillments": [
                {
                    "trackingCode": "code123",
                    "trackingUrl": "http://example.com/tracking?code=code123",
                    "shipmentMethodName":"DHL Express Domestic BR",
                    "shipmentMethodUid":"dhl_express_domestic_br",
                    "fulfillmentCountry":"BR",
                    "fulfillmentStateProvince":"SP",
                    "fulfillmentFacilityId": "940fec84-54bc-44fc-a8a3-7d6f02cf8f14"
                },
                {
                    "trackingCode": "code234",
                    "trackingUrl": "http://example.com/tracking?code=code234",
                    "shipmentMethodName":"DHL Express Domestic BR",
                    "shipmentMethodUid":"dhl_express_domestic_br",
                    "fulfillmentCountry":"BR",
                    "fulfillmentStateProvince":"SP",
                    "fulfillmentFacilityId": "940fec84-54bc-44fc-a8a3-7d6f02cf8f14"
                }
            ]
        }
    ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `order_status_updated`. |
| **orderId** | string | Unique ID assigned by Gelato to your order |
| **storeId** | string | E-commerce store ID identifying which store the order was placed in. It will be null if the order was placed via UI or API. |
| **orderReferenceId** | string | Reference to your internal order id. |
| **fulfillmentStatus** | string | The current order fulfillment status can be one of the statuses described under [Order statuses](https://dashboard.gelato.com/docs/orders/order_details/#order-statuses). |
| **items** | OrderItem\[\] | Array of order items, including reference id, current status and fulfillment details for each item |

`OrderItem` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **itemReferenceId** | string | Reference to your internal item id. |
| **fulfillmentStatus** | string | The current item fulfillment status can be one of the statuses described under [Order statuses](https://dashboard.gelato.com/docs/orders/order_details/#order-statuses). |
| **fulfillments** | OrderItemFulfillment\[\] | Array of fulfillment details for each order items. Each fulfillment contains information about tracking codes and shipping providers |

`OrderItemFulfillment` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **trackingCode** | string | The tracking code of the package with your item. |
| **trackingUrl** | string | The URL to shipping provider page with tracking information about your package with the item. |
| **shipmentMethodName** | string | Name of the shipping provider specified including shipment method |
| **shipmentMethodUid** | string | Unique identifier of shipping provider inside Gelato system |
| **fulfillmentCountry** | string | Code of the country where the ordered product was produced |
| **fulfillmentStateProvince** | string | Code of the state, province or region where the ordered product was produced |
| **fulfillmentFacilityId** | string | Id of production facility where the order was assigned to. |

### Order Item Status Updated

It is triggered when the status of an item has changed. This is a useful event to track information about your item, including notification if the item has been printed or if an error has occured.

> Item status object example:

```
{
  "id": "is_5b6403bd3cf1f",
  "event": "order_item_status_updated",
  "itemReferenceId": "{{MyItemId}}",
  "orderReferenceId": "{{MyOrderId}}",
  "orderId": "e82885f8-f92a-4326-b2c7-77d010f6996f",
  "storeId": null,
  "fulfillmentCountry": "US",
  "fulfillmentStateProvince": "NY",
  "fulfillmentFacilityId": "21315db8-e694-4ded-a72a-98f60814c6e8",
  "status": "passed",
  "comment": "",
  "created": "2018-08-03T07:26:52+00:00"
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `order_item_status_updated`. |
| **orderId** | string | Unique ID assigned by Gelato to your order |
| **storeId** | string | E-commerce store ID identifying which store the order was placed in. It will be null if the order was placed via UI or API. |
| **itemReferenceId** | string | Reference to your internal item id. |
| **orderReferenceId** | string | Reference to your internal order id. |
| **status** | string | The current item fulfillment status can be one of the statuses described under [Order statuses](https://dashboard.gelato.com/order_details/#order-statuses). |
| **fulfillmentCountry** | string | Code of the country where the ordered product was produced |
| **fulfillmentStateProvince** | string | Code of the state, province or region where the ordered product was produced |
| **fulfillmentFacilityId** | string | Id of production facility where the order was assigned to. |
| **comment** | string | Short text defining the reason for the status change. |
| **created** | string | Time at which the object was created. The value is in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format. |

### Order Item Tracking Code Updated

It is triggered when item is shipped, this event provides information about the tracking code and the shipping provider.

> Tracking code object example:

```
{
  "id": "tc_5b6403bd3cf2e",
  "event": "order_item_tracking_code_updated",
  "orderId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df0e24d9",
  "storeId": "84086be9-8499-4420-a4c5-02235e126e56",
  "itemReferenceId": "{{MyItemId}}",
  "orderReferenceId": "{{MyOrderId}}",
  "trackingCode": "code123",
  "trackingUrl": "http://example.com/tracking?code=code123",
  "shipmentMethodName":"DHL Express Domestic BR",
  "shipmentMethodUid":"dhl_express_domestic_br",
  "productionCountry":"BR",
  "productionStateProvince":"SP",
  "productionFacilityId": "940fec84-54bc-44fc-a8a3-7d6f02cf8f14",
  "created": "2018-08-03T12:11:30+00:00"
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `order_item_tracking_code_updated`. |
| **orderId** | string | Unique ID assigned by Gelato to your order |
| **storeId** | string | E-commerce store ID identifying which store the order was placed in. It will be null if the order was placed via UI or API. |
| **itemReferenceId** | string | Reference to your internal item id. |
| **orderReferenceId** | string | Reference to your internal order id. |
| **trackingCode** | string | The tracking code of the package with your item. |
| **trackingUrl** | string | The URL to shipping provider page with tracking information about your package with the item. |
| **shipmentMethodName** | string | Name of the shipping provider specified including shipment method |
| **shipmentMethodUid** | string | Unique identifier of shipping provider inside Gelato system |
| **fulfillmentCountry** | string | Code of the country where the ordered product was produced |
| **fulfillmentStateProvince** | string | Code of the state, province or region where the ordered product was produced |
| **fulfillmentFacilityId** | string | Id of production facility where the order was assigned to. |
| **created** | string | Time at which the object was created. The value is in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format. |

### Order Delivery Estimate Updated

!!! Beta Feature

To get access to this beta feature contact us on [apisupport@gelato.com](mailto:apisupport@gelato.com).

Triggered when an order's delivery estimate has increased. If either the estimated min or max delivery date is increased then the event will be fired. If an order contains multiple packages that would have different delivery dates then the most conservative delivery estimate will be used.

> Order Delivery Estimated Changed Object example:
>
```
{
    "id": "os_5e5680ce494f6",
    "event": "order_delivery_estimate_updated",
    "orderId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df0e24d9",
    "storeId": null,
    "orderReferenceId": "9AKJFFH372",
    "minDeliveryDate": "2022-11-03",
    "maxDeliveryDate": "2022-11-05",
    "created": "2022-11-01T07:26:52+00:00"
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `order_delivery_estimate_updated`. |
| **orderId** | string | Unique ID assigned by Gelato to your order |
| **storeId** | string | E-commerce store ID identifying which store the order was placed in. It will be null if the order was placed via UI or API. |
| **orderReferenceId** | string | Reference to your internal order id. |
| **minDeliveryDate** | string | The most recent estimated minimum delivery date of the order. |
| **maxDeliveryDate** | string | The most recent estimated maximum delivery date of the order. |
| **created** | string | Time at which the object was created. The value is in [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601) format. |

### Catalog Product Stock Availability Updated

It is triggered when the status of Stock availability in a region has changed. This event provides information about depleted or replenished stock of a product at Gelato Partners.

> Stock region availability object example:

```
{
  "id": "sra_5b6403bd3cf2e",
  "event": "catalog_product_stock_availability_updated",
  "productAvailability": [
    {
      "productUid": "frame_product_frs_500x500-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass",
      "availability": [
        {
          "stockRegionUid": "EU",
          "status": "out-of-stock"
        },
        {
          "stockRegionUid": "ROW",
          "status": "out-of-stock-replenishable"
        }
      ]
    },
    {
      "productUid": "frame_product_frs_279x432-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "in-stock"
        }
      ]
    }
  ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `catalog_product_stock_availability_updated`. |
| **productsAvailability** _(required)_ | ProductAvailability\[\] | Array of product's availability in region. |

`ProductAvailability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product UID from the request. |
| **availability** _(required)_ | Availability | Availability in region. |

`Availability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **stockRegionUid** _(required)_ | string | One of [defined stock region UIDs](https://dashboard.gelato.com/docs/products/stock/region-availability/#regions-definition). |
| **status** _(required)_ | string | One of the possible availability statuses. |

Parameter `status` can be one of 3 possible values:

*   `in-stock` - Product is in stock at one of Gelato Partners and can be be delivered to given region by at least one of the partners.

*   `out-of-stock-replenishable` - Product is temporarily out of stock at Gelato Partners but is in stock at the Gelato Hub which acts as a fallback solution, thus still can be delivered to the given region. Meantime the product is about to be replenished soon at the partners.

*   `out-of-stock` - Product is currently out of stock at both Gelato Partners and the Gelato Hub, thus cannot be delivered to the given region.


### Store Product Created

This webhook is triggered when a new store product is created in the Gelato system.

> Example:
>
```
{
    "id": "spc_2e856a12",
    "event": "store_product_created",  
    "storeProductId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
    "storeId": "6ada0d2f-73f4-41f4-af92-91911c22171d",
    "externalId": "7647344525468",
    "title": "Classic Unisex Crewneck T-shirt",
    "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>\n<br><br>\n<p><strong>Size guide</strong></p>\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (cm)</strong></td>\n<td>70.99</td>\n<td>73.66</td>\n<td>76.00</td>\n<td>78.74</td>\n<td>81.00</td>\n<td>83.82</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (cm)</strong></td>\n<td>45.72</td>\n<td>50.80</td>\n<td>55.88</td>\n<td>60.96</td>\n<td>65.99</td>\n<td>70.99</td>\n</tr>\n</table>\n\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (inches)</strong></td>\n<td>27.95</td>\n<td>29.00</td>\n<td>29.92</td>\n<td>31.00</td>\n<td>31.89</td>\n<td>33.00</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (inches)</strong></td>\n<td>18.00</td>\n<td>20.00</td>\n<td>22.00</td>\n<td>24.00</td>\n<td>25.98</td>\n<td>27.95</td>\n</tr>\n</table>\n\n\n<br><br>\n<p><strong>Care instructions</strong></p>\n<table><tr><td>Wash</td><td>Machine, warm, inside out, similar colors</td>\n<tr><td>Tumble Dry</td><td>Low</td>\n<tr><td>Bleach</td><td>Only non-chlorine</td>\n<tr><td>Dry Clean</td><td>Do not dry clean</td>\n<tr><td>Iron</td><td>Do not iron</td>\n</table>",
    "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230622%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230622T090654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=b0739d7d29a71dce5dd4cc831f3f8e6b337ca86da6fbf9f0b5dc912eb8784540",
    "externalPreviewUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21.png?v=1687340653",
    "externalThumbnailUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21_medium.png?v=1687340653",
    "publishingErrorCode": null,
    "status": "active",
    "publishedAt": "2023-06-21T09:44:03+0000",
    "createdAt": "2023-06-21T09:43:24+0000",
    "updatedAt": "2023-06-21T09:44:14+0000",
    "variants": [
      {
        "id": "70dbc3c5-5ca7-48f9-8b2f-b928b3d7cd19",
        "title": "Navy - S",
        "externalId": "42533218025628",
        "connectionStatus": "connected"
      },
      {
        "id": "4c87c248-71d5-451c-810e-a0ecbc1ef04d",
        "title": "Navy - M",
        "externalId": "42533218058396",
        "connectionStatus": "connected"
      },
      {
        "id": "b64ea434-e022-4824-9b3b-edcfd4dee21c",
        "title": "White - M",
        "externalId": "42533217992860",
        "connectionStatus": "connected"
      },
      {
        "id": "0b78ebd3-a05f-4714-bc75-3349339bd1f6",
        "title": "White - S",
        "externalId": "42533217960092",
        "connectionStatus": "connected"
      }
    ],
    "productVariantOptions": [
      {
        "name": "Color",
        "values": [
          "White",
          "Navy"
        ]
      },
      {
        "name": "Size",
        "values": [
          "S",
          "M"
        ]
      }
    ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `store_product_created`. |
| **storeProductId** | string | ID of created store product. |

Details related to other parameters are available [here](https://dashboard.gelato.com/docs/ecommerce/products/get/).

### Store Product Updated

This webhook is triggered when a store product is updated in the Gelato system or when the product is published.

> Example:
>
```
{
  "id": "spu_2e856a12",
  "event": "store_product_updated",
  "storeProductId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
  "storeId": "6ada0d2f-73f4-41f4-af92-91911c22171d",
  "externalId": "7647344525468",
  "title": "Classic Unisex Crewneck T-shirt",
  "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>\n<br><br>\n<p><strong>Size guide</strong></p>\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (cm)</strong></td>\n<td>70.99</td>\n<td>73.66</td>\n<td>76.00</td>\n<td>78.74</td>\n<td>81.00</td>\n<td>83.82</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (cm)</strong></td>\n<td>45.72</td>\n<td>50.80</td>\n<td>55.88</td>\n<td>60.96</td>\n<td>65.99</td>\n<td>70.99</td>\n</tr>\n</table>\n\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (inches)</strong></td>\n<td>27.95</td>\n<td>29.00</td>\n<td>29.92</td>\n<td>31.00</td>\n<td>31.89</td>\n<td>33.00</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (inches)</strong></td>\n<td>18.00</td>\n<td>20.00</td>\n<td>22.00</td>\n<td>24.00</td>\n<td>25.98</td>\n<td>27.95</td>\n</tr>\n</table>\n\n\n<br><br>\n<p><strong>Care instructions</strong></p>\n<table><tr><td>Wash</td><td>Machine, warm, inside out, similar colors</td>\n<tr><td>Tumble Dry</td><td>Low</td>\n<tr><td>Bleach</td><td>Only non-chlorine</td>\n<tr><td>Dry Clean</td><td>Do not dry clean</td>\n<tr><td>Iron</td><td>Do not iron</td>\n</table>",
  "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230622%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230622T090654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=b0739d7d29a71dce5dd4cc831f3f8e6b337ca86da6fbf9f0b5dc912eb8784540",
  "externalPreviewUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21.png?v=1687340653",
  "externalThumbnailUrl": "https://cdn.shopify.com/s/files/1/0430/2418/7548/files/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21_medium.png?v=1687340653",
  "publishingErrorCode": null,
  "status": "active",
  "publishedAt": "2023-06-21T09:44:03+0000",
  "createdAt": "2023-06-21T09:43:24+0000",
  "updatedAt": "2023-06-21T09:44:14+0000",
  "variants": [
    {
      "id": "70dbc3c5-5ca7-48f9-8b2f-b928b3d7cd19",
      "title": "Navy - S",
      "externalId": "42533218025628",
      "connectionStatus": "connected"
    },
    {
      "id": "4c87c248-71d5-451c-810e-a0ecbc1ef04d",
      "title": "Navy - M",
      "externalId": "42533218058396",
      "connectionStatus": "connected"
    },
    {
      "id": "b64ea434-e022-4824-9b3b-edcfd4dee21c",
      "title": "White - M",
      "externalId": "42533217992860",
      "connectionStatus": "connected"
    },
    {
      "id": "0b78ebd3-a05f-4714-bc75-3349339bd1f6",
      "title": "White - S",
      "externalId": "42533217960092",
      "connectionStatus": "connected"
    }
  ],
  "productVariantOptions": [
    {
      "name": "Color",
      "values": [
        "White",
        "Navy"
      ]
    },
    {
      "name": "Size",
      "values": [
        "S",
        "M"
      ]
    }
  ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s type. The value is always `store_product_updated`. |
| **storeProductId** | string | ID of updated store product. |

Details related to other parameters are available [here](https://dashboard.gelato.com/docs/ecommerce/products/get/).

### Store Product Deleted

Triggered when a store product is deleted from the Gelato system.

> Example:
>
```
{
    "id": "spd_a6a1f9ce",
    "event": "store_product_deleted",
    "storeProductId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df4e2449"
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `store_product_deleted`. |
| **storeProductId** | string | ID of deleted store product. |

### Store Product Template Created

This webhook is triggered when a new store product template is created in the Gelato system.

> Example:
>
```
{
 "id": "sptc_2e856a12",
 "event": "store_product_template_created",
 "storeProductTemplateId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
 "title": "Classic Unisex Crewneck T-shirt",
 "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>\n<br><br>\n<p><strong>Size guide</strong></p>\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (cm)</strong></td>\n<td>70.99</td>\n<td>73.66</td>\n<td>76.00</td>\n<td>78.74</td>\n<td>81.00</td>\n<td>83.82</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (cm)</strong></td>\n<td>45.72</td>\n<td>50.80</td>\n<td>55.88</td>\n<td>60.96</td>\n<td>65.99</td>\n<td>70.99</td>\n</tr>\n</table>\n\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (inches)</strong></td>\n<td>27.95</td>\n<td>29.00</td>\n<td>29.92</td>\n<td>31.00</td>\n<td>31.89</td>\n<td>33.00</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (inches)</strong></td>\n<td>18.00</td>\n<td>20.00</td>\n<td>22.00</td>\n<td>24.00</td>\n<td>25.98</td>\n<td>27.95</td>\n</tr>\n</table>\n\n\n<br><br>\n<p><strong>Care instructions</strong></p>\n<table><tr><td>Wash</td><td>Machine, warm, inside out, similar colors</td>\n<tr><td>Tumble Dry</td><td>Low</td>\n<tr><td>Bleach</td><td>Only non-chlorine</td>\n<tr><td>Dry Clean</td><td>Do not dry clean</td>\n<tr><td>Iron</td><td>Do not iron</td>\n</table>",
 "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230622%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230622T090654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=b0739d7d29a71dce5dd4cc831f3f8e6b337ca86da6fbf9f0b5dc912eb8784540",
 "createdAt": "2023-06-21T09:43:24+0000",
 "updatedAt": "2023-06-21T09:44:14+0000",
 "variants": [
  {
   "id": "079e8578-5cf8-42d7-aa94-d87e719a305d",
   "title": "Black - X - Embroidery",
   "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-weight_gsi_x_gco_black_gpr_chstl-emb",
   "variantOptions": [
    {
     "name": "Color",
     "value": "Black"
    },
    {
     "name": "Size",
     "value": "X"
    }
   ],
   "imagePlaceholders": [
    {
     "name": "Image1",
     "printArea": "chest-left-embroidery",
     "height": 137.25,
     "width": 244
    }
   ],
   "textPlaceholders": [
    {
     "name": "Text",
     "text": "My Text"
    },
    {
     "name": "Text2",
     "text": "Something"
    }
   ]
  },
  {
   "id": "1613f840-47e7-4fae-ba9e-1a61e9a71226",
   "title": "White - XL - Embroidery",
   "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-weight_gsi_xl_gco_white_gpr_chstl-emb",
   "variantOptions": [
    {
     "name": "Color",
     "value": "White"
    },
    {
     "name": "Size",
     "value": "XL"
    }
   ],
   "imagePlaceholders": [
    {
     "name": "Image1",
     "printArea": "chest-left-embroidery",
     "height": 137.25,
     "width": 244
    }
   ],
   "textPlaceholders": [
    {
     "name": "Text",
     "text": "My Text"
    },
    {
     "name": "Text2",
     "text": "Something"
    }
   ]
  }
 ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `store_product_template_created`. |
| **storeProductTempalteId** | string | ID of created store product template. |

Details related to other parameters are available [here](https://dashboard.gelato.com/docs/ecommerce/templates/get/).

### Store Product Template Updated

This webhook is triggered when a store product template is updated in the Gelato system.

> Example:
>
```
{
 "id": "sptu_2e856a12",
 "event": "store_product_template_updated",
 "storeProductTemplateId": "62b20586-e4c4-46e7-8d0d-9e203b02b2ea",
 "title": "Classic Unisex Crewneck T-shirt",
 "description": "<div><p>A classic unisex t-shirt that works well with any outfit. Made of a heavier cotton with a double-stitched neckline and sleeves.</p><p>- Rolled-forward shoulders for a better fit<br>- Stylish fitted sleeve<br>- Seamless double-needle collar<br>- Taped neck and shoulders for durability<br>- Tubular fit for minimal torque</p><p>This product is made on demand. No minimums.</p></div>\n<br><br>\n<p><strong>Size guide</strong></p>\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (cm)</strong></td>\n<td>70.99</td>\n<td>73.66</td>\n<td>76.00</td>\n<td>78.74</td>\n<td>81.00</td>\n<td>83.82</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (cm)</strong></td>\n<td>45.72</td>\n<td>50.80</td>\n<td>55.88</td>\n<td>60.96</td>\n<td>65.99</td>\n<td>70.99</td>\n</tr>\n</table>\n\n\n<br><br>\n<table>\n<tr>\n<td> </td>\n<td><strong>S</strong></td>\n<td><strong>M</strong></td>\n<td><strong>L</strong></td>\n<td><strong>XL</strong></td>\n<td><strong>2XL</strong></td>\n<td><strong>3XL</strong></td>\n</tr>\n<tr>\n<td><strong>A) Length (inches)</strong></td>\n<td>27.95</td>\n<td>29.00</td>\n<td>29.92</td>\n<td>31.00</td>\n<td>31.89</td>\n<td>33.00</td>\n</tr>\n<tr>\n<td><strong>B) Half Chest (inches)</strong></td>\n<td>18.00</td>\n<td>20.00</td>\n<td>22.00</td>\n<td>24.00</td>\n<td>25.98</td>\n<td>27.95</td>\n</tr>\n</table>\n\n\n<br><br>\n<p><strong>Care instructions</strong></p>\n<table><tr><td>Wash</td><td>Machine, warm, inside out, similar colors</td>\n<tr><td>Tumble Dry</td><td>Low</td>\n<tr><td>Bleach</td><td>Only non-chlorine</td>\n<tr><td>Dry Clean</td><td>Do not dry clean</td>\n<tr><td>Iron</td><td>Do not iron</td>\n</table>",
 "previewUrl": "https://gelato-api-test.s3.eu-west-1.amazonaws.com/ecommerce/store_product_image/e1bd4fb5-f8de-48dc-a06b-f0cf66b6cd21/preview?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIATQZMBOFCESNXH67O%2F20230622%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230622T090654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=86400&X-Amz-Signature=b0739d7d29a71dce5dd4cc831f3f8e6b337ca86da6fbf9f0b5dc912eb8784540",
 "createdAt": "2023-06-21T09:43:24+0000",
 "updatedAt": "2023-06-21T09:44:14+0000",
 "variants": [
  {
   "id": "079e8578-5cf8-42d7-aa94-d87e719a305d",
   "title": "Black - X - Embroidery",
   "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-weight_gsi_x_gco_black_gpr_chstl-emb",
   "variantOptions": [
    {
     "name": "Color",
     "value": "Black"
    },
    {
     "name": "Size",
     "value": "X"
    }
   ],
   "imagePlaceholders": [
    {
     "name": "Image1",
     "printArea": "chest-left-embroidery",
     "height": 137.25,
     "width": 244
    }
   ],
   "textPlaceholders": [
    {
     "name": "Text",
     "text": "My Text"
    },
    {
     "name": "Text2",
     "text": "Something"
    }
   ]
  },
  {
   "id": "1613f840-47e7-4fae-ba9e-1a61e9a71226",
   "title": "White - XL - Embroidery",
   "productUid": "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_heavy-weight_gsi_xl_gco_white_gpr_chstl-emb",
   "variantOptions": [
    {
     "name": "Color",
     "value": "White"
    },
    {
     "name": "Size",
     "value": "XL"
    }
   ],
   "imagePlaceholders": [
    {
     "name": "Image1",
     "printArea": "chest-left-embroidery",
     "height": 137.25,
     "width": 244
    }
   ],
   "textPlaceholders": [
    {
     "name": "Text",
     "text": "My Text"
    },
    {
     "name": "Text2",
     "text": "Something"
    }
   ]
  }
 ]
}
```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s type. The value is always `store_product_template_updated`. |
| **storeProductTemplateId** | string | ID of updated store product template. |

Details related to other parameters are available [here](https://dashboard.gelato.com/docs/ecommerce/templates/get/).

### Store Product Template Deleted

Triggered when a store product template is deleted from the Gelato system.

> Example:
>
```
{
    "id": "sptd_a6a1f9ce",
    "event": "store_product_template_deleted",
    "storeProductTemplateId": "a6a1f9ce-2bdd-4a9e-9f8d-0009df4e2449"
}

```

**Object parameters**

| Parameter | Type | Description |
| --- | --- | --- |
| **id** | string | Unique identifier for the event. |
| **event** | string | String representing the event’s name. The value is always `store_product_template_deleted`. |
| **storeProductTemplateId** | string | ID of deleted store product template. |
