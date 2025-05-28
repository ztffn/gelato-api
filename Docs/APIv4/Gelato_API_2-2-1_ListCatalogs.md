# List catalogs

Gives a list of available catalogs

`GET https://product.gelatoapis.com/v3/catalogs`

#### Request example

```
$  curl -X GET https://product.gelatoapis.com/v3/catalogs \
    -H 'X-API-KEY: {{apiKey}}'
```

#### Response example

```
[
    {
        "catalogUid": "cards",
        "title": "cards"
    },
    {
        "catalogUid": "posters",
        "title": "Posters"
    },
    {
        "catalogUid": "multipage-brochures",
        "title": "Multipage Brochures"
    }
]
```

#### Response parameters

Response is a collection `Catalog` objects.

`Catalog` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **catalogUid** _(required)_ | string | Catalog unique identifier. |
| **title** _(required)_ | string | Title of the catalog. |

- - -
