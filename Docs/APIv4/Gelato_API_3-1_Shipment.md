# Methods

Use this endpoint to get information on each shipment method that Gelato provides. The shipping methods can be filtered on shipment destination country.

`GET https://shipment.gelatoapis.com/v1/shipment-methods`

#### Request example

`$  curl -X GET https://shipment.gelatoapis.com/v1/shipment-methods \     -H 'X-API-KEY: {{apiKey}}'`

#### Response example

`{     "shipmentMethods": [         {             "shipmentMethodUid": "dhl_global_parcel",             "type": "normal",             "name": "DHL Global Parcel",             "isBusiness": true,             "isPrivate": true,             "hasTracking": true,             "supportedCountries": [                 "AT",                 "BE",                 "BG",                 "CH",                 "CY",                 "CZ",                 "DK",                 "EE",                 "FI",                 "FO",                 "FR",                 "GB",                 "GI",                 "GL",                 "GR",                 "HR",                 "HU",                 "IE",                 "IT",                 "LT",                 "LU",                 "LV",                 "MT",                 "NG",                 "NL",                 "NO",                 "PL",                 "PT",                 "RO",                 "SE",                 "SI",                 "SK"             ]         },         {             "shipmentMethodUid": "dhl_parcel",             "type": "normal",             "name": "DHL Parcel",             "isBusiness": true,             "isPrivate": true,             "hasTracking": true,             "supportedCountries": [                 "DE"             ]         },         {             "shipmentMethodUid": "tnt_parcel",             "type": "normal",             "name": "PostNL Standard",             "isBusiness": true,             "isPrivate": true,             "hasTracking": true,             "supportedCountries": [                 "NL"             ]         },         {             "shipmentMethodUid": "tnt_global_pack",             "type": "normal",             "name": "PostNL Global Pack",             "isBusiness": true,             "isPrivate": true,             "hasTracking": true,             "supportedCountries": [                 "AT",                 "AU",                 "AX",                 "BE",                 "BG",                 "BR",                 "CA",                 "CH",                 "CN",                 "CY",                 "CZ",                 "DE",                 "DK",                 "EE",                 "ES",                 "FI",                 "FR",                 "GR",                 "HK",                 "HR",                 "HU",                 "IE",                 "IN",                 "IT",                 "JP",                 "LT",                 "LU",                 "LV",                 "MT",                 "NO",                 "NZ",                 "PL",                 "PT",                 "RO",                 "RU",                 "SE",                 "SI",                 "SK",                 "TR",                 "US",                 "ZA"             ]         }     ] }`

#### Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **country** _(optional)_ | string | Destination country ISO code |

#### Response Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| **shipmentMethods** _(required)_ | Method\[\] | Array of Method objects. |

`MethodObject`

| Parameter | Type | Description |
| --- | --- | --- |
| **shipmentMethodUid** _(required)_ | string | Unique Shipment method identifier. |
| **type** _(required)_ | string | Shipping service type. Can be: normal, express or pallet. |
| **name** _(required)_ | string | The name of the Shipment method. |
| **isBusiness** _(required)_ | bool | Indicates if the shipment method is suitable for shipping to business addresses. |
| **isPrivate** _(required)_ | bool | Indicates if the shipment method is suitable for shipping to residential addresses. |
| **hasTracking** _(required)_ | bool | Defines if the shipment method is tracked, i.e. you will receive a tracking code and URL when the order is shipped with the shipment method. |
| **supportedCountries** _(required)_ | string\[\] | List of destination country ISO codes where the method is available as a delivery option. |

- - -