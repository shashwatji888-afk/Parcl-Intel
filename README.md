# 🏢 Parcl Intel — Real Estate Machine Learning Intelligence Platform

**Parcl Intel** is a production-grade Real Estate Market Intelligence and Buyer Segmentation platform built with **Next.js 16 (App Router)**, **Supabase (PostgreSQL)**, and **K-Means Machine Learning Clustering**.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Prerequisites](#-prerequisites)
4. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
   - [1. Environment Configuration](#1-environment-configuration)
   - [2. Supabase Database Setup](#2-supabase-database-setup)
   - [3. Google OAuth 2.0 Integration Setup](#3-google-oauth-20-integration-setup)
5. [Feeding Real Estate Datasets](#-feeding-real-estate-datasets)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Running Locally & Production Build](#-running-locally--production-build)
8. [Deploying to Vercel](#-deploying-to-vercel)

---

## 🚀 Key Features

- **🤖 ML Buyer Profiler & Classifier**: Real-time buyer segment prediction algorithm (`C1 Global Investors`, `C2 First-Time Buyers`, `C3 Corporate Buyers`, `C4 Luxury Investors`) with confidence scoring.
- **📊 Live Supabase Analytics**: Real-time DB querying across buyer demographics, satisfaction scores, cash vs financing ratios, and regional market density.
- **⚡ ML Pipeline Engine (`/pipeline`)**: Interactive CSV drag-and-drop uploader, automated dataset sanitization, and live execution logging terminal.
- **📄 Reports & PDF Export Engine (`/reports`)**: Export dataset metrics in CSV, JSON schema, or print/download formatted Executive PDF reports.
- **🔑 Public REST API (`/api/predict`)**: Bearer API token authentication for third-party script integrations.
- **🔐 Enterprise Auth Guard**: Supabase Auth with Google OAuth integration, email/password login, and role-based access control.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: Next.js 16 (App Router), React 19, Vanilla CSS Design System (`globals.css`), Google Material Symbols.
- **Backend & Database**: Supabase PostgreSQL, Row-Level Security (RLS), Supabase Auth.
- **ML Engine**: K-Means Clustering (`C1`–`C4`), Feature Scaling & Normalization.
- **Deployment**: Vercel ready.

---

## 📦 Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v18.17.0` or higher
- **npm**: `v9.0.0` or higher
- **Supabase Account**: [https://supabase.com](https://supabase.com)
- **Google Cloud Console Account**: [https://console.cloud.google.com](https://console.cloud.google.com)

---

## ⚙️ Step-by-Step Setup Guide

### 1. Environment Configuration

Clone the repository and create a `.env.local` file in the root directory:

```bash
# Clone repository
git clone https://github.com/your-username/parcl-intel.git
cd parcl-intel

# Install dependencies
npm install
```

Create `.env.local` in your root folder:

```env
# Supabase Project Credentials
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_<your-key>
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_<your-key>
```

---

### 2. Supabase Database Setup

1. **Create a Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
   - Note down your `Project URL` and `Publishable Key` from **Project Settings -> API**.

2. **Run Database Migration Script**:
   - Navigate to **SQL Editor** in your Supabase Dashboard.
   - Click **New Query**, copy the entire contents of `supabase_schema.sql`, and click **Run**:

```sql
-- Creates Profiles, Buyers dataset table, Buyer Predictions, RLS policies, and Auth triggers
-- (Complete script available in repository root: supabase_schema.sql)
```

3. **Populate Initial Buyer Dataset**:
   - Open **SQL Editor**, paste the contents of `buyers_sample_data.sql`, and click **Run**.
   - Alternatively, go to **Table Editor -> buyers -> Import data from CSV** and upload `buyers_dataset.csv`.

---

### 3. Google OAuth 2.0 Integration Setup

To enable **Sign in with Google** on the login page:

#### A. Configure Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project named **`Parcl Intel`**.
3. Go to **APIs & Services -> OAuth consent screen**:
   - Select **External** and click **Create**.
   - **App name**: `Parcl Intel`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
   - Save and click **Publish App** under the Audience tab.
4. Go to **APIs & Services -> Credentials**:
   - Click **Create Credentials -> OAuth client ID**.
   - Select **Application type**: `Web application`.
   - **Name**: `Parcl Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://<your-supabase-project-ref>.supabase.co`
   - **Authorized redirect URIs**:
     - `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`
   - Click **Create** and copy your **Client ID** and **Client Secret**.

#### B. Configure Supabase Auth Provider
1. Go to [Supabase Dashboard](https://supabase.com/dashboard) -> **Authentication -> Providers -> Google**.
2. Toggle **Enable Google provider** to ON.
3. Paste your **Client ID** and **Client Secret** from Google Cloud Console.
4. Save changes.

---

## 📥 Feeding Real Estate Datasets

You can feed data into the Parcl Intel platform using 3 methods:

1. **API Ingestion Endpoint (`POST /api/pipeline/ingest`)**:
   Send raw buyer profile arrays via cURL or Python:
   ```bash
   curl -X POST http://localhost:3000/api/pipeline/ingest \
     -H "Content-Type: application/json" \
     -d '[{ "clientType": "Corporate", "country": "UAE", "purpose": "Investment", "satScore": 9.2 }]'
   ```
2. **UI Drag & Drop (`/pipeline`)**:
   Navigate to [`http://localhost:3000/pipeline`](http://localhost:3000/pipeline) and drop any `.csv` file.
3. **Supabase CSV Upload**:
   Upload `buyers_dataset.csv` directly via Supabase Table Editor.

---

## 🔌 API Endpoints Reference

### 1. ML Prediction Endpoint
- **URL**: `POST /api/predict`
- **Header**: `Authorization: Bearer prcl_live_<your_token>`
- **Payload Example**:
  ```json
  {
    "clientType": "Individual",
    "country": "United States",
    "purpose": "Investment",
    "satScore": 9.5
  }
  ```

### 2. Dataset Ingestion Pipeline
- **URL**: `POST /api/pipeline/ingest`
- **Header**: `Content-Type: application/json`

---

## 🏃 Running Locally & Production Build

```bash
# Start development server
npm run dev

# Run production build check
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

Deploy your application to Vercel in 1 minute:

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository directly to [Vercel Dashboard](https://vercel.com/new). Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` under Environment Variables.

---

## 📄 License
This project is licensed under the MIT License.
