# Admin Panel APIs Documentation

This document describes the APIs for admin panel features including Contact Info, Opening Hours, Social Media, Policies, General Ratings, Logos, Contact Queries, and Reservation Queries.

**Base URL:** `/api/v1`

**Authentication:** Admin endpoints require Staff JWT token with `admin` or `manager` role.

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

# Contact Info API

Manage store contact information. Only ONE contact info can be published at a time.

## [GET] /contactinfo/published

Get the currently published contact info (Public).

### Response

```typescript
type Response = ServerApiResponse<ContactInfoResponse | null>;

type ContactInfoResponse = {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/contactinfo/published"
```

---

## [GET] /contactinfo/list

List all contact info entries with filtering and pagination (Admin only).

### Query Parameters

```typescript
type ContactInfoQueryParams = {
  page?: number;        // Default: 1, Min: 1
  limit?: number;       // Default: 10, Min: 1, Max: 100
  sortBy?: string;      // Field to sort by (e.g., "createdAt")
  isAscending?: boolean; // Sort direction, Default: false
  isPublished?: boolean; // Filter by published status
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<ContactInfoResponse>>;
```

### Example Request

```bash
curl -X GET "/api/v1/contactinfo/list?page=1&limit=10&isPublished=true" \
  -H "Authorization: Bearer <staff_token>"
```

---

## [POST] /contactinfo/create

Create a new contact info entry (Admin only).

**Note:** If `isPublished` is set to `true`, all other contact info entries will be automatically unpublished.

### Request Body

```typescript
type ContactInfoCreateData = {
  addressLine1: string;      // Required, min 2, max 200 chars
  addressLine2?: string;     // Optional
  area: string;              // Required, min 2, max 100 chars
  city: string;              // Required, min 2, max 100 chars
  county?: string;           // Optional
  zip: string;               // Required, min 2, max 20 chars
  phone: string;             // Required, valid phone format
  email: string;             // Required, valid email format
  lat?: number;              // Optional, -90 to 90
  lng?: number;              // Optional, -180 to 180
  immediatePhoneNo?: string; // Optional
  immediateEmail?: string;   // Optional
  isPublished?: boolean;     // Optional, default: false
};
```

### Response

```typescript
type Response = ServerApiResponse<ContactInfoResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/contactinfo/create" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "addressLine1": "123 Pizza Street",
    "area": "Downtown",
    "city": "New York",
    "zip": "10001",
    "phone": "+1-555-123-4567",
    "email": "contact@pizzastore.com",
    "isPublished": true
  }'
```

---

## [PUT] /contactinfo/edit/:id

Update a contact info entry (Admin only).

**Note:** If `isPublished` is set to `true`, all other contact info entries will be automatically unpublished.

### Path Parameters

```typescript
type PathParams = {
  id: string; // Contact Info ID (24-char hex, required)
};
```

### Request Body

```typescript
type ContactInfoUpdateData = {
  addressLine1?: string;
  addressLine2?: string;
  area?: string;
  city?: string;
  county?: string;
  zip?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished?: boolean;
};
```

### Response

```typescript
type Response = ServerApiResponse<ContactInfoResponse>;
```

### Example Request

```bash
curl -X PUT "/api/v1/contactinfo/edit/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"isPublished": true}'
```

---

## [DELETE] /contactinfo/delete/:id

Delete a contact info entry (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Contact Info ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

### Example Request

```bash
curl -X DELETE "/api/v1/contactinfo/delete/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>"
```

---

# Opening Hours API

Manage store opening hours.

## [GET] /openinghours/list

Get all opening hours sorted by sortOrder (Public).

### Response

```typescript
type Response = ServerApiResponse<OpeningHoursResponse[]>;

type OpeningHoursResponse = {
  _id: string;
  day: string;        // e.g., "Monday", "Tuesday"
  startTime: string;  // e.g., "09:00"
  endTime: string;    // e.g., "22:00"
  sortOrder: number;  // 1, 2, 3...
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/openinghours/list"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d0",
      "day": "Monday",
      "startTime": "09:00",
      "endTime": "22:00",
      "sortOrder": 1,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    },
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d1",
      "day": "Tuesday",
      "startTime": "09:00",
      "endTime": "22:00",
      "sortOrder": 2,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

---

## [POST] /openinghours/create

Create a new opening hours entry (Admin only).

### Request Body

```typescript
type OpeningHoursCreateData = {
  day: string;       // Required, min 2, max 20 chars
  startTime: string; // Required, HH:MM format (e.g., "09:00")
  endTime: string;   // Required, HH:MM format (e.g., "22:00")
  sortOrder: number; // Required, min 1
};
```

### Response

```typescript
type Response = ServerApiResponse<OpeningHoursResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/openinghours/create" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "22:00",
    "sortOrder": 1
  }'
