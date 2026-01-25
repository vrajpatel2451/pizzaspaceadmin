// Dashboard field names that can be requested
export type DashboardField =
  // Order status counts
  | "initiatedOrders"
  | "confirmedNewOrders"
  | "paymentErrorOrders"
  | "cancelledOrders"
  | "ordersInPreparing"
  | "readyToPickupOrders"
  | "onTheWayOrders"
  | "deliveredOrders"
  // Store stats
  | "totalStores"
  | "totalStaff"
  // Customer/Revenue
  | "totalCustomers"
  | "totalRevenue"
  // Timeline charts
  | "orderCountTimelineWise"
  | "orderRevenueTimelineWise"
  // Order queries/tickets
  | "totalOrderQueries"
  // Order reviews
  | "totalOrderReviews"
  | "averageOrderReviews"
  // Order item reviews
  | "totalOrderItemReviews"
  | "averageOrderItemReviews"
  // Reservations
  | "reservationRequests"
  // General ratings
  | "totalGeneralRatings"
  | "averageGeneralRatings"
  // Contact form
  | "totalContactFormQueries";

// Request interface
export type DashboardRequestBody = {
  storeIds?: string[];
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  spans?: number; // Number of data points for timeline charts
  includingFields: DashboardField[];
};

// Timeline data structure for charts
export type TimelineData = {
  data: Record<string, Array<[string, number]>>; // Record<storeId, Array<[isoDate, value]>>
  meta: Record<string, string>; // Record<storeId, storeName>
};

// Response interface - all fields optional, only included if requested
export type DashboardResponse = {
  // Order status counts
  initiatedOrders?: number;
  confirmedNewOrders?: number;
  paymentErrorOrders?: number;
  cancelledOrders?: number;
  ordersInPreparing?: number;
  readyToPickupOrders?: number;
  onTheWayOrders?: number;
  deliveredOrders?: number;
  // Store stats
  totalStores?: number;
  totalStaff?: number;
  // Customer/Revenue
  totalCustomers?: number;
  totalRevenue?: number;
  // Timeline charts
  orderCountTimelineWise?: TimelineData;
  orderRevenueTimelineWise?: TimelineData;
  // Order queries/tickets
  totalOrderQueries?: number;
  // Order reviews
  totalOrderReviews?: number;
  averageOrderReviews?: number;
  // Order item reviews
  totalOrderItemReviews?: number;
  averageOrderItemReviews?: number;
  // Reservations
  reservationRequests?: number;
  // General ratings (not filtered by store)
  totalGeneralRatings?: number;
  averageGeneralRatings?: number;
  // Contact form (not filtered by store)
  totalContactFormQueries?: number;
};

// ==================== REPORTS API TYPES ====================

export type ReportType = "stores" | "delivery-boys" | "customers" | "products";

export type StoreSortBy = "orders" | "revenue";
export type DeliveryBoySortBy = "averageRatings" | "ordersCompleted";
export type CustomerSortBy = "orders" | "purchase";
export type ProductSortBy = "orderCount";

export interface ReportsRequest {
  type: ReportType;
  startTime: string;
  endTime: string;
  compareStartTime: string;
  compareEndTime: string;
  storeIds?: string[];
  limit?: number; // Default 10, 0 = all
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface StoreReportItem {
  storeId: string;
  name: string;
  city: string;
  orders: number;
  compareOrders: number;
  revenue: number;
  compareRevenue: number;
}

export interface DeliveryBoyReportItem {
  staffId: string;
  name: string;
  storeName: string;
  averageRatings: number;
  compareAverageRatings: number;
  ordersCompleted: number;
  compareOrdersCompleted: number;
}

export interface CustomerReportItem {
  customerId: string;
  name: string;
  phone: string;
  orders: number;
  compareOrders: number;
  purchase: number;
  comparePurchase: number;
}

export interface ProductReportItem {
  productId: string;
  name: string;
  orderCount: number;
  compareOrderCount: number;
}

export type ReportsResponse =
  | StoreReportItem[]
  | DeliveryBoyReportItem[]
  | CustomerReportItem[]
  | ProductReportItem[];
