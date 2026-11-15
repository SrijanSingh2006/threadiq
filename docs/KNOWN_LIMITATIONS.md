# Known Limitations & Demonstration Boundaries

1. **Simulated Payments**: Checkout does not charge real bank instruments; transactions are simulated.
2. **Synthetic Telemetry**: The 20,000 product events and 5,000 customer profiles are synthetic records generated for demonstration and statistical validity.
3. **Courier Partner Integration**: Logistics dispatch and reverse pickups simulate SLA webhooks rather than connecting to live carrier production credentials.
4. **Google Gemini Mode**: Real generative AI queries require `GEMINI_API_KEY`. If not configured, the system transparently runs deterministic domain intelligence.\n