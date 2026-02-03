# 🧪 Testing Plan

## 📖 Overview of testing 
ObsidianRoutes testing combines automated and manual testing to ensure correctness, reliability, and real-world usability. Testing covers main logic and isolated components to catch issues early and keep behavior predictable. End-to-end (E2E) tests validate user flows from login to starting a ride, ensuring the app works as expected from a rider's point of view. Manual testing complements automation by validating GPS behaviour, offline resilience, and on-bike usability. 

## ✅ 1. Unit testing 
Automated unit tests focus on isolating business logic and utility functions to ensure mathematical and logical accuracy. These tests are triggered automatically via GitHub Actions (see [**devops.md**](./devops.md)).

* Tools: [Jest](https://jestjs.io/) and [React native testing library](https://callstack.github.io/react-native-testing-library/)
* Coverage Targets: 
    * Weather analysis logic.
    * Distance calculations.
    * Form Validations.

## 📝 2. End to End Testing
E2E tests simulate real-world user interactions to ensure the integrated system, from the UI to the Supabase backend, work as intended.
* Tools: [Maestro](https://maestro.mobile.dev/)
* Primary Test suites:
    * **Login/Authentication Flow**: Validates that a user can log in, handle session persistence and lands on the app home screen.
    * **Garage Management Flows**: Validates navigation to the garage, adding/deleting motorcyles and verifying the record is correctly persisted.  
    * **Route Planning Flows:** Tests Mapbox geometry rendering given an origin and destination, and verifies if *Start Ride* can be triggered.

## 🕵️‍♂️ 3. Manual Testing
Beyond automation, as the app interacts with the users phone hardware, some scenarios require real-world hands-on verification such as:
 * *GPS behavior* and signal recovery in tunnels. 
 * *Offline resilience*, ensuring that data remains cached via TanStack Query and Zustand when a signal is lost mid-ride. 
 * *Usability* and *Accesibility* checks to verify UI legibility and button target sizes are appropriate for a mounted motorcycle environment and accessible for users with disabilities.

