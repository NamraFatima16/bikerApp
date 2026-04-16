# Obsidian Routes — Copilot Instructions

Obsidian Routes is a React Native / Expo motorcycle safety companion app — a SETU thesis project targeting Android. It combines route planning, weather-along-route analysis, live GPS ride recording, bike management (garage), and emergency SOS into one app for motorcyclists. All application source code lives in the `ObsidianRoutes/` subdirectory. **Run all commands from `ObsidianRoutes/`.**

---

## Commands

```bash
# Development
npm run start          # Start Expo dev server
npm run android        # Start on Android emulator/device

# Quality checks (also run in CI on every PR to master)
npx eslint . --ext .ts,.tsx
npx tsc --noEmit
npx prettier --check .
npx jest --passWithNoTests

# Run a single Jest test file
npx jest path/to/file.test.ts

# Run tests matching a name pattern
npx jest --testNamePattern="getDistanceMetres"

# Production build (requires EXPO_TOKEN secret)
eas build --profile development --platform android --non-interactive
```

---

## Architecture

### Navigation

`App.tsx` is a Native Stack with three root routes: `Login → Signup → App`. The `App` route renders `AppNavigator` (`navigation/AppNavigator.tsx`), which is a **Drawer** wrapping a nested **BottomTabNavigator**:

- **Bottom tabs (primary):** `Map` · `Planner` · `Emergency`
- **Drawer screens (secondary):** `Profile` · `Garage` · `Settings` · `History`

### API / Backend

A **hybrid API** strategy — choose the right layer for each use case:

| Use case | Layer |
|---|---|
| Standard CRUD (bikes, rides, routes, users) | Supabase Client SDK via `lib/api/*.ts` |
| Route weather analysis | Supabase Edge Function `POST /functions/v1/analyze-route` |
| Emergency SOS via Twilio SMS | Supabase Edge Function `POST /functions/v1/send-sos` |

Edge Functions are written in **TypeScript** and run on the **Deno runtime** (not Node.js). They support npm modules and Node built-ins. API keys (OpenWeatherMap, Twilio, Mapbox) are stored in Supabase Vault — never in client code.

The weather analysis Edge Function:
1. Samples route geometry every ~10 km
2. Calls OpenWeatherMap API per segment at the correct future timestamp
3. Flags hazards when: rain probability > 70%, wind > 40 km/h, temperature < 5°C
4. Returns `{ hazards: [], safe: boolean }`

The SOS Edge Function:
1. Verifies active user session
2. Retrieves emergency contacts ordered by `priority_order`
3. Sends SMS via Twilio per contact (GPS coordinates, Google Maps link, battery level)
4. Logs each SMS attempt as a separate row in `emergency_alerts`
5. Returns `{ success: boolean, sent_attempt: n }`

### State Management

Three distinct layers — use the correct one:

| Layer | Tool | What lives here |
|---|---|---|
| Global client state | **Zustand** | `AuthStore` (user, session, isAuthenticated), `RideStore` (isRiding, currentRoute, distanceTraveled) **persisted**, `SettingsStore` (units, theme, notifications) **persisted** |
| Server / async state | **TanStack Query** | Weather (cached 15 min), bikes list, ride history; mutations use optimistic updates (`useSaveRoute`) |
| Component-local state | `useState` / `useReducer` | Ephemeral form input, transient UI state |

The `RideStore` and `SettingsStore` are persisted to `AsyncStorage` so ride state survives app crashes and can be resumed on relaunch.

### Database

PostgreSQL on Supabase with the **PostGIS** extension. Key tables and their purpose:

| Table | Purpose |
|---|---|
| `users` | Profiles extending Supabase Auth (1:1) |
| `bikes` | Motorcycle inventory; `registration` is unique |
| `routes` | Saved planned paths; `path_geometry` uses `GEOGRAPHY` type |
| `ride_history` | Completed trips; `route_data` is a **JSONB snapshot** (not a FK) |
| `emergency_contacts` | SOS recipients; `priority_order` NOT NULL |
| `emergency_alerts` | Audit log of SOS SMS attempts (one row per contact per event) |
| `hazards` | Community-reported road conditions; `type` is an enum |

All geographic columns use the `GEOGRAPHY` type with GIST indexes for spatial queries. **Row Level Security (RLS) is enforced on all user-specific tables** — queries are automatically scoped to `auth.uid()`, so never manually filter by `user_id` in client code.

---

## Implementation Status

### ✅ Implemented (closed GitHub issues)

These features have code in the repo and should have test coverage:

| Feature | Files |
|---|---|
| Project setup, CI, EAS build, Sentry | `App.tsx`, `.github/workflows/` |
| Authentication (email/password login & signup) | `screens/auth/LoginScreen.tsx`, `screens/auth/SignupScreen.tsx` |
| Navigation shell (drawer + bottom tabs) | `navigation/AppNavigator.tsx` |
| Mapbox map with user location | `screens/main/MapScreen.tsx` |
| Live GPS ride tracking (start/stop, polyline, stats) | `screens/main/MapScreen.tsx`, `lib/api/location.ts` |
| Save completed ride to Supabase | `lib/api/rides.ts` → `saveRide()` |
| Garage: bikes table + RLS | `supabase/migrations/` |
| Garage: CRUD API | `lib/api/bikes.ts` |
| Garage: UI (list, add, delete) | `screens/main/GarageScreen.tsx` |
| Routes table + PostGIS schema | `supabase/migrations/` |
| Mapbox Directions API integration | `lib/api/directions.ts` → `getDirections()` |
| Route planner UI (coord input, route on map) | `screens/main/PlannerScreen.tsx` |
| Weather along route (OpenWeatherMap + sampling) | `lib/api/weather.ts` → `getWeatherAlongRoute()` |
| Weather markers on planner map | `screens/main/PlannerScreen.tsx` |
| `ride_history` database schema | `supabase/migrations/` |

