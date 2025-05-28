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
