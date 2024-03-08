## Next.js + PostgreSQL + Auth.js + Drizzle Starter

This Next.js template integrates PostgreSQL for database management, Auth.js for Google and GitHub authentication, and Drizzle as the ORM. It provides features like Google and GitHub authentication, role-based user authentication, and a user management page.

### Features

- Google and GitHub authentication
- Role-based user authentication with a visually appealing login page
- User Management page

### Getting Started

#### 1. Clone the Repository and Install Dependencies

Clone the repository and delete the .git folder to initialize your own git repository.

```
git clone https://github.com/mohitkumaragrawal/next-auth-drizzle-template.git
```

Then, install dependencies using pnpm.

```
pnpm i
```

#### 2. Create a `.env` file in your root directory

Copy the .env.example file to .env.

#### 3. Setup your Github OAuth Client

- Create your own [Github OAuth Client](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- Add http://localhost:3000/api/auth/callback/github to the
  callback url

- Copy the respective GITHUB_ID and GITHUB_SECRET to the `.env` file

#### 4. Setup your Google OAuth Client

- [Google OAuth Configuration](https://console.developers.google.com/apis/credentials)
- Callback Url: http://localhost:3000/api/auth/callback/google
- Copy the respective GOOGLE_ID and GOOGLE_SECRET to the .env file

#### 5. Generate the `NEXTAUTH_SECRET`

- Run this command to generate the NEXTAUTH_SECRET

```
openssl rand -base64 32
```

#### 6. Setup your database

- I'm using Docker to spin up PostgreSQL just install docker
  and run `sudo docker-compose up -d`

- Create all the required tables in the database using `pnpm db:push`

#### 7. You are all set!

- Run the development server

```
pnpm dev
```

- Optionally, open Drizzle Studio using pnpm db:studio and assign the owner role to yourself by adding a row in the userRole table with your user ID as the userId and owner as the role.

Now, you're ready to start developing with this Next.js template!
