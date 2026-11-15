# Event Tracking Specification & Telemetry Schemas

## Standard Event Envelope
Every event emitted across the ThreadIQ storefront must conform to the following schema:
```json
{
  "event_name": "product_viewed",
  "user_id": "USR-CUST-10491",
  "session_id": "sess_7f9b2a",
  "timestamp": "2026-11-15T05:30:00Z",
  "product_id": 42,
  "product_category": "Ethnic Wear",
  "search_query": null,
  "device_type": "mobile",
  "experiment_assignment": "EXP-FIT-GUIDE-001:variant_b",
  "properties_json": "{\"price\": 1899, \"size\": \"M\"}",
  "is_synthetic": false
}
```

## Supported Events List
1. `homepage_viewed`: User lands on storefront.
2. `category_selected`: Category pill or menu clicked.
3. `search_submitted`: User submits search keyword.
4. `search_result_clicked`: Item selected from search results.
5. `filter_applied`: Price, brand, or size filter modified.
6. `product_viewed`: PDP viewed.
7. `product_compared`: Item added to side-by-side comparison.
8. `size_guide_opened`: Size chart or fit predictor modal launched.
9. `recommendation_clicked`: Item selected from recommendation rail.
10. `wishlist_added`: Item bookmarked.
11. `added_to_cart`: Item and size added to shopping bag.
12. `checkout_started`: User initiates checkout flow.
13. `purchase_completed`: Order successfully placed.
14. `order_cancelled`: Order cancelled before dispatch.
15. `return_requested`: Doorstep return pickup initiated.
16. `exchange_requested`: 1-Click replacement size booked.\n