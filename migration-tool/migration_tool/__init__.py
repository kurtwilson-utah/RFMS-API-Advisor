"""
RFMS WIP Migration Tool — Cedar Ridge Flooring prototype.

================================================================================
STEP 1 DELIVERABLE: RFMS API ENDPOINT CONTRACTS (authoritative reference)
================================================================================
All endpoint shapes below were transcribed from ../../lib/rfms-api-reference.md
(treated as the Postman-authoritative source for this prototype). No endpoint
in this module is invoked without first being verified there.

Auth model
----------
1. POST {BASE}/v2/session/begin
     Auth: HTTP Basic — username = store-queue / API-key-id, password = API-key-secret.
     Body: (none)
     Response: { "authorized": true,
                 "sessionToken": "<hex>",
                 "sessionExpires": "<datestring>" }
   Use the returned sessionToken on every subsequent call (header name TBD on
   first live round-trip; the reference does not show it explicitly).

API tier gating (CRITICAL — confirm sandbox tier before Step 2)
---------------------------------------------------------------
- v2/order/create               → Enterprise tier (HARD requirement for v1)
- v2/quote/create               → Enterprise tier
- v2/product/find               → Plus tier minimum
- v2/customers/find/advanced    → Plus tier minimum
- v2/payables                   → Plus tier minimum
- v2/customers/find             → no stated tier requirement
- v2/customer/{id}, v2/customer/ → no stated tier requirement

Customer endpoints
------------------
2. POST {BASE}/v2/customers/find        — basic name/address/phone/email search
   Body: { "searchText": str (required),
           "includeCustomers": bool, "includeProspects": bool,
           "includeInactive": bool, "startIndex": int, "referralType": str }
   Response: { "status": "success",
               "result": [],
               "detail": [ { "customerSource": "Customer",
                             "customerSourceId": <int>,   ← see_num for FK link
                             "customerName": str, ... } ] }

3. POST {BASE}/v2/customers/find/advanced — (Plus) richer filters
   Body: { "searchText", "stores":[int], "salespersonName", "activeOnly",
           "dateCreatedFrom/To", "lastPurchaseFrom/To",
           "customerTypes":[str], "businessSoldName", "businessShipName" }
   Response: { "status": "success",
               "result": [ { "customerId": <int>,        ← same FK value
                             "customerAddress": {...}, ... } ] }

4. GET  {BASE}/v2/customer/{customerId}  — fetch one customer
5. GET  {BASE}/v2/customers              — Get Customer Values (allowed enum
   values for customerType, entryType, taxStatus, taxMethod, salesperson lists,
   stores). Use this to validate seed/migrate input.
6. POST {BASE}/v2/customer/              — Create or Update a Customer.
   NOTE: Not used by this prototype. Customer seeding is performed by manual
   CSV import in RFMS, per product owner. Listed here for completeness only.

Product endpoints
-----------------
7. POST {BASE}/v2/product/find           — (Plus) search by style/color name
   Body: { "searchText": str (required), "productCode", "storeNumber",
           "colorSKU", "pageIndex", "ecProductId", "ecColorId", "ecSizeId" }
   Response: { "status": "success",
               "result": [ { "id": "<productId>",          ← order line.productId
                             "styleName": str,
                             "styleNumber": str,
                             "saleUnits": str,
                             "colorOptions": [
                                 { "id": "<colorId>",      ← order line.colorId
                                   "colorName": str,
                                   "colorNumber": str,
                                   "SKU": str } ] } ] }
   IMPLICATION FOR FUZZY MATCH: a source-system product name must be matched
   against the cartesian space of (styleName, colorName). The match key the
   prototype uses is f"{styleName} {colorName}" with rapidfuzz token_set_ratio.

8. POST {BASE}/v2/product/get            — (Plus) fetch full detail by id list
   Body: { "products": ["<productId>", ...] }
   (Used only for diagnostics in this prototype.)

Order endpoints
---------------
9. POST {BASE}/v2/order/create           — (Enterprise) create non-web order
   Required for non-web: include { "category": "Order" } in body, otherwise
   the order is flagged as Web Order.
   Body shape used by this prototype:
     { "category": "Order",
       "poNumber": str,                              # source_order_id
       "quoteDate": "YYYY-MM-DD",                    # order_date
       "soldTo": { "customerId": <int> },            # FK from customer find
       "storeNumber": <int>,                         # RFMS_DEFAULT_STORE_NUMBER
       "userOrderTypeId": <int>,                     # from Get order values
       "serviceTypeId": <int>,
       "contractTypeId": <int>,
       "privateNotes": str, "publicNotes": str,
       "lines": [
           { "productId": <int>,                     # from product/find
             "colorId":   <int>,                     # from product/find color
             "quantity":  <number>,
             "unitPrice": <number> }
       ] }
   Response (success):
     { "status": "success", "result": "<order number, e.g. CG003607>",
       "detail": null }
   Response (store waiting):
     { "status": "waiting", "result": "...", "detail": { "docId": "<id>" } }
     → docId can be used in a follow-up header to retrieve the result.
   LINES NOTE: Per project scope, line statuses are NOT set by this prototype.
   Lines are inserted with productId/colorId/quantity/unitPrice only.

10. GET  {BASE}/v2/order/:number         — fetch order back for verification
11. GET  {BASE}/v2/order                 — Get order values (returns
    userOrderTypeId, serviceTypeId, contractTypeId allowed integer values).
    Called once at startup; values cached for the migration run.

AP / Payables endpoint
----------------------
12. POST {BASE}/v2/payables              — (Plus) record one or more payables
    Body: ARRAY of payable objects:
      [ { "supplierName": str,                # vendor_name
          "invoiceNumber": str,               # invoice_number (unique with supplierName)
          "invoiceDate": "M/D/YY" or ISO,
          "dueDate": "M/D/YY" or ISO,
          "discountableAmount": <number>,
          "nonDiscountableAmount": <number>,  # bulk amount lives here for v1
          "discountRate": <number>,
          "linkedDocumentNumber": str,
          "internalNotes": str,
          "remittanceAdviceNotes": str,
          "detailLines": [
              { "storeNumber": <int>,         # required, store NUMBER not display code
                "accountCode": str,           # account_code
                "subAccountCode": str,
                "amount": <number>,
                "comment": str } ] } ]
    Response: { "status": "success",
                "result": "<supplierName> - <invoiceNumber> Added",
                "detail": null }

AR (Accounts Receivable) — OUT OF SCOPE for v1
----------------------------------------------
The reference exposes no direct "create open AR invoice" endpoint. AR records
are produced as a byproduct of running an order through RFMS's invoicing
workflow, which is the same workflow-walking problem as line statuses. Per
product owner direction, ar.csv is dropped from v1 and surfaced as a known
gap in the README. The data-model still includes ar.csv only because the
prompt's source-bundle spec does; the migrate engine ignores it.

What this prototype does NOT do (verbatim from project scope)
-------------------------------------------------------------
- Set line statuses (received/allocated/picked/invoiced).
- Allocate inventory against lines.
- Inject open AR records.
- Carry deposits/customer payments already taken on open orders.
- Inject beginning/found inventory.
- Talk to QuickBooks/QFloors directly. Input is normalized CSV only.
- Handle auth/multi-tenant/idempotency/retry — prototype only.
"""
