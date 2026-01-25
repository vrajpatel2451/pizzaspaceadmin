import type { DashboardResponse } from "@/types/analytics.types";
import {
  AlertCircle,
  CalendarCheck,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Package,
  PoundSterling,
  ShoppingBag,
  Star,
  Store,
  Truck,
  Users,
  UserCheck,
  Utensils,
  XCircle,
} from "lucide-react";
import type { FC } from "react";
import StatCard from "./StatCard";

interface StatsCardsGridProps {
  data: DashboardResponse | null;
  isLoading?: boolean;
}

const StatsCardsGrid: FC<StatsCardsGridProps> = ({ data, isLoading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatRating = (value: number) => {
    return value.toFixed(1);
  };

  const orderStatusCards = [
    {
      key: "initiatedOrders",
      label: "Initiated",
      icon: <Clock />,
      value: data?.initiatedOrders ?? 0,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      key: "confirmedNewOrders",
      label: "Confirmed",
      icon: <CheckCircle />,
      value: data?.confirmedNewOrders ?? 0,
      iconBgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-500 dark:text-green-400",
    },
    {
      key: "paymentErrorOrders",
      label: "Payment Error",
      icon: <AlertCircle />,
      value: data?.paymentErrorOrders ?? 0,
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      key: "cancelledOrders",
      label: "Cancelled",
      icon: <XCircle />,
      value: data?.cancelledOrders ?? 0,
      iconBgColor: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-500 dark:text-red-400",
    },
    {
      key: "ordersInPreparing",
      label: "Preparing",
      icon: <Utensils />,
      value: data?.ordersInPreparing ?? 0,
      iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-500 dark:text-orange-400",
    },
    {
      key: "readyToPickupOrders",
      label: "Ready for Pickup",
      icon: <Package />,
      value: data?.readyToPickupOrders ?? 0,
      iconBgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
    {
      key: "onTheWayOrders",
      label: "On the Way",
      icon: <Truck />,
      value: data?.onTheWayOrders ?? 0,
      iconBgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-500 dark:text-cyan-400",
    },
    {
      key: "deliveredOrders",
      label: "Delivered",
      icon: <CheckCircle />,
      value: data?.deliveredOrders ?? 0,
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-500 dark:text-emerald-400",
    },
  ];

  const summaryCards = [
    {
      key: "totalRevenue",
      label: "Total Revenue",
      icon: <PoundSterling />,
      value: formatCurrency(data?.totalRevenue ?? 0),
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-500 dark:text-emerald-400",
    },
    {
      key: "totalStores",
      label: "Total Stores",
      icon: <Store />,
      value: data?.totalStores ?? 0,
      iconBgColor: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-500 dark:text-violet-400",
    },
    {
      key: "totalStaff",
      label: "Total Staff",
      icon: <UserCheck />,
      value: data?.totalStaff ?? 0,
      iconBgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-500 dark:text-indigo-400",
    },
    {
      key: "totalCustomers",
      label: "Total Customers",
      icon: <Users />,
      value: data?.totalCustomers ?? 0,
      iconBgColor: "bg-pink-100 dark:bg-pink-900/30",
      iconColor: "text-pink-500 dark:text-pink-400",
    },
  ];

  const reviewsAndRatingsCards = [
    {
      key: "totalOrderReviews",
      label: "Order Reviews",
      icon: <MessageSquare />,
      value: data?.totalOrderReviews ?? 0,
      iconBgColor: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      key: "averageOrderReviews",
      label: "Avg Order Rating",
      icon: <Star />,
      value: formatRating(data?.averageOrderReviews ?? 0),
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-500 dark:text-yellow-400",
    },
    {
      key: "totalOrderItemReviews",
      label: "Item Reviews",
      icon: <ShoppingBag />,
      value: data?.totalOrderItemReviews ?? 0,
      iconBgColor: "bg-teal-100 dark:bg-teal-900/30",
      iconColor: "text-teal-500 dark:text-teal-400",
    },
    {
      key: "averageOrderItemReviews",
      label: "Avg Item Rating",
      icon: <Star />,
      value: formatRating(data?.averageOrderItemReviews ?? 0),
      iconBgColor: "bg-lime-100 dark:bg-lime-900/30",
      iconColor: "text-lime-600 dark:text-lime-400",
    },
    {
      key: "totalGeneralRatings",
      label: "General Ratings",
      icon: <Star />,
      value: data?.totalGeneralRatings ?? 0,
      iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-500 dark:text-orange-400",
    },
    {
      key: "averageGeneralRatings",
      label: "Avg General Rating",
      icon: <Star />,
      value: formatRating(data?.averageGeneralRatings ?? 0),
      iconBgColor: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-500 dark:text-rose-400",
    },
  ];

  const engagementCards = [
    {
      key: "totalOrderQueries",
      label: "Order Queries",
      icon: <MessageSquare />,
      value: data?.totalOrderQueries ?? 0,
      iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      key: "reservationRequests",
      label: "Reservations",
      icon: <CalendarCheck />,
      value: data?.reservationRequests ?? 0,
      iconBgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-500 dark:text-purple-400",
    },
    {
      key: "totalContactFormQueries",
      label: "Contact Queries",
      icon: <Mail />,
      value: data?.totalContactFormQueries ?? 0,
      iconBgColor: "bg-slate-100 dark:bg-slate-900/30",
      iconColor: "text-slate-500 dark:text-slate-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Order Status Section */}
      <div>
        <h3 className="text-nl-700 dark:text-nd-200 mb-3 text-sm font-medium uppercase tracking-wide">
          Order Status
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {orderStatusCards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.value}
              isLoading={isLoading}
              variant="compact"
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <div>
        <h3 className="text-nl-700 dark:text-nd-200 mb-3 text-sm font-medium uppercase tracking-wide">
          Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.value}
              isLoading={isLoading}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div>
        <h3 className="text-nl-700 dark:text-nd-200 mb-3 text-sm font-medium uppercase tracking-wide">
          Reviews & Ratings
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {reviewsAndRatingsCards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.value}
              isLoading={isLoading}
              variant="compact"
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>

      {/* Engagement Section */}
      <div>
        <h3 className="text-nl-700 dark:text-nd-200 mb-3 text-sm font-medium uppercase tracking-wide">
          Customer Engagement
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {engagementCards.map((card) => (
            <StatCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              value={card.value}
              isLoading={isLoading}
              iconBgColor={card.iconBgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCardsGrid;
