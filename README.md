# 🌿 **Strathmore University Mental Health Club Website**

A vibrant, interactive, and community-driven platform designed to promote **mental wellness**, **awareness**, and **connection** within **Strathmore University**.
Built with modern technologies to make mental health resources, events, and updates easily accessible to all students. 💚

---

## 🌐 **Live Site**

🔗 [https://su-mental-health-club.vercel.app](https://su-mental-health-club.vercel.app)

---

## ⚙️ **Tech Stack**

| Layer                       | Technologies Used                           |
| --------------------------- | ------------------------------------------- |
| **Frontend**                | ⚛️ Next.js (React) + 💨 TailwindCSS         |
| **Backend / Database**      | 🧩 Supabase (PostgreSQL + Auth + Storage)   |
| **Version Control**         | 🐙 GitHub                                   |
| **Deployment**              | ▲ Vercel                                    |
| **Development Environment** | 💻 Visual Studio Code                       |

---

## 🚀 **Core Features**

### 🧠 Mental Health Awareness

* Dynamic monthly awareness banner highlighting key mental health themes (e.g. *Suicide Prevention Month*, *Mindfulness May*).
* Easily updateable by admins via the dashboard.

### 🗓️ Events & Activities

* View upcoming and past events organized by the Mental Health Club.
* Each event includes details such as description, date, and imagery.
* Full **CRUD functionality** — admins can **Create, Read, Update, and Delete** events in real-time.

### 🖼️ Gallery Page

* Dedicated gallery section showcasing photos from various club events and initiatives.
* Click on an event to open a full photo grid of that event with captions/descriptions under each image.
* Fully manageable via admin dashboard (add or remove images easily).

### 📚 Resources & Articles

* Curated resources including articles, podcasts, and self-help materials.
* Filtered under different categories for easier exploration.
* Icons and visuals to make navigation engaging and intuitive.

### 👥 Council Members

* “Meet the Council” section showcasing the current Mental Health Club leadership team.
* Admins can update member profiles, images, and positions effortlessly.

### 🔒 Admin Dashboard

* Secure Supabase-authenticated login (restricted to **2 admins maximum**).
* Real-time synchronization with Supabase backend.
* Full CRUD control over Events, Resources, Council Members, Quotes, and Gallery items.
* Integrated “Forgot Password” flow with reset email feature for security.

---

## 🧩 **Recent Improvements**

✅ Added **Gallery Page** with per-event photo grids.
✅ Implemented **Row-Level Security (RLS)** and Supabase policies for safe CRUD operations.
✅ Limited admin access to only **two active accounts** at any time for security.
✅ Added **Forgot Password modal** triggered after one failed login attempt.
✅ Integrated **real-time database updates** through Supabase for all admin edits.
✅ Improved visual consistency with Strathmore University colors (🎓 navy blue, crimson red, and white).
✅ Enhanced mobile responsiveness and performance.

---

## 🔐 **Security Highlights**

* Supabase authentication and storage policies enforce controlled access.
* Admin dashboard locked behind secure login and real-time auth verification.
* Password reset flow ensures unique credentials and automatic session invalidation.
* Maximum 2-admin rule protects from unauthorized multi-admin control.

---

## 🌍 **Deployment & Version Control**

* Hosted on **Vercel**, automatically deploying every time new changes are pushed to GitHub.
* Continuous Integration (CI/CD) ensures new features and fixes go live instantly.
* Connected to Supabase for database, storage, and authentication management.

---

## 🎯 **Future Enhancements**

* 📱 Development of a **mobile app version** for better accessibility on the go.
* 💬 Integration of an **anonymous peer-support chat system** for confidential communication.
* 🧾 Advanced **analytics dashboard** for tracking engagement and awareness reach.
* 🌱 Expansion to other Strathmore student clubs for mental wellness collaboration.

---

## 💡 **Project Vision**

To make Strathmore University a leading example of mental health awareness and digital support in African universities — where every student feels heard, supported, and empowered. 🌈

---

## 🔗 **Access the Platform**

👉 [**Visit the Live Site**](https://su-mental-health-club.vercel.app)
Created by the **Strathmore University Mental Health Club Development Team** 💚


