# Campus Finder Fellow

# Build Campus Lost and Found — Project 4/50

Act as a senior product designer and full-stack engineer. Build a complete, polished, responsive web application called **Campus Lost & Found**, designed for students to report and recover lost belongings on campus.

The application must be functional, visually premium, and easy to use on mobile devices. Do not create a static mockup.

## 1. Design system

Create a clean, modern campus utility product.

- Use a premium light theme with a deep navy primary color, subtle blue accents, and neutral backgrounds.
- Use modern typography, clear spacing, refined shadows, and restrained rounded corners.
- Use Lucide icons and consistent status indicators.
- Make the design responsive across desktop, tablet, and mobile.
- Include polished hover states, loading states, empty states, and confirmation dialogs.
- Use realistic sample items, such as a water bottle, calculator, backpack, notebook, and set of keys.
- Clearly label sample content as demo data.

## 2. Home dashboard

Build a landing dashboard with:
- Product name and navigation.
- A search bar for finding items.
- Prominent "Report Lost Item" and "Report Found Item" actions.
- Summary counts for lost, found, and returned items.
- Recently reported items displayed as attractive cards.
- Filters for status, category, and location.
- A clear explanation of how students can recover their belongings.

## 3. Item reporting

Create one reusable item form for reporting either a lost or found item.

Fields:
- Item title.
- Description.
- Item category: Electronics, Stationery, Bags, Clothing, Accessories, Water Bottles, Documents, or Other.
- Location where the item was lost or found.
- Date lost or found.
- Optional photograph.
- Contact method or safe contact instructions.
- Item type: Lost or Found.

Validate required fields and show useful inline errors.

## 4. Item listings and search

Every listing must display:
- Item photograph or a polished placeholder.
- Title and description.
- Category.
- Location.
- Date reported.
- Status: Lost, Found, or Returned.
- Item details and available contact instructions.

Implement search across item titles, descriptions, locations, and categories.

Filters must combine correctly with search and update the results immediately.

Provide sorting by newest and oldest.

## 5. Item details and status changes

Each item must have a dedicated detail view.

Allow the item's owner or authorized demo user to:
- Edit the listing.
- Mark the item as returned or recovered.
- Delete a listing after confirmation.

Changing an item's status must update the existing record rather than creating a duplicate.

Returned items should remain visible in a separate filterable history instead of disappearing permanently.

## 6. Data and persistence

Use a clear item data model containing:
- id
- title
- description
- category
- location
- dateOccurred
- image
- type
- status
- contactInstructions
- createdAt
- updatedAt

Persist records so that creating, editing, and updating an item survives page refreshes.

If a backend is available, use it appropriately. Otherwise, implement robust local persistence and clearly identify the application as a local demo. Do not claim that reports are shared across devices unless a real shared backend exists.

## 7. Privacy and safety

- Do not require students to publish phone numbers or email addresses publicly.
- Warn users against posting passwords, student IDs, sensitive documents, or private information in photographs.
- Do not expose private contact information in public listing cards.
- Make demo permissions and any limitations clear.
- Do not claim identity verification or secure authentication unless implemented.

## 8. Quality requirements

Verify that:
1. Lost and found reports can both be created.
2. Required fields are validated.
3. Search works across relevant fields.
4. Multiple filters work together.
5. Images and placeholders render correctly.
6. Status changes persist after refresh.
7. Editing updates the original item.
8. Deletion requires confirmation.
9. Returned items remain accessible through history.
10. The UI works on mobile and desktop.
11. Empty states and invalid input are handled gracefully.
12. Every visible button performs its advertised action.

Build the complete application, not merely the homepage. At the end, summarize implemented functionality, persistence, testing performed, and remaining limitations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/14599913-1b5e-4db5-8b2b-fc4c5c646b18).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
