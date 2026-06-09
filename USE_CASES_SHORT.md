# The Golden Fork — Use Cases

## Overview
Digital menu app: customers browse, order, and track meals. React frontend + Node.js/Express backend.

## Actors
- **Customer** – browses menu and places orders
- **Kitchen Staff** – receives and manages orders
- **Manager** – manages menu and views reports

## Use Cases

| # | Use Case | Actor | Status |
|---|----------|-------|--------|
| 1 | **Browse Menu** – Dishes by category with name, price, image, tags, and "Popular" badge. | Customer | — |
| 2 | **Navigate by Category** – Nav bar scrolls to section with visual highlight. | Customer | — |
| 3 | **Add Item to Order** – "+" adds to cart; repeats increment quantity. | Customer | ✅ |
| 4 | **Manage Cart** – Adjust quantities; zero removes item; real-time subtotals and total. | Customer | — |
| 5 | **Place Order** – Enter name, table, requests; backend stores; success shows order number. | Customer | — |
| 6 | **Responsive Mobile** – Floating button opens sliding cart drawer; single-column menu. | Customer | ✅ |
| 7 | **Search & Filter** – Real-time keyword search + dietary filters. | Customer | — |
| 8 | **View Item Details** – Modal with full image, allergens, prep time, add-to-cart. | Customer | — |
| 9 | **Track Order Status** – Real-time: Received → Preparing → Ready → Delivered. | Customer | ❌ |
| 10 | **Order History** – Past session orders with totals; one-click reorder. | Customer | — |
| 11 | **Manage Menu** – Admin CRUD for items/categories; toggle availability. | Manager | ❌ |
| 12 | **Kitchen Dashboard** – Real-time orders; update status; view special requests. | Kitchen Staff | — |
| 13 | **Promotions** – Manager creates offers; discounts auto-applied in cart. | Manager | — |
| 14 | **Rate & Review** – Rate items post-delivery; ratings shown on cards. | Customer | — |
| 15 | **Sales Dashboard** – Revenue, popular items, avg order value in charts. | Manager | — |
