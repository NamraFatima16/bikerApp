# 🗄️ Database Schema  

## 📖 Overview
[PostgreSQL](https://www.postgresql.org/) serves as the application's primary database, hosted on [Supabase](https://supabase.com/) to leverage integrated authentication and real-time capabilities. This schema utilizes the [PostGIS](https://postgis.net/) extension for advanced spatial queries and high-performance geographic data handling. Additionally, `citext` and `uuid-ossp` are used for case-insensitive string comparisons and Universally Unique Identifiers (UUIDs), respectively.

## 📋┬─┬ Tables Overview

| Table | Description | Constraints | Key Relationships |
| :---: | :---------- | :-----------| :---------------- |
| **`users`** | Profiles extending Supabase Auth. | `email` (Unique, CITEXT) | **1:1** with `auth.users` |
| **`bikes`** | Motorcycle inventory and maintenance data. | `registration` (Unique) | **Many:1** with `users` |
| **`emergency_contacts`** | User-defined SOS recipients. | `priority_order` (Not Null) | **Many:1** with `users` |
| **`routes`** | Saved and planned paths with geometry. | `path_geometry` (Geography) | **Many:1** with `users` |
| **`ride_history`** | Logs of completed trips and telemetry. | `start_time` (Not Null) | **Many:1** with `users`/`bikes` |
| **`hazards`** | Community-reported road conditions. | `type` (Enum) | **Many:1** with `users` |
| **`points_of_interest`** | User-marked locations (Fuel, etc.). | `category` (Enum) | **Many:1** with `users` |
| **`emergency_alerts`** | Audit log of SOS activations and SMS status. | `twilio_sms_sid` (Unique) | **Many:1** with `ride_history` |


> [!NOTE]
> * All geographic columns use the `GEOGRAPHY` type for accurate real-world distance calculations, with **GIST indexes** used for efficient proximity searching.
> * `ride_history` stores `route_data` as a `JSONB` snapshot to preserve historical trip telemetry even if source routes are modified.
> * `emergency_alerts` logs every individual notification attempt; one SOS event can generate multiple alert rows - one for each contact notified.
> * Row Level Security (RLS) is enforced on all user-specific tables, ensuring users only access rows where `user_id` matches their `auth.uid()`.

## 🤝 Entity Relationship Diagram
```mermaid
%%{init: {
    'themeVariables': {
    'lineColor': '#e03333'
  }
}}%%
erDiagram
    users ||--o{ bikes : "owns"
    users ||--o{ emergency_contacts : "notifies"
    users ||--o{ routes : "saves"
    users ||--o{ ride_history : "records"
    users ||--o{ hazards : "reports"
    bikes ||--o{ ride_history : "used_in"
    ride_history ||--o{ emergency_alerts : "triggers"
    emergency_contacts ||--o{ emergency_alerts : "received_by"

    users {
        uuid id PK
        citext email UK
        string full_name
        string avatar_url
        timestamp created_at
    }

    bikes {
        uuid id PK
        uuid user_id FK
        string make
        string model
        int year
        string registration UK
        int odometer_reading
        date last_service_date
        float tire_pressure_front
        float tire_pressure_rear
    }

    emergency_contacts {
        uuid id PK
        uuid user_id FK
        string name
        string phone_number
        string relationship
        int priority_order
    }

    routes {
        uuid id PK
        uuid user_id FK
        string name
        geography start_point
        geography end_point
        geography path_geometry
        float distance_km
    }

    ride_history {
        uuid id PK
        uuid user_id FK
        uuid bike_id FK
        timestamp start_time
        timestamp end_time
        jsonb route_data
        float max_speed
        jsonb weather_summary
    }

    hazards {
        uuid id PK
        uuid reported_by FK
        geography location
        hazard_type type
        int upvotes
        timestamp created_at
    }

    emergency_alerts {
        uuid id PK
        uuid ride_id FK
        uuid contact_id FK
        string twilio_sms_sid UK
        alert_status status
        string resolved_by
    }
```