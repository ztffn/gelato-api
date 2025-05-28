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
