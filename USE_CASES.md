# The Golden Fork — Use Cases

## System Overview

A restaurant digital menu application where customers can browse the menu, build their order, and submit it to the kitchen. The system has a React frontend (customer-facing) and a Node.js/Express backend (API).

---

## Actors

- **Customer**: Person dining at the restaurant who browses the menu and places orders.
- **Kitchen Staff**: Receives and manages incoming orders.
- **Restaurant Manager**: Manages the menu, categories, pricing, and views reports.

 Browse Menu

**Actor:** Customer
**Description:** The customer opens the app and views all available dishes organized by category (Starters, Main Courses, Desserts, Drinks). Each item displays its name, description, price, image, dietary tags (vegetarian, gluten-free, seafood), and a "Popular" badge when applicable.

 Navigate by Category

**Actor:** Customer
**Description:** The customer selects a category from the top navigation bar. The page smoothly scrolls to the corresponding section, and the selected category is visually highlighted.

Add Item to Order

**Actor:** Customer
**Description:** The customer clicks the "+" button on a menu item. The item is added to the cart sidebar. If the item already exists in the cart, its quantity is incremented by one.
**Current state:** Implemented.

 Manage Cart

**Actor:** Customer
**Description:** The customer views their current order in the cart sidebar. They can increase or decrease the quantity of each item. When quantity reaches zero, the item is removed. The cart displays per-item subtotals and the order total in real time.

 Place Order

**Actor:** Customer
**Description:** The customer clicks "Place Order", fills in their name (required), table number (optional), and special requests (optional), then confirms. The order is sent to the backend, which validates and stores it. A success screen shows the order number and total.

Responsive Mobile Experience

**Actor:** Customer
**Description:** On mobile devices, the cart is hidden behind a floating button. Tapping it opens a sliding drawer with the full cart. The menu grid adapts to a single-column layout.
**Current state:** Implemented.

Search and Filter Menu

**Actor:** Customer
**Description:** The customer types a keyword in a search bar to filter menu items by name or description. Additionally, they can toggle dietary filters (vegetarian, gluten-free, seafood) to narrow down options. Results update in real time.

 View Item Details

**Actor:** Customer
**Description:** The customer taps on a menu item card to open a detail modal with a larger image, full description, nutritional highlights, allergen info, and preparation time. From this modal, they can add the item to their order.

 Track Order Status

**Actor:** Customer
**Description:** After placing an order, the customer can view its real-time status (Received, Preparing, Ready, Delivered). The status updates are displayed on a dedicated order tracking screen accessible via order number.
**Current state:** Not implemented.

View Order History

**Actor:** Customer
**Description:** The customer can view a list of their past orders in the current session, including items ordered, totals, and timestamps. They can reorder a previous order with one click.

 Manage Menu (Admin)

**Actor:** Restaurant Manager
**Description:** The manager accesses an admin panel to create, edit, and delete menu items and categories. They can update names, descriptions, prices, images, tags, and toggle item availability (e.g., mark as "sold out").
**Current state:** Not implemented.

Update Order Status (Kitchen)

**Actor:** Kitchen Staff
**Description:** Kitchen staff accesses a kitchen dashboard showing all incoming orders in real time. They can update each order's status (Received → Preparing → Ready → Delivered) and view order details including special requests.

 Apply Promotions

**Actor:** Customer, Restaurant Manager
**Description:** The manager creates promotional offers (e.g., 10% off starters, combo deals). The customer sees active promotions on the menu and in the cart, with discounts automatically applied to the order total.

 Rate and Review

**Actor:** Customer
**Description:** After an order is marked as delivered, the customer can rate individual items (1-5 stars) and leave a short text review. Average ratings are displayed on menu item cards.

View Sales Dashboard

**Actor:** Restaurant Manager
**Description:** The manager accesses a dashboard showing key metrics: total orders, revenue, most popular items, average order value, and orders by time period. Data is presented in charts and summary cards.
