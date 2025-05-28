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
