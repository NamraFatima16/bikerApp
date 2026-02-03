### 🧠 State Management Strategy 

State management is critical for ObsidianRoutes, as location data, ride status, and user preferences must be accessible across multiple screens. This architecture defines what data lives where and how the application shares information.

## 📖 1. Global State

[Zustand](https://zustand.docs.pmnd.rs/) is used for client-side global state management. It is lightweight, fast and integrates seamlessly with *React Native*. To ensure the app is resilient, specifically for tracking rides, certain stores are synced to local storage using `persist` middleware to `AsyncStorage`

### 🗃️ Zustand Stores 

Refer to [**database-schema.md**](./database-schema.md) for the underlying data models.

|   Store  | Responsibility | Persistence |
|----------|:---------------|:-----------:|
| **Auth** | Tracks the `user` profile, Supabase login `session`, and `isAuthenticated` status. | **No** |
| **Ride** | Manages `isRiding` status, `currentRoute` (GeoJSON), and live stats like `distanceTraveled`. | **Yes** |
| **Settings** | Handles user preferences like `theme` (Light/Dark), `units`, and notification toggles. | **Yes** |

### 🔍 TanStack Query Server State
[TanStack Query](https://tanstack.com/query/v5) is used to fetch asynchronous data from the backend. Caching and background synchronization are handled automatically, ensuring the app remains functional even with intermittent connectivity during a journey.

| Hook | Type | Behavior         |
| :---:| :--- | :--------------- |
| `useWeather` | Query | Fetches real-time weather; results are cached for 15 minutes to minimize API calls. |
| `useBikes` | Query | Retrieves the list of bikes registered to the current user. |
| `useHistory` | Query | Fetches the user's past ride history. |
| `useSaveRoute` | Mutation | Implements **optimistic updates**, reflecting a "Saved" status immediately while background sync completes. |
| `useUpdateOdometer` | Mutation | Synchronizes physical bike stats with the backend. |

## 📍 2. Local components state

For small temporary state, like text being typed before hitting "Submit", react build-in functions like useState and useReducer are utlized.



* User login session
* if user have logged in or out 

2. **User Current Ride** 
* If user is riding right now 
* the route user is taking 
* when it started 
* how far user have gone
* this information will be there if the app crashes. when it is reopened it will pick up right where it was left off

3. **User Preferences:**
* Light or dark mode 
* Metric or imperial units 
* what kind of notification a user wants

## 2. TanStack Query/ React Query (Server State)
This is used to fetch data from thew web. It handles response storage effeciently so the user can still still the information when they are offline 

* Things to fetch: 
    - The weather for where users are 
    - The list of user bikes
    - Users past rides
* Things to send:
    - Saving finished route it will show "saved" right away even if the upload is still happening in the background 
    - Updating users bike mileage

## 3. Local components state

* For small temporary state like text being typed before hitting "Submit" we can rely on react build-in functions like useState and useReducer 


