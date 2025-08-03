
# Zadaci

Zadaci is a powerful and collaborative task management platform designed for modern teams. It allows you to organize projects, assign tasks, manage subtasks, and collaborate efficiently with your team.

## 🌟 Features

- 🗂 **Projects**: Organize tasks within specific projects for better focus.
- ✅ **Tasks & Subtasks**: Create, assign, and manage tasks with support for nested subtasks.
- 👥 **Teams**: Collaborate with team members with role-based access and permissions.
- 🔐 **Authentication**: Google OAuth and secure session-based login.
- 📁 **File Uploads**: Powered by Cloudinary for media management.
- 📬 **Email Notifications**: Send automated emails when tasks are completed or updated.
- 🌐 **Responsive Design**: Works great across desktops and mobile devices.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Crow-Studio/zadaci.git
cd zadaci
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and copy the following content:

```env
NUXT_PUBLIC_SITE_URL="http://localhost:3001"
NUXT_PUBLIC_SITE_NAME="Zadaci"
NITRO_PORT=3001

NUXT_SESSION_PASSWORD="your-secure-session-password"
ENCRYPTION_KEY="your-encryption-key"

# Google OAuth
NUXT_OAUTH_GOOGLE_CLIENT_ID="your-google-client-id"
NUXT_OAUTH_GOOGLE_CLIENT_SECRET="your-google-client-secret"
NUXT_OAUTH_GOOGLE_REDIRECT_URL="http://localhost:3001/api/auth/signin/google"

# Database
DATABASE_URL="your-postgres-url"

# Email (Resend)
NUXT_RESEND_API_KEY="your-resend-api-key"

# Cloudinary
NUXT_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NUXT_CLOUDINARY_CLOUD_API_KEY="your-cloud-api-key"
NUXT_CLOUDINARY_CLOUD_API_SECRET="your-cloud-api-secret"
```

### 4. Run the Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open Zadaci.

## 🛠 Tech Stack

- **Nuxt 3**
- **Tailwind CSS**
- **Drizzle ORM + PostgreSQL**
- **Google OAuth**
- **Cloudinary** for media
- **Resend** for email notifications

## 🤝 Contributing

Feel free to fork the repo and submit pull requests. Feedback, suggestions, and improvements are welcome!

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Crow Studios](https://github.com/Crow-Studio)
