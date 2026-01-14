# Shopping List CMS API Documentation

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```
- **Response:** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "token": "<JWT token>"
}
```

---

## User Endpoints

### Get All Users
- **GET** `/api/users/`
- **Access:** Admin only
- **Headers:** Authorization required
- **Response:** Array of users

### Get User by ID
- **GET** `/api/users/:id`
- **Access:** Admin or Owner (User can only access their own ID)
- **Headers:** Authorization required
- **Response:** User object

### Update User
- **PUT** `/api/users/:id`
- **Access:** Admin or Owner
- **Headers:** Authorization required
- **Body:** Partial user fields
  - Note: Non-admins cannot update the `role` field.
- **Response:** Updated user object

### Delete User
- **DELETE** `/api/users/:id`
- **Access:** Admin or Owner
- **Headers:** Authorization required
- **Response:**
```json
{
  "message": "User deleted"
}
```

---

## Shopping List Endpoints

### Get All Lists (for user)
- **GET** `/api/lists/`
- **Headers:** Authorization required
- **Response:** Array of shopping lists (with `items` populated)

### Create List
- **POST** `/api/lists/`
- **Headers:** Authorization required
- **Body:**
```json
{
  "name": "string"
}
```
- **Response:** Created list object

### Get List by ID
- **GET** `/api/lists/:id`
- **Headers:** Authorization required
- **Response:** List object (with `items` populated)

### Update List
- **PUT** `/api/lists/:id`
- **Headers:** Authorization required
- **Body:** Partial list fields
- **Response:** Updated list object

### Delete List
- **DELETE** `/api/lists/:id`
- **Headers:** Authorization required
- **Response:**
```json
{
  "message": "List deleted"
}
```

---

## Item Endpoints

### Add Item to List
- **POST** `/api/items/`
- **Headers:** Authorization required
- **Body:**
```json
{
  "name": "string",
  "quantity": number,
  "shoppingList": "<listId>",
  "purchased": boolean (optional, default: false)
}
```
- **Response:** Created item object

### Update Item
- **PUT** `/api/items/:id`
- **Headers:** Authorization required
- **Body:** Partial item fields
  - `name`
  - `quantity`
  - `purchased`
- **Response:** Updated item object

### Delete Item
- **DELETE** `/api/items/:id`
- **Headers:** Authorization required
- **Response:**
```json
{
  "message": "Item deleted"
}
```

---

## Error Responses
- All endpoints return errors in the form:
```json
{
  "error": "Error message"
}
```

---

## Notes
- Register and login do not require authentication.
- All other endpoints require a valid JWT token.
- Use the `/api/auth/login` endpoint to obtain a token.
