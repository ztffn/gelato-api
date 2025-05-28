# Cover dimensions

Use this endpoint to get information about the dimensions of the cover of a product such as photo book or a multi-page brochure.

`GET https://product.gelatoapis.com/v3/products/{{productUid}}/cover-dimensions`

#### Request example

`$ curl -X GET 'https://product.gelatoapis.com/v3/products/photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver/cover-dimensions?pageCount=34' \     -H 'X-API-KEY: {{apiKey}}'`

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
