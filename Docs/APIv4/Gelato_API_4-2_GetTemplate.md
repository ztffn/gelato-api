# Get template

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
{
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