```

---

## [PUT] /openinghours/edit/:id

Update an opening hours entry (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Opening Hours ID (24-char hex, required)
};
```

### Request Body

```typescript
type OpeningHoursUpdateData = {
  day?: string;
  startTime?: string;
  endTime?: string;
  sortOrder?: number;
};
```

### Response

```typescript
type Response = ServerApiResponse<OpeningHoursResponse>;
```

### Example Request

```bash
curl -X PUT "/api/v1/openinghours/edit/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"endTime": "23:00"}'
```

---

## [DELETE] /openinghours/delete/:id

Delete an opening hours entry (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Opening Hours ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# Social Media API

Manage social media links.

## [GET] /socialmedia/list

Get all social media entries (Public).

### Response

```typescript
type Response = ServerApiResponse<SocialMediaResponse[]>;

type SocialMediaResponse = {
  _id: string;
  name: string;  // e.g., "Facebook", "Instagram"
  logo: string;  // URL to logo image
  link: string;  // Social media profile URL
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/socialmedia/list"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d0",
      "name": "Facebook",
      "logo": "https://example.com/fb-logo.png",
      "link": "https://facebook.com/pizzastore",
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    },
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d1",
      "name": "Instagram",
      "logo": "https://example.com/ig-logo.png",
      "link": "https://instagram.com/pizzastore",
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

---

## [POST] /socialmedia/create

Create a new social media entry (Admin only).

### Request Body

```typescript
type SocialMediaCreateData = {
  name: string; // Required, min 2, max 50 chars
  logo: string; // Required, valid URL
  link: string; // Required, valid URL
};
```

### Response

```typescript
type Response = ServerApiResponse<SocialMediaResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/socialmedia/create" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Twitter",
    "logo": "https://example.com/twitter-logo.png",
    "link": "https://twitter.com/pizzastore"
  }'
```

---

## [PUT] /socialmedia/edit/:id

Update a social media entry (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Social Media ID (24-char hex, required)
};
```

### Request Body

```typescript
type SocialMediaUpdateData = {
  name?: string;
  logo?: string;
  link?: string;
};
```

### Response

```typescript
type Response = ServerApiResponse<SocialMediaResponse>;
```

---

## [DELETE] /socialmedia/delete/:id

