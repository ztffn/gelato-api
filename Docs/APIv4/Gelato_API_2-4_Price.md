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
