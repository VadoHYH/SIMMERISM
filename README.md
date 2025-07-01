# SIMMERISM – AI Recipe Recommendation Web App

**Your intelligent kitchen companion.** SIMMERSIM helps users decide what to cook, plan meals for the week, generate smart shopping lists, and find daily food inspiration through intuitive and engaging features.

### 🔗 Demo: [https://simmerism.vercel.app](https://simmerism.vercel.app)
![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/HomePage.png)

---

## Main Features

### 📊 **Personalized Dashboard Overview** 
* **Instant Meal Glance:** Provides a quick overview on the homepage, showing the number of meals you have scheduled for breakfast, lunch, and dinner.
* **Weekly Shopping List Summary:** Offers an at-a-glance summary of your consolidated shopping list for the week, enabling efficient planning and preparation.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/HomePage.png)

### 🔍 Search Recipes

* **Multiple search modes:**

  * By keyword
  * By ingredient (multi-select)
  * By dietary preference (vegetarian, gluten-free, etc.)
  * By tag or category (main dish, dessert, etc.)

* **Intuitive UI:** Easily navigate through diverse culinary options.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/SearchFeture.gif)

### ❤️ Recipe Collections

* **One-Click Saving:** Easily save favorite recipes for quick access and future reference.
* **Centralized Management:** View and organize all favorited recipes on a dedicated page.
* **User-Specific Storage:** Recipes are securely stored in Firestore, linked to individual user IDs.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/CollectionFeture.gif)

### 📅 Plan & Schedule Cooking

* **Daily Calendar Integration:** Effortlessly select and add recipes to your personalized daily meal plan.
* **Organized Overview:** View all scheduled recipes by date for clear meal management.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/ScheduleFeture.gif)

### 🛍️ Auto-Generated Shopping List

* **Consolidated Ingredients:** Automatically aggregates all ingredients from your planned recipes into a single, comprehensive shopping list.
* **Dynamic Updates:** The shopping list instantly updates as scheduled meals are added, removed, or changed.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/ShoppingListFeture.gif)

### 🤖 AI Chef Assistant ("問問厨娘")

* **Integrated OpenAI GPT-3.5 API:** Provides intelligent, dynamic recipe recommendations and answers various food-related inquiries, acting as your personal virtual chef.

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/AiChefAssistant.gif)

---

## Technologies Used

![](https://github.com/VadoHYH/SIMMERISM/blob/main/images/TechnologiesUsed.png)

### 🌐 Frontend
* **React** / **Next.js**: Modern JavaScript library and framework for building performant user interfaces.
* **TypeScript**: Ensures type safety and improves code maintainability.
* **Tailwind CSS**: Utility-first CSS framework for rapid and consistent styling.
* **Zustand**: Lightweight global state management for efficient data flow across components.
* **Axios**: Promise-based HTTP client for making API requests.
* **Day.js**: Lightweight JavaScript date library for date manipulation (e.g., in meal scheduling).

### ☁️ Backend & Data
* **Firebase Firestore**: NoSQL cloud database for real-time data storage and synchronization (recipes, user data, schedules, favorites).
* **Firebase Authentication**: Secure user authentication and authorization (email/password, Google Sign-In).
* **Spoonacular API**: External API for comprehensive recipe data (ingredients, instructions, nutrition).
* **OpenAI GPT-3.5 API**: Powers the AI Chef Assistant for intelligent recommendations and responses.
* **Google Translate API**: Used for real-time translation of recipe content to support bilingual features.

### 🎨 UI/UX & Development Tools
* **Headless UI**: Provides unstyled, accessible UI components for custom styling with Tailwind CSS.
* **Lucide Icons**: High-quality, customizable open-source icons.
* **Git & GitHub**: For version control, collaborative development, and project management (feature branches, pull requests).
* **Vercel**: For seamless and efficient deployment of the Next.js application.

---

## Architecture 

![SIMMERISM High-Level Architecture](https://github.com/VadoHYH/simmerism/blob/main/images/HighLevelArchitecture.png)


---

## Folder Structure

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

## User Experience

* **Optimized State Management:** Zustand-based global state management effectively handles complex states (favorites, filters, scheduling) across components, ensuring data persistence (e.g., via localStorage) and minimizing unnecessary re-renders for a fluid experience.
* **Robust Feedback Mechanisms:** Comprehensive error handling, intuitive loading skeletons, and clear empty state UIs ensure users are always informed and guided, even during data fetching or unexpected scenarios.
* **Adaptive Design:** Fully responsive layout ensures a consistent and enjoyable user experience across various devices (desktop, tablet, mobile).

---

## Contact

**謝曜徽 Vado Hsieh**
* Frontend Developer (Taiwan)
* Email: [vado.hyh@gmail.com](mailto:vado.hyh@gmail.com)