Delete a social media entry (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Social Media ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# Policies API

Manage policy pages (Privacy Policy, Terms, etc.).

## [GET] /policies/list

Get all policies without content (Public).

### Response

```typescript
type Response = ServerApiResponse<PolicyListResponse[]>;

type PolicyListResponse = {
  _id: string;
  name: string;         // e.g., "Privacy Policy"
  slug: string;         // e.g., "privacy-policy"
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/policies/list"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d0",
      "name": "Privacy Policy",
      "slug": "privacy-policy",
      "showOnFooter": true,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    },
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d1",
      "name": "Terms of Service",
      "slug": "terms-of-service",
      "showOnFooter": true,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

---

## [GET] /policies/details/:slug

Get full policy details by slug (Public).

### Path Parameters

```typescript
type PathParams = {
  slug: string; // Policy slug (e.g., "privacy-policy")
};
```

### Response

```typescript
type Response = ServerApiResponse<PolicyResponse | null>;

type PolicyResponse = {
  _id: string;
  name: string;
  content: string;      // Rich text/HTML content
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/policies/details/privacy-policy"
```

---

## [GET] /policies/details/id/:id

Get full policy details by ID (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Policy ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<PolicyResponse>;
```

### Example Request

```bash
curl -X GET "/api/v1/policies/details/id/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>"
```

---

## [POST] /policies/create

Create a new policy (Admin only).

### Request Body

```typescript
type PolicyCreateData = {
  name: string;          // Required, min 2, max 100 chars
  content: string;       // Required, min 10 chars (HTML allowed)
  slug: string;          // Required, lowercase, alphanumeric with hyphens only
  showOnFooter?: boolean; // Optional, default: false
};
```

### Response

```typescript
type Response = ServerApiResponse<PolicyResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/policies/create" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Privacy Policy",
    "content": "<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>",
    "slug": "privacy-policy",
    "showOnFooter": true
  }'
```

---

## [PUT] /policies/edit/:id

Update a policy (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Policy ID (24-char hex, required)
};
```

### Request Body

```typescript
type PolicyUpdateData = {
  name?: string;
  content?: string;
  slug?: string;
  showOnFooter?: boolean;
};
```

### Response

```typescript
type Response = ServerApiResponse<PolicyResponse>;
```

---

## [DELETE] /policies/delete/:id

Delete a policy (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Policy ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# General Ratings API

Manage customer testimonials/ratings. Public create is allowed but creates unpublished entries.

## [GET] /general-ratings/list

Get published ratings with pagination (Public).

### Query Parameters

```typescript
type GeneralRatingQueryParams = {
  page?: number;         // Default: 1, Min: 1
  limit?: number;        // Default: 10, Min: 1, Max: 100
  sortBy?: string;       // Field to sort by
  isAscending?: boolean; // Sort direction
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<GeneralRatingResponse>>;

type GeneralRatingResponse = {
  _id: string;
  personName: string;
  personImage?: string;    // URL
  ratings: number;         // 1 to 5
  personTagRole?: string;  // e.g., "Customer", "Chef"
  isPublished: boolean;
  personPhone?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/general-ratings/list?page=1&limit=10"
```

---

## [GET] /general-ratings/admin/list

Get all ratings with filtering (Admin only).

### Query Parameters

```typescript
type GeneralRatingQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  isAscending?: boolean;
  isPublished?: boolean;  // Filter by published status
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<GeneralRatingResponse>>;
```

### Example Request

```bash
curl -X GET "/api/v1/general-ratings/admin/list?isPublished=false" \
  -H "Authorization: Bearer <staff_token>"
```

---

## [POST] /general-ratings/create

Submit a new rating (Public, rate-limited: 5/hour).

**Note:** Ratings are created with `isPublished: false` by default. Admin must approve.

### Request Body

```typescript
type GeneralRatingCreateData = {
  personName: string;      // Required, min 2, max 100 chars
  personImage?: string;    // Optional, valid URL
  ratings: number;         // Required, 1 to 5
  personTagRole?: string;  // Optional, min 2, max 50 chars
  personPhone?: string;    // Optional, valid phone format
};
```

### Response

```typescript
type Response = ServerApiResponse<GeneralRatingResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/general-ratings/create" \
  -H "Content-Type: application/json" \
  -d '{
    "personName": "John Doe",
    "ratings": 5,
    "personTagRole": "Customer"
  }'
```

---

## [PUT] /general-ratings/edit/:id

Update a rating (Admin only). Use this to publish/unpublish ratings.

### Path Parameters

```typescript
type PathParams = {
  id: string; // Rating ID (24-char hex, required)
};
```

### Request Body

```typescript
type GeneralRatingUpdateData = {
  personName?: string;
  personImage?: string;
  ratings?: number;
  personTagRole?: string;
  isPublished?: boolean;   // Set to true to publish
  personPhone?: string;
};
```

### Response

```typescript
type Response = ServerApiResponse<GeneralRatingResponse>;
```

### Example Request (Approve/Publish a rating)

```bash
curl -X PUT "/api/v1/general-ratings/edit/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{"isPublished": true}'
```

---

## [DELETE] /general-ratings/delete/:id

Delete a rating (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Rating ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# Logo API

Manage logos for different positions and themes. Each (type, theme) combination must be unique.

## [GET] /logos/list

Get all logos (Public).

### Response

```typescript
type Response = ServerApiResponse<LogoResponse[]>;

type LogoType = "header" | "favicon" | "footer";
type LogoTheme = "dark" | "light";

type LogoResponse = {
  _id: string;
  logoImage: string;     // URL
  type: LogoType;
  theme: LogoTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X GET "/api/v1/logos/list"
```

### Example Response

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d0",
      "logoImage": "https://example.com/logo-header-dark.png",
      "type": "header",
      "theme": "dark",
      "isPublished": true,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    },
    {
      "_id": "6749a1b2c3d4e5f6a7b8c9d1",
      "logoImage": "https://example.com/logo-header-light.png",
      "type": "header",
      "theme": "light",
      "isPublished": true,
      "createdAt": "2024-12-01T10:30:00.000Z",
      "updatedAt": "2024-12-01T10:30:00.000Z"
    }
  ]
}
```

---

## [GET] /logos/details

Get a specific logo by type and theme (Public).

### Query Parameters

```typescript
type LogoDetailsQuery = {
  type: "header" | "favicon" | "footer";  // Required
  theme: "dark" | "light";                 // Required
};
```

### Response

```typescript
type Response = ServerApiResponse<LogoResponse | null>;
```

### Example Request

```bash
curl -X GET "/api/v1/logos/details?type=header&theme=dark"
```

---

## [POST] /logos/create

Create a new logo (Admin only).

**Note:** Each (type, theme) combination must be unique.

### Request Body

```typescript
type LogoCreateData = {
  logoImage: string;                       // Required, valid URL
  type: "header" | "favicon" | "footer";   // Required
  theme: "dark" | "light";                 // Required
  isPublished?: boolean;                   // Optional, default: false
};
```

### Response

```typescript
type Response = ServerApiResponse<LogoResponse>;
```

### Example Request

```bash
curl -X POST "/api/v1/logos/create" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "logoImage": "https://example.com/logo-favicon-dark.png",
    "type": "favicon",
    "theme": "dark",
    "isPublished": true
  }'
```

---

## [PUT] /logos/edit/:id

Update a logo (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Logo ID (24-char hex, required)
};
```

### Request Body

```typescript
type LogoUpdateData = {
  logoImage?: string;
  type?: "header" | "favicon" | "footer";
  theme?: "dark" | "light";
  isPublished?: boolean;
};
```

### Response

```typescript
type Response = ServerApiResponse<LogoResponse>;
```

---

## [DELETE] /logos/delete/:id

Delete a logo (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Logo ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# Contact Queries API

Manage customer contact form submissions.

## [POST] /contact-queries/create

Submit a contact query (Public, rate-limited: 10/hour).

### Request Body

```typescript
type ContactQuerySubject =
  | "general inquiry"
  | "order issue"
  | "feedback"
  | "other"
  | "reservation"
  | "general complaint";

type ContactQueryCreateData = {
  name: string;              // Required, min 2, max 100 chars
  email: string;             // Required, valid email
  phone?: string;            // Optional, valid phone format
  subject: ContactQuerySubject; // Required
  message: string;           // Required, min 10, max 2000 chars
};
```

### Response

```typescript
type Response = ServerApiResponse<ContactQueryResponse>;

type ContactQueryStatus = "open" | "closed";

type ContactQueryResponse = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: ContactQuerySubject;
  message: string;
  status: ContactQueryStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X POST "/api/v1/contact-queries/create" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1-555-987-6543",
    "subject": "general inquiry",
    "message": "I would like to know more about your catering services for events."
  }'
```

---

## [GET] /contact-queries/list

List all contact queries with filtering (Admin only).

### Query Parameters

```typescript
type ContactQueryQueryParams = {
  page?: number;         // Default: 1, Min: 1
  limit?: number;        // Default: 10, Min: 1, Max: 100
  sortBy?: string;       // Field to sort by
  isAscending?: boolean; // Sort direction
  status?: "open" | "closed"; // Filter by status
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<ContactQueryResponse>>;
```

### Example Request

```bash
curl -X GET "/api/v1/contact-queries/list?status=open" \
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
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-987-6543",
        "subject": "general inquiry",
        "message": "I would like to know more about your catering services for events.",
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

## [PUT] /contact-queries/edit/:id

Update a contact query (Admin only). Use this to close queries and add closing message.

### Path Parameters

```typescript
type PathParams = {
  id: string; // Contact Query ID (24-char hex, required)
};
```

### Request Body

```typescript
type ContactQueryUpdateData = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: ContactQuerySubject;
  message?: string;
  status?: "open" | "closed";
  closingMessage?: string;      // Max 1000 chars
};
```

### Response

```typescript
type Response = ServerApiResponse<ContactQueryResponse>;
```

### Example Request (Close query with response)

```bash
curl -X PUT "/api/v1/contact-queries/edit/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "closed",
    "closingMessage": "Thank you for your inquiry. Our catering team will contact you shortly."
  }'
```

---

## [DELETE] /contact-queries/delete/:id

Delete a contact query (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Contact Query ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
```

---

# Reservation Queries API

Manage table reservation requests.

## [POST] /reservation-form/create

Submit a reservation request (Public, rate-limited: 10/hour).

### Request Body

```typescript
type ReservationQueryCreateData = {
  storeId: string;    // Required, 24-char hex
  date: string;       // Required, ISO date format
  time: string;       // Required, HH:MM format (e.g., "19:00")
  noOfGuest: number;  // Required, min 1, max 100
  name: string;       // Required, min 2, max 100 chars
  phone: string;      // Required, valid phone format
  message?: string;   // Optional, max 1000 chars
};
```

### Response

```typescript
type Response = ServerApiResponse<ReservationQueryResponse>;

type ReservationStatus = "open" | "cancelled" | "reserved";

type ReservationQueryResponse = {
  _id: string;
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
  status: ReservationStatus;
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Example Request

```bash
curl -X POST "/api/v1/reservation-form/create" \
  -H "Content-Type: application/json" \
  -d '{
    "storeId": "6749a1b2c3d4e5f6a7b8c9d0",
    "date": "2024-12-15",
    "time": "19:00",
    "noOfGuest": 4,
    "name": "John Smith",
    "phone": "+1-555-123-4567",
    "message": "We are celebrating a birthday, please arrange a cake if possible."
  }'
```

---

## [GET] /reservation-form/list

List all reservations with filtering (Admin only).

### Query Parameters

```typescript
type ReservationQueryQueryParams = {
  page?: number;                              // Default: 1, Min: 1
  limit?: number;                             // Default: 10, Min: 1, Max: 100
  sortBy?: string;                            // Field to sort by
  isAscending?: boolean;                      // Sort direction
  status?: "open" | "cancelled" | "reserved"; // Filter by status
};
```

### Response

```typescript
type Response = ServerApiResponse<PaginatedResponse<ReservationQueryResponse>>;
```

### Example Request

```bash
curl -X GET "/api/v1/reservation-form/list?status=open" \
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
        "storeId": "6749a1b2c3d4e5f6a7b8c9d1",
        "date": "2024-12-15T00:00:00.000Z",
        "time": "19:00",
        "noOfGuest": 4,
        "name": "John Smith",
        "phone": "+1-555-123-4567",
        "message": "We are celebrating a birthday, please arrange a cake if possible.",
        "status": "open",
        "closingMessage": null,
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:30:00.000Z"
      }
    ],
    "meta": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

---

## [PUT] /reservation-form/edit/:id

Update a reservation (Admin only). Use this to confirm or cancel reservations.

### Path Parameters

```typescript
type PathParams = {
  id: string; // Reservation ID (24-char hex, required)
};
```

### Request Body

```typescript
type ReservationQueryUpdateData = {
  storeId?: string;
  date?: string;
  time?: string;
  noOfGuest?: number;
  name?: string;
  phone?: string;
  message?: string;
  status?: "open" | "cancelled" | "reserved";
  closingMessage?: string;    // Max 1000 chars
};
```

### Response

```typescript
type Response = ServerApiResponse<ReservationQueryResponse>;
```

### Example Request (Confirm reservation)

```bash
curl -X PUT "/api/v1/reservation-form/edit/6749a1b2c3d4e5f6a7b8c9d0" \
  -H "Authorization: Bearer <staff_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "reserved",
    "closingMessage": "Your table for 4 is confirmed for Dec 15 at 7:00 PM. We will have a birthday cake ready!"
  }'
```

---

## [DELETE] /reservation-form/delete/:id

Delete a reservation (Admin only).

### Path Parameters

```typescript
type PathParams = {
  id: string; // Reservation ID (24-char hex, required)
};
```

### Response

```typescript
type Response = ServerApiResponse<boolean>;
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

---

# Rate Limits

| Endpoint                         | Requests | Duration | Block Duration |
| -------------------------------- | -------- | -------- | -------------- |
| POST /general-ratings/create     | 5        | 1 hour   | 1 hour         |
| POST /contact-queries/create     | 10       | 1 hour   | 30 min         |
| POST /reservation-form/create    | 10       | 1 hour   | 30 min         |
| Admin create endpoints           | 30       | 1 hour   | 5 min          |
| Admin update endpoints           | 60       | 15 min   | 5 min          |
| Admin delete endpoints           | 20       | 1 hour   | 15 min         |
| Public list endpoints            | 100      | 5 min    | 1 min          |

---

# Authentication

All admin endpoints require a valid Staff JWT token with `admin` or `manager` role.

### Header Format

```
Authorization: Bearer <staff_jwt_token>
```

### Example

```bash
curl -X GET "/api/v1/contact-queries/list" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
