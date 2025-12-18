# Frontend Implementation Brief (TripPlan)

## Purpose
This document defines the contract between the human developer (backend) and Codex (frontend).
Codex must implement frontend concerns only, based on the fixed specifications.

---

## Scope of Responsibility

### Codex Responsibilities
- Rails ERB views
- Partials
- Turbo Drive / Turbo Streams
- Stimulus controllers (minimal)
- UI behavior (empty states, flash messages, confirmation dialogs)

### Out of Scope (Must NOT do)
- Database schema changes
- Models, validations, scopes
- Authorization logic
- Writing raw SQL

---

## Tech Stack
- Ruby on Rails 7
- Server-Side Rendering (ERB)
- Hotwire (Turbo / Stimulus)
- Devise (already installed)
- MySQL
- Mobile-first responsive design
- No SPA

---

## MVP Screens

### Authentication
- Use Devise default screens
- UI adjustments allowed (layout, copy)

---

### Trips Index (/trips)

Tabs:
- All
- Upcoming
- Past

Logic is handled by controllers.

Card content:
- Title
- Destination
- Date range
- Theme color

Empty state:
- Message: "Let's plan your next trip!"
- CTA: "Create a new trip"

---

### Trip Create / Edit

Fields:
- title (required)
- destination (optional)
- start_date (required)
- end_date (required)
- color (optional)
- notes (edit only)

Validation errors:
- Summary at top
- Inline messages per field

---

### Trip Show (/trips/:id)

Tabs:
- Activities
- Packing
- Notes

---

## Activities UI

- Grouped by date
- Card-based layout

Card fields:
- Time (if present)
- Title
- Location (optional)
- Cost (optional, ¥)
- Memo (optional)

Add action:
- "+ Add activity" per date section
- Date is prefilled

Empty state:
- "No activities yet" with CTA

---

## Packing Items UI

Fixed categories:
- Clothing
- Toiletries
- Electronics
- Documents
- Health
- Others

Rules:
- Grouped by category
- Unchecked first, checked later
- Checked items: gray + strikethrough

Behavior:
- Checkbox toggle via Turbo/Stimulus
- No full page reloads

Empty state:
- Encourage list creation

---

## Notes UI
- Single textarea
- No autosave
- Placeholder guidance text

---

## Flash Messages
- Success: flash[:notice] at top
- Errors: flash[:alert]

---

## Deletion
- Trip deletion requires confirmation dialog

---

## Hotwire Policy
Allowed:
- Checkbox toggles
- Partial updates on create/delete

Not allowed:
- SPA-like state management
- Heavy JavaScript

---

## Definition of Done
- Mobile-safe layout
- All empty states implemented
- Clear validation feedback
- Partial updates only
- Clean partial structure
