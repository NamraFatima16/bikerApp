# 🛤️ User Flow Documentation

## 📖 Overview
The following diagrams describe how riders move through the ObsidianRoutes app to complete key workflows, such as planning routes, recording rides, managing bikes, handling emergencies, and reviewing ride history.

### Diagram Legend
| Role | Colour |
| :--- | :--- |
| *Entry points / Neutral states* | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#3d96d8" stroke="#000"/></svg> |
| *Success / Completion* | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#53ad2c" stroke="#000"/></svg> |
| *Warnings / Non-critical issues* | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#a27a037b" stroke="#000"/></svg> |
| *Errors / Critical failures* | <svg width="4.5em" height="1.5em" style="vertical-align:middle"><rect width="100%" height="100%" rx="6" fill="#f44336" stroke="#000"/></svg> |
---
## 1. First Time User  

### Happy Path

```mermaid
flowchart
A[App Launch] --> B[Splash Screen - Logo]
B --> C[Welcome Screen'Ride safe, ride smart']
C --> D[Get Started Button]
D --> E[Account Creation]
E --> |Email & Passwordor Google| F[Permissions Request]
F --> |Location - Required Notifications - Alerts| G[Profile Setup]
G --> |NamePhonePhoto - Optional| H{Add First Bike?}
H --> |Add Bike| I[Bike Details Form]
H --> |Skip| J[Emergency Contact Setup]
I --> |Make, Engine SizeYear, Plate, Photo| J
J --> |Name, Phone Relationship| K{Add Contact?}
K --> |Add| L[Main App Screen - Map]
K --> |Skip| L
L --> |Map centeredon location| M[Tap to start the first ride]


style A fill:#3d96d8
style L fill:#53ad2c
style M fill:#53ad2c


```

### Unhappy Path
```mermaid
flowchart
A[Location Permission Denied] --> B[Prompt: Enable in System Settings]
B ---> C{User Action}
C --> |Enables Permission| D[Continue Onboarding]
C --> |Refuses| E[Limited Functionality Warning]
E --> F[Can Use App but No Ride Tracking]
G[App Crash During Ride] --> H[Relaunch App]
H --> I{Resume or Discard Ride?}
I --> |Resume| J[Continue ride from last point]
I --> |Discard| K[Delete ride data return to map]



style A fill:#f44336
style E fill:#f44336
style F fill:#f44336
style G fill:#f44336
style J fill:#a27a037b

```

## Route Planning Flow

### Happy Path Flow 
```mermaid
flowchart

A[Home Map Screen] --> B[Tap Plan Button on Bottom Navigation]
B --> C[Route Planning Screen]
C --> D[Search: Where to go? Recent destinations and current location]
D --> E[Enter Start Location]
E --> |Type address or drop pin| F{Add Waypoints?}
F --> |Yes| G[+ Add Stop, drag to reorder]
F --> |No| H[Route Preferences]
G --> H
H --> |Fastest/Scenic/Avoid Highways| I[Show Routes]
I --> J[Generates 2-3 route options]
J --> |Distance, Time, Weather, Twisty Roads, Rating| K[Select Route]
K --> L[Save Route]
L --> |Auto-name or Custom Name| M[Start Navigation]
M --> N[Map with Route Loaded]
N --> |Overlay: Ready?| O[Start Ride Button]

style A fill:#3d96d8
style O fill:#53ad2c

```

### Unhappy Path Flow

```mermaid
flowchart
A[No Internet Connection] --> B[Displays an Error Message]
B --> C[Route Planning is Unavailable]
C --> D{User Action}
D --> |Wait for the connection| E[Retry When Back Online]
D --> |Use Previous Route| F[Load Saved Route]
D --> |Cancel| G[Return to Map]

H[Severe Weather Detected] --> I[Display Route Warnings]
I --> J[Show Alert: Hazardous Conditions]
J --> K{User Decision}
K --> |Choose Alternative| M[Suggest safer routes]
K --> |Proceed Anyway| L[Continue with route + a safety warning]
K --> |Cancel| G

N[No Routes Found] --> O[Display: No valid routes available]
O --> P{User Action}
P --> |Adjust Preferences| Q[Modify route settings]
P --> |Change Destination| R[New Search]
P --> |Cancel| G


style A fill:#f44336
style C fill:#f44336
style H fill:#a27a037b
style J fill:#a27a037b
style N fill:#f44336
style O fill:#f44336

```

## 3. Starting and Recording a Ride

