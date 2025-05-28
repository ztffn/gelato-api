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
