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


# API v.4 References


---

---

---

---


- - -


- - -


- - -

- - -


- - -

# Templates



---

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