### Happy Path Flow 
```mermaid
flowchart
A[Route loaded on map] --> B[Tap Start Ride]
B --> C{Pre-checking the check list?}
C --> |Optional| D[Checklist Screen]
C --> |Skip| E[Active Ride Mode]
D --> |Tire pressure, Lights, Phone Emergency Contacts|E
E --> |Location, Route speed, Time | F[Bottom Controls]
F --> G{User Ride}
G --> |Pause| H[Pause Ride]
G --> |End Ride | J[End Ride Flow]
H --> |Resume| E

style A fill:#3d96d8
style E fill:#3d96d8
style F fill:#3d96d8

```
### A. Log Hazard Subflow 

```mermaid
flowchart
A[Active Ride Mode] --> B[Tap Add Incident]
B --> C[Select incident type]
C --> |Pothole/Road kill/Near miss | D[Auto Capture Location and Time]
D --> E{Add Details?}
E --> |Optional| F[Photo and Notes]
E --> |Skip| G[Save Incident]
F --> G
G --> H[Return to The Ride Mode]

style B fill:#a27a037b
style G fill:#53ad2c


```
### B. Pause ride sub-flow
```mermaid
flowchart
A[Active Ride] --> B[Tap to Pause]
B --> C[GPS Recording Stops]
C --> D[Button to Resume]
D --> E[Tap to Resume]
E --> A


style B fill:#a27a037b
style E fill:#53ad2c
```

### C. End Ride Sub-flow
```mermaid
flowchart
A[Active Ride Mode] --> B[Tap to End the Ride]
B --> C[Confirmation Dialog]
C --> |Distance Duration| D{Continue}
D --> |Keep Riding| A
D --> |End Riding| E{Ride summary}
E --> |Map , Distance Time, Speedavg/Max, Weather, Incident| F[Save Ride]
F --> G{rate the routes?}
G --> |Optional| H{1 - 5 Stars}
G --> |Skip| I{Return to Map}
H --> I

style E fill:#53ad2c
style I fill:#3d96d8
```

### Unhappy path flows 

```mermaid 
flowchart
A[GPS Signal Lost] --> B[Display Warning]
B --> C[Enable Offline Tracking Mode]
C --> D[Use Accelerometer and Last Known Location]
D --> E{Signal Restored?}
E --> |Yes| F[Resume Normal Tracking]
E --> |No| G[Continue Offline with Limited Data]

H[App Crashes Unexpectedly] --> I[Detects Crash on the Next Launch]
I --> J[Ride Recovery Prompt]
J --> K{User Decision}
K --> |Resume| L[Restore Ride State Continue Recording]
K --> |Discard Ride| M[Delete Incomplete Data]
M --> N[Return to Map]

O[Low Battery Duration Ride ] --> P[Display Warning 10% Remaining]
P --> Q{User Action}
Q --> |Continue Ride| R[Reduce GPS Frequency Battery Saver Mode]
Q --> |End Ride Early| S[Save Current Ride]

T[Storage full] --> U[Cannot Save Ride Data]
U --> V[Prompt: Free Space or Skip Save]
V --> W{User Choice}
W --> |Free Spac| X[Retry Save]
W --> |Skip| Y[Lose Ride Data]

style A fill:#f44336
style B fill:#f44336
style G fill:#a27a037b
style H fill:#f44336
style M fill:#f44336
style O fill:#a27a037b
style P fill:#a27a037b
style T fill:#f44336
style U fill:#f44336
style Y fill:#f44336
```

## 4. Emergency SOS 

### Happy path
```mermaid 
flowchart
A[App Navigation] --> B[Tap Emergency Tab]
B --> C[Emergency Screen]
C --> |Large red button list contacts and small cancel button| D[Tap SOS Button]
D --> E[Confirmation Dialog]
E --> |Are You in an Emergency?| F{Confirm?}
F --> |Cancel| C
F --> |Yes , Send Alert| G[Emergency Alert Triggered]
G --> H[Send SMS to All Contacts]
G --> I[Auto Call the Primary Contact]
G --> J[Log Emergency Event]
H --> K[Confirmation Screen]
I --> K
J --> K
K --> |List of Notified Contacts| L{User action}
L --> |Call 112| M[Emergency Alert Triggered]
L --> |I am Safe Now| N[Send Follow-up SMS to Contacts]


style C fill:#a27a037b
style D fill:#f44336
style G fill:#f44336
style M fill:#53ad2c
style N fill:#53ad2c
```

### Unhappy Path Flows

```mermaid
flowchart
A[No Network Signals] --> B[Display No Signal Warning]
B --> C[Queue SMS for Retrying]
C --> D[Prominently Display Call 112 Option]
D --> E{Network Available?}
E --> |yes| F[Send Queued SMS to Contacts]
E --> |No| G[User Must Use Manual Call]

H[No Emergency Contact Configured] --> I[Display Error: No contacts]
I --> J[Show Quick Add Contact Option]
J --> K{User Action}
K --> |Add contact| L[Quick Contact Form]
K --> |Skip| M[Only Show Call 112 Option]
L --> N[Retry Emergency Alert]

O[Accidental SOS trigger] --> P[User Taps Cancel Immediately]
P --> Q[Confirmation Cancel Alert?]
Q --> R{Confirm Cancel?}
R --> |Yes| S[Alert Canclled no Message Sent]
R --> |No| T[Continue with Emergency Alert]

U[SMS Delivery Failed ] --> V[Display Warning]
V --> W[Retry Sending 3 Times ]
W --> X{Success?}
X --> |NO| Y[Log Failure Show Manual Options]
X --> |Yes| Z[Confirm Delivery]

style A fill:#f44336
style B fill:#f44336
style G fill:#f44336
style H fill:#f44336
style I fill:#f44336
style O fill:#a27a037b
style U fill:#f44336
style Y fill:#f44336


```


## 5. Manageing bikes (Garage)

### Happy Path Flow
```mermaid 
flowchart
A[Drawer Menu] --> B[Tap Garage]
B --> C[Garage Screen]
C --> |Bike Cards list Make/Model/Year/Odometer| D{User Action}
D --> |+Add New Bike| E[Add Bike Flow]
D --> |Tap Bike Card| F[View/Edit Bike]

style C fill:#3d96d8
```
### A. Add bike subflow

```mermaid
flowchart 
A[Garage Screen ] --> B[+Add New Bike]
B --> C[Add Bike Form]
C --> |Make, Model, Year, Plate, Odometer, Photo| D[Save Bike]
D --> E[Confirmation Message]
E --> F{Next Action?}
F --> |Log first service| G[Service Log Form]
F --> |Done| H[Return to Garage]
G --> H

style D fill:#53ad2c
style H fill:#3d96d8
```

### B. View/Edit bike sub-flow

```mermaid
flowchart
A[Tap Bike Card] --> B{Bike Detail Screen}
B --> | Photo, Specs, Odometer, Service History| C{User Action}
C --> |Edit Details| D[Edit Form]
C --> |Log Service| E[Service Log Flow]
C --> |Delete Bike| F[Confirm Delete]
D --> B
F --> G[Remove from Garage]

style B fill:#3d96d8
style G fill:#f44336
```

### C. Log service sub-flow
```mermaid
flowchart
A[Bike Detail Screen] --> B[Log Service]
B --> C[Service Form]
C --> |Service Type Data Odomewter| D[Optional Fields]
D --> |Cost, Show notes , Next Service Due| E[Save Servie]
E --> F[Scheule Reminder]
F --> G[Return to Bike Details]

style E fill:#53ad2c
style G fill:#3d96d8

```
### Unhappy Path Flow 

```mermaid
flowchart
A[Invalid Bike Data Entry ] --> B[Display Validation Error]
B --> C[High Light Requird Fields]
C --> D{User Action}
D --> |Fix Error| E[Retry Save]
D --> |Cencle| F[Return to Garage Without Saving]

G[Photo Upload Failed] --> H[Display Error]
H --> I{User Choice}
I --> |Retry Upload| J[Attempt Upload Again]
I --> |Skip Photo| K[Save Bike Without Photo]
I --> |Cancle| F

L[Delete Bike with Ride History] --> M[Warning: The Bike Contain Ride Data]
M --> N{Confirm Delete?}
N --> |Yes| O[Delete Bike Keep Ride History]
N --> |No| P[Cancel Deletion and Return to Details]

Q[Service Due to Data in Past] --> R[Earning : Data Already Passed]
R --> S{User Action}
S --> |Correct Data| T[Update to Future Data]
S --> |Confirm Past Data| U[Save With Over Due Status]

style A fill:#f44336
style B fill:#f44336
style G fill:#f44336
style H fill:#f44336
style L fill:#a27a037b
style M fill:#a27a037b
style Q fill:#a27a037b
style R fill:#a27a037b
```