### 🔲 Not yet implemented (open GitHub issues)

Do not write tests for these — they do not exist yet:

- **#20** End ride flow (summary screen, JSONB snapshot save, star rating)
- **#21** Ride history screen (list, filter, detail view, share, delete)
- **#22** Incident/hazard logging during a ride
- **#23** Emergency contacts database schema
- **#24** Emergency SOS Edge Function (Twilio)
- **#25** Emergency screen UI
- **#26** Emergency contacts management UI
- **#27** Offline resilience (queued SOS, offline banner)
- **#28** Settings screen (units, ride settings, privacy, account)
- **#29** Dark mode and UI polish
- **#30** App store submission prep

---

## Testing

There are currently **no tests** in the project. The goal is to write Jest unit tests for all implemented logic. Tools are already installed: `jest`, `@types/jest`, and React Native Testing Library.

### What to test and how to mock

**`lib/api/weather.ts`** — highest priority; contains pure business logic:
- `getDistanceMetres` is a private Haversine implementation — test indirectly via `getWeatherAlongRoute` by checking the number of weather samples returned for a given set of coordinates
- `getWeatherAlongRoute` — mock `global.fetch` to return a fixture; verify sampling occurs every `intervalKm` kilometres and the result shape matches `{ coordinate, weather }`
- `getWeatherAtPoint` — mock `global.fetch`; verify it throws when `data.cod !== 200`

**Weather hazard thresholds** (from Edge Function spec, issue #15) — critical to test:
- Rain probability > 70% → hazard flag
- Wind speed > 40 km/h → hazard flag
- Temperature < 5°C → hazard flag

**`lib/api/bikes.ts`** — mock `@supabase/supabase-js`:
- `getBikes` returns data array or throws on error
- `createBike` inserts with `user_id` from `supabase.auth.getUser()`
- `updateBike` patches `updated_at` automatically
- `deleteBike` throws on error

**`lib/api/rides.ts`** — mock `@supabase/supabase-js`:
- `saveRide` inserts with `user_id` attached
- `getRides` returns rides ordered newest first

**`lib/api/directions.ts`** — mock `global.fetch`:
- Returns `{ distance, duration, coordinates }` on success
- Throws `"No routes found"` when API returns empty routes array

**`lib/api/location.ts`** — mock `expo-location`:
- `requestLocationPermission` returns `true` when status is `"granted"`
- `watchLocation` calls the callback with a correctly shaped `LocationPoint`

**`screens/main/MapScreen.tsx`** — extract `formatTime` to a util if testing it standalone:
- `formatTime(0)` → `"00:00:00"`
- `formatTime(3661)` → `"01:01:01"`
- Speed conversion: `m/s × 3.6` (used in `watchLocation` callback in `startRide`)

### Mock patterns

```ts
// Mock Supabase client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: {}, error: null }),
    auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } }) },
  },
}));

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({ /* fixture */ }),
});

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  Accuracy: { High: 6 },
}));
```

### Where to put tests

Place test files next to the source file they test:
- `lib/api/weather.test.ts`
- `lib/api/bikes.test.ts`
- `lib/api/rides.test.ts`
- `lib/api/directions.test.ts`
- `lib/api/location.test.ts`

---

## Key Conventions

### File layout
- `lib/supabase.ts` — single exported `supabase` client; import from here everywhere.
- `lib/api/*.ts` — typed data-access functions, one file per domain. Each function throws on Supabase/fetch error and returns typed data directly.
- Types for domain objects (`Bike`, `Ride`, `WeatherData`, `LocationPoint`, etc.) are co-located with their API functions in `lib/api/*.ts`.
- `types/declarations.d.ts` — global module declarations (`@rnmapbox/maps`).
- `supabase/migrations/` — SQL migration files for the database schema.

### TypeScript
- Strict mode enabled (`"strict": true`).
- No `any` — use the typed return values from `lib/api/*.ts`.

### UI / Styling
- **Mapbox** (`@rnmapbox/maps`) for all map features — not Google Maps or `MapView`.
- Map token comes from `process.env.EXPO_PUBLIC_MAPBOX_TOKEN`.
- Colour palette (high-contrast for bright-sunlight riding visibility):
  - Primary: Oak Brown `#825514`
  - Secondary: Dark Aqua `#116682`
  - Tertiary: Blue Stone `#006a62`
  - Hazards/Warnings: Firebrick `#8c1717`
- Target Material Design 3 via **React Native Paper** (not yet applied consistently).
- Button tap areas must be large enough for gloved use on a motorcycle.

### Error tracking
`App.tsx` wraps the root component in `Sentry.wrap(...)`. Do not remove this wrapper.

### Branching
- `master` — production; direct pushes are blocked.
- `feature/*` — all feature branches (e.g., `feature/ride-history-ui`).

Each issue has a corresponding `feature/*` branch name in its description.
