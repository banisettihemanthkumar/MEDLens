# MedLens

MedLens is a modern clinical intelligence and medical records management platform built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Patient Management**: Add, update, and search patient profiles and history.
- **Clinical Timeline & Observations**: Track medical records, lab reports, and chronological history.
- **Conflict Resolution**: Identify and resolve contradictory clinical data.
- **Medical Report Analysis**: View and review clinical reports with automated insights.
- **Audit Logging**: Traceability for clinical record changes and updates.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database / ORM**: [Prisma](https://www.prisma.io/) with SQLite
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: NextAuth / bcryptjs

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/banisettihemanthkumar/medlens.git
   cd medlens
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and configure your secret keys:
   ```bash
   cp .env.example .env
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.