## 6. Ride history

### Happy path flow
```mermaid
flowchart
A[Drawer Menu] --> B[Tap History]
B --> C[Ride History Screen]
C --> |List - Newest First <br/>Thumbnail<br/>Data/Time/Distance| D{Apply Filter}
D --> |Yes| E[Filter Options]
D --> |No| F[Tap Ride]
E --> |All/Month/Year/Bike| F
F --> G[Ride Detail Screen]
G --> |Full Map/Stats/Weather/Incidents| H{User Action}
H --> |Share Ride| I[Share Options]
H --> |Delete Ride| J[Confirm Delete]
I --> |Image/Social Media/GPX| K[Share Complete]
J --> L[Remove Ride]
K --> G
L --> C

style C fill:#3d96d8
style G fill:#3d96d8
style K fill:#53ad2c

```
### Unhappy path floe

```mermaid 
flowchart
A[No Ride Found] --> B[Display Empty State]
B --> C[Show Prompt 'Start your First Ride']
C --> D{User Action}
D --> |Tap CTA| E[Navigate to Map]
D --> |Close| F[Return to Menu]

G[Share Failed] --> H[Display Error Message]
H --> I[Error Type]
I --> |No Internet| J[Retry When Online]
I --> |File Too Large| L[Compress File and Retry]

M[Delete Ride Confirmation] --> N[Warning: Cannot be Undone]
N --> O{Confirmation?}
O --> |Yes| P[Permenently Delete Ride]
O --> |No| Q[Cancel Deletion Keep Ride]

R[Corrupt Ride Data] --> S[Display Error: Ride Unreadable]
S --> T{User Action}
T --> |Delete Corruptdata| U[Remove Corrupt Ride]
T --> |Repost Issue| V[Send Error Log to Support]
T --> |Cancle| F

style A fill:#a27a037b
style B fill:#a27a037b
style G fill:#f44336
style H fill:#f44336
style M fill:#a27a037b
style R fill:#f44336
style S fill:#f44336

```


## 7. Setting Flow

### Happy path Flow

```mermaid
flowchart
A[Drawer Menu] --> B[Tap Settings]
B --> C[Setting Screen]
C --> D{Select Catagory}

D --> E1[Unit and Display]
E1 --> E2[Distance KM/Miles, Temp: C/F Speed: kmh/mph, Map Style: Dark mode/Light Mode]

D --> F1[Ride Setting]
F1 --> F2[Auto Pause / Pause / Checklist / Voice Guidance / Auto Record Ride]

D --> G1[Privacy]
G1 --> G2[Share Location/ Public Ride/ Emergency Permissions]

D --> H1[Account]
H1 --> H2[Edit Profile/ Change Password/Manage Contacts/ Delete Account]

D --> I1[About]
I1 --> I2[App Version/Privacy Policy and Service/Feedback/Rate App]

E2 --> J[Save Changes]
F2 --> J
G2 --> J
I2 --> K[External Link]


style C fill:#3d96d8
style J fill:#53ad2c
```

### Unhappy Path Flow

```mermaid
flowchart
A[Delete Account/ Request] --> B[Warning: All Data will be Lost]
B --> C[Require Password Confirmation]
C --> D{Verification}
D --> |Wrong Password| E[Error: Invaid Passweord]
E --> F{Retry?}
F --> |Yes| C
F --> |No| G[Cancel Deletion]
D  --> |Correct| H[Final Confirmation]
H --> I{Proceed?}
I --> |Yes| J[Delete Account and All Data]
I --> |No| G
J --> K[Logout and Return to Welcome Screen]

L[Change Password] --> M[Enter Current Password]
M --> N{Current Password Correct?}
N --> |No| O[Error: Wrong Password]
O --> P[Retry or Cancle]
N --> |Yes| Q[Enter New Password]
Q --> R{Passowrd Matches?}
R --> |No| S[Error: Password Dont Match]
S --> Q
R --> |Yes| T[Password Updated]

U[Permission Revoked by User] --> V[Display Impact Warning]
V --> W[Feature Limited or Disabled]
W --> X{User Account}
X --> |Keep Disabled| Z[Continue with Limitation]

style A fill:#a27a037b
style B fill:#a27a037b
style E fill:#f44336
style J fill:#f44336
style O fill:#f44336
style S fill:#f44336
style U fill:#a27a037b
style V fill:#a27a037b
style W fill:#a27a037b
```
