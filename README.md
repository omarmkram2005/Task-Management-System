# 📝 Task Management System

A full-stack **task management application** built with **React + Vite** and **Supabase**, designed for individuals and teams to organize tasks, collaborate, and manage projects efficiently.

---
## Live Demo: https://task-management-sy.netlify.app/

## 🚀 Features

### Authentication & Authorization
- Sign up / Log in with Email (with verification)
- Google login support
- Role-based permissions: **Admin / Member**

### User Profile Management
- Update profile info (name & avatar)

### Teams & Collaboration
- Create or join teams
- Admins can update member roles or remove members
- Role-based access:
  - **Admin/Creator:** Can edit/delete team boards & tasks
  - **Member:** Can create tasks but cannot modify others' work

### Boards & Tasks
- Team boards & tasks visible to all team members
- Personal boards & tasks for private work
- Drag & Drop for easy task management

### UI/UX Enhancements
- Light/Dark mode
- Multi-language support: Arabic / English
- Responsive design

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, Context API
- **Backend:** Supabase (PostgreSQL, Auth, Storage, API)
- **Other Tools:** hello-pangea/dnd, React Router, Axios

---

## 👤 User Roles & Permissions

| Role      | Edit/Delete Team Boards | Create Tasks | Edit/Delete Tasks | Manage Members |
|-----------|------------------------|--------------|-----------------|----------------|
| Admin     | ✅                     | ✅           | ✅               | ✅              |
| Member    | ❌                     | ✅           | ❌               | ❌              |

---

## 🌐 Multi-Language Support
- English
- Arabic

---

## 🎨 Theme
- Light Mode
- Dark Mode

---

## ⚙️ Installation & Setup

1. Clone the repository
``` bush
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
```
2.Install dependencies:
```bush
npm install
```
3.Setup environment variables:
```bush
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
4.Start the development server:
```bush
npm run dev
```


