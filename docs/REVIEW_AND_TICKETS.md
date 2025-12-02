# Review and tickets needs to be made.

1. there are four screens to make, order tickets, order reviews, inventory reviews, delivery boy reviews
2. each should be same design as order history screen
3. in response userId, storeId, staffId info can be there so what u can do is fetch details of each so that we can show it in table
4. in reviews actions should be call customer, email customer
5. in tickets actions should be call customer, email customer, update status, update closing message.
6. Also pages should be linked to left sidebar

## APIs are mentioned below

# Order Reviews & Tickets API Documentation

This document describes the admin APIs for order reviews, item reviews, and order tickets.

**Base URL:** `/api/v1`

**Authentication:** All admin endpoints require Staff JWT token with `admin` or `manager` role.

---

## Common Types

```typescript
// Pagination response wrapper
type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationInfo;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

// Standard API response wrapper
type ServerApiResponse<T> = {
  statusCode: number;
  data: T;
  errorMessage?: string;
};
```

---

# Order Reviews API

## [GET] /review/order-reviews

List all order reviews with filtering and pagination (Admin only).

### Query Parameters

```typescript
type OrderReviewQueryParams = {
  currentPage?: number; // Default: 1, Min: 1
  limit?: number; // Default: 10, Min: 1, Max: 100
  orderId?: string; // Filter by order ID (24-char hex)
  overallRatings?: number; // Filter by overall rating (1-5)
  deliveryBoyRatings?: number; // Filter by delivery rating (1-5)
  userId?: string; // Filter by user ID (24-char hex)
  storeId?: string; // Filter by store ID (24-char hex)
  staffId?: string; // Filter by staff/rider ID (24-char hex)
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<OrderReviewResponse>>;

type OrderReviewResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  staffId?: string;
  overallRatings: number; // 1-5
  overallMessage?: string;
  deliveryBoyRatings?: number; // 1-5
  deliveryBoyMessage?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/review/order-reviews?currentPage=1&limit=10&storeId=abc123..." \
  -H "Authorization: Bearer <staff_token>"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "_id": "6749a1b2c3d4e5f6a7b8c9d0",
        "orderId": "6749a1b2c3d4e5f6a7b8c9d1",
        "userId": "6749a1b2c3d4e5f6a7b8c9d2",
        "storeId": "6749a1b2c3d4e5f6a7b8c9d3",
        "staffId": "6749a1b2c3d4e5f6a7b8c9d4",
        "overallRatings": 5,
        "overallMessage": "Great pizza, loved it!",
        "deliveryBoyRatings": 4,
        "deliveryBoyMessage": "Quick delivery",
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## [GET] /review/order-item-reviews

List all individual item reviews with filtering and pagination (Admin only).

### Query Parameters

```typescript
type OrderItemReviewQueryParams = {
  currentPage?: number; // Default: 1, Min: 1
  limit?: number; // Default: 10, Min: 1, Max: 100
  orderId?: string; // Filter by order ID (24-char hex)
  ratings?: number; // Filter by rating (1-5)
  userId?: string; // Filter by user ID (24-char hex)
  storeId?: string; // Filter by store ID (24-char hex)
  itemId?: string; // Filter by item/product ID (24-char hex)
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<OrderItemReviewResponse>>;

type OrderItemReviewResponse = {
  _id: string;
  orderId: string;
  itemId: string;
  userId: string;
  storeId: string;
  ratings: number; // 1-5
  message?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/review/order-item-reviews?itemId=abc123...&ratings=5" \
  -H "Authorization: Bearer <staff_token>"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "_id": "6749a1b2c3d4e5f6a7b8c9d0",
        "orderId": "6749a1b2c3d4e5f6a7b8c9d1",
        "itemId": "6749a1b2c3d4e5f6a7b8c9d5",
        "userId": "6749a1b2c3d4e5f6a7b8c9d2",
        "storeId": "6749a1b2c3d4e5f6a7b8c9d3",
        "ratings": 5,
        "message": "Best margherita pizza ever!",
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

# Order Tickets API

## [GET] /ticket/order-tickets

List all support tickets with filtering and pagination (Admin only).

### Query Parameters

```typescript
type OrderTicketQueryParams = {
  currentPage?: number; // Default: 1, Min: 1
  limit?: number; // Default: 10, Min: 1, Max: 100
  orderId?: string; // Filter by order ID (24-char hex)
  status?: "open" | "closed"; // Filter by ticket status
  userId?: string; // Filter by user ID (24-char hex)
  storeId?: string; // Filter by store ID (24-char hex)
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<OrderTicketResponse>>;

type OrderTicketStatus = "open" | "closed";

type OrderTicketResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  message: string;
  imageList: string[];
  status: OrderTicketStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/ticket/order-tickets?status=open&storeId=abc123..." \
  -H "Authorization: Bearer <staff_token>"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "data": [
      {
        "_id": "6749a1b2c3d4e5f6a7b8c9d0",
        "orderId": "6749a1b2c3d4e5f6a7b8c9d1",
        "userId": "6749a1b2c3d4e5f6a7b8c9d2",
        "storeId": "6749a1b2c3d4e5f6a7b8c9d3",
        "message": "My order was missing a drink that I paid for.",
        "imageList": ["https://example.com/uploads/receipt1.jpg"],
        "status": "open",
        "closingMessage": null,
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## [PUT] /ticket/change-status/:ticketId

Change the status of a support ticket (Admin only).

### Path Parameters

```typescript
type PathParams = {
  ticketId: string; // Ticket ID (24-char hex, required)
};
```

### Request Body

```typescript
type ChangeTicketStatusData = {
  status: "open" | "closed"; // Required
};
```

### Response

```typescript
type Response = ServerApiResponse<OrderTicketResponse>;

type OrderTicketResponse = {
  _id: string;
  orderId: string;
  userId: string;
  storeId: string;
  message: string;
  imageList: string[];
  status: "open" | "closed";
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X PUT "/api/v1/ticket/change-status/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "closed"}'
```

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "6749a1b2c3d4e5f6a7b8c9d0",
    "orderId": "6749a1b2c3d4e5f6a7b8c9d1",
    "userId": "6749a1b2c3d4e5f6a7b8c9d2",
    "storeId": "6749a1b2c3d4e5f6a7b8c9d3",
    "message": "My order was missing a drink that I paid for.",
    "imageList": ["https://example.com/uploads/receipt1.jpg"],
    "status": "closed",
    "closingMessage": null,
    "createdAt": "2024-12-01T10:30:00.000Z",
    "updatedAt": "2024-12-01T11:00:00.000Z"
  }
}
```

---

## [PUT] /ticket/change-message/:ticketId

Update the closing message of a ticket (Admin only).

### Path Parameters

```typescript
type PathParams = {
  ticketId: string; // Ticket ID (24-char hex, required)
};
```

### Request Body

```typescript
type UpdateClosingMessageData = {
  closingMessage: string; // Required, max 2000 chars
};
```

### Response

```typescript
type Response = ServerApiResponse<OrderTicketResponse>;
```

### Example Request

```bash
curl -X PUT "/api/v1/ticket/change-message/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"closingMessage": "We have issued a refund for the missing drink. Apologies for the inconvenience."}'
```

### Example Response

```json
{
  "statusCode": 200,
  "data": {
    "_id": "6749a1b2c3d4e5f6a7b8c9d0",
    "orderId": "6749a1b2c3d4e5f6a7b8c9d1",
    "userId": "6749a1b2c3d4e5f6a7b8c9d2",
    "storeId": "6749a1b2c3d4e5f6a7b8c9d3",
    "message": "My order was missing a drink that I paid for.",
    "imageList": ["https://example.com/uploads/receipt1.jpg"],
    "status": "closed",
    "closingMessage": "We have issued a refund for the missing drink. Apologies for the inconvenience.",
    "createdAt": "2024-12-01T10:30:00.000Z",
    "updatedAt": "2024-12-01T11:05:00.000Z"
  }
}
```

---

# Error Responses

All endpoints return errors in the following format:

```typescript
type ErrorResponse = {
  statusCode: number;
  data: null;
  errorMessage: string;
};
```

### Common Error Codes

| Status Code | Description                                              |
| ----------- | -------------------------------------------------------- |
| 400         | Bad Request - Invalid parameters or validation failed    |
| 401         | Unauthorized - Missing or invalid token                  |
| 403         | Forbidden - Insufficient permissions (not admin/manager) |
| 404         | Not Found - Resource not found                           |
| 429         | Too Many Requests - Rate limit exceeded                  |
| 500         | Internal Server Error                                    |

### Rate Limits

| Endpoint                       | Requests | Duration | Block Duration |
| ------------------------------ | -------- | -------- | -------------- |
| GET /review/order-reviews      | 100      | 5 min    | 1 min          |
| GET /review/order-item-reviews | 100      | 5 min    | 1 min          |
| GET /ticket/order-tickets      | 100      | 5 min    | 1 min          |
| PUT /ticket/change-status/\*   | 60       | 15 min   | 5 min          |
| PUT /ticket/change-message/\*  | 60       | 15 min   | 5 min          |
