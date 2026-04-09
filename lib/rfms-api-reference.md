POST Begin a new session
Path: v2/session/begin
Request a session token to be used by all other API methods.  This method has no parameters.  Instead, use Basic Auth using your Store API Credentials, provided by RFMS support when you subscribe to the service.
If you have a Third Party Developer (TPD) agreement with RFMS, this method works a bit differently to allow you to specify which store you are requesting the session for. Normally, this method accepts a store-queue as user and API key as password.  However, when called by the TPD they will instead use the following as their Basic Auth credentials:
Username: {rfmsBusId}@{TPD ID}
Password {their TPD password}
If the member store has granted access to you, the TPD, this method returns an access token that can then be used normally.  The API will function in the same manner as if the session/begin method were called with a regular store API token.  The token will be granted Plus level access regardless of the store’s actual API subscription level.
Example Request Body:
(none)
Example Responses:
[200 Begin a new session]: {
"authorized": true,
"sessionToken": "1598c4a37c1c54552732bb907013176d",
"sessionExpires": "3/5/2018 7:00:39 PM +00:00"
}
---
POST Request Bus ID
Path: v2/session/request
Before a TPD can access data at a member store, the store must opt-in to sharing their data with the TPD.  This API method allows the TPD to request opt-in for one or more stores.
When calling this method, the TPD should use their provided ID and password as credentials using Basic Auth.  They also POST the JSON values shown below.
The rfmsBusId is an integer value commonly known as the RFMS Business ID that the TPD is expected to already have and identifies the company.  The text in the "reason" parameter will be displayed to the member store when they are asked to opt-in to allowing this access to their data.
Example Request Body:
{
"rfmsBusId": 99999,
"reason": "PRACTICE: To provide access to TPD's App"
}
Example Responses:
(none)
---
POST Find Customers
Path: v2/customers/find
Search for customers
Parameters
---
Parameter	Required	Meaning
searchText	true	The supplied text will be found in customer and ship-to name, address, phone, email address and city
includeCustomers	false	Search customers (true by default)
includeProspects	false	Search prospects (true by default)
includeInactive	false	Include inactive customers (false by default)
startIndex	false	Results are returned 10 at a time.  If this value is omitted the first 10 are returned (Index numbers 0 to 9).  To request the next 10, send startIndex = 10, etc.
referralType	false	For users that have the proper parameter set, setting this value to "member" will display customer search results with an association to Main only, while a "client" input will display results with association to a Branch only
Example Request Body:
{
"searchText": "blackmore",
"includeCustomers": "true",
"includeProspects": "false",
"includeInactive": "false"
}
Example Responses:
[200 Customers Find]: {
"status": "success",
"result": [],
"detail": [
{
"customerSource": "Customer",
"customerSourceId": 12345,
"salesLeadId": 0,
"lmsId": "",
"customerName": "GROKMAN",
"customerFirstName": "ISAAK",
"actualCustomerFirstName": "ISAAK",
"customerLastName": "GROKMAN",
"customerBusinessName": "BIZ",
"customerAddress": "2 CASTA WAY",
"customerAddress2": "UNIT 3",
"customerCity": "FAYETTE",
"customerState": "AL",
"customerZIP": "35555",
"customerPhone": "(808) 978 74",
"customerPhone2": "",
"customerPhone3": "",
"useSoldToBusinessName": false,
"customerEm
---
POST Advanced Customers Find
Path: v2/customers/find/advanced
Search for customers.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameter	Notes
searchText	String value. Text found in customer name.
stores	List of integers.
salespersonName	String value.
activeOnly	Boolean value. `true` value filters out inactive customers.
dateCreatedFrom	String in YYYY-MM-DD format
dateCreatedTo	String in YYYY-MM-DD format
lastPurchaseFrom	String in YYYY-MM-DD format
lastPurchaseTo	String in YYYY-MM-DD format
customerTypes	List of string values. Obtain from Get Customer Values endpoint.
businessSoldName	String value.
businessShipName	String value.
Example Request Body:
{
"searchText": "car",
"stores": [32, 50],
"activeOnly": false,
"dateCreatedFrom": "01-01-2021",
"customerTypes": ["Commercial"]
}
Example Responses:
[200 Advanced Customers Find]: {
"status": "success",
"result": [
{
"phone3": "",
"contact1": "MAX ERNST",
"contact2": "",
"active": true,
"dateCreated": "2021-03-23T15:12:50",
"createdBy": "kwilson",
"dateUpdated": "2023-10-30T10:39:44",
"updatedBy": "CBanuelos",
"customerId": 75688,
"customerAddress": {
"businessName": "BANUELOS LLC",
"lastName": "BANUELOS2",
"firstName": "CARLTON",
"address1": "123 Apple Rd",
"address2": "",
"city": "AKRON",
"state": "AL",
"postalCode": "35441",
"county": "HALE",
"country": null
},
---
GET Get Customer
Path: v2/customer/{{customerId}}
Fetch information about one specific customer by ID
>*For those with RFMS Version 20.99 or higher, customer internal notes will also be viewable within the returned customer record*
Example Request Body:
(none)
Example Responses:
[200 Get Customer]: {
"status": "success",
"result": {
"customerId": 12345,
"customerType": "ACCOMMODATIONS",
"entryType": "Customer",
"customerAddress": {
"businessName": "BIZ",
"lastName": "GROKMAN",
"firstName": "ISAAK",
"address1": "2 CASTA WAY",
"address2": "UNIT 1",
"city": "FAYETTE",
"state": "AL",
"postalCode": "35555",
"county": ""
},
"shipToAddress": {
"businessName": "BIZ",
"lastName": "GROKMAN",
"firstName": "ISAAK",
"address1": "3 CASTA WAY",
"address2": "UNIT 2",
"city": "FAUNSDALE",
"state": "AL",
"postalCode": "36738",
"county
[200 Get Customer - Internal Note]: {
"status": "success",
"result": {
"customerId": 75526,
"customerType": "CASH & CARRY",
"entryType": "Customer",
"customerAddress": {
"businessName": null,
"lastName": "APARTMENTS",
"firstName": "CB",
"address1": "123 TEST AVE",
"address2": "",
"city": "SAN DIEGO",
"state": "CA",
"postalCode": "92026",
"county": null
},
"shipToAddress": {
"businessName": null,
"lastName": "BANUELOS",
"firstName": "CARLOS",
"address1": "123 TEST AVE",
"address2": "",
"city": "SAN DIEGO",
"state": "CA",
"postalCode": "92026",
"county": null

---
GET Get Customer Values
Path: v2/customers
When creating customers, some fields only allow certain values.  This method returns those fields and a list of the allowed values for each.  Note that since this method does not actually communicate with the store, it returns a simple result - not the regular response with status and result.
Example Request Body:
(none)
Example Responses:
[200 Get Customer Values]: {
"customerType": [
"ACCOMMODATIONS",
"CASH & CARRY",
"COMMERCIAL",
"INSTALLER",
"REMODELING"
],
"entryType": [
"Customer",
"Prospect"
],
"taxStatus": [
"Tax",
"Exempt",
"Resale"
],
"taxMethod": [
"SalesTax",
"UseTax",
"LineTax"
],
"preferredSalesperson1": [
"BOB",
"ANDREW",
"HOUSE",
"FRANK"
],
"preferredSalesperson2": [
"BOB",
"ANDREW",
"HOUSE",
"FRANK"
],
"stores": [
{
"id": 32,
"name": "ACME CARPET WEST",
"displayCode": " "
},
{
"id": 50,
"name": "ACME CARPET EAST",
"displayCode": "2"
}
]  
}
---
POST Create or Update a Customer
Path: v2/customer/
Create a new customer or update an existing one. When creating a new customer the customerId element should be omitted.
Some of the values must match a valid selection. For example, customerType must match one of several specific values. To see the available values, GET /customers (see above.)
For users who have the correct parameters enabled, an association to a member (Main) or client (Branch) type referral may be made by including the following field(s):
```
{
    "referralType": "client", //or "member"
    "referralMemberId" 1234 //required if referralType is "client", otherwise exclude from request body
}

```
For users that are associated with CCA/DRIVE, the lmsId field may be specified among the other elements like so:
```
{
    "customerType": "COMMERCIAL",
    "lmsId": "ABA123",
    "customerAddress": {...}
}
```
Example Request Body:
{
"customerType": "COMMERCIAL",
"entryType": "Customer",  
"customerAddress": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"shipToAddress": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"phone1": "661-555-1212",
"phone2": "818-298-0000",
"email": "john.doe@gmail.com",
"taxStatus": "Tax",  
"taxMethod": "SalesTax",  
"preferredSalesperson1": "BOB",
"preferredSalesperson2": "",
"storeNum
Example Responses:
[200 Create a New Customer]:
[200 Update a Customer]:
---
POST Create an Opportunity
Path: v2/opportunity
Create a new customer and a corresponding document. The document may be one of the following:
For companies with an active CRM license, a CRM Opportunity can be created by setting useCRM to true.
An empty Quote if createOrder is false or omitted
An empty Order if createOrder is true (see below for the option to create a web order or regular order)
A BidPro estimate if useBidPro is true.

The request is nearly identical to that of Create Customer, but includes a few additional elements that are specific to the document (quote or order) that will be created. Returns the new document number.
If your store is configured in such a way to allow referrals, an opportunity, like a customer, may also be assigned as either a member (Main) or client (Branch) type referral. See Create Or Update a Customer for more detailed instructions.
If your store is associated with CCA/DRIVE, lmsId may be added to a new opportunity as well. See Create Or Update Customer for more detailed instructions.
Using an existing customer
Depending on your store's configuration, an error might occur if a customer already exists with the same name and phone number. When that occurs, the response will look like this.
```
{
    "accepted": false,
    "requestId": "",
    "messages": [
        "A Sales Lead, Prospect or Customer record with this name and phone number already exists.",
        "existingCustomerId:74028"
    ]
}

 ```
You can use this same method to create just the empty quote associated with the existing customer. To do that, include just the customerId and quote-specific fields, like this:
```
{
  "customerid": 74028,
  "notes": "SAMPLE NOTES",
  "estimatedDeliveryDate": "3/1/2019",
  "storeNumber": 32,
  "preferredSalesperson1": "BOB",
  "preferredSalesperson2": ""
}

 ```
When using an existing customer, you can still optionally override the ship-to address by including the ship-to element, like this:
```
{
  "customerid": 74028,
  "shipTo": { ... },
  ...
}

 ```
Using BidPro
Rather than creating a corresponding quote, you can also create a blank BidPro estimate. To do this, include the following elements in your message:
```
{
  "useBidPro": true,
  "modelName": "OPPORTUNITY",
  ...
}

 ```
Model name is a required field for many stores when creating a BidPro estimate. You can pass any value you like for that and it will be included in the estimate.
Using Project Manager
To create a sales lead in Project Manager, include the following element in your message:
```
{
  "useProjectManager": true,
  ...
}

 ```
Note that if this field is true, other flags, such as `useBidPro` or `createOrder` will be ignored.
Providing a custom document number
Normally, RFMS will generate a new quote, order, or estimate number. However, you can send the one you would like to use. Simply include this attribute:
```
{
  "documentNumber": "ABC123",
  ...
}

 ```
Your store must be configured to allow this.
Business name behavior
The opportunity accepts a businessName for soldTo and shipTo, and if provided it will be recorded on the customer that is created. However, quotes and orders do not have this field.
If businessName is provided for an address, it will be used as the lastName on the quote or order, and the firstName will be left blank.
Specifying an Order Type
If the creation of an opportunity is to be associated with a new order, the way to specify a non web order is as follows. Otherwise, the order will be considered a web order
```
{
  "createOrder": true,
  "orderType": "Order"
}

 ```
Saving to a secondary company
The default behavior of this method will be to save a new opportunity to the primary store associated with the public api. To override this behavior, add to the main body of the opportunity and populate the companyId field with the corresponding company id of the secondary company to which the opportunity must be added.
Additional Parameters
The following table describes some additional parameters that can be saved to the opportunity:
Parameter	Type	Description
journey	string	Code indicating the "customer journey" this opportunity should enter. (Third-party developer feature only)
journeyDetail	string	Journey-specific details about the journey. (Third-party developer feature only)
marketingOptIn	object	See available fields below
marketingOptIn: email	boolean	Required. Indicates if the user has opted into receiving emails.
marketingOptIn: sms	boolean	Required. Indicates if the user has opted into receiving text messages.
marketingOptIn: optInDate	DateTime	Optional. The time stamp of the opt-in. (May be used for compliance purposes)
marketingOptIn: ipAddress	string	Optional. The IP address of the opt-in. (May be used for compliance purposes)
Example Request Body:
{
"createOrder": false,
"notes": "SAMPLE NOTES",
"estimatedDeliveryDate": "3/1/2019",
"storeNumber": 32,
"customerType": "COMMERCIAL",
"entryType": "Customer",  
"customerAddress": {
"businessName": "ACME",
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"shipToAddress": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"phone1": "661-555-1212",
"phone2": "818-298-0000",
"email": "john.doe@gmail.com",
"taxStatu
Example Responses:
[200 Create a New Opportunity]: {
"status": "success",
"result": "ES803274"
}
---
GET Get CRM Opportunities
Path: v2/opportunities
Fetches all opportunities that have been modified within the past seven days
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get CRM Opportunities ]: {
"status": "success",
"result": [
{
"id": "N07W7BPIXY",
"title": "DANNY WILSON",
"customerId": "1472",
"salesperson": "kurt@rfmstest.com",
"store": 32,
"dateCreated": "3/17/2021",
"lastModified": "6/28/2021 1:58 PM",
"totalValue": 22402.21,
"stage": "Quote",
"quotes": [
"ES103292",
"undefined"
],
"quoteApproval": "undefined",
"orders": [],
"products": []
},
{
"id": "IVUWQJ2SQX",
"title": "MCM-1370, MCM-1370",
"customerId": "75691",
"salesperson": "justin@branch.com",
"store": 57,
"dateCreat
---
GET Get CRM Opportunities  By Stage
Path: v2/opportunities/:stage
>This method requires the "Plus" level of the API product at a minimum.
Gets all CRM opportunities by stage.
Stages to select from include the following:
To Do
Contact
Products
Measure
Quote
Won
Lost
Please note that within the CRM application, a company can rename stages. The above stages are the generic names, not the company-specific alias'. They are listed by the order in which they appear in CRM
Example Request Body:
(none)
Example Responses:
[200 Get CRM Opportunities  By Stage]: {
"status": "success",
"result": [
{
"id": "DP3LP1E3C7",
"title": "KONG, KING",
"customerId": "75065",
"salesperson": "giul@branch.com",
"store": 0,
"dateCreated": "11/27/2019",
"lastModified": "6/7/2021 11:42 AM",
"totalValue": 254.62,
"stage": "Measure",
"quotes": [],
"quoteApproval": null,
"orders": [],
"products": []
},
{
"id": "2GLKH6725E",
"title": "JAMES SMITH",
"customerId": "1392",
"salesperson": "SNEAKY PETE",
"store": 0,
"dateCreated": "2/27/2020",
"lastModified": "11/16/2020 9:56 AM",
"totalValue":
---
GET Get Opportunity Change Logs
Path: v2/opportunities/lastmodified
Retrieves a list of opportunities that have been modified or created in the last seven days. If an opportunity's status has changed, the change will be recorded and the opportunity will be included in the list returned by this method.
> *This method requires the "Plus" level of the API product.*
Example Request Body:
(none)
Example Responses:
[200 Get Opportunity Change Logs]: {
"status": "success",
"result": [
{
"opportunityId": "3X4R7W4WYW",
"opportunityName": "CIDER, APPLE",
"eventName": "STAGE CHANGED",
"eventTime": "12/15/2021 4:28:00 PM",
"user": "Carlos Banuelos",
"detail": "Quote -> Measure"
},
{
"opportunityId": "O3RP9Z0XO6",
"opportunityName": "KELLY, TAURUS",
"eventName": "STAGE CHANGED",
"eventTime": "12/15/2021 4:29:00 PM",
"user": "Carlos Banuelos",
"detail": "Won -> Quote"
},
{
"opportunityId": "O3RP9Z0XO6",
"opportunityName": "KELLY, TAURUS",
"eventName": "STAGE CHANGED",
"eventTime": "12/15/2021 4:29:00 PM",

---
GET Get Opportunity
Path: v2/opportunity/:id
Fetches an opportunity by ID
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get Opportunity]: {
"status": "success",
"result": {
"id": "NNUZ1RHDJE",
"title": "TRUBISKY, MITCH",
"customerId": "75685",
"salesperson": "carlos2@branch.com",
"store": 32,
"dateCreated": "3/22/2021",
"lastModified": "7/2/2021 12:37 PM",
"totalValue": 374.84,
"stage": "Quote",
"quotes": [
"ES103494"
],
"quoteApproval": "ES103494",
"orders": [],
"products": [
{
"id": 918196,
"colorId": 6983585,
"quantity": 300,
"sampleCheckedOut": false,
"price": 1.04
}
]
},
"detail": null
}
---
GET Get order values
Path: v2/order
This will return master lists that can be used when creating new quotes or orders.
Example Request Body:
(none)
Example Responses:
[200 Get order values]: {
"userOrderTypeId": [
{
"id": 1,
"name": "APPROVED"
},
{
"id": 3,
"name": "IN REVIEW"
},
{
"id": 2,
"name": "REJECTED"
}
],
"serviceTypeId": [
{
"id": 1,
"name": "CERTIFICATE "
}
],
"contractTypeId": [
{
"id": 1,
"name": "CONTRACT SAMPLE"
}
]
}
---
GET Get Quote
Path: v2/quote/:number
> *This method requires the "Plus" level of the API product at a minimum.*
Retrieve a specific quote.
Example Request Body:
(none)
Example Responses:
[200 Get Quote]: {
"status": "success",
"result": {
"id": "35813",
"number": "ES002971",
"originalNumber": "ES002971",
"category": "OriginalInvoice",
"soldTo": {
"customerId": 75515,
"phone1": "000-000-0205",
"phone2": "",
"email": "TEST@TEST.COM",
"customerType": "RETAIL-INSTALL",
"businessName": null,
"lastName": "BANUELOS",
"firstName": "CARLOS",
"address1": "123 TEST TUSCALOOSA AVE",
"address2": "",
"city": "TUSCALOOSA",
"state": "AL",
"postalCode": "35405",
"county": "TUSCALOOSA"
},
"shipTo": {
"businessName": null,
"lastName": "BANUELOS",

---
POST Create Quote
Path: v2/quote/create
> _This method requires the "Enterprise" level of the API product._ Requests from other level API accounts will return Unauthorized. 

When creating referenced lines, only the productId, colorId, quantity, and price (either unitPrice or priceLevel) are needed. Optionally, unitCost can be set. The other attributes will be looked up from the product catalog and used automatically.
If a soldTo.customerId is provided, that customer will be fetched from the store and soldTo and shipTo information will be filled out using that customer. Any information provided in the API call for soldTo or shipTo will then be used to override the values from the store.
In order to relate an existing parent quote to the new quote, add the parameter, "relatedQuote" along with the parent quote number.
Example:
```
{
    "relatedQuote": "ES902830"
}

 ```
For Prosource users, to add a line using EcProductId and EcColorId values, simply include these values instead of using the default productId, colorId fields.
Example:
```
{
    "lines: [{ 
            "ecProductId": "1234", 
            "ecColorId": "5678",
            "quantity": 32
            }]
}

 ```
Adding Work Order Lines
When adding work order lines to a specific line, keep in mind that the quantity needs to match (or in the case of multiple work order lines - add up to) the total quantity as defined in the order line. See Example - Create Quote with Work Order Lines for more details on the structure of the request.
Example Request Body:
{
"poNumber": "987654",
"adSource": "BILLBOARD",
"quoteDate": "2019-07-01",
"estimatedDeliveryDate": "2019-08-01",
"jobNumber": "ABC123",
"soldTo": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"storeNumber": 50,
"privateNotes": "PRIVATE",
"publicNotes": "PUBLIC",
"workOrderNotes": "WORK ORDER NOTES",
"salesperson1": "JOHN",
"salesperson2": "FRANK",
"userOrderTypeId": 1,
"serviceTypeId": 1,
"contractTypeId": 1,
"timeSlot": 2,
"isOccupied": false,
"phase": "1",
"model": "The Dystopian",
"unit": "101",  
"lines": [
{
"produc
Example Responses:
[200 Create Quote using referenced line]: {
"status": "success",
"result": "ES903428",
"detail": null
}
[200 Create Quote using unreferenced line]: {
"status": "success",
"result": "ES903428",
"detail": null
}
---
POST Update Quote
Path: v2/quote
> _This method requires the "Plus" level of the API product at a minimum._ 

All elements other than "number" are optional. Only include those elements you want to modify. All others, or those with a value of null, will be ignored and the existing value on the quote will remain unchanged.
Updating lines
"Enterprise" level API users can also add, delete, and edit lines. Here are some examples:
To delete a line, include just the line id and delete: true.
```
{
    "number": "ES903500",
    "lines": [ { "id": 215541, "delete": true } ]
}

 ```
To edit a line, include the line id:
```
{
    "number": "ES903500",
    "lines": [ { "id": 215541, "productId": 866639, "colorId": 6414238, "quantity": 100, "unitCost": 2.1 } ]
}

 ```
To add a new line, omit line id:
```
{
    "number": "ES903500",
    "lines": [ { "productId": 992048, "colorId": 567483, "quantity": 99 } ]
}

 ```
When modifying or adding lines, the following elements are supported:
unitPrice
quantity
lineStatus
productId
colorId
priceLevel
unitCost
lineGroupId

When productId is supplied, information from the associated product is copied to the line. Price level can only be set when a productId is supplied. This rule also applies to unit cost, but only when editing or adding a referenced line or a line not associated with a service. Otherwise, the productId need not be provided.
Note on the isUseTaxLine element: isUseTaxLine element can be used only if store permissions allow for it, and if the quote (or order) has one of the following tax methods: LineTax, UseTax. Otherwise, any attempt to set that element will be ignored.
For Prosource users, to add a line using EcProductId and EcColorId values, simply include these values instead of using the default productId, colorId fields.
Example:
```
{
    "number": "ES123456",
    "lines: [{ 
            "ecProductId": "1234", 
            "ecColorId": "5678",
            "quantity": 32
            }]
}

 ```
Options for Updating Notes
To replace notes, include additional fields, as specified above.
To append notes, only include note fields in the body of the request.
> _Note: Appending notes to a line requires Enterprise Level API access_ 

Example Note Append:
```
{
    "number": "ES903500",
    "privateNotes": "this will be appended to existing notes, if any",
    "publicNotes": "this will also be appened",
    "lines":[ "id": 215541, "notes": "and this too will be appended to a line note"}] 
}

 ```
Adding Work Order Lines
When adding or deleting work order lines to a specific line, keep in mind that the quantity needs to match (or in the case of multiple work order lines - add up to) the total quantity as defined in the order line. The structure for adding, editing and deleting work order lines is very similar to order lines. For example:
To delete a line, include the line id, work order line id, and delete: true.
```
{
    "number": "ES103603",
    "lines": [ { "id": 218796, "workOrderLines": [ { "id": 277302, "delete": true } ] } ]
}

 ```
To edit a line, include the line id, work order line id:
```
{
    "number": "ES103603",
    "lines": [ { "id": 218796, "workOrderLines": [ {"id": 277302, "areaName": "BR 2" } ] } ]
}

 ```
To add a work order line new line, omit line id:
```
{
    "number": "ES103603",
    "lines": [ { "id": 218796, "workOrderLines": [ {"areaName": "Room 2", "notes": "new room", "quantity": 99 } ] } ]
}

 ```
Example Request Body:
{
"number": "CG903368",
"poNumber": "987654",
"adSource": "BILLBOARD",
"quoteDate": "2019-07-01",
"estimatedDeliveryDate": "2019-08-01",
"jobNumber": "ABC123",
"soldTo": { "customerType": "DECORATOR" },
"storeNumber": 50,
"privateNotes": "PRIVATE",
"publicNotes": "PUBLIC",
"workOrderNotes": "WORK ORDER NOTES",
"salesperson1": "JOHN",
"salesperson2": "FRANK",
"userOrderTypeId": 2,
"serviceTypeId": 1,
"contractTypeId": 1,
"timeSlot": 2,
"isOccupied": false,
"phase": "2",
"model": "The Dystopian",
"unit": "101"  
}
Example Responses:
(none)
---
POST Find Quotes
Path: v2/quote/find
Search for Quotes.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Required	Meaning
searchText	true	Given text will be found in customer first or customer last name.
dateCreatedFrom	false	Search for a quote that was created after this date.
dateCreatedTo	false	Search for a quote that was created before this date
salesperson1	false	Filter quotes by a certain salesperson
salesperson2	false	Filter based on a secondary salesperson
customerId	false	Search based on customer Id
viewExportedOnly	false	Filter quotes based on export status. If true, only exported quotes will be returned
resultPageNumber	false	Specify a specific page of quote results to view. By default, returns first page of results
> _Note: Each page contains ten results from the query, starting from most recently created._
Example Request Body:
{
"searchText": "Smith",
"dateCreatedFrom": "1/1/2018",
"salesperson1": "Kurt Wilson",
"pageResultNumber": 3
}
Example Responses:
[ Find Quotes]: {
"status": "success",
"result": [
{
"documentNumber": "ES903247",
"customerFirst": "JIM",
"customerLast": "BUILDER",
"customerType": "BUILDER",
"createdDate": "2019-09-04T00:00:00",
"grandTotal": 12.6,
"status": "Exported"
},
{
"documentNumber": "ES803033",
"customerFirst": "JIM",
"customerLast": "BUILDER",
"customerType": "BUILDER",
"createdDate": "2018-06-26T00:00:00",
"grandTotal": 6433.47,
"status": "Exported"
}
],
"detail": [
{
"documentNumber": "ES903247",
"documentType": 0,
"description": "",
"customerFirst": "JIM"
[200 Find Quotes - View Additional Pages]: {
"status": "success",
"result": [
{
"documentNumber": "ES903145",
"customerFirst": "TOMMY",
"customerLast": "BUILDER",
"customerType": "BUILDER",
"createdDate": "2019-06-11T00:00:00",
"grandTotal": 8863.64,
"status": "Open"
},
{
"documentNumber": "ES903030",
"customerFirst": "DANNY",
"customerLast": "SMITH CONSTRUCTION",
"customerType": "NEW RESIDENTIAL",
"createdDate": "2019-03-27T00:00:00",
"grandTotal": 4877.04,
"status": "Open"
},
{
"documentNumber": "ES902963",
"customerFirst": "DANNY",
"customerLast": "SMITH CONSTRUCTION",

---
GET Get Quote Gross Profit
Path: v2/quote/grossprofit/ES803033
Get gross profit values, along with additional information, by providing a quote number.
>*This method requires "Plus" level of API product at a minimum*
Example Request Body:
(none)
Example Responses:
[ Get Quote Gross Profit]: {
"status": "success",
"result": "OK",
"detail": {
"InvoiceNumber": "ES803033",
"GrossProfitPercent": 67.98,
"GrossProfit": 3975.87,
"TotalTransaction": 6433.47,
"NetSales": 5848.61,
"MaterialGrossCost": 1658.64,
"LaborCost": 0.0,
"FreightCost": 29.81,
"Load": 0.0,
"MiscOverheadCost": 184.29,
"MiscExtraCost": 0.0,
"TaxCost": 584.86,
"ReferralTotal": 0.0
}
}
---
POST Export Quote to Order
Path: v2/quote/ES903214/export
> *This method requires the "Plus" level of the API product at a minimum.*
Simply supply the quote number in the URL.  If successful, the new order number is returned.  The order will be flagged as a "Web Order".
Example Request Body:
(none)
Example Responses:
[200 Export Quote to Order]: {
"status": "success",
"result": "OK",
"detail": "CG903534"
}
---
GET Get Order
Path: v2/order/:number
> _This method requires the "Plus" level of the API product at a minimum._ 

Retrieve a specific order.
Locking the Order
To request a lock when retrieving the order, add the query parameter `locked=true`
The lock returned on the order result can then be passed to the `lockId` field when saving the order. To manually unlock the order, see Unlock Document.
Example Request Body:
(none)
Example Responses:
[200 Get Order]: {
"status": "success",
"result": {
"id": "83307",
"number": "CG003659",
"originalNumber": "",
"category": "OriginalInvoice",
"soldTo": {
"customerId": 75515,
"phone1": "205-555-5555",
"phone2": "",
"email": "TEST@TEST.COM",
"customerType": "RETAIL-INSTALL",
"businessName": null,
"lastName": "BANUELOS",
"firstName": "CARLOS",
"address1": "555 TUSCALOOSA AVE",
"address2": "",
"city": "TUSCALOOSA",
"state": "AL",
"postalCode": "35405",
"county": "TUSCALOOSA"
},
"shipTo": {
"businessName": null,
"lastName": "BANUELOS",
"firstName"
---
POST Create Order
Path: v2/order/create
> _This method requires the "Enterprise" level of the API product._ Requests from other level API accounts will return Unauthorized. 

In order to specify a non-web order, the following JSON must be included in the body of the request. Otherwise, a newly created order will be considered a Web Order.
```
{
  "category": "Order"
}

 ```
When creating referenced lines, only the productId, colorId, quantity, and price (either unitPrice or priceLevel) are needed. Optionally, unitCost can be set. The other attributes will be looked up from the product catalog and used automatically. Width can also be set, but this will result in an unreferenced line.
If a soldTo.customerId is provided, that customer will be fetched from the store and soldTo and shipTo information will be filled out using that customer. Any information provided in the API call for soldTo or shipTo will then be used to override the values from the store.
For Prosource users, ECProductId and ECColorId fields may be included instead of the default productId and colorId fields for adding lines. See Create Quote for a detailed example.
Billing Groups
To add a new billing group to a new order, provide a general description, as well as contact information (up to four contacts may be added) in the following format:
```
{
"billingGroup": {
        "description": "Project 15 - 34 NW Blvd",
        "contactList": [
            {
                "name": "Yevgeniy Zhakarov",
                "phone": "432-223-1212",
                "email": "yevgen@nextgen.com",
                "other": "zhenya@flyingcarpets.com"
            },
            {
                "name": "Alex Smith",
                "phone": "000-000-0010",
                "email": "smith@floor.com"
            },
            {
                "name": "Leonard Bernstein",
                "email": "lenny@classicalcarpets.com"
            },
            {
                "name": "Vartan Nersisyan",
                "phone": "333-222-1111",
                "other": "vnersisyan@flyingcarpet.com"
            }
        ]
    }
}

 ```
Each contact object may contain these optional fields: "name", "phone", "email", "other"
To create a new order and add an existing billing group to it, input the invoice number of an order that already contains the existing group, like the following example shows:
```
{
    "billingGroup": {
        "parentOrder": "CG003616"
    }
}

 ```
Adding Work Order Lines
When adding work order lines to a specific line, keep in mind that the quantity needs to match (or in the case of multiple work order lines - add up to) the total quantity as defined in the order line. See Example under Create Quote - Create Quote with Work Order Lines for more details on the structure of the request.
Handling Store Waiting Responses
In the event that the Create Order method is called, but the store is not responding, a result similar to the following example will be returned:
```
{
    "status": "waiting",
    "result": "Store has not replied. Try again later with following message id",
    "detail": {
        "docId": "a11fbbb82ea34977bd3feabb36ca40eb"
    }
}

 ```
Note the `detail` object contains the `docId` field. The value of this field is the message id that can be used in an HTTP header (See HEADERS) to later retrieve the details of that message.
Example Request Body:
{
"poNumber": "987655",
"adSource": "BILLBOARD",
"quoteDate": "2021-04-01",
"estimatedDeliveryDate": "2021-05-04",
"jobNumber": "XYZ123",
"soldTo": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"storeNumber": 50,
"privateNotes": "PRIVATE",
"publicNotes": "PUBLIC",
"workOrderNotes": "WORK ORDER NOTES",
"salesperson1": "JOHN",
"salesperson2": "FRANK",
"userOrderTypeId": 3,
"serviceTypeId": 1,
"contractTypeId": 1,
"timeSlot": 4,
"isOccupied": false,
"phase": "1",
"model": "The Base Model",
"unit": "60",
"tract": "Tract A",
"block": "B
Example Responses:
[200 Create Quote using referenced line]: {
"status": "success",
"result": "ES903428",
"detail": null
}
[200 Create Quote using unreferenced line]: {
"status": "success",
"result": "ES903428",
"detail": null
}
---
POST Update Order
Path: v2/order
> *This method requires the "Plus" level of the API product at a minimum.* 
All elements other than "number" are optional.  Only include those elements you want to modify.  All others, or those with a value of null, will be ignored and the existing value on the order will remain unchanged.
Updating order lines
See the documentation for Update Quote for more information
Updating work order lines
See the documentation for Update Quote for more information
Billing Groups
See the documentation for Create Order for guidance on adding a new or existing billing group to an order.
>*Note: Only non-Web Orders may be updated with a billing group.*
Example Request Body:
{
"number": "CG903368",
"poNumber": "987654",
"adSource": "BILLBOARD",
"orderDate": "2019-07-01",
"estimatedDeliveryDate": "2019-08-01",
"jobNumber": "ABC123",
"soldTo": { "customerType": "DECORATOR" },
"storeNumber": 50,
"privateNotes": "PRIVATE",
"publicNotes": "PUBLIC",
"workOrderNotes": "WORK ORDER NOTES",
"salesperson1": "JOHN",
"salesperson2": "FRANK",
"userOrderTypeId": 2,
"serviceTypeId": 1,
"contractTypeId": 1,
"timeSlot": 3,
"isOccupied": false,
"phase": "1",
"model": "The Base Model",
"unit": "50",
"tract": "Tract A",
"block": "Block A",
"lot": "Lot A"
}
Example Responses:
(none)
---
POST Add Notes to Order
Path: v2/order/notes
Append or add new notes to an order. This method can be used to update notes, even in the event that the order is already Job Costed.
> *This method requires the "Plus" level of the API product*

Available Parameters

Parameter	Required	Type	Meaning
number	true	string	Order (or claim if using /claim/notes endpoint) number
publicNotes	false	string	Text to append to the public note field
privateNotes	false	string	Text to append to the private note field
workOrderNotes	false	string	Text to append to the work order note field
lineNotes	false	array	An array of objects that allow for specifying a line to which to append notes. See example for exact formatting
Example Request Body:
{
"number": "CG003804",
"publicNotes": "A public note",
"privateNotes": "Private note",
"lineNotes": [
{
"id": 201379,
"note": "new line note"
}
]
}
Example Responses:
[200 Add Notes to Order]: {
"status": "success",
"result": "OK",
"detail": null
}
---
POST Switch Line Status None To GenPO
Path: v2/order/save/linestatus
Stand alone call to switch either a single line or multiple line statuses to and from None to GeneratePurchaseOrder.
Parameters
Parameters	Required	Meaning
orderNumber	true	Number of order for which the line(s) will be updated
lineId	false	Integer. The line id. Line must have status of None or GenPO
lineIds	false	List of integers. All line ids must have a status of None or GenPO
setToGeneratePO	true	Boolean to switch the status between None and GenPO.
Example Request Body:
{
"orderNumber": "CG903341",
"lineId": 200380,
"setToGeneratePO": true
}
Example Responses:
[200 Update Multiple Line Statuses]: {
"status": "success",
"result": "Status updated for lines: 203542 203543",
"detail": null
}
[200 Update Single Line Status]: {
"status": "success",
"result": "Status updated for lines: 203544",
"detail": null
}
---
POST Find Orders
Path: v2/order/find
Search for orders.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Required	Meaning
searchText	true	Given text will be found in customer first or customer last name.
dateCreatedFrom	false	Search for a quote that was created after this date.
dateCreatedTo	false	Search for a quote that was created before this date
salesperson1	false	Filter quotes by a certain salesperson
salesperson2	false	Filter based on a secondary salesperson
customerId	false	Search based on customer Id
viewBilledOnly	false	Filter orders based on billed status. If true, only billed orders will be returned
resultPageNumber	false	Specify a specific page of order results to view. By default, returns first page of results
> _Note: Each page contains ten results from the query, starting from most recently created._
Example Request Body:
{
"searchText": "sol",
"dateCreatedFrom": "2024-08-01",
"dateCreatedTo": "2024-08-20",
"resultPageNumber": 1,
"viewBilledOnly": true
}
Example Responses:
[200 Find Orders]: {
"status": "success",
"result": [
{
"documentNumber": "CG402188",
"customerFirst": "JACOB",
"customerLast": "SOLANTO",
"customerType": "ACCOMMODATIONS",
"createdDate": "2024-08-19T00:00:00",
"grandTotal": 35,
"status": "Job Costed",
"balanceDue": 35
}
],
"detail": [
{
"documentNumber": "CG402188",
"databaseId": 84847,
"documentType": 1,
"description": "PO number: 12345",
"customerFirst": "JACOB",
"customerLast": "SOLANTO",
"customerType": "ACCOMMODATIONS",
"createdDate": "2024-08-19T00:00:00",
"enteredDate": "2024-08-19T00:00:00",
"deliv
---
POST Advanced Order Search
Path: v2/order/find/advanced
Search for orders.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Notes	Required
searchText	Text found in customer first or last name, phone number, address, PO number, and job number	false
adSource	String value	false
orderSearchType	String value. Type of document for which to search. Options are Order, Quote, or Claim. Defaults to Order	false
orderType	Integer value from userOrderTypeId list found in the Get order values endpoint	false
contractType	Integer value from contractTypeId list found in the Get order values endpoint	false
serviceType	Integer value from serviceTypeId list found in the Get order values endpoint	false
stores	List of store numbers. Note: Need to specify at least one store to return valid search results	true
estimatedDeliveryFrom	String in YYYY-MM-DD format	false
estimatedDeliveryTo	String in YYYY-MM-DD format	false
orderDateFrom	String in YYYY-MM-DD format	false
orderDateTo	String in YYYY-MM-DD format	false
measureDateFrom	String in YYYY-MM-DD format	false
measureDateTo	String in YYYY-MM-DD format	false
deliveryDateFrom	String in YYYY-MM-DD format	false
deliveryDateTo	String in YYYY-MM-DD format	false
updatedDateFrom	Gets all new or updated orders starting from the specified date.  <br>String in YYYY-MM-DD format	false
scheduleProStatus	Integer value selected from the Get Job Status Ids endpoint	false
Example Request Body:
{
"searchText": "car",
"stores": [32, 50],
"estimatedDeliveryFrom": "2023-01-01"
}
Example Responses:
[200 Advanced Order Search]: {
"status": "success",
"result": [
{
"id": 84337,
"documentNumber": "WO394853",
"customer": {
"customerId": 75515,
"phone1": "2055555556",
"phone2": "",
"email": "TEST@TEST.COM",
"customerType": "RETAIL-INSTALL",
"businessName": null,
"lastName": "BANUELOS, CARLOS",
"firstName": null,
"address1": "555 TUSCALOOSA AVE",
"address2": "",
"city": "TUSCALOOSA",
"state": "AL",
"postalCode": "35405",
"county": "TUSCALOOSA"
},
"shipTo": {
"businessName": null,
"lastName":
---
GET Get Order Gross Profit
Path: v2/order/grossprofit/CG003607
Given an order number, this method retrieves the gross profit, along with additional information.<br>
>*This method requires "Plus" level of API product at a minimum*
Example Request Body:
(none)
Example Responses:
[ Get Gross Profit]: {
"status": "success",
"result": "OK",
"detail": {
"InvoiceNumber": "CG003607",
"GrossProfitPercent": -6.84,
"GrossProfit": -0.24,
"TotalTransaction": 3.86,
"NetSales": 3.51,
"MaterialGrossCost": 2.04,
"LaborCost": 0,
"FreightCost": 0.16,
"Load": 1.49,
"MiscOverheadCost": 0.06,
"MiscExtraCost": 0,
"TaxCost": 0.35,
"ReferralTotal": 0
}
}
---
GET Get Payment Values
Path: v2/payments
> *This method requires the "Plus" level of the API product at a minimum.*
Request master lists used to submit payments
Example Request Body:
(none)
Example Responses:
[200 Get Payment Values]: {
"receiptAccounts": [
{
"id": 5,
"name": "AMEX (MAIN BRANCH)",
"creditCardPrefixes": [
3
]
},
{
"id": 4,
"name": "DISCOVER (MAIN BRANCH)",
"creditCardPrefixes": [
6
]
},
{
"id": 1,
"name": "PRIMARY RECEIPT FILE (MAIN BRANCH)",
"creditCardPrefixes": []
}
]
}
---
POST Record Payment
Path: v2/payment
> *This method requires the "Plus" level of the API product at a minimum.*
Attach a record of payment to an existing quote or order.
Handling a Store Waiting Response
In the event that the Record Payment method is called, but the store is not responding, the request will return a result that looks similar to the following:
```
{
    "status": "waiting",
    "result": "Store has not replied. Try again later with provided message id",
    "detail": "a11fbbb82ea34977bd3feabb36ca40eb"
}
```
Note that the detail field contains, in this case, a messageId. This id can be used in an Http Header (See HEADERS and Example) to retrieve later the details of that message, once the store is able to process it.
Example Request Body:
{
"documentNumber": "CG903367",
"paymentMethod": "creditcard",
"paymentAmount": 10.00,
"approvalCode": "12345",
"receiptAccountId": 2,
"paymentFee": 2.16,
"paymentReference": "ABA123"
}
Example Responses:
[200 Record Payment]: {
"status": "success",
"result": {
"InvoiceNumber": "CG903367",
"Balance": 9637.73
}
}
---
GET Get Recently Jobcosted Orders
Path: v2/orders/jobcosted
Returns orders with a delivery date in the last 31 days and have been updated in the last 48 hours.
Example Request Body:
(none)
Example Responses:
(none)
---
POST Find Purchase Orders
Path: v2/order/purchaseorder/find
Search for purchase orders associated with a certain order and line number.<br>
>*This method requires the "Plus" level of the API product at a minimum.*<br>
Example Request Body:
{
"number": "CG105159",
"lineNumber": 1
}
Example Responses:
[200 Find Purchase Orders]: {
"status": "success",
"result": {
"purchaseOrderNumber": "CG1051590001",
"referenceNumber": "123456789",
"supplierName": "MOHAWK INDUSTRIES",
"styleName": "TOWN CENTER II 30 - 12'",
"colorName": "POWDER INDIGO",
"manufacturerName": "ALADDIN",
"amountOrdered": 1200,
"amountReceived": 0,
"amountRemaining": 1200,
"units": "SF",
"freightCarrier": "FEDEX FLOORS",
"trackingNumber": "UA5E6D5E1FGD5E",
"orderDate": "2021-08-19T00:00:00",
"promiseDate": "2021-12-09T00:00:00",
"requiredDate": "2021-12-10T00:00:00",
"requestedShipDate": null,
"status": "Open",
"orderedBy": "CBANUELOS",
"takenBy": "CARLOS",
"comments": "NICE COMMENT"

---
POST Calculate Taxes
Path: v2/calculatetaxes
Given an order template with individual order lines, this method will return the applicable Sales Tax, Use Tax, and/or Misc Tax for given line total. For tax to be properly calculated, consult the table below:

Parameter	Required	Explanation	Field Belongs To
shipTo	true	Fill out all relevant fields in  accordance with city information	Order Object
productCode	See Meaning	Either include this field,  or relevant product information.  i.e productId, quantity, priceLevel	Line Object
lineTotal	true	Total dollar amount for goods/services for single line	Line Object
useLineTax	false	Set to true if line should be calculated as a UseTax line, and excluded from sales tax calculations	Line Object
Example Request Body:
{
"poNumber": "12345",
"adSource": "Website",
"jobNumber": "ZAGZIG5",
"quoteDate": "2020-12-02",
"estimatedDeliveryDate": "2020-12-29",
"soldTo": {
"lastName": "Rimsky-Korsakov",
"firstName": "Nikolai",
"address1": "1 Bumblebee Dr",
"address2": "STE 5",
"email": "nik@classicalcarpets.com",
"city": "BESSEMER",
"state": "AL",
"postalCode": "35020"
},
"shipTo":
{
"lastName": "Zolotoy",
"firstName": "Vitaly",
"address1": "14 Wide Rd",
"city": "Alabaster",
"state": "AL",
"postalCode": "35007"
},
"storeNumber": 50,
"salesperson1": "Pyotr",
"taxStatus": "Tax",
"lines": [
{
"productC
Example Responses:
[200 Calculate Taxes]: {
"status": "success",
"result": "OK",
"detail": {
"SalesTax": 982.2,
"MiscTax": 0,
"UseTax": 0
}
}
---
GET List Payments
Path: v2/order/payments/:number
> *This method requires the "Plus" level of the API product at a minimum.*
Given an order invoice number, this method returns a list of payments made on that order.
Example Request Body:
(none)
Example Responses:
[200 List Payments]: {
"status": "success",
"result": [
{
"documentNumber": "CG105152",
"paymentNumber": 132,
"paymentMethod": "creditcard",
"paymentAmount": 127.53,
"approvalCode": null,
"receiptAccountId": 7,
"paymentReference": "Visa - 1443",
"paymentDate": "2021-08-18",
"orderDate": "2021-08-17",
"beginningBalance": 127.53,
"remainingBalance": 0,
"discountAmount": 0,
"discountAccountNumber": "405",
"financingCharge": 0,
"customerName": "JACK, WILSON",
"storeNumber": 32,
"notes": ""
},
{
"documentNumber": "CG105152",
"paymentNumber": 133,
"
---
GET Get Attachment
Path: v2/attachment/:id
> *This method requires the "Plus" level of the API product at a minimum.*
Retrieve a file attachment.  The file is returned as a Base64 encoded string.
Example Request Body:
(none)
Example Responses:
[ Get Attachment]: {
"status": "success",
"result": "OK",
"detail": "** BASE64 ENCODED DATA **"
}
---
POST Add Attachment
Path: v2/attachment
Add an attachment to a document or a product
> _This method requires the "Plus" level of the API product at a minimum._ 

The following table details the parameters required, if the user wishes to add an attachment to a quote:
Parameters	Type	Required	Meaning
documentNumber	string	true	Number of document to which attachment is to be added
documentType	string	true	Specify if this document is a Quote, Order, Estimate, or Claim
lineNumber	number	false	If adding attachment to specific quote/order line, specify using this parameter
fileExtension	string	true	File extension of attachment (jpg,pdf,etc)
description	string	false	Brief description of attachment contents
fileData	string	true	Base64 encoded string representing the file
paperlessDocType	int	false	Document type id obtained from Get Paperless Document Types endpoint
subNumber	int	false	The estimate sub number. Defaults to 1. Only applies to adding an attachment to an estimate.
If the user wishes to add an attachment to a product, then the following parameters shall be used:
Parameters	Type	Required	Meaning
productId	number	true	Id of the product to which the attachment will be added
fileExtension	string	true	File extension of attachment (jpg,pdf,etc)
description	string	false	Brief description of attachment contents
fileData	string	true	Base64 encoded string representing the file
paperlessDocType	int	false	Document type id obtained from Get Paperless Document Types endpoint
Example Request Body:
(none)
Example Responses:
[ Add Attachment To Document]: {
"documentNumber": "ES903371",
"documentType": "Quote",
"fileExtension": "jpg",
"description": "Describe attachment contents here",
"fileData": "Insert Base64 Encoded File here"
}
[ Add Attachment To Product]: {
"productId": 1023581,
"fileExtension": "jpg",
"description": "Describe attachment contents here",
"fileData": "Base64 encoded file data here"
}
---
POST Get Paperless Document Types
Path: v2/attachment/paperless/doctype
> _This method requires the "Plus" level of the API product at a minimum._ 

Gets a list of paperless document types for a specific user, or the default list if no user is provided.
Group can be one of the following values:
Group	Explanation
RollProductColor	Roll Product Color
ItemProductColor	Product Item Color
ServicePictures	Service Record
HeaderPictures	Order Header
LinePictures	Order Line
EstHeadPictures	Quote Header
EstLinePictures	Quote Line
ClaimHeadPictures	Claim Header
ClaimLinePictures	Claim Line
JeHeadPictures	BidPro Estimate Header
JeLinePictures	BidPro Estimate Line
RollInventory	Roll Inventory Record
ItemInventory	Item Inventory Record
RollProduct	Roll Product Record
ItemProduct	Item Product Record
Example Request Body:
{
"user": "admin",
"group": "HeaderPictures"
}
Example Responses:
[200 Get Paperless Document Types]: {
"status": "success",
"result": [
{
"id": 100001,
"name": "Invoice"
},
{
"id": 100005,
"name": "Receiving Ticket"
},
{
"id": 200004,
"name": "Header Pictures Document"
}
],
"detail": null
}
---
POST List Attachments
Path: v2/attachments
> *This method requires the "Plus" level of the API product at a minimum.*
Finds attachments based on a variety of user-provided parameters. Said parameter options are defined below:
Attachment Type	Required Parameters	Optional Parameters	Notes
Quote Header Order Header Estimate Header	documentNumber documentType	subNumber (Estimate only)	documentType = "Quote" documentType = "Order" documentType = "Estimate"
Quote Line Order Line Estimate Line	documentNumber documentType lineNumber	subNumber (Estimate only)	Same as above
Roll Good Item	productId		
Roll Good Inventory Item Inventory	productId isInventory		isInventory must be set to true
Roll Good Color Item Color	productId colorId		
Service	productId isService		isService must be set to true
Example Request Body:
{
"productId": 123387,
"isService": true
}
Example Responses:
[200 List Attachments - Service]: {
"status": "success",
"result": [
{
"id": 18289,
"path": "\\path\to\file\Image123.png",
"fileExtension": "png",
"size": 9053,
"description": "photo.png",
"fileData": "base64 encoded file data"
}
],
"detail": null
}
---
DELETE Delete Attachment
Path: v2/attachment/:id
> *This method requires the "Plus" level of the API product at a minimum.*
Given an attachment id, this method will delete the associated attachment.
Example Request Body:
(none)
Example Responses:
(none)
---
GET Get Estimate
Path: v2/estimate/:number
Retrieve a specific estimate
> _This method requires the "Plus" level of the API product at a minimum._
Example Request Body:
(none)
Example Responses:
[200 Get Estimate]: {
"status": "success",
"result": {
"id": "4875",
"number": "JE100250",
"subNumber": 1,
"originalNumber": "",
"category": "",
"soldTo": {
"customerId": 373,
"phone1": "",
"phone2": "",
"email": "",
"customerType": "CASH & CARRY",
"businessName": null,
"lastName": "",
"firstName": "NANCY",
"address1": "17557 GOLD FINCH DRIVE",
"address2": "",
"city": "BUHL",
"state": "AL",
"postalCode": "35446-",
"county": ""
},
"shipTo": {
"businessName": null,
"lastName": "SMITH",
"firstName": "NANCY",
"address1": "17557 GO
---
POST Create Estimate
Path: v2/estimate/create
Create a BidPro estimate. The same fields for creating a quote may be used to populate estimate information.
Sub Number
An estimate sub number can be specified. If not included, it will default to 1. To create an estimate with a sub number greater than 1, include the `documentNumber` field in the body of the request, in addition to the `subNumber` field.
> _This method requires the "Enterprise" level of the API product_
Example Request Body:
{
"poNumber": "00504",
"measureDate": "2021-03-01",
"estimatedDeliveryDate": "2021-03-29",
"jobNumber": "WERS997",
"soldTo": {
"lastName": "Orwell",
"firstName": "George",
"address1": "77 Almaz BLVD",
"address2": "STE 101",
"city": "NOWHERE",
"state": "NE",
"postalCode": "56332",
"phone1": "403-333-1000",
"email": "gorwell1@dystopiancoverings.com",
"customerType": "REMODELING"
},
"shipTo":
{
"lastName": "Orwell",
"firstName": "George",
"address1": "77 Almaz BLVD",
"address2": "STE 102",
"city": "NOWHERE",
"state": "NE",
"postalCode": "56332"
},
"storeNumber": 32,
"privateNotes": "PRIVA
Example Responses:
[200 Create BidPro Estimate]: {
"status": "success",
"result": "JE100281",
"detail": {
"docId": "4907"
}
}
[ Create Estimate With Sub Number]: {
"status": "success",
"result": "JE100281",
"detail": {
"docId": "4907"
}
}
---
POST Update Estimate
Path: v2/estimate
All elements other than number are optional. Similar to updating quotes, only include the elements you wish to modify. To update an estimate with a particular sub number, include the `subNumber` field. If no `subNumber` is included, the default will be 1.
> _This method requires the "Enterprise" level of the API product_
Example Request Body:
{
"number": "JE100281",
"estimatedDeliveryDate": "2021-04-23",
"privateNotes": "SHIPPING DELAYS EXPECTED"
}
Example Responses:
[200 Update Estimate]: {
"status": "success",
"result": "OK",
"detail": "true"
}
[ Update Estimate With Sub Number]:
---
POST Find Estimate
Path: v2/estimate/find
Search for Estimates.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Required	Meaning
searchText	true	Text searches across customer first name, customer last name, estimate number, project name, model, salesperson1, and salesperson2
dateCreatedFrom	false	Search for an estimate that was created after this date.
dateCreatedTo	false	Search for an estimate that was created before this date
viewExportedOnly	false	Filters estimates by export status.
viewOpenOnly	false	Filters estimates by export status.
resultPageNumber	false	Specify a specific page of estimate results to view. By default, returns first page of results
> _Note: Each page contains ten results from the query, starting from most recently created._
Example Request Body:
{
"searchText": "Jacob Solanto",
"dateCreatedFrom": "2023-06-20",
"dateCreatedTo": "2023-06-28",
"viewExportedOnly": true,
"viewOpenOnly": false
}
Example Responses:
(none)
---
POST Create Claim
Path: v2/claim/create
> *This method requires the "Enterprise" level of the API product.*  Requests from other level API accounts will return Unauthorized.

Example Request Body:
{
"poNumber": "987654",
"adSource": "BILLBOARD",
"quoteDate": "2019-07-01",
"estimatedDeliveryDate": "2019-08-01",
"jobNumber": "ABC123",
"soldTo": {
"lastName": "DOE",
"firstName": "JOHN",
"address1": "1234 MAIN ST",
"address2": "STE 33",
"city": "ANYTOWN",
"state": "CA",
"postalCode": "91332",
"county": "LOS ANGELES"
},
"storeNumber": 50,
"privateNotes": "PRIVATE",
"publicNotes": "PUBLIC",
"workOrderNotes": "WORK ORDER NOTES",
"salesperson1": "JOHN",
"salesperson2": "FRANK",
"lines": [
{
"productId": 992048,
"colorId": 7814430,
"quantity": 12.00,
"priceLevel": "Price3"
}
]
}
Example Responses:
[200 Create Claim]: {
"status": "success",
"result": "CL903428",
"detail": null
}
---
POST Add Notes to Claim
Path: v2/claim/notes
Append or add new notes to a claim. Refer to Add Notes To Order documentation to view all available parameters for updating note fields.
> *This method requires the "Plus" level of the API product*
Example Request Body:
{
"number": "CL000015",
"publicNotes": "A public note",
"privateNotes": "Private note",
"workOrderNotes": "Work order notes"
}
Example Responses:
[200 Add Notes to Claim]: {
"status": "success",
"result": "OK",
"detail": null
}
---
GET Get Product Codes
Path: v2/product/get/productcodes
This call returns a list of product codes defined for a store.
>*This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get Product Codes]: {
"productCodes": [
{
"productCode": "01",
"title": "01 - CARPET"
},
{
"productCode": "02",
"title": "02 - VINYL"
},
{
"productCode": "03",
"title": "03 - AREA RUGS"
},
{
"productCode": "04",
"title": "04 - CUSHION"
},
{
"productCode": "05",
"title": "05 - WALL COVERINGS"
},
{
"productCode": "06",
"title": "06 - CERAMIC"
},
{
"productCode": "07",
"title": "07 - HARDWOOD"
},
{
"productCode": "08",
"title": "08 - SUPPLIES"
},
{
"productCode": "09",

---
POST Get Products
Path: v2/product/get
Given an array containing one or more product IDs, this request returns detailed information about each respective product.
>*This method requires "Plus" level of API product at a minimum*
Example Request Body:
{
"products" :["88419", "88168", "1021622"]
}
Example Responses:
[200 Get Products]: {
"status": "success",
"result": [
{
"rollNumber": "",
"supplierName": "SHAW INDUSTRIES, INC",
"privateSupplierName": "CARPET ONE",
"manufacturerName": "PHILADELPHIA MAINSTR 40",
"rollLengthInches": 2400,
"activeProduct": true,
"sellByQuantity": 0,
"notes": "",
"inventoryUnits": "",
"priceListings": {
"Price1": 3.79,
"Price2": 2.12,
"Price3": 1.74,
"Price4": 1.59,
"Price5": 1.55,
"Price8": 5.68,
"Price9": 2.31,
"Price10": 5.78,
"Price11": 2.41,
"Price12": 1.04,
"Cut": 1.04,

---
POST Find Products
Path: v2/product/find
> *This method requires the "Plus" level of the API product at a minimum.*
Search for products to include in quotes and orders.
Parameters
---
Parameter	Required	Meaning
searchText	true	The supplied text will be found in the style name and color names for the product
productCode	false	Limit search to only products in a specific product code
storeNumber	false	If supplied, results will be filtered to only those in this store
colorSKU	false	Search for a specific color SKU
pageIndex	false	Results are returned 10 at a time. If this value is omitted (or set to 0) the first 10 are returned. To request the next page of 10, send pageIndex = 1, etc.
ecProductId	false	Search for products with certain ECProductID
ecColorId	false	Search for products with specified ECColorID
ecSizeId	false	Search for products with specified ECSizeID
Example Request Body:
{
"searchText": "adobe",
"storeNumber": 32,
"productCode": "01",
"ecProductId": "123AB"
}
Example Responses:
[ Find Products]: {
"status": "success",
"result": [
{
"id": "1025333",
"productCode": "01",
"storeNumber": 32,
"styleName": "ABBEY COURT - 12'",
"styleNumber": "HGL85",
"defaultPrice": 0,
"saleUnits": "SF",
"rollWidthInInches": 144,
"patternWidthInInches": 0,
"patternLengthInInches": 0,
"colorOptions": [
{
"id": "8293005",
"colorName": "ACORN",
"colorNumber": "00703",
"SKU": ""
},
{
"id": "8293009",
"colorName": "ADOBE SHADOW",
"colorNumber": "00101",
"SKU"
---
POST Get Product Bundles
Path: v2/product/get/productbundle
Given a product ID and a color ID, this request will retrieve all associated product bundles. The response will also contain, for all products in each assoicated bundle, detailed product information. If color ID is left blank, the default behavior is to return all associated product bundles across all colors.
>*This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
{
"productId": 1017786,
"colorId": 8166321
}
Example Responses:
[200 Get Product Bundles]: {
"status": "success",
"result": [
{
"id": 346678,
"name": "ACAPELLA FLOOR TILE - 13X13 - BRUN - 13x13 - GATEWAY",
"products": [
{
"rollNumber": "",
"supplierName": "MOHAWK INDUSTRIES",
"privateSupplierName": "CARPET ONE",
"manufacturerName": "MOHAWK INDUSTRIES",
"rollLengthInches": 0,
"activeProduct": true,
"sellByQuantity": 0,
"inventoryUnits": "",
"priceListings": {
"Cut": 0,
"Roll": 0
},
"colorOptions": [
{

---
GET Get Product Templates
Path: v2/product/templates/:id
Given a product code, this request will return all associated templates, including detailed product information for all products contained in each returned template.
>*This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get Product Templates]: {
"status": "success",
"result": [
{
"id": 1,
"name": "STANDARD CERAMIC FLOORS",
"products": [
{
"rollNumber": "",
"supplierName": "WCO",
"privateSupplierName": "WCO",
"manufacturerName": "WCO",
"rollLengthInches": 0,
"activeProduct": true,
"sellByQuantity": 0,
"inventoryUnits": "",
"priceListings": {
"Price1": 4.45,
"Price2": 3.95,
"Price12": 2.15,
"Cut": 2.15,
"Roll": 2.15
},
"colorOptio
---
GET Get Product ETaggs
Path: v2/product/etaggs
> _This method requires the "Plus" level of the API product at a minimum._ 

This method retrieves all product etag records associated with a company.
Example Request Body:
(none)
Example Responses:
[200 Get Product ETaggs]: {
"status": "success",
"result": "OK",
"detail": [
{
"SeqNum": 87602,
"StoreCode": 32,
"StoreCaptionLong": "[" "] CYNCLY'S CARPET STORE",
"StoreCaptionShort": "[" "]",
"ProductCode": "01",
"PrivateLabelCo": "CARPET ONE",
"PrivateStyleNumber": "10101978",
"PrivateStyle": "PERIMETER PLACE - HSC - 12' - 12'",
"Supplier": "SHAW INDUSTRIES, INC",
"Style": "ASHFORD 12 - 12'",
"StyleNumber": "7R342",
"Collection": "",
"SerialNumber": "",
"Manufacturer": "PHILADELPHIA 02",
"Price1": 2.79,
"Price2": 1.52,
"Price3": 1.25,
"Price4": 1.14,

---
POST Check Available Inventory
Path: v2/product/inventorycheck
> *This method requires the "Plus" level of the API product at a minimum.*
This method will allow you to check the available inventory for a product.  Supply the productCode, styleName, and colorName exactly as they appear on the product record and you will receive one or more instances of the product in inventory.
If you would like to reserve or cut inventory, take note of the inventoryLink value returned.  That value is supplied to the /order/inventory methods to actually assign the inventory to an order line.
Example Request Body:
{
"productCode": "01",
"styleName": "FOREIGNER - SOLID - 12'",
"colorName": "FENCE POST"
}

Example Responses:
[200 Check Available Inventory]: {
"status": "success",
"result": [
{
"storeId": 32,
"productCode": "01",
"styleName": "FOREIGNER - SOLID - 12'",
"colorName": "FENCE POST",
"styleNumber": "28593",
"colorNumber": "456367",
"lotName": "22192401",
"supplierName": "BEAULIEU OF AMERICA",
"manufacturerName": "BEAULIEU OF AMERICA",
"availableQuantity": 165,
"unitPrice": 1.46,
"saleUnits": "SF",
"location": "",
"availableLengthInInches": 165,
"isOnOrder": false,
"rollWidth": "12",
"inventoryLink": {
"inventoryId": 0,
"rollNumber": "36165578"
}
}
],
"detai
---
POST Reserve Inventory
Path: v2/order/inventory/reserve
> *This method requires the "Enterprise" level of the API product.*  Requests from other level API accounts will return Unauthorized.
This method reserves inventory for a line on an existing order.  Supply the order number, line number, and the inventoryLink value.  This value can be found by using the /product/inventorycheck method to find available inventory for the item.
Reserving for Multiple Order Lines
To reserve inventory for multiple lines of an existing order in a single request, omit lineNumber and inventoryLink fields from the main body of the request. Instead, these values should be placed inside a list of objects; one object for each order line the user wishes to modify. The following example illustrates this:

    {
        "orderNumber": "CG003646",
        "inventoryList": [
            {
                "lineNumber": 1,
                "inventoryLink": {
                    "inventoryId": 0,
                    "rollNumber": "35112072"
                }
            },
            {
                "lineNumber": 2,
                "inventoryLink": {
                    "inventoryId": 0,
                    "rollNumber": "244190K"
                }
            },
            {
                "lineNumber": 3,
                "inventoryLink": {
                    "inventoryId": 0,
                    "rollNumber": "49265195"
                }
            }
        ]
    }

Example Request Body:
{
"orderNumber": "CG903520",
"lineNumber": 1,
"inventoryLink": {
"inventoryId": 39,
"rollNumber": "D2001"
}
}

Example Responses:
[ Reserve Inventory]: {
"status": "success",
"result": "Line 1: Assigned",
"detail": null
}
---
POST Cut Inventory
Path: v2/order/inventory/cut
> *This method requires the "Enterprise" level of the API product.*  Requests from other level API accounts will return Unauthorized.
This method cuts inventory for a line on an existing order.  Supply the order number, line number, and the inventoryLink value.  This value can be found by using the /product/inventorycheck method to find available inventory for the item.
Cutting for Multiple Order Lines
To cut inventory for multiple lines of an existing order in a single request, follow the instructions as outlined in the Reserve Inventory request, under the subheading entitled: Reserving for Multiple Order Lines
The only difference will be the request itself.
Example Request Body:
{
"orderNumber": "CG903520",
"lineNumber": 1,
"inventoryLink": {
"inventoryId": 39,
"rollNumber": "D2001"
}
}

Example Responses:
(none)
---
POST Stage Lines
Path: v2/order/inventory/stage
This method stages either one or multiple lines on an order. Please note that this endpoint is for ERRM orders only.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Required	Meaning
orderNumber	true	String. Order number.
orderDate	true	Formatted date string. Date to mark the lines as staged.
lines	true	List of integers. The number of the line to mark as staged.
Example Request Body:
{
"orderNumber": "CG402100",
"orderDate": "07-09-2024",
"lines": [5]
}
Example Responses:
[200 Stage Lines]: {
"status": "success",
"result": "Staged Lines Processed",
"detail": null
}
---
POST Deliver Lines
Path: v2/order/inventory/deliver
This method delivers either one or multiple lines on an order.
> _This method requires the "Plus" level of the API product at a minimum._ 

Parameters
Parameters	Required	Meaning
orderNumber	true	String. Order number.
orderDate	true	Formatted date string. Date to mark the lines as delivered.
lines	true	List of integers. The number of the line to mark as delivered.
Example Request Body:
{
"orderNumber": "CG402092",
"orderDate": "06-20-2024",
"lines": [3]
}
Example Responses:
[200 Deliver Lines]: {
"status": "success",
"result": "Cut Lines Processed",
"detail": null
}
---
POST Set Inventory Location
Path: v2/inventory/location
Move inventory to a new bin location.
> _This method requires the "Plus" level of the API product at a minimum._ 
Parameters
Parameter	Notes
productCode	String value.
location	String value. The bin location to which the inventory item will be moved.
id	Integer value. The System Reference Number of the inventory item.
Example Request Body:
{
"productCode": "01",
"location": "A-2",
"id": 123
}
Example Responses:
[200 Set Inventory Location]: {
"status": "success",
"result": "OK",
"detail": null
}
---
GET Get Visible Stores To Salesperson
Path: v2/stores/:id
Retrieves visible and default store(s) for a salesperson by name.
>This method requires the "Plus" level of the API product at a minimum.
Example Request Body:
(none)
Example Responses:
[200 Get Visible Stores - Salesperson]: [
{
"storeId": 32,
"isDefault": false
},
{
"storeId": 50,
"isDefault": true
},
{
"storeId": 52,
"isDefault": false
},
{
"storeId": 53,
"isDefault": false
},
{
"storeId": 54,
"isDefault": false
},
{
"storeId": 75,
"isDefault": false
}
]
---
POST Post Provider Record From Order
Path: v2/order/provider
> *This method requires the "Enterprise" level of the API product.*
Given the following parameters, this method creates a provider record from an order line.
Parameter	Required	Description
documentNumber	true	Order number from which to generate the provider record
lineNumber	true	Line number of the order
installDate	true	Line install date
supplierId	See Description	Id of supplier, provide this value, or the value below
providerId	See Description	Id of provider. Supply this value, or the value above
rate	false	Overrides rate. Defaults to line gross cost or personnel hourly rate
hoursRegular	false	Decimal value
hoursOvertime	false	Decimal value
hoursDoubleTime	false	Decimal value
Note: Obtain the supplierId and providerId from the following public API methods: Get Suppliers, Get Personnel
Example Request Body:
{
"documentNumber": "CG203699",
"lineNumber": 1,
"installDate": "2022-04-07",
"supplierId": 71
}
Example Responses:
[200 Post Provide Record From Order]: {
"status": "success",
"result": "OK",
"detail": null
}
---
GET Get Suppliers
Path: v2/suppliers
> *This method requires the "Enterprise" level of the API product.*
Lists all suppliers associated with a store queue.
Example Request Body:
(none)
Example Responses:
[200 Get Suppliers]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 1059,
"name": "84 LUMBER COMPANY",
"contactPhone": "128-8820",
"accountNumber": "123",
"email": ""
},
{
"id": 2005,
"name": "A AND D HOME IMPROVEMENT",
"contactPhone": "",
"accountNumber": "",
"email": ""
},
{
"id": 17,
"name": "ALAGASCO",
"contactPhone": "759-2501",
"accountNumber": "",
"email": ""
},
{
"id": 1953,
"name": "C & W CONTRACTING",
"contactPhone": "468-0471",
"accountNumber": "",
"email": ""
},
{

---
GET Get Personnel
Path: v2/personnel
> *This method requires the "Enterprise" level of the API product.*
Lists all personnel associated with a store queue.
Example Request Body:
(none)
Example Responses:
[200 Get Personnel]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 2,
"firstName": "CARLOS",
"lastName": "PROVIDER"
},
{
"id": 3,
"firstName": "LINDSEY",
"lastName": "PROVIDER"
},
{
"id": 1,
"firstName": "KURT",
"lastName": "WILSON"
}
]
}
---
POST Create Remark
Path: v2/remark
> This method requires the "Plus" level of the API product. 

Create a remark associated with a defined entity (i.e quote, customer).
Available Paramters:
Parameter	Type	Notes
id	integer	Sequence number of the entity with which to associate the remark
isPublicRemark	bool	Viewing rights for the remark
entityType	string	Available Options: Customer, Header, Quote
remarkType	string	Select from list returned by Get Remark Types endpoint
remark	string	Remark text
Example Request Body:
{
"id": 38166,
"isPublicRemark": true,
"entityType": "Quote",
"remarkType": "INFORMATION",
"remark": "Another remark! Mark remarked at the market with marked surprise."
}
Example Responses:
[200 Create Remark]: {
"status": "success",
"result": {
"remarkId": 2822,
"isPublic": true,
"remarkType": "INFORMATION",
"remark": "Another remark! Mark remarked at the market with marked surprise."
},
"detail": null
}
---
GET Get Remark Types
Path: v2/remark/types
> _This method requires the "Plus" level of the API product._
Retrieves a list of all available remark types.
Example Request Body:
(none)
Example Responses:
[200 Get Remark Types]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 4,
"type": "CUSTOMER SERVICE"
},
{
"id": 5,
"type": "DIRECT MAIL"
},
{
"id": 1,
"type": "INFORMATION"
},
{
"id": 7,
"type": "LOST - GENERAL"
},
{
"id": 2,
"type": "SALES FOLLOW UP"
}
]
}
---
GET Unlock Document
Path: v2/unlock/:id
> This method requires the "Enterprise" level of the API product at a minimum. 

Given the lockId returned from the Get Order call, this method will unlock the document. Note that this lockId will be returned on Get Order calls that request a lock only.
Example Request Body:
(none)
Example Responses:
(none)
---
POST Record Payables
Path: v2/payables
> *This method requires the "Plus" level of the API product at a minimum.*
Use this method to create one or more payables in RFMS.  Call this method with an array of payables.  The combination of supplierName and invoiceNumber must be unique for each.
Payable properties
---
Property	Field in RFMS
supplierName	Supplier (who the bill is from)
invoiceNumber	Invoice # (the Supplier's invoice number)
invoiceDate	Invoice Date
dueDate	Due Date
discountableAmount	Discountable
nonDiscountableAmount	Non Discountable
discountRate	Disc Rate
linkedDocumentNumber	
internalNotes	A/P Internal Notes
remittanceAdviceNotes	A/P Remittance Advice Notes
detailLines	List of details
Each detail line can have these properties:
Property	Field in RFMS
storeNumber	Store (note that you must supply the Store number (32), not the Store display code (" ")
accountCode	Account Code
subAccountCode	Sub Code
amount	Amount
comment	Comment
Example Request Body:
[
{
"supplierName": "ACME",
"invoiceNumber": "XS101",
"invoiceDate": "9/24/19",
"dueDate": "10/24/19",
"discountableAmount": 10,
"nonDiscountableAmount": 90,
"discountRate": 0.1,
"linkedDocumentNumber": "",
"internalNotes": "Internal note",
"remittanceAdviceNotes": "Remit note",
"detailLines": [
{
"storeNumber": 32,
"accountCode": "101",
"subAccountCode": "",
"amount": 100,
"comment": "detail line"
}
]
}
]
Example Responses:
[ Record Payables]: {
"status": "success",
"result": "ACME - XS101 Added",
"detail": null
}
---
GET Get Job
Path: v2/job/:id
> *This method requires the "Plus" level of the API product at a minimum.*
Given a Schedule Pro Job Id, this method fetches the corresponding job.
Example Request Body:
(none)
Example Responses:
[200 Get Job]: {
"status": "success",
"result": "OK",
"detail": {
"customerName": "SOL GUGGENHEIM",
"depotName": "IN HOUSE                      ",
"secondaryCrew": "",
"timeSlot": "",
"orderInternalNote": "",
"orderCustomNote": "",
"workOrderNote": "",
"jobLock": null,
"orderLock": null,
"lines": [
{
"jobId": 17475,
"crewName": "CREW A                        ",
"documentNumber": "CG203671",
"productCode": "01",
"lineStatus": "",
"scheduledDate": "2022-04-07",
"orderLineNote": "",
"woLineNote": "",
"notes": "",
"delete": false,
"l
---
GET Get All Scheduled Jobs
Path: v2/order/jobs/:number
Gets all scheduled jobs for an order by invoice number.
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get Scheduled Jobs]: {
"status": "success",
"result": "OK",
"detail": [
{
"jobId": 17458,
"jobName": "BANUELOS, CARLOS",
"documentNumber": "CG105092",
"documentIsClaim": false,
"address": "123",
"address2": "",
"city": "",
"state": "",
"ZIP": "",
"phone1": "2059371144",
"phone2": "",
"salesperson": null,
"jobStatus": "CONTINUED",
"availableStatuses": null,
"crewName": "CREW A",
"scheduledStart": "20210617",
"scheduledEnd": "20210622",
"startTime": "08:00:00",
"endTime": "17:00:00",
"notes": "<div>\n<div>\n<p style="margin:0pt 0pt 0pt 0pt;line-height:norm
---
GET Get Scheduled Jobs for Crews
Path: v2/jobs/:crew
Retrieves all scheduled jobs associated with a particular crew, by the name of said crew.
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
(none)
Example Responses:
[200 Get Scheduled Jobs for Crews]: {
"status": "success",
"result": "OK",
"detail": [
{
"jobId": 17455,
"jobName": "BROWN, CHARLIE",
"documentNumber": "CG105053",
"address": "1 MAIN ST",
"address2": "",
"city": "BIRMINGHAM",
"state": "AL",
"ZIP": "",
"phone1": "201-575-0731",
"phone2": "",
"salesperson": null,
"jobStatus": "GROUT",
"availableStatuses": null,
"crewName": "CREW A",
"secondaryCrewName": "",
"scheduledStart": "20210510",
"scheduledEnd": "20210519",
"startTime": "08:00:00",
"endTime": "17:00:00",
"laborTotal": 0,
"storeNumber": 0,
"s
---
POST Get Jobs For Crew - POST
Path: v2/jobs/crew
Search for all scheduled jobs associated with a crew name. This method may be used instead of the Get Scheduled Jobs For Crew in all cases, but must be used when the crew name contains special characters, such as the following: & . * ( ) , [ ]
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
{
"crew": "Bed, Bath, & Beyond"
}
Example Responses:
(none)
---
GET Get Active Job Statuses
Path: v2/statuses
Returns a list of active job statuses.
>Note: In order to successfully update a Schedule Pro job status, the status value must be selected from the list returned by this method.
Example Request Body:
(none)
Example Responses:
[200 Job Statuses]: {
"activeStatuses": [
"CONTINUED",
"FINISH",
"ONE DAY COMPLETE",
"DELIVER TO ACCLIMATE",
"TAKE UP ONLY",
"GROUT",
"MOVE FURNITURE",
"START"
]
}
---
POST Change Job Status
Path: v2/job/status
Updates a job status.
> **Note: Status must be a selection from the list returned by the Get Active Job Statuses method**
> *This method requires the "Plus" level of the API product at a minimum.*
Example Request Body:
{
"jobId": 1234,
"status": "START"
}
Example Responses:
(none)
---
POST Add Notes To Job
Path: v2/job/notes
If there are no work order nor work ticket notes already associated with a scheduled job, the specified notes will be added. Otherwise, the existing notes will be replaced by the new content. When adding notes, specify either one or the other.
> *This method requires the "Plus" level of the API product*

Available Parameters

Parameter	Required	Type	Meaning
id	true	integer	Job ID
workOrderNotes	false	string	Text to add to the work order note field
workTicketNotes	false	string	Text to add to the work ticket note field
Example Request Body:
{
"id": 17459,
"workOrderNotes": "Add a new work order note"
}
Example Responses:
(none)
---
GET Get Crews
Path: v2/crews
> *This method requires the "Plus" level of the API product at a minimum.*
Lists all crews, along with additional information such as availability and naming.
Example Request Body:
(none)
Example Responses:
[200 Get Crews]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 94,
"name": "A-FLOORING PROS",
"description": "",
"depot": "IN HOUSE",
"nickname": "A-FLOORING PROS",
"rfmsName": "",
"telephone1": "",
"telephone1Description": "",
"telephone2": "",
"telephone2Description": "",
"availability": {
"Sunday": false,
"Monday": true,
"Tuesday": true,
"Wednesday": true,
"Thursday": false,
"Friday": true,
"Saturday": false
}
},
{
"id": 8,
"name": "COLLAZO, JESUS",
"description": "CER
---
POST Find Jobs
Path: v2/jobs/find
> *This method requires the "Plus" level of the API product at a minimum.*
Query for Schedule Pro jobs based on the following parameters:
Record status date range
Scheduled date range
Job status
State of the Schedule Pro job itself in RFMS (Inserted, Updated, or Both)
Line install date range

For example, a recordStatus value of "Inserted" will only return jobs that were inserted within the specified startDate and endDate range. "Updated" will return updated only. Finally, a value of "Both" will return all jobs both inserted and updated within the given date range.
Example Request Body:
{
"startDate": "01-01-2017",
"endDate": "02-15-2022",
"scheduledStartDate": "01-01-2017",
"scheduledEndDate": "03-10-2022",
"installStartDate": "01-01-2022",
"installEndDate": "0401-2022",
"crews": ["EVANS, TONY"],
"secondaryCrews": ["SLEDGE, GLENN"],
"jobStatus": ["Continued"],
"recordStatus": "Both"
}
Example Responses:
[200 Find Jobs]: {
"status": "success",
"result": [
{
"jobId": 17430,
"jobName": "",
"documentNumber": "CG003776",
"address": "                                                                 ",
"address2": "",
"city": "                              ",
"state": "     ",
"ZIP": "          ",
"phone1": "            ",
"phone2": "205-926-9988",
"salesperson": null,
"jobStatus": "",
"availableStatuses": null,
"crewName": "EVANS, TONY                   ",
"secondaryCrewName": "SLEDGE, GLENN",
"scheduledStart": "20201109",
"scheduledEnd": "20201109",
"startTime": "MIXED
---
POST Create Job From Order
Path: v2/job/create
> *This method requires the "Enterprise" level of the API product at a minimum.*
Given both an order document id, and a list of line ids belonging to that order, this method will generate a new, scheduled job based on the content of the order and lines.
Example Request Body:
{
"orderNumber": 83818,
"orderLines": [2478]
}
Example Responses:
[200 Create Job From Order]: {
"status": "success",
"result": "CG203515",
"detail": {
"docId": "17462"
}
}
---
POST Create Job
Path: v2/job
> _This method requires the "Enterprise" level of the API product._
Creates a Schedule Pro job.
Handling Validation Errors
When system settings dictate, creating or updating a job may result in validation warnings and restrictions. To override these warnings, do the following:
Take the error list returned in the detail field on the initial call, and for each restriction and/or warning, set the override parameter to true
Assign the list to the jobChecks parameter on the job object.

This will override the validation check warnings and allow the job to be created or updated. See the example "Create Job - Validation Response"
Example Request Body:
{
"jobName": "Post Modern Designs",
"jobNumber": "ABC123",
"documentNumber": "CG203671",
"storeNumber": 32,
"address": "14 Vassar Dr",
"address2": "Block 40",
"city": "Somewhere",
"state": "NE",
"zip": "00331",
"phone1": "002-343-2214",
"phone2": "893-222-2461",
"salesperson": "Ray Stata",
"crewName": "CREW A",
"secondaryCrew": "CREW B",
"unassigned": false,
"depotName": "IN HOUSE",
"scheduledStart": "2022-04-05",
"scheduledEnd": "2022-04-07",
"customerName": "Frank Gehry",
"notes": "Test notes",
"track1Description": "DELIVER GOODS TO ACCLIMATE",
"track2Description": "ALTERNATE-INSURANCE CLAIM",
"laborTotal": "3421.94",
"lines": [
{
"documentNumber":
Example Responses:
[200 Create Or Update Job]: {
"status": "success",
"result": "CG203671",
"detail": {
"docId": "17473"
}
}
[200 Update Job]: {
"status": "success",
"result": "CG203671",
"detail": {
"docId": "17475"
}
}
---
POST Update Job
Path: v2/job
> _This method requires the "Enterprise" level of the API product._ 

Update a job with a given id.
Updating lines
"Enterprise" level API users can also add, delete, and edit lines. Here are some examples:
To delete a line, include just the line id and delete: true.
Handling Validation Errors
See Create Job documentation for more details.
```
{
    "jobId": 1234,
    "lines": [ { "lineId": 215541, "delete": true } ]
}

 ```
To edit a line, include the line id:
```
{
    "jobId": 1235,
    "lines": [ { "lineId": 215541, "scheduledStartTime":"0008:30", "scheduledEndTime": "0012:00", "quantity": 100, "deductCapacity": true } ]
}

 ```
To add a new line, omit line id:
```
{
    "jobId": 1235,
    "lines":[ { "scheduledStartTime":"0008:30", "scheduledEndTime": "0012:00", "quantity": 100, "material": "CARPET", "deductCapacity": true } ]
}

 ```
When modifying or adding lines, the following elements are supported:
material
quantity
productCode
scheduledDate
styleName
colorName
units
scheduledStartTime
scheduledEndTime
documentNumber
lineNumber (on associated order - if provided)
crewName
deductCapacity
depotName
Example Request Body:
{
"jobId": 17475,
"unassigned": false,
"lines": [
{
"lineId": 183286,
"documentNumber": "CG203671",
"lineNumber": 1
}
]
}
Example Responses:
(none)
---
POST Post Provider Record From Job
Path: v2/job/provider
> *This method requires the "Enterprise" level of the API product.*
Given a jobId and a jobLineId, generate a provider record. The job line must already have a document number and a line number associated with it for the call to be successful.
Example Request Body:
{
"jobId": 17475,
"jobLineId": 183286
}
Example Responses:
[200 Post Provider Record From Job]: {
"status": "success",
"result": "OK",
"detail": null
}
---
GET Get Time Slots
Path: v2/timeslots
> _This method requires the "Plus" level of the API product._
Lists all available time slots that a job can have.
Example Request Body:
(none)
Example Responses:
[200 Get Time Slots]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 1,
"slot": "MIXED",
"startTime": "0008:00:00",
"endTime": "0017:00:00"
},
{
"id": 2,
"slot": "MORNING",
"startTime": "0008:00:00",
"endTime": "0012:00:00"
},
{
"id": 3,
"slot": "AFTERNOON",
"startTime": "0013:00:00",
"endTime": "0017:00:00"
},
{
"id": 4,
"slot": "CONTINUED",
"startTime": "0008:00:00",
"endTime": "0008:30:00"
},
{
"id": 5,
"slot": "FINISH",
"startTime": "0008:00:00",
"endTime": "0017:00:00"

---
GET Get Job Track Listings
Path: v2/job/tracklist
> _This method requires the "Plus" level of the API product._
Lists all available track listing descriptions for a job. The "track1Listings" result contains a set of descriptions that can only be used for setting the matching "track1Description" field on a job. Likewise, the "track2Listings" result set can only be used for setting "track2Description" field.
Example Request Body:
(none)
Example Responses:
[200 Get Job Track Listings]: {
"status": "success",
"result": "OK",
"detail": {
"track1Listings": [
{
"id": 1,
"description": "CERAMIC REPAIR"
},
{
"id": 2,
"description": "DELIVER GOODS TO ACCLIMATE"
},
{
"id": 3,
"description": "GROUT"
},
{
"id": 4,
"description": "HARDWOOD REMOVAL"
},
{
"id": 5,
"description": "INSTALL MOULDING"
},
{
"id": 6,
"description": "MOVE FURNITURE"
},
{
"id": 7,
"description": "RUN PUNCH LIST"

---
GET Get Job Status Ids
Path: v2/jobstatusids
> _This method requires the "Plus" level of the API product._
Lists all available job statuses that a job can have
Example Request Body:
(none)
Example Responses:
[200 Get Job Status Ids]: {
"status": "success",
"result": "OK",
"detail": [
{
"id": 6,
"description": "GROUT"
},
{
"id": 7,
"description": "FINISH"
},
{
"id": 9,
"description": "START"
},
{
"id": 10,
"description": "ONE DAY COMPLETE"
},
{
"id": 11,
"description": "DELIVER TO ACCLIMATE"
},
{
"id": 15,
"description": "TAKE UP ONLY"
},
{
"id": 18,
"description": "MOVE FURNITURE"
},
{
"id": 19,
"description": "CONTINUED"
}
]
}
---
GET Get Job Types
Path: v2/jobtypes
> _This method requires the "Plus" level of the API product at a minimum._ 

Gets a list of job types.
Example Request Body:
(none)
Example Responses:
[200 Get Job Types]: {
"jobTypes": [
"CARPET",
"WOOD",
"VINYL",
"VCT",
"LAMINATES",
"CERAMIC",
"TAKE UP CARPET",
"TAKE UP WOOD",
"DELIVERY",
"SAND/FINISH",
"MEASURE"
]
}
---
GET Get Order History
Path: v2/order/history/:number
Provided an order number, this request will return the quote or estimate used to create given order.
>Requires API product level of Plus or higher
If the detail field returns as null, then the specified order has no quote or estimate origins.
Example Request Body:
(none)
Example Responses:
[200 Get Order History]: {
"status": "success",
"result": "OK",
"detail": "JE100250.1"
}
---
POST Generate Report
Path: v2/quote/report/generate
> *This method requires the "Plus" level of the API product.*
Given a quote number and a series of options, this method will return a MyFlooringLink URL to the newly generated report. The options below are all the available ones to choose from when determining which fields will be displayed on the report. All listed options are optional and, if not included, will simply default to a false value.
To customize which terms and conditions are listed on the report, use the Get Terms endpoint to view a list of terms titles. Then, include the termsToShow parameter, followed by an array of chosen terms titles.
> **Note:** To generate a report for an order, simply use an order number and call the endpoint like so: v2/order/report/generate
Example Request Body:
{
"documentNumber": "ES103271",
"options": {
"showLogo": true,
"storeAddress": true,
"storeName": true,
"showRoomPlan": true,
"showSeams": true,
"showGrandTotal": true,
"showColorChip": true,
"showQuantity": true,
"showUnitPrice": true,
"showLineTotal": true,
"showApprove": true,
"showDeliveryDate": true,
"showPhotos": true,
"showLineNotes": true,
"showLineGroups": true,
"showPayment": true,
"showSignature": true,
"showAuthorization": true,
"allowAuthorization": true,
"allowPayment": false,
"termsToShow": ["Terms and Conditions", "Bullet Point Terms"],
"defaultShareMessage": "Her
Example Responses:
[200 Generate Report]: {
"status": "success",
"result": "https://myflooringlink.com/#/view/25cf5abb7eb047958d2756c1e28f5934",
"detail": null
}
---
GET Get Terms
Path: v2/report/terms
> *This method requires the "Plus" level of the API product at a minimum.*
Gets a list of all terms and conditions maintained by a company. All terms and conditions means the default terms, as well as terms for a specific store. Only stores that have terms and conditions saved will appear in the returned result. Other stores ought to use the terms belonging to the default option.
To get terms and conditions belonging to a secondary company, use the following request:
`GET /v2/report/terms/{companyId}`
Example Request Body:
(none)
Example Responses:
[200 Get Terms]: {
"status": "success",
"result": [
{
"storeId": "default",
"terms": [
"Terms and Conditions",
"Terms",
"TERMS",
"New Terms",
"Even Newer Terms",
"Bullet Point Terms",
"Mutiple Choice T&C"
]
},
{
"storeId": " ",
"terms": [
"Terms and Conditions"
]
},
{
"storeId": "2",
"terms": [
"Terms and Conditions"
]
},
{
"storeId": "4",
"terms": [
"TERMS",
"Even Newer Terms"
]
},
{
"storeId": "5",

---
GET Sync Settings
Path: v2/cacherefresh
Sync all store setttings.
> _**Note:**_ **This method is very taxing on the server and should be used sparingly and with intent.**
Example Request Body:
(none)
Example Responses:
(none)
---
POST API Pass Through
Path: v2/passthrough
This method allows for making raw data queries directly to RFMS.
The format of the query is as follows:
``` json
{
   "methodName": "RfmsMethod",
   "requestPayload": {
      //data query here
   }
}

 ```
Example Request Body:
{
"methodName": "Method.Name",
"requestPayload": {
"username": "Username",
"legacy": false
}
}
Example Responses:
[200 Raw Query]: {
"status": "success",
"result": "OK",
"detail": {
"DidCosting": true,
"IsError": true,
"ReceivingResults": {
"Method": "UpdateOrderLines",
"Code": 0,
"Message": "Receiving complete",
"IsError": false,
"ReceivedRollsItems": [
{
"RollLadingNumber": "31",
"PONumber": "",
"IsRoll": true,
"SeqNumSystemRefNum": 123
}
]
},
"CostingResults": {
"IsNull": false,
"IsError": true,
"IsValidationError": true,
"IsModelError": true,
"IsException": false,
"Messages": "No Invoice Number Provided\r\nInvoi