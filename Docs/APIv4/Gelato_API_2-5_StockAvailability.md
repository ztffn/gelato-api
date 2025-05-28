
## Stock availability

Use this endpoint to get information about the availability of stock-able products in different regions.

`POST https://product.gelatoapis.com/v3/stock/region-availability`

#### Request example

```
$ curl --location --request POST 'https://product.gelatoapis.com/v3/stock/region-availability' \
-H 'X-API-KEY: {{apiKey}}' \
-H 'Content-Type: application/json' \
-d '{
  "products": [
    "wall_hanger_product_whs_290-mm_whc_white_whm_wood_whp_w14xt20-mm",
    "frame_and_poster_product_frs_300x400-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_300x400-mm_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_hor",
    "non-existing-product-uid"
  ]
}'
```


#### Response example

```
{
  "productsAvailability": [
    {
      "productUid": "wall_hanger_product_whs_290-mm_whc_white_whm_wood_whp_w14xt20-mm",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2022-02-13"
        },
        {
          "stockRegionUid": "OC",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "AS",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "in-stock",
          "replenishmentDate": null
        }
      ]
    },
    {
      "productUid": "frame_and_poster_product_frs_300x400-mm_frc_black_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_300x400-mm_pt_170-gsm-coated-silk_cl_4-0_ct_none_prt_none_hor",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "OC",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2022-04-21"
        },
        {
          "stockRegionUid": "AS",
          "status": "in-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "out-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "out-of-stock-replenishable",
          "replenishmentDate": "2021-11-04"
        }
      ]
    },
    {
      "productUid": "non-existing-product-uid",
      "availability": [
        {
          "stockRegionUid": "US-CA",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "EU",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "OC",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "AS",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "SA",
          "status": "not-supported",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "UK",
          "status": "in-of-stock",
          "replenishmentDate": null
        },
        {
          "stockRegionUid": "ROW",
          "status": "not-supported",
          "replenishmentDate": null
        }
      ]
    }
  ]
}
```

#### Request parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **products** _(required)_ | string\[\] | Array of product UIDs to check availability for. Product UIDs can be taken from [Product Search API](https://dashboard.gelato.com/docs/products/product/search). Minimum number of requested products: 1. Max number of requested products: 250. |

## Successful response

#### Response parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productsAvailability** _(required)_ | ProductAvailability\[\] | Array of product's availability in region. |

