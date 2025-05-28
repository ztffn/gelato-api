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
