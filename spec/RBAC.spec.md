Admin Module:

Login:
email/phone/empID & password

Sidebar/Navbar
Dashboard (Owner, Store Manger)
Reports (Owner, Store Manger)
Inventory (Owner, Store Manger)
Categories (Owner Only)
Menu & Products (Owner, Store Manger)
Reviews (Owner, Store Manger)
Orders (All)
Recent Orders (All)
Order History (Owner, Store Manger)
Create Order (Owner, Store Manger)
Reviews (Owner, Store Manger)
Tickets (Owner, Store Manger)
Customers (Owner)
Customer List (Owner)
Create Customer (Owner)
Contact Us Request (Owner Only)
Profile Screen Requests (Owner)
Coupons (Owner, Store Manger)
Staff Management (Owner, Store Manger)
Stores (Owner Only)
Staff (Owner, Store Manger)
Delivery Boy Reviews (Owner, Store Manger)
Website Management (Owner Only)
Logos
Payment management
Extra charges
Delivery Charges
Settings (off/on)
Banners
Policy Pages
Contact US Info for (HQ)
Account (All)
Logout (All)

POS (Owner, Store Manger)
By default stick to side bar with banner create order
When click expand left side as full screen
Left side as item from menu selection
Right side - items lise, summary, customer details, coupon to apply and checkout type.
When complete order show change option on left side when cash submission
Once done print receipt button and after that stick to default
IF OWNER - then select store first (if many) before selecting menu

Dashboard (Owner, Store Manger)
List of widgets of dashboard with responsive GRID
Owner List
Today’s Ongoing Orders (Single Stat - Table store wise on expand)
Completed Orders (Single Stat with order up and down default day, Can select week, month, year (compare duration should be according to that) - Table store wise on expand)
Revenue (Single stat same as above - Table store wise on expand)
Stores (Single stat)
Staff (Single stat - Table store wise on expand)
Customers (Single Stat with order up and down default day, Can select week, month, year (compare duration should be according to that))
Recent Orders list with time range selection, status filter, store filter, default all stores and ongoing orders
Store Manger
Today’s Ongoing Orders (Single Stat)
Completed Orders (Single Stat with order up and down default day, Can select week, month, year (compare duration should be according to that))
Revenue (Single stat same as above)
Staff (Single stat)
Recent Orders list with time range selection, status filter, store filter, default all stores and ongoing orders

