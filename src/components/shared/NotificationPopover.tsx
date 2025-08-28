import { Button } from "../base/Button";
import MenuItem from "../compound/MenuItem";

const NotificationPopover = () => {
  return (
    <div className="menu-items">
      <MenuItem>New use registered</MenuItem>
      <MenuItem>Order #6762 - Completed</MenuItem>
      <MenuItem>New Info update Ticket Submitted</MenuItem>
      <MenuItem>Order #2321 - Out for delivery</MenuItem>
      <Button color="neutral" className="hover:dark:bg-nd-500 mt-1">
        View All
      </Button>
    </div>
  );
};

export default NotificationPopover;
