Get All Utility Information
GET /utilities

Description:
Fetches all utility information records.
Authorization: Manager only

Response (200 OK):
[
  {
    "id": number,
    "user_id": number,
    "water_cost": number,
    "water_usage": number,
    "electric_cost": number,
    "electric_usage": number,
    "gas_cost": number,
    "gas_usage": number,
    "due_date": "YYYY-MM-DD",
    "paid_date": "YYYY-MM-DD",
    "paid": boolean,
    "created_at": "timestamp"
  },
  ...
]

Error Responses:
401 Unauthorized – If user is not a manager
500 Internal Server Error – Something went wrong fetching the data





Get All Unpaid Utilities
GET /utilities/unpaid

Description:
Returns all utility records where paid is false.
Authorization: Manager only

Response (200 OK):
Same structure as above, filtered to unpaid records.

Error Responses:
401 Unauthorized – If user is not a manager
500 Internal Server Error – Something went wrong fetching the data





Get Utility Information for a User
GET /users/:id/utilities

Description:
Gets all utility information for a specific user. May be filtered by paid status (implementation dependent).
Authorization: Logged-in users

URL Params:

:id – User ID

Response (200 OK):
[
  {
    "id": number,
    "user_id": number,
    "water_cost": number,
    "water_usage": number,
    "electric_cost": number,
    "electric_usage": number,
    "gas_cost": number,
    "gas_usage": number,
    "due_date": "YYYY-MM-DD",
    "paid_date": "YYYY-MM-DD",
    "paid": boolean,
    "created_at": "timestamp"
  },
  ...
]

Error Responses:
500 Internal Server Error – Something went wrong retrieving the data





Create Utility Information for a User
POST /users/:id/utilities

Description:
Creates a utility record for the specified user.
Authorization: Logged-in users

URL Params:

:id – User ID

Request Body (optional fields):
{
  "water_cost": number,
  "water_usage": number,
  "electric_cost": number,
  "electric_usage": number,
  "gas_cost": number,
  "gas_usage": number,
  "due_date": "YYYY-MM-DD",
  "paid_date": "YYYY-MM-DD"
}

Response (201 Created):
{
  "id": number,
  "user_id": number,
  "water_cost": number,
  "water_usage": number,
  "electric_cost": number,
  "electric_usage": number,
  "gas_cost": number,
  "gas_usage": number,
  "due_date": "YYYY-MM-DD",
  "paid_date": "YYYY-MM-DD",
  "paid": false,
  "created_at": "timestamp"
}

Error Responses:
500 Internal Server Error – Something went wrong creating the record





Update Paid Status of a User's Utilities
PATCH /users/:id/utilities

Description:
Updates the paid status of the user's utility records.
Authorization: Logged-in users

URL Params:

:id – User ID

Request Body (required):
{
  "paid": true | false
}

Response (200 OK):
{
  "id": number,
  "user_id": number,
  "paid": true,
  ...
}
