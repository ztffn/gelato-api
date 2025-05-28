# Migration Guide

## From v3 to v4

The major addition to the order v4 API is support for multiple raster files. Prior to v4, customers were expected to upload multi-page PDFs for product with multiple print areas. In v4, you can upload a different raster file for each print area as specified in the [create order request](https://dashboard.gelato.com/docs/orders/v4/create). You can also change files, via the [patch order request](https://dashboard.gelato.com/docs/orders/v4/patch)

For products with multiple print areas, multi-page PDF is still supported, and the type must be [default](https://dashboard.gelato.com/docs/orders/v4/create#request). This is very helpful for photo books, greeting cards and calendars.

### Breaking changes

Order API V4 introduces some breaking changes, as ennumerated bellow.

1.  The `fileUrl` property in [orderItem](https://dashboard.gelato.com/docs/orders/v3/create#request#ItemObject) has been substituted with [files](https://dashboard.gelato.com/docs/orders/v4/create#request#ItemObject) property in v4.
2.  In V4, the [get order response](https://dashboard.gelato.com/docs/orders/v4/get/), the minimum and maximum delivery dates are returned in the format `YYYY-MM-DD`. In V3, it is an `epoch unix timestamp`.

## From v2 to v3

In order v3 API, you no longer need a [promiseID](https://dashboard.gelato.com/docs/get-started#promise-uid) to create an order. You can create an order with a single request. Gelato will automatically assign the cheapest available shipping method to your orders. However, if you want to use a preferred shipping method, you can do so by providing the `shipmentMethodUid` property. The available shipping methods are `express` and `normal`. See [create order request](https://dashboard.gelato.com/docs/orders/v3/create)
