# 🖥️ Frontend Documentation

## 📐👷🏻‍♀️ 1. Architecture Overview
* **Framework:** [React Native](https://reactnative.dev/) managed using [Expo](https://expo.dev/).
* **Language:** TypeScript. 
* **Platform:** :robot: Android (Primary).
* **Architecture Style:** **MVVM (Model-View-ViewModel)** is utilized to separate UI logic from business logic and data management.

## 🧩 2. Frontend Stack
* [React Native Paper](https://reactnativepaper.com/) provides a production-ready design system based on Material Design to keep the UI consistent.
* [@rnmapbox/maps](https://github.com/rnmapbox/maps) is used to handle all interactive mapping features using the Mapbox SDK for high-performance, customizable maps.
* [React Navigation](https://reactnavigation.org/) manages the app's routing and screen transitions.
* [Zustand](https://docs.pmnd.rs/) serves as the primary state manager to share data across the app with minimal boilerplate.
* [TanStack Query](https://tanstack.com/query/latest) simplifies fetching and caching data, ensuring that the UI stays in sync with the backend. 
* [React-hook-form](https://react-hook-form.com/) streamlines building forms, handling validation and submission for relevant user flows.

## 🗺️ 3. Navigation Structure
### 🧭 Bottom tabs for Main Navigation 

* 🏠 **Ride / Map (Home)** Core screen with map, "Start Ride" button, and weather overlay.
* 📝 **Planner** Route planning interface. Start/End journey input.
* 🆘 **Emergency** Large, accessible SOS button and emergency contacts list.

### ☰ Menu for Secondary Navigation
* 👤 **User Profile** Edit/Update user information and emergency contacts.
* 🏍️ **Garage** Saved bikes make, model, and maintenance logs.
* ⚙️ **Settings** Unit preferences (km/miles, Celsius/Fahrenheit) and notification thresholds.
* 🗃️ **History** List of past rides.

## 4. 🎨🖌️ UI/UX Styling
The UI/UX follows Material Design 3 (MD3) principles.

 **Colour Palette:** 

  | Role     | Colour     |                   Hex                          |
  | :--------| :----------| :----------------------------------------------|
  |**Primary**| Oak Brown | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#825514" stroke="#000"/><text x="50%" y="70%" font-size=".8em" text-anchor="middle" fill="#fff" font-family="monospace">#825514</text></svg>|
  |**Secondary**| Dark Aqua | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#116682" stroke="#000"/><text x="50%" y="70%" font-size=".8em" text-anchor="middle" fill="#000" font-family="monospace">#116682</text></svg>|
  |**Tertiary**| Blue Stone | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#006a62" stroke="#000"/><text x="50%" y="70%" font-size=".8em" text-anchor="middle" fill="#fff" font-family="monospace">#006a62</text></svg>| 
  |**Hazards/Warnings**| Firebrick | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#8c1717" stroke="#000"/><text x="50%" y="70%" font-size=".8em" text-anchor="middle" fill="#000" font-family="monospace">#8c1717</text></svg>|


> [!NOTE]  
> The colours have high-contrast, which is required for visibility while riding in bright light

**Typography:** Large, legible fonts for easy reading at a glance. Roboto is the default typeface for Android. The fallback order is:
1. Roboto Flex  
2. Roboto  
3. Noto Sans


## 📍 5. Mapbox Specifics
* **Style URL** utilizes a custom Mapbox Studio style so that unnecessary landmarks are not shown to reduce visual clutter. 
* **Camera** uses "Puck" tracking mode, which follows the user's location with the course up.
* **Overlays** include a Polyline for the Route and custom markers for weather checkpoints every 10–15 km.