`ProductAvailability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **productUid** _(required)_ | string | Product UID from the request. |
| **availability** _(required)_ | Availability | Availability in region. |

`Availability` parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **stockRegionUid** _(required)_ | string | One of [defined stock region UIDs](https://dashboard.gelato.com/docs/products/stock/region-availability/#regions-definition). |
| **status** _(required)_ | string | One of the possible availability statuses. |
| **replenishmentDate** _(optional)_ | string\|null | Estimated replenishment date for `out-of-stock-replenishable` status. |

Parameter `status` can be one of 5 possible values:

*   `in-stock` - Product is in stock at one of Gelato Partners and can be be delivered to given region by at least one of the partners.

*   `out-of-stock-replenishable` - Product is temporarily out of stock at Gelato Partners but there are upcoming products that will replenish depleted stocks on an estimated `replenishmentDate`.

*   `out-of-stock` - Product is currently out of stock at both Gelato Partners and the Gelato Hub, thus cannot be delivered to the given region.

*   `non-stockable` - Product is not stock-able, thus an information if it is currently in stock or out of stock cannot be given. Example stock-able products are frames, wall hangers, envelopes and combined versions of them like framed poster. Example of non-stock-able products: printable mugs, posters, canvases, cards etc.

*   `not-supported` - Product is not recognized by Gelato.


Products are constantly being replenished at Gelato Partners and Gelato Hub, so availability can change frequently.

## Error response

#### Error response example:

```
{
  "code": "invalid_request_too_many_products",
  "message": "Too many products requested: 273 of maximum 250."
}
```

| HTTP Status Code | Code | Message |
| --- | --- | --- |
| 400 | invalid\_request\_too\_many\_products | Too many products requested: N of maximum 250. |
| 400 | invalid\_request\_products\_not\_provided | No products provided, at least one is required. |
| 401 | invalid\_api\_key\_provided | Access denied. Token is invalid. |
| 500 | internal\_server\_error | We had a problem with our server. Problem reported. Try again later. |

## Regions definition

Defined list of regions with countries that are included to them is the following.

**Region: US and Canada**

Stock region UID: `US-CA`

*   United States
*   Canada

**Region: South America**

Stock region UID: `SA`

*   Brazil
*   Argentina
*   Bolivia
*   Chile
*   Colombia
*   Ecuador
*   Guyana
*   Paraguay
*   Peru
*   Suriname
*   Uruguay
*   Venezuela

**Region: Oceania**

Stock region UID: `OC`

*   Australia
*   New Zealand

**Region: Asia**

Stock region UID: `AS`

*   Singapore
*   Vietnam
*   Brunei
*   Cambodia
*   China
*   Indonesia
*   Japan
*   Laos
*   Thailand
*   Taiwan
*   South Korea
*   Myanmar
*   Philippines
*   Malaysia

**Region: United Kingdom**

Stock region UID: `UK`

*   United Kingdom

**Region: Europe**

Stock region UID: `EU`

*   Albania
*   Andorra
*   Austria
*   Belarus
*   Belgium
*   Bosnia and Herzegovina
*   Bulgaria
*   Croatia
*   Cyprus
*   Czechia
*   Denmark
*   Estonia
*   Finland
*   France
*   Georgia
*   Germany
*   Greece
*   Hungary
*   Iceland
*   Ireland
*   Italy
*   Kosovo
*   Latvia
*   Liechtenstein
*   Lithuania
*   Luxembourg
*   Malta
*   Moldova
*   Monaco
*   Montenegro
*   Netherlands
*   North Macedonia
*   Norway
*   Poland
*   Portugal
*   Romania
*   Russia
*   San Marino
*   Serbia
*   Slovakia
*   Slovenia
*   Spain
*   Sweden
*   Switzerland
*   Turkey
*   Ukraine
*   Vatican City

**Region: Rest of the world**

Stock region UID: `ROW`

*   Afghanistan
*   Algeria
*   Angola
*   Anguilla
*   Antigua and Barbuda
*   Armenia
*   Aruba
*   Azerbaijan
*   Bahamas
*   Bahrain
*   Bangladesh
*   Barbados
*   Belize
*   Benin
*   Bermuda
*   Bhutan
*   Bonaire, Saint Eustatius and Saba
*   Botswana
*   Bouvet Island
*   Burkina Faso
*   Burundi
*   Cameroon
*   Cape Verde
*   Cayman Islands
*   Central African Republic
*   Chad
*   Christmas Island
*   Cocos (Keeling) Islands
*   Comoros
*   Congo
*   Congo, the Democratic Republic of the
*   Cook Islands
*   Costa Rica
*   Cuba
*   Ivory Coast
*   Djibouti
*   Dominica
*   Dominican Republic
*   Egypt
*   El Salvador
*   Equatorial Guinea
*   Eritrea
*   Ethiopia
*   Falkland Islands (Malvinas)
*   Faroe Islands
*   Federated States of Micronesia
*   Fiji
*   French Guiana
*   French Polynesia
*   Gabon
*   Gambia
*   Ghana
*   Gibraltar
*   Greenland
*   Grenada
*   Guadeloupe
*   Guatemala
*   Guernsey
*   Guinea
*   Guinea-Bissau
*   Haiti
*   Honduras
*   Hong Kong
*   India
*   Iran
*   Iraq
*   Israel
*   Jamaica
*   Jersey
*   Jordan
*   Kazakhstan
*   Kenya
*   Kiribati
*   Kuwait
*   Kyrgyzstan
*   Lebanon
*   Lesotho
*   Liberia
*   Libya
*   Macao
*   Madagascar
*   Malawi
*   Maldives
*   Mali
*   Marshall Islands
*   Martinique
*   Mauritania
*   Mauritius
*   Mayotte
*   Mexico
*   Mongolia
*   Montserrat
*   Morocco
*   Mozambique
*   Namibia
*   Nauru
*   Nepal
*   Netherlands Antilles
*   New Caledonia
*   Nicaragua
*   Niger
*   Nigeria
*   Niue
*   North Korea
*   Oman
*   Pakistan
*   Palau
*   Palestinian Territory, Occupied
*   Panama
*   Papua New Guinea
*   Pitcairn
*   Qatar
*   Rwanda
*   Réunion
*   Saint Helena, Ascension and Tristan da Cunha
*   Saint Kitts and Nevis
*   Saint Lucia
*   Saint Pierre and Miquelon
*   Samoa
*   Sao Tome and Principe
*   Saudi Arabia
*   Senegal
*   Seychelles
*   Sierra Leone
*   Solomon Islands
*   Somalia
*   South Africa
*   South Sudan
*   Sri Lanka
*   St. Vincent & the Grenadines
*   Sudan
*   Svalbard and Jan Mayen
*   Swaziland
*   Syria
*   Tajikistan
*   Tanzania, United Republic of
*   Timor-Leste
*   Togo
*   Tonga
*   Trinidad and Tobago
*   Tunisia
*   Turkmenistan
*   Turks and Caicos Islands
*   Tuvalu
*   Uganda
*   United Arab Emirates (UAE)
*   Uzbekistan
*   Vanuatu
*   Virgin Islands, British
*   Wallis and Futuna
*   Western Sahara
*   Yemen
*   Zambia
*   Zimbabwe

**Countries currently not supported by Gelato**

*   Åland Islands
*   British Indian Ocean Territory
*   French Southern Territories
*   Heard Island and McDonald Islands
*   Isle of Man
*   Norfolk Island
*   South Georgia and the South Sandwich Islands
*   Tokelau
*   United States Minor Outlying Islands
