# Acceptance Criteria Specifications (Gherkin Format)

## Story US-01: Recommended Size Badge on PDP
```gherkin
Feature: Automated Recommended Size Guidance on PDP

  Scenario: User with previous purchase history views garment PDP
    Given an authenticated user with at least 1 previously retained apparel purchase
    When they land on any apparel Product Detail Page
    Then the Recommended Size Badge should render within 200ms
    And display: "Recommended for you: Size M (Based on your Roadster Shirt purchase)"
    And clicking the badge should open the detailed fit explanation sheet

  Scenario: Anonymous user opens size guide
    Given an anonymous or first-time user
    When they click "Size Chart & Fit Guide"
    Then present a standard standardized dimension matrix
    And provide height and weight slider selectors for instant fit prediction

  Scenario: Telemetry Event Dispatch
    Given a user interacting with size recommendations
    When the size guide modal is opened
    Then dispatch event 'size_guide_opened' with property { source: 'smart_badge' }
```\n