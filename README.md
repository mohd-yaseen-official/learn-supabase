# Learn Supabase 🚀

A hands-on project demonstrating user authentication and profile management using Supabase, Next.js, and Tailwind CSS.

![Project Screenshot](/screenshot.png)

## Features ✨

- 🔐 **Authentication**:
  - Email/password signup & login
  - Session management
  - Protected routes
- 👤 **User Profiles**:
  - Profile creation after signup
  - Profile viewing
  - Responsive design with dark mode
- 🛠 **Tech Stack**:
  - Supabase (Auth & Database)
  - Next.js 13+ (App Router)
  - Tailwind CSS
  - Lucide React icons

## Getting Started 🏁

### Prerequisites

- Node.js v18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohd-yaseen-official/learn-supabase.git
   cd learn-supabase
   ```
2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**
   
   Create a .env.local file in the root directory:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Database Setup**

    Run this SQL in your Supabase SQL Editor:

   ```bash
     CREATE TABLE public.profiles (
       id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
       full_name text,
       username text unique,
       created_at timestamp with time zone DEFAULT timezone('utc', now())
     );

    -- Enable Row Level Security
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Allow users to create their own profile" 
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

    CREATE POLICY "Allow users to view their own profile" 
    ON public.profiles FOR SELECT TO authenticated
    USING (auth.uid() = id);
   ```
5. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

### Project Structure 📂
```bash
learn-supabase/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── layout.js
│   │   └── page.js
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── components/
│   │   └── (shared components)
└── public/
    └── (static assets)
```

### Available Routes 🛣️

- **/** - Home page (view profile)

- **/login** - User login

- **/signup** - User registration

## Deployment 🚀
- [Vercel](https://learn-supabase-sable.vercel.app/)
  
## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## ✨ Credits

Developed with 💙 by [Mohamed Yaseen](https://github.com/mohd-yaseen-official)
