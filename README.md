# PageVoyage: New Era University Visitor Management System

PageVoyage is the official institutional visitor management and activity tracking platform for **New Era University (NEU)**. Designed to streamline campus traffic and provide administrative oversight, it leverages real-time synchronization and Generative AI to manage facility visits across the campus.

## 🚀 Key Features

### 🏢 Institutional Branding & Culture
*   **NEU VMGO Integration**: The landing page prominently features the university's Vision, Mission, Goals, and Objectives, reinforcing the Christian culture of excellence.
*   **Institutional Access**: Secure login restricted to `@neu.edu.ph` email addresses.

### ⏱️ Real-Time Visitor Tracking
*   **Live Check-in**: Automated timestamping for visits to key facilities like the University Library and the Dean's Office.
*   **Active Sessions Dashboard**: Real-time monitoring of currently logged-in users across campus terminals and mobile devices.
*   **Live Activity Log**: Instant updates to the admin console whenever a visitor checks in, complete with status management (Waiting, In-Meeting, Completed).

### 📊 Advanced Analytics & Filtering
*   **Granular Filtering**: Ability to filter visitor data by College Department (CAS, CBA, CCMS, etc.), Visitor Type (Student, Teacher, Staff), and Facility.
*   **Full-Text Search**: Quickly find records based on visitor names or specific reasons for visiting.

### 🤖 AI-Powered Insights (Genkit)
*   **Operational Summaries**: Automated AI generation of visitor activity reports for daily or weekly review.
*   **Trend Analysis**: AI identifies emerging patterns, such as departmental spikes or peak visiting hours, providing actionable recommendations for resource allocation.

### 🔐 Role-Based Access Control (RBAC)
*   **Automatic Admin Assignment**: Specialized access for designated institutional administrators.
*   **Visitor Privacy**: Secure, owner-based access to personal check-in records.

## 🛠️ Technical Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
*   **Backend**: [Firebase](https://firebase.google.com/) (Authentication, Cloud Firestore)
*   **AI Engine**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with Gemini 2.5 Flash
*   **Icons**: [Lucide React](https://lucide.dev/)

## 📖 Getting Started

1.  **Login**: Use your institutional `@neu.edu.ph` email.
2.  **Check-in**: Select your destination facility and fill out the automated form.
3.  **Admin Access**: Authorized administrators can access the "Admin Console" to monitor live traffic and generate AI reports.

---
© 2025 New Era University. All rights reserved.