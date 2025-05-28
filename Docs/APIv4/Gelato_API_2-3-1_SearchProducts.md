# Search products

Use this endpoint to list products from a catalog. You can filter the list of products on the product attributes.

`POST https://product.gelatoapis.com/v3/catalogs/{{catalogUid}}/products:search`

#### Request example

```
$ curl -X POST "https://product.gelatoapis.com/v3/catalogs/posters/products:search" \
    -H 'X-API-KEY: {{apiKey}}' \
    -H 'Content-Type: application/json' \
    -d '{
        "attributeFilters": {
            "Orientation": ["hor", "ver"],
            "CoatingType": ["none"]
        },
        "limit": 50,
        "offset": 0
    }'
```

#### Response example

```
{
  "products": [
    {
      "productUid": "8pp-accordion-fold_pf_dl_pt_100-lb-text-coated-silk_cl_4-4_ft_8pp-accordion-fold-ver_ver",
      "attributes": {
        "CoatingType": "none",
        "ColorType": "4-4",
        "FoldingType": "8pp-accordion-fold-ver",
        "Orientation": "ver",
        "PaperFormat": "DL",
        "PaperType": "100-lb-text-coated-silk",
        "ProductStatus": "activated",
        "ProtectionType": "none",
        "SpotFinishingType": "none",
        "Variable": "no"
      },
      "weight": {
        "value": 12.308,
        "measureUnit": "grams"
      },
      "dimensions": {
        "Thickness": {
          "value": 0.14629,
          "measureUnit": "mm"
        },
        "Width": {
          "value": 99,
          "measureUnit": "mm"
        },
        "Height": {
          "value": 210,
          "measureUnit": "mm"
        }
      }
    }
  ],
  "hits": {
    "attributeHits": {
      "CoverColorType": {
        "none": 106,
        "4-4": 3041
      },
      "ProtectionType": {
        "1-1": 1590,
        "1-0": 1971,
        "none": 2137
      },
      "CoatingType": {
        "glossy-protection": 1765,
        "matt-protection": 1592,
        "glossy-coating": 102,
        "glossy-lamination": 43,
        "matt-lamination": 44,
        "matt-coating": 10,
        "soft-touch-lamination": 5,
        "none": 2137
      },
      "CustomPaperFormat": {
        "custom": 13,
        "custom-flyers": 1
      },
      "BannerMaterial": {
        "polyester-fabric": 2
      },
      "ClosingType": {
        "tape-doublesided": 12
      },
      "BaseArea": {
        "80mm": 6
      }
    }
  }
}
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. Value be taken as `catalogUid`field in Catalog list API call. |
| **attributeFilters** _(optional)_ | AttributeFilters | Associative array of the product attribute based filters for filtering |
| **limit** _(optional)_ | int | Maximum amount of products within the response. Upper limit is 100. |
| **offset** _(optional)_ | int | Offset for the products list. Default value: 0 |

`AttributeFilters`

Associative array of the attribute filters for the search.

Keys represent attribute Uid. They can be taken from `productAttributeUid` parameter in Catalog info API response.

Values is an array of attribute values. They can be taken from `productAttributeValueUid` parameter in Catalog info API response.

```
{
    "Orientation": ["hor", "ver"],
    "CoatingType": ["none"]
}
```


#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **products** _(required)_ | Product\[\] | List of the products. |
| **hits** _(required)_ | FilterHits | List of the attributes with their possible values and number of hits for each value. |

`Product` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product UID. |
| **attributes** _(required)_ | ProductAttributes | Associative array of product attributes. |
| **weight** _(required)_ | MeasureUnit | Weight of the product. |
| **dimensions** _(required)_ | MeasureUnit\[\] | Product dimensions depending on the product model. Possible values can be Width, Thickness, Height, etc. |
| **supportedCountries** _(required)_ | string\[\] | Codes array of supported countries. Each string is the two-character [ISO 3166-1](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) code that identifies the country or region. Please note: the country code for United Kingdom is `GB` and not `UK` as used in the top-level domain names for that country.  <br>_Pattern: ^\[A-Z\]{2}$_ |

`ProductAttributes`

Associative array of product attributes.

Keys represent attributes names. These are the same as `ProductAttributeUid` in Catalog info API response.

Values represent attribute values. These are the same as `ProductAttributeValueUid` in Catalog info API response.

```
{
    "CoatingType": "none",
    "ColorType": "4-4",
    "FoldingType": "8pp-accordion-fold-ver"
}

```

`MeasureUnit` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **value** _(required)_ | float | Value in a given units of measurement. |
| **measureUnit** _(required)_ | string | Name of the unit of measurement (grams, mm, etc). |

`FilterHits` parameters

| Parameter | Type |
| --- | --- |
| **attributeHits** _(required)_ | AttributeHits |

`AttributeHits`

Associative array of product attributes with the number of hits for each possible value.

The 1st level of keys represents attributes. These are the same as `ProductAttributeUid` in Catalog info API response.

The 2nd level of keys represents attribute values. These are the same as `ProductAttributeValueUid` in Catalog info API response. Array values represent number of hits for each value.

```
{
    "CoverColorType": {
        "none": 106,
        "4-4": 3041
    },
    "ProtectionType": {
        "1-1": 1590,
        "1-0": 1971,
        "none": 2137
    }
}
```

- - -
