# ♾️ DevOps & CI/CD 

## 📖 Overview

The ObsidianRoutes infrastructure utilizes a lightweight DevOps setup. GitHub and Git are used for version control, GitHub Actions for automated quality gates, and [EAS (Expo Application Services)](https://expo.dev/eas) to handle the heavy lifting of Android builds. EAS is a deeply integrated cloud service for Expo and React Native apps that handles the complex build process in the cloud. By automating quality checks and offloading builds to the cloud, the project enables deployment with minimal manual intervention.

## 🪾 1. Source Control & Branching

The project utilizes [GitHub](https://github.com/) for version control, following a structured branching strategy to ensure stability:

* **`master`**: Contains production-ready code. Direct pushes are restricted.
* **`feature/*`**: Dedicated branches for new development (e.g., `feature/weather-overlay`).

## ֎ 2. GitHub Actions

CI/CD pipelines are orchestrated with `github actions` enforcing quality standards and handling deployments.

| Pipeline | Trigger | Tasks | Result  |
| :--------| :------ | :---- | :------ |
| **PR Quality Check** | Pull Request to `master` | Runs `ESLint`, `Prettier`, `Jest unit tests` and typescript `type-check`. | Validates code quality before merging. |
| **Android Deployment** | Push to `master` | Triggers a production build via [Expo Application Services (EAS)](https://expo.dev/eas). | Generates an `.apk` available in the Expo Dashboard. |


## 📈 3. Monitoring & Error Tracking
[Sentry](https://sentry.io/) is integrated into the React Native application to provide performance and error metrics. Examples include:
* Capturing and reporting unhandled JavaScript errors and native-level crashes (e.g., Mapbox failures).
* Tracking screen load times and network latency to identify UI bottlenecks.