# Renta - Full-Stack Property Management Platform

Renta is a comprehensive web application built with the PERN stack (PostgreSQL, Express, React, Node.js) designed to streamline operations for property managers and enhance the living experience for residents. It provides a dual-interface portal for managing properties, tenants, payments, and maintenance, while offering residents a seamless way to pay rent, submit requests, and stay connected with their community.

## Project Background

> **Note:** This project began as a group capstone at Fullstack Academy. I contributed heavily to the original team effort, building out key features on both the frontend and backend. My work included the resident and manager dashboards, Stripe payment integration, and the file upload system using Multer and Cloudinary.  
>  
> After graduation, I created this solo repo to refactor the codebase, make the app mobile responsive, improve accessibility, and polish the user experience for professional portfolio use.

**Live Demo:** [**https://cozy-melba-1a313f.netlify.app/**](https://cozy-melba-1a313f.netlify.app/)

<!-- prettier-ignore-start -->
| Manager View | Resident View |
| :---: | :---: |
| ![Manager Dashboard](https://raw.githubusercontent.com/sudosu-dev/property_management_portfolio/main/docs/images/manager-dashboard.png) | ![Resident Dashboard](https://raw.githubusercontent.com/sudosu-dev/property_management_portfolio/main/docs/images/resident-dashboard.png) |
<!-- prettier-ignore-end -->

## Key Features

### For Residents:

- **Secure User Authentication**: Safe login and registration system.
- **Resident Dashboard**: A central hub for a quick overview of account status and recent activity.
- **Online Payments**: Securely pay rent and other charges using Stripe.
- **Full Account Ledger**: View a complete history of all charges and payments.
- **Maintenance Requests**: Submit new maintenance requests with descriptions and photo uploads, and view the status of existing requests.
- **Community Announcements**: Stay informed with a community board for posts from management and other residents.

### For Property Managers:

- **Manager Dashboard**: An at-a-glance view of key metrics like occupancy rate, outstanding balances, and open maintenance tickets.
- **Property & Unit Management**: Full CRUD (Create, Read, Update, Delete) functionality for properties and individual units.
- **User & Tenant Management**: Onboard new users, manage resident information, and assign tenants to units.
- **Financial Management**:
  - View aggregated tenant balances.
  - Manually add charges (e.g., late fees, damages) to tenant ledgers.
  - Record offline payments (check, cash).
  - View detailed transaction history for any tenant.
- **Utility Billing System**:
  - Set property-wide utility rates (water, electric, gas).
  - Enter monthly usage readings for each unit to automatically calculate and post utility bills to tenant ledgers.
- **Maintenance Management**: View, track, update, and mark maintenance requests as complete.
- **Announcement Control**: Create, edit, and manage all community announcements, including a review/approval system for tenant-submitted posts.

---

## Technology Stack

This project is a full-stack application utilizing a modern, robust technology stack.

| Area                | Technology                                        |
| :------------------ | :------------------------------------------------ |
| **Frontend**        | React, React Router, Vite, CSS Modules, Stripe.js |
| **Backend**         | Node.js, Express.js                               |
| **Database**        | PostgreSQL                                        |
| **Authentication**  | JWT (JSON Web Tokens), bcrypt                     |
| **File Storage**    | Cloudinary (for maintenance photos)               |
| **Payments**        | Stripe API                                        |
| **Scheduled Tasks** | node-cron (for automated monthly rent charges)    |

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm
- PostgreSQL

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone [https://github.com/sudosu-dev/property_management_portfolio](https://github.com/sudosu-dev/property_management_portfolio)
    cd your-repo-name
    ```

2.  **Backend Setup:**

    ```sh
    cd backend
    npm install
    ```

    - Create a PostgreSQL database.
    - Create a `.env` file in the `/backend` directory and add the following environment variables:

      ```env
      # Database
      DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME

      # Authentication
      JWT_SECRET=your_super_secret_jwt_key

      # Stripe
      STRIPE_SECRET_KEY=sk_test_...
      STRIPE_WEBHOOK_SECRET=whsec_...

      # Cloudinary (for file uploads)
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret

      # CORS
      CORS_ORIGIN=http://localhost:5173
      ```

    - Run the database schema and seed scripts:
      ```sh
      npm run db:build
      ```

3.  **Frontend Setup:**

    ```sh
    cd ../frontend
    npm install
    ```

    - Create a `.env` file in the `/frontend` directory:
      ```env
      VITE_API_URL=http://localhost:8000
      VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
      ```

4.  **Run the Application:**
    - Start the backend server (from the `/backend` directory):
      ```sh
      npm run server:dev
      ```
    - Start the frontend development server (from the `/frontend` directory):
      ```sh
      npm run dev
      ```
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Accounts

Use the following credentials to explore the application's features from different perspectives. The demo data is reset automatically upon login to ensure a consistent experience.

- **Manager Account:**

  - **Username:** `manager1`
  - **Password:** `password1`

- **Resident Account:**
  - **Username:** `user1`
  - **Password:** `password1`

---

## Project Roadmap & Future Improvements

While the application is fully functional, I have identified several areas for future enhancement:

- **Performance Optimization**: Refactor CSS to use a centralized utility class system, reducing redundant code and improving initial page load times.
- **Partial Payments**: Implement functionality to allow residents to pay a portion of their outstanding balance.
- **Enhanced User Feedback**: Improve UI/UX by providing clearer, more consistent feedback for actions like failed logins or form submissions.
- **Password Visibility Toggle**: Add a "show/hide" toggle to password fields to improve user experience during login and registration.

---

## Contact

Your Name – [matthewsharp.developer@gmail.com](mailto:matthewsharp.developer@gmail.com)

Project Link: [https://github.com/sudosu-dev/property_management_portfolio](https://github.com/sudosu-dev/property_management_portfolio)
