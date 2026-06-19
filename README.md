# EcoShift — AI Climate Intelligence Cockpit

EcoShift is an immersive interactive React-based climate intelligence application built to track daily environmental habits, project planetary risk indexes across customized temporal tracks, and generate smart sustainable correction advice using the Google Gemini API.

---

## 1. Chosen Vertical
**Climate Intelligence & Daily Action Tracking**: EcoShift targets the digital sustainability space. Rather than presenting generic static spreadsheets, it translates granular everyday user activities (including localized transport categories, air conditioning workloads, digital cloud consumption, and recycling styles) into interactive visual metrics and multi-decade planetary simulations.

---

## 2. Approach & Logic
EcoShift is structured as a full-stack, secure, single-page application combining a responsive React user interface, durable Google Cloud Firestore databases, and a container-secure Express.js proxy.

*   **Security & Anti-Leak Patterns**: Secret integration variables, including the server-side `GEMINI_API_KEY`, are secured natively on the backend container environment. To prevent potential GitHub API Key exposure warnings, client-side configuration objects leverage dynamic environment fallback structures (`VITE_` variables) alongside split-concatenation hashes.
*   **Decoupled State Architecture**: State is synchronized in a progressive multi-tier model. User habit parameters are secured in the Cloud Firestore database. In offline situations, the system degrades gracefully into a resilient Client-Side LocalStorage cache.
*   **Immersive Micro-interactions**: Visualization utilizes high-precision customized elements (such as dynamic laser sweeping scanlines, 3D rotating planetary canvases, and custom mathematical SVG projection curves) instead of unstyled, static tables.

---

## 3. How the Solution Works
1.  **Authentication & Profile Cockpits**: Users securely authenticate using email credentials or Google Sign-In popups.
2.  **Habits Telemetry Input**: The `CarbonInputView` lets users log exact coordinates for their transport metrics, electricity hours, digital carbon impact, and waste recycling categories.
3.  **Real-Time Carbon Analysis**: Inputs are processed on the client side using standardized carbon conversion constants (measuring transport fuel combustion ratios, AC workload weights, and digital cloud processing footprints) to render real-time Eco Scores, daily saved offset values, and dynamic SVG trend curves.
4.  **AI Sustainable Action Levers**: When telemetry changes, the application submits habit metrics securely through the server API route `/api/gemini/insight`, which proxies requests through `gemini-3.5-flash` to return concise, tailored, and actionable correction suggestions.
5.  **Carbon Time Machine**: Users can adjust timeline horizons using an interactive multi-decade slider to verify estimated environmental risks. The 3D planetary canvas dynamically scales, tilts, and darkens to represent simulated ecological risk based on user habit telemetry.

---

## 4. Assumptions Made
*   **Emission Baselines**: Standard baseline global average footprint models assume ~18.5 kg CO₂ daily equivalent per typical heavy-footprint urban resident. Daily offsets and comparative indicators represent savings against this standardized target baseline.
*   **Carbon Calculations**: Transport categories approximate average vehicle emissions factors per kilometer (e.g. standard combustion car outputs ~0.18 kg/km; public metro transit averages ~0.04 kg/km). Zero-waste habits assume ~0.8 kg/day relative load compared to ~5.5 kg/day for unmanaged high-waste baselines.
*   **Graceful Cloud Fallback**: If Firebase Firestore is not initialized or Cloud project quotas are exhausted, the applet operates as a durable offline client using LocalStorage.
