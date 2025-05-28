# Get catalog

Get information about a specific catalog. Includes a catalogs attributes which defines the products stored inside of the catalog.

`GET https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}`

#### Request example

```
$ curl -X GET "https://product.gelatoapis.com/v3/catalogs/posters" \
    -H 'X-API-KEY: {{apiKey}}'

```

#### Response example

```
{
  "catalogUid": "posters",
  "title": "Posters",
  "productAttributes": [
    {
      "productAttributeUid": "Orientation",
      "title": "Orientation",
      "values": [
        {
          "productAttributeValueUid": "hor",
          "title": "Landscape"
        },
        {
          "productAttributeValueUid": "ver",
          "title": "Portrait"
        }
      ]
    },
    {
      "productAttributeUid": "PaperFormat",
      "title": "Paper Format",
      "values": [
        {
          "productAttributeValueUid": "A1",
          "title": "A1"
        },
        {
          "productAttributeValueUid": "A2",
          "title": "A2"
        },
        {
          "productAttributeValueUid": "A3",
          "title": "A3"
        }
      ]
    }
  ]
}
```

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. Value be taken as `catalogUid`field in Catalog list API call. |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. |
| **title** _(required)_ | string | Title of the catalog. |
| **productAttributes** _(required)_ | ProductAttribute\[\] | Array of product attributes and their possible values. All products in the catalog are defined by these attributes. |

`ProductAttribute` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productAttributeUid** _(required)_ | string | Attribute unique identifier. |
| **title** _(required)_ | string | Attribute title. |
| **values** _(required)_ | ProductAttributeValue\[\] | Array of possible values for the attribute. |

`ProductAttributeValue` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productAttributeValueUid** _(required)_ | string | Attribute value unique identifier. |
| **title** _(required)_ | string | Attribute title. |

- - -
