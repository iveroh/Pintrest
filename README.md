# Pintrest 🍺

> A social media platform for sharing and celebrating your drinking sessions with friends.

**Pintrest** (pronounced *pint-rest*) is a full-stack social media application where users can share their drinking experiences, interact with posts, and build a community around social drinking culture.

Check out our application by clicking the link below! You can create your own profile or try out our test user by logging in with:
```bash
username:
password:
```
[![Live Demo](https://img.shields.io/badge/demo-live-green)](http://it2810-12.idi.ntnu.no/project2)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Sustainable Development](#sustainable-development)
- [Testing](#testing)
- [AI Usage](#ai-usage)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

---

## ✨ Features

### Current Features
- ✅ Create posts with images, descriptions, and pint counts
- ✅ Like and comment on posts
- ✅ User authentication and authorization with JWT
- ✅ User profiles with statistics and customizable avatars/banners
- ✅ Sort and filter posts by date and popularity
- ✅ Responsive design for mobile and desktop
- ✅ Image upload and management via Cloudinary
- ✅ Follower system - follow and unfollow other users
- ✅ Achievement badges based on activity
- ✅ Infinite scroll for posts
- ✅ Search functionality for posts
- ✅ Image cropping for avatars, banners, and post images
- ✅ Edit and delete posts
- ✅ User statistics (followers, posts, likes, pints consumed)
- ✅ Separate home feed for followed users vs. explore page

![Homepage](images/Screenshot%202025-11-21%20215547.png)
![Explorepage](images/Screenshot%202025-11-21%20215654.png)
![ExploreCard](images/Screenshot%202025-11-21%20215709.png)
![ProfilePage](images/Screenshot%202025-11-21%20215739.png)
![PostPint](images/Screenshot%202025-11-21%20215751.png)
![MobileComments](images/Screenshot%202025-11-21%20215826.png)
![MobileExplore](images/Screenshot%202025-11-21%20215836.png)

---

## 🛠 Tech Stack

### Backend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime environment
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Apollo Server](https://www.apollographql.com/docs/apollo-server/)** - GraphQL server framework
- **[GraphQL](https://graphql.org/)** - API query language
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Password hashing
- **[JWT](https://jwt.io/)** - Authentication tokens
- **[Cloudinary](https://cloudinary.com/)** - Cloud-based image storage and management

### Frontend
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Apollo Client](https://www.apollographql.com/docs/react/)** - GraphQL client
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Prebuilt React components
- **[React Router](https://reactrouter.com/)** - Client-side routing
- **[React Hook Form](https://react-hook-form.com/)** - Form validation
- **[Zod](https://zod.dev/)** - Schema validation
- **[React Image Crop](https://www.npmjs.com/package/react-image-crop)** - Image cropping functionality
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwrigt](https://playwright.dev/)** - Playwright end-2-end testing

### Development Tools
- **[GraphQL Code Generator](https://the-guild.dev/graphql/codegen)** - Automated TypeScript type generation from GraphQL schema
- **[ESLint](https://eslint.org/)** - Code linting
- **[tsx](https://github.com/privatenumber/tsx)** - TypeScript execution for development

---

## 🏗 Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

```
┌─────────────────┐      GraphQL/HTTP      ┌─────────────────┐
│                 │ ◄──────────────────────► │                 │
│    Frontend     │                          │     Backend     │
│  (React/Vite)   │                          │  (Apollo/Node)  │
│                 │                          │                 │
└─────────────────┘                          └────────┬────────┘
                                                      │
                                                      │ Prisma ORM
                                                      │
                                             ┌────────▼────────┐
                                             │                 │
                                             │   PostgreSQL    │
                                             │                 │
                                             └─────────────────┘
                                                      │
                                             ┌────────▼────────┐
                                             │   Cloudinary    │
                                             │ (Image Storage) │
                                             └─────────────────┘
```

### Backend (`/backend`)

The backend uses a modular GraphQL architecture with domain-driven design:

- **`/prisma/schema.prisma`** - Database schema with models:
  - `Users` - User accounts with authentication
  - `PintPosts` - User posts with images and pint counts
  - `Likes` - Post likes with composite primary key
  - `Comments` - Post comments
  - `Follower` - User follow relationships

- **`/prisma/migrations`** - Migration history tracking database changes

- **`/src/graphql/`** - Modular GraphQL implementation:
  - **`index.ts`** - Merges all type definitions and resolvers
  - **`user/`** - User queries, mutations, and authentication
  - **`pintpost/`** - Post CRUD operations with pagination
  - **`comment/`** - Comment management
  - **`like/`** - Like functionality
  - **`follower/`** - Follow/unfollow operations
  - **`image/`** - Cloudinary image upload/delete

- **`/src/index.ts`** - Apollo Server setup with JWT authentication context
- **`/src/database.ts`** - Prisma client configuration
- **`/src/cloudinary.ts`** - Cloudinary SDK configuration

**Data Flow:**
1. Frontend sends GraphQL query/mutation via Apollo Client
2. Apollo Server validates JWT token and adds user to context
3. Request is routed to appropriate resolver based on operation
4. Resolver uses Prisma to interact with PostgreSQL database
5. Images are uploaded/deleted via Cloudinary SDK when needed
6. Data is returned through resolver → Apollo Server → Apollo Client → React component

### Frontend (`/frontend`)

The frontend provides a responsive user interface with modern React patterns:

- **`/src/pages/`** - Page components:
  - `Home/` - Main feed with infinite scroll and sorting
  - `Profile/` - User profiles with posts and statistics
  - `Explore/` - Grid view of all posts with modal preview
  - `Signin/` & `Signup/` - Authentication pages

- **`/src/components/`** - Reusable React components:
  - `PostCard.tsx` / `ExploreCard.tsx` - Post rendering and detail modal
  - `PostForm.tsx` / `EditForm.tsx` - Create and edit posts with image upload/cropping
  - `Comment/` - Comment display and form
  - `BeerCount.tsx` - Pint counter
  - `Navbar/` - Responsive navigation
  - `ui/` - Shadcn-based primitives (button, form, dropdown, etc.)

- **`/src/graphql/`** - GraphQL operations:
  - `generated.ts` - Auto-generated TypeScript types from schema
  - Queries and mutations for all operations

- **`/src/context/`** - React context providers:
  - `authContext.tsx` - Authentication state management

- **`/src/hooks/`** - Custom React hooks:
  - `useFetchPosts.ts` - Post fetching with pagination, sorting, search
  - `useInfiniteScroll.ts` - IntersectionObserver-based pagination
  - `useGetUser.ts`, `useFollowing.ts`, `useLike.ts`, `useComments.ts`, `useImageUpload.ts`, `useHandleImageUpload.ts`, `useSmartNavigation.ts`, `useResponsiveSize.ts`

- **`/src/lib/`** - Utility functions:
  - `apolloClient.ts` - Apollo Client configuration with auth headers
  - `utils.ts` - Helper functions

- **`/src/types/`** - TypeScript type definitions

**Styling Approach:**
- Tailwind CSS for utility-first styling
- CSS variables for theming (colors, spacing, borders)
- Shadcn components built on Radix UI primitives
- Responsive design with mobile-first approach

---

## 📁 Project Structure

```
T12-Project-2/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Migration history
│   ├── src/
│   │   ├── index.ts               # Server entry point
│   │   ├── database.ts            # Prisma client
│   │   ├── cloudinary.ts          # Cloudinary config
│   │   └── graphql/               # GraphQL modules (user, pintpost, comment, like, follower, image)
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/                # Page components
│   │   │   ├── Home/
│   │   │   ├── Profile/
│   │   │   ├── Explore/
│   │   │   ├── Signin/
│   │   │   └── Signup/
│   │   ├── components/           # Reusable components
│   │   │   ├── PostCard.tsx, ExploreCard.tsx, BeerCount.tsx
│   │   │   ├── PostForm.tsx, EditForm.tsx, PostCropImage.tsx
│   │   │   ├── Comment/
│   │   │   ├── Navbar/
│   │   │   └── ui/               # Shadcn components
│   │   ├── graphql/              # GraphQL operations
│   │   │   └── generated.ts      # Auto-generated types
│   │   ├── context/              # React contexts
│   │   │   └── authContext.tsx
│   │   ├── hooks/                # Custom hooks
│   │   ├── lib/                  # Utilities
│   │   │   ├── apolloClient.ts
│   │   │   └── utils.ts
│   │   ├── tests/                # Vitest unit tests
│   │   └── types/                # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   ├── codegen.yaml              # GraphQL code generation
│   └── tailwind.config.ts
└── README.md
```
---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Environment Variables

You must add .env files in both backend and frontend directories and copy the following:

#### Backend (`.env` in `/backend`)
```env
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_SIGNED_UPLOAD_PRESET=
BACKEND_BASE_PATH=
NODE_ENV=
```

#### Frontend (`.env` in `/frontend`)
```env

VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_GRAPHQL_URI=
VITE_CLOUDINARY_NAME=
VITE_CLOUDINARY_PRESET=
VITE_PUBLIC_BASE_PATH=
```

### Installation And Running The Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd T12-Project-2
   ```
1. **Start Project**
   ```bash
    npm run start-project
   ```
   This will run
    ```bash
   npm install
   npm run dev
   ``` 
   in frontend and backend directories
   

### Development

You can also run frontend and backend separately like this:

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend/GraphQL: `http://localhost:4000/graphql`


### Live Demo

The application is deployed on the NTNU network and accessible at:

**http://it2810-12.idi.ntnu.no/project2**

> ⚠️ **Note:** You must be connected to the NTNU network to access the live demo.

---

## 🌱 Sustainable Development

Our project follows sustainable development practices to ensure maintainability, scalability, and environmental responsibility:

### Code Quality & Maintainability
- **TypeScript** throughout the stack ensures type safety and reduces runtime errors
- **Modular architecture** with separated concerns (GraphQL modules, React components)
- **GraphQL Code Generator** automatically generates types, reducing manual work and errors
- **Consistent code style** enforced through ESLint configuration
- **Reusable components** to avoid code duplication and improve maintainability

### Performance Optimization
- **Infinite scroll pagination** reduces initial load time and data transfer
- **Image optimization** via Cloudinary (automatic format conversion, lazy loading)
- **Efficient database queries** using Prisma ORM with query optimization
- **Client-side caching** with Apollo Client to minimize unnecessary API calls
- **Vite build tool** for fast development and optimized production builds

### Resource Efficiency
- **Cloud-based image storage** (Cloudinary) eliminates need for local image processing
- **JWT authentication** reduces database queries for session management
- **Cursor-based pagination** for efficient large dataset handling
- **Lazy loading** of images and components to reduce bandwidth usage

### Scalability & Flexibility
- **PostgreSQL database** with proper indexing for horizontal scaling capability
- **Stateless backend** design allows for easy load balancing
- **Environment-based configuration** for different deployment environments
- **Migration system** (Prisma) ensures safe database schema evolution

### Development Practices
- **Version control** (Git) for collaborative development and change tracking
- **Environment variables** for secure credential management
- **Separate development/production environments** to prevent production issues
- **Testing setup** (Vitest) for frontend component testing and playwright for end-2-end testing

---



## 🧪 Testing (`/testing`)

We use Vitest for fast unit and integration tests of our React/logic code. Playwright handles our end-to-end browser tests to verify real user flows work as expected.

### Unit testing (Vitest)

We keep focused unit/integration coverage in `frontend/src/tests` (Vitest + Testing Library). Current highlights:
- Components: `BeerCount`, `FilteringDropdown`, `PostForm`, `CommentForm` (form validation, interactions, dropdown behavior).
- Hooks: `useLike`, `useInfiniteScroll`, `useResponsiveSize`, `useFollowing`.
- Context/logic: `authContext` provider, badge logic in `lib/badges`.

How to run (frontend):
```bash
cd frontend
npm test          # runs vitest, excludes e2e specs
npm test:watch    # watch mode
npm test:ui       # Vitest UI
```

Notes:
- Tests rely on jsdom and mock Apollo clients; no backend is required.
- Some browser APIs (e.g., `IntersectionObserver`, `ResizeObserver`) are mocked inside the tests.
- Image imports are stubbed in `src/tests/vitest.setup.ts` so asset files aren’t needed.

### End-2-end testing (Playwright)

The end to end test cover the following user flows.

- #### Running the end-2-end test
```
cd frontend
npm run test:e2e
```

- #### Authentication
  - Sign Up - Happy path
  - Sign Up - Failure Scenario
   - Sign In - Happy path
  - Sign In - Failure Scenario
- #### Posts
  - Create Post - Happy Path
  - Create Post - Failure Scenario
  - Delete Post - Happy Path
  - Delete Post - Failure Scenario
  - Edit Post - Happy Path
- #### Interactions 
  - Like Post - Happy Path
  - Comment - Happy Path
  - Comment - Failure Scenarios
- #### Navigator
  - Simple navigator test to ensure setup works
---

## 🤖 AI Usage

Throughout the development of Pintrest, we leveraged AI tools to enhance productivity and code quality:

### Development Assistance
- **GitHub Copilot** - Used for:
  - Generating boilerplate code for GraphQL resolvers and type definitions
  - Creating React component structures and hooks
  - Writing TypeScript type definitions and interfaces
  - Auto-completing repetitive code patterns

- **ChatGPT/Claude** - Used for:
  - Understanding GraphQL best practices and patterns
  - Researching Prisma ORM capabilities and query optimization
  - Explaining React hooks and state management patterns

### Research & Problem Solving
- **Documentation Navigation** - AI assisted in finding relevant documentation sections for:
  - Apollo Server context configuration with JWT
  - Tailwind CSS responsive design patterns
  - Cloudinary API integration

- **Architecture Decisions** - AI helped evaluate trade-offs such as:
  - JWT vs session-based authentication
  - Cursor vs offset-based pagination
  - Component composition patterns
  - State management approaches (Context API vs external libraries)

### Limitations & Human Oversight
While AI tools were valuable, all code was:
- **Reviewed and tested** by team members before merging
- **Adapted** to fit our specific project requirements
- **Debugged manually** when AI suggestions didn't work as expected
- **Refactored** based on team coding standards and best practices

AI served as a productivity multiplier, but critical thinking and domain knowledge remained essential for Pinterest

---


## 🤝 Contributing

This is an academic project for IT2810 at NTNU. Contributions are limited to team members.

---

## 👥 Team

IT2810 - Group 12
- [@iveroh](https://www.github.com/iveroh)
- [@Dasar0410](https://www.github.com/Dasar0410)
- [@mnemarius](https://www.github.com/mnemarius)
- [@Andrej-52](https://www.github.com/Andrej-52)

---
**Made with ☕ and 🍺 by IT2810 Group 12**