Reports
List of tables with responsive Grid
Owner List
Stores Insights (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name & city, orders, compare orders, revenue, compare revenue
Delivery boy Insights (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), Store filter default to all, also ascending/descendings)
Name & Store, Ratings average, compare ratings, Orders completed, compare count
Customer Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name & phone, orders, compare orders, purchase, compare purchase
Category Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), store filter, also ascending/descendings)
Name, order count, compare order count
Product Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), store filter, also ascending/descendings)
Name, order count, compare order count
Store Manager List
Delivery boy Insights (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name, Ratings average, compare ratings, Orders completed, compare count
Customer Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name & phone, orders, compare orders, purchase, compare purchase
Category Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name, order count, compare order count
Product Insight (Default 10 then 1 to all option, default day, Can select week, month, year (compare duration should be according to that), also ascending/descendings)
Name, order count, compare order count

Categories (Owner Only)
List of categories grid with 25 pagination
Add, edit, delete
Name, photo

Menu & Products (Owner, Store Manger)
Store Manager
Menu view only with disabling category, subcategory, items
Add on
Disable addon group or specific addon with message
Request for new add on same after creation copy as below
Product Details
Disable variant group, addon group, or specific variant with message
Owner Only
Menu Creation - category, subcategory and product selection, up,down sorting, also select stores to disable category, subcategory or product
Add on creation
Group Creation - name, description and select add ons
Add on creation - treat name, price (if 0 then show checkbox for show as free) default checked,
Product mapping with group - select product against groups for addons

Product Creation
Basic info - Name, Description, food type (veg, nonveg, egg, vegan), Photo list, category
Serving info - no of people, dish size, (count, unit (grm, litter, millis, count, etc))
Pricing - Base price, packaging charge (make sure charges matches badge)
Variants
Grouping - title, description (multiple)
Variant - label, price
Note for variant creation
Map Addons (vice versa from addons grouping)
Additional info - tags, spice level (0,1,2 chillis icons), frosting
Nutritional info - Weight (per gms), protein, carbs, fats, fiber, Calorie count (Automated - also show calculator info of calories count)
Allergic Info - select chips which elements are available
Ingrediants list - name, grams(optional)

Reviews
Owner Only
Review table with pagination of 25
Time range selection default today
Store selection default all
Table Columns : Customer name & phone, product ID, review and details, action (hide from website, call customer, send email)
Manager
Review table with pagination of 25
Time range selection default today
Table Columns : Customer name & phone, product ID, review and details, action (hide from website, call customer, send email)

Recent Orders (All)
Order Card with grid of (min 1 max 3) columns and 25 list of pagination
Status filter - All, received, preparing, on the way (Default Preparing) (Owner and store manager)
Store Filter (By Owner only)
Received orders should be shown as popup via websocket (Owner and store manager)
IF kitchen display then only which are in preparing stage, if delivery boy which are assigned and ongoing, rest all
Received Order Popup - Customer Details, address, all items with details, time, accept & reject button, item total, orderID (Owner & Store manager)
Once accept - should add preparation time and delivery time (approx) (Owner & Store manager)
Order Card - customer details (ALL), orderID (ALL), Address and location (ALL), total items (ALL), time (ALL), preparation (not Delivery boy) and delivery count down (not kitchen), order price (not kitchen), actions (Not kitchen) - view (Owner & Store manager), change status (move to ready to dispatched, move to dispatched, mark as delivered, cancelled), assign delivery boy (Owner & Store manager), print counter receipt (Owner & Store manager), print customer receipt(Owner & Store manager), call customer (not kitchen), Type POS/Website, Query Count if any (Owner & Store manager)
View details sidebar: item list name, price, quantity, addons and variants, summary of pricing - subtotal, discount, packing charges, delivery charges, tax, total. Discount applied, customer details with call, assign delivery boy, if assign then details and call. Print customer and kitchen receipt. Change status (move to ready to dispatched, move to dispatched, mark as delivered, cancelled) (Owner & Store manager), Queries if any (Owner & Store manager)

Order History (Owner & Store manager)
Order Table 25 list of pagination
Status Filter (Completed, Cancelled)
Store Filter Default to all (By Owner Only)
Time Filter (Default this week)
Columns - OrderID, customer details, address (With Store - Owner only), payment mode, delivery boy details, ratings info (overall ratings on hover with detailed ratings), Total items, Price, Action - view, call customer, call store manager (Owner only), call delivery boy, send email to customer, print invoice, order type (Web, POS), date and time
View Details Sidebar - OrderId, Type POS/Website, Date and Time, customer details with call action, address with location pin, store info with call and location pin (Owner Only), Driver info with call action, Ratings in details, Support queries if any, items list with summary, with refund items. Send email, print invoice

Order Tickets (Owner & Store manager)
Table with 25 list of pagination
Status Filter (Completed, Cancelled)
Store Filter Default to all (By Owner Only)
Time Filter (Default today)
Columns - Customer details, message, photo list (see on hover), orderID (go to order or view details sidebar), date & time, before completion or after completion, action call customer, send email, call store (Owner only), call driver if not completed, store (by Owner only)

Order Reviews (Owner & Store manager)
Table with 25 list of pagination
Status Filter (Completed, Cancelled)
Store Filter Default to all (By Owner Only)
Time Filter (Default today)
Columns - Customer details, overall rating, item wise rating, delivery boy rating, orderID (go to order or view details sidebar), date & time, action call customer, send email, call store (Owner only), call driver if not completed, store (by Owner only), hide from website

Create Order (Owner & Store manage)
Open POS and flow same as POS, additional step for address field and after completion send payment link and mark as accepted button

Customer List (Owner only)
Table of customer 25 list of pagination
Time range filter Default this week
Columns - name, phone, email, DOB, address count, orders count on hover COD and online orders, amount spent, action - details, edit, send email, call customer, block, delete
Details - name, phone, email, DOB, address list, orders list same as order history and ongoing orders card grid view, tickets list, review list, profile queries list, contact us queries list, stats - total orders, pure completed orders, cancelled orders, order with cancelled items, tickets count, review count, profile queries count, contact us queries count, all actions from table except view details and go to list action
Edit - edit name, phone, email, DOB, and address list with CRUD, save and view details and go to list action.

Create Customer (Owner only)
Same as edit customer but with blank fields

Contact US Requests (Owner)
Table with 25 list of pagination
Status Filter (Pending, Resolved)
Time Filter (Default this week)
Type filters (Default all) franchise, order, other
Columns - Customer details, message, photo list (see on hover), type, status, date & time, action call customer, send email, mark as resolved, comment

Profile Requests (Owner)
Table with 25 list of pagination
Status Filter (Pending, Resolved)
Time Filter (Default this week)
Type filters (Default all) franchise, order, other
Columns - Customer details, message, photo list (see on hover), type, status, date & time, action call customer, send email, mark as resolved, comment

Coupons (Owner & Store manage)
Coupon card grid with 25 pagination
Filter active/inactive
Filter type (product, overall, packaging, delivery)
Filter Store Default to all(Owner only)
Coupon card: name, code, description, type, discount amount and type (percentage or fixed), start-end, actions - active or inactive toggle, edit.
Create/Edit/Clone coupon
Select type popup - product, overall, delivery, packaging (ADD only)
Basic Info - Name, description, code
Pricing - amount, type (percentage|fixed)
Product selection - all | categories | products
Customer selection - all | select
Usage - unlimited | limited with any user (count field) | limited with user (count per customer)
Duration - start - end (can be never for infiniter)
Assign Store - ALL | Select stores (Owner only)
Active | Inactive
Stores (Owner Only)
Card grid with 25 pagination
Filter with search only
Card - name, photo, phone, email, short address line location icon, edit button, active inactive toggle, details
Add | Edit | Clone
Basic info - name, photo, phone, email
Address - same as customer selection
Active | inactive toggle
Save and go back to list
Details
Info with card
Stats - total completed orders, total cancelled orders, total orders with cancelled items, total successful orders, total staff, total items, average order reviews, average delivery boy reviews, average item reviews, total tickets.
Tabs - orders same as order history and current orders, reviews, tickets, staff

Staff (Owner, Store Manger)
Table with 25 pagination
Filter with stores (Owner only)
Filters with roles
Columns: Name, phone, email, role, action - change role, edit, active/inactive, Ratings and total deliveries if delivery boy
Create|Clone|Edit Staff
Name, email, phone, id card, staff unique id, password, role, save

Delivery Boy Reviews (Owner, Store Manger)
Owner Only
Review table with pagination of 25
Time range selection default today
Store selection default all
Table Columns : Customer name & phone, product ID, review and details, action (hide from website, call customer, send email, call store, call delivery boy)
Manager
Review table with pagination of 25
Time range selection default today
Table Columns : Customer name & phone, product ID, review and details, action (hide from website, call customer, send email, call delivery boy)

Logos (WM) Owner Only
Add and update at same time
Header logo
Small logo
Detailed logo
Footer logo
Black logo
White logo

Payment Management (WM) (Owner only)
COD and online management card with toggle on/off
If online - open dialog to add stripe keys

Extra Charges (WM) (Owner only)
Cards of Extra charges - label, amount, type (percentage or fixed), apply to other (yes, no)
ADD | CLONE | EDIT
Label
Amount, type (percentage or fixed)
Apply to other toggle
If yes the select multiple subtotal, delivery charges, packaging charges (eg Tax)
After Discount or before discount
Active | Inactive

Delivery Charges (WM) (Owner only)
Single screen to add update
Fixed | Floating tab buttons
If fixed - amount, type (percentage or fixed)
If floating add warning with google map costing
If floating add google service account key
If floating add amount / miles

OFF/On (WM) (Owner only)
Single screen to add update
Toggle going live and going offline
Add warning for live and offline
Comming soon page config
Image, title, description
Contact info - name, email, phone, address, social links

Banners (WM) (Owner only)
Banner card grid 25 pagination
Search filter
Card: name, image list, location in website,active in active, clone, delete
ADD | Edit | Clone
Name
Image list
Image
Action - go to page ( select page), go to store menu (select store)
Location in website - home1, home2, about1, about2, etc….

Policy Pages (WM) (Owner only)
table 25 pagination
Search filter
Column: title, created date, updated date, active|inactive, action - edit, delete
ADD | Edit | Clone
Title
Content
Image (If any)
Meta - title, keywords, description, image (if any)

Contact Us info (WM) (Owner only)
Name
Phone
Email
Address same as others
Location
Social links with icons

Account (ALL)
Name, phone, email, DOB (edit and save)
Change password
