🌌 AnimeHub
AnimeHub is a robust, full-stack MERN application designed for anime enthusiasts to discover, search, and manage a personalized collection of series. The platform features a secure, role-based architecture that allows standard users to engage through social features while granting administrators exclusive tools for content management and community moderation.

🚀 Key Features
Secure Authentication: Implementation of JWT-based authentication with Bcrypt password hashing for secure session management.

Dynamic Discovery: Real-time search and multi-parameter filtering using MongoDB aggregation for optimized data retrieval.

Social Interactions: Atomic "Like" system and a hierarchical comment section featuring administrative "pinning" capabilities.

Role-Based Access Control (RBAC): Distinct permissions for user and admin roles protected via custom server-side middleware (protect and adminOnly).

Asset Management: Automated image processing and storage for anime covers utilizing Multer and Express static routing.

🛠️ Technical Stack
Frontend: React (Vite), Tailwind CSS, Lucide-react components.

Backend: Node.js, Express.js RESTful API.

Database: MongoDB with Mongoose ODM for schema validation and data population.

Security: JSON Web Tokens (JWT) for stateless authentication.
