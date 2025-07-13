# Second Hand Market App (Frontend)

This is a frontend project built with **Vite + React + TypeScript**.  
It includes user authentication pages, Zustand global store, and Ant Design UI components.

---

## Project Structure

```
src/
├── components/               # Reusable UI components 
│   └── AuthForm.tsx          # Login/Register form 
│   └── Layout.tsx            # Common layout with nav 
│
├── pages/                    # Route pages 
│   ├── Login.tsx             # Login page 
│   ├── Register.tsx          # Register page 
│   └── Profile.tsx           # User profile page 
│
├── services/                 # API requests 
│   └── authApi.ts            # Auth related API 
│
├── store/                    # Global state management 
│   └── auth.ts               # Auth store using Zustand 
│
├── utils/                    # Utility helpers 
│   └── api.ts                # Axios instance with token 
│
├── App.tsx                   # Root app with routing 
├── main.tsx                  # React app mount point React 
└── index.html                # HTML entry for Vite Vite 
```

---

## Features

- User Login / Register 
- Zustand global state (to manage user authentication state)
- Ant Design UI form and layout (for polished interface)
- React Router (for navigation and routing)
- Axios + Token (auto-attachment in requests)
- Built with Vite (for fast development)

---

## Getting Started 

### 1. Install dependencies 

```bash
npm install
```

### 2. Start development server 

```bash
npm run dev
```

### 3. Visit the app

Open in browser:  
http://localhost:5173/login

Can visit the following web pages:

- `/login` – Login page   
- `/register` – Register page 
- `/profile` – User profile page (login first)

---

## Backend Integration 

Currently, the API requests (`/auth/login`, `/auth/register`) are **mocked or expected to be implemented by backend**.  

You should provide backend endpoints that return `{ token, user }`:

- `POST /auth/login`
- `POST /auth/register`

---

## Tech Stack 

- [Vite](https://vitejs.dev/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Ant Design](https://ant.design/)
- [React Router](https://reactrouter.com/)

---

## Notes

- The frontend is fully functional with routing and state.
- User info and token are stored in Zustand and localStorage.
- Axios automatically attaches the token to each request.

---

## Author / Contributor

**Name**: Shuwen Luo 
**Role**: Frontend Developer  
**Responsibilities**:
- Completed user authentication module (`/login`, `/register`, `/profile`)
- Designed and implemented Zustand-based auth store
- Configured project structure, routing (`App.tsx`, `Layout.tsx`)
- Integrated Ant Design UI for forms and layout
- Setup API handling (`axios` instance with token support)
- Project launch and Vite environment configuration

