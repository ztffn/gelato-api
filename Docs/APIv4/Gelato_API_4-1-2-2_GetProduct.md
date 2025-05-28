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
