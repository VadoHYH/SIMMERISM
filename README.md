# SIMMERISM – AI Recipe Recommendation Web App

Your smart kitchen companion. SIMMERISM helps users decide what to cook, plan meals for the week, generate shopping lists, and get daily food inspiration through fun and intuitive features.

### 🔗 Demo: [https://simmerism.vercel.app](https://simmerism.vercel.app)

---

## 🌍 Main Features

### 🔍 Search Recipes

* Multiple search modes:

  * By keyword
  * By ingredient (multi-select)
  * By dietary preference (vegetarian, gluten-free, etc.)
  * By tag or category (main dish, dessert, etc.)

### 🍳 Plan & Schedule Cooking

* Select your recipe and plan it into your weekly calendar
* View all scheduled recipes by date
* Linked shopping list will auto-generate

### 🛍️ Auto-Generated Shopping List

* Aggregates all planned recipes' ingredients
* Groups ingredients by type (e.g., vegetables, dairy, spices) to make shopping more efficient
* Automatically updates when scheduled meals change

### ❤️ Favorite Recipes

* Save recipes with one click
* View all favorited recipes in one page
* Stored in Firestore by user ID

### ☕️ Ask the Chef ("問問小厨娘")

* A playful homepage interaction that gives users a randomized food suggestion based on rule-based and randomized logic, simulating an AI recommendation experience.
* Includes illustration and clickable recipe preview.

---

## 🤝 Technologies Used

### 🚀 Frontend

* **React** / **Next.js**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion** (for animations)
* **Zustand** (global state management)

### 📊 Backend / Data

* **Firebase Firestore** (realtime DB)
* **Spoonacular API** (external recipe data)
* **Custom Translation Script** (English to Mandarin for recipes, using a custom dictionary and translation logic rather than external APIs like Google Translate)

### 🎨 UI/UX

* Tag filter bar with animation
* Modal for recipe detail view
* Responsive layout across devices
* Loading states and transition effects

### 📜 Project Management

* Git & GitHub
* Feature branches, PRs, commits
* Vercel deployment

---

## 🔄 Folder Structure

```
simmerism
├── app
│   ├── recipe          
│   ├── search           
│   ├── schedule         
│   ├── shopping         
│   ├── questions
│   ├── collection
│   ├── AuthProvider.tsx
│   ├── globals.css
│   ├── layout.tsx  
│   └── page.tsx       
├── components           # Reusable UI components (e.g., RecipeCard, FilterModal, DatePicker)
│   ├── AddToScheduleModal.tsx
│   ├── ChatButtton.tsx
│   ├── ChefChat.tsx
│   ├── DatePicker.tsx
│   ├── FilterModal.tsx
│   ├── Footer.tsx
│   ├── ForgetPasswordModal.tsx
│   ├── Header.tsx
│   ├── LoginModal.tsx
│   ├── NavItem.tsx
│   ├── Pagination.tsx
│   ├── RecipeCard.tsx
│   ├── RegisterModal.tsx
│   ├── ScheduleCard.tsx
│   └── SearchBar.tsx
├── hooks                # Custom hooks for recipe fetching, filters, favorites, etc.
│   ├── useFavorite.ts
│   ├── useFilterLogic.ts
│   ├── useRecipes.ts
│   ├── useRequireLogin.ts
│   ├── useSchedule.ts
│   └── useShoppingList.ts
├── context
│   └── AuthContext.tsx  # Login modal context for access control
├── lib                  # Firebase config and custom translation tool
│   └── firebase.ts
├── stores               # Zustand state stores
├── types                # Shared TypeScript interfaces and types
├── utils                # Helper functions and reusable constants
├── styles
│   └── globals.css
```

---

## 🎨 User Experience

* Zustand-based global state management handles favorites and filters across components, with persistence through localStorage and optimization to avoid unnecessary re-renders
* "Ask the Chef" provides an emotional hook on first visit
* Error handling, loading skeletons, and empty state UI

---

## 📢 Contact

**謝曜徽 Vado Hsieh**
Frontend Developer (Taiwan)
Email: [vado.hyh@gmail.com](mailto:vado.hyh@gmail.com)
