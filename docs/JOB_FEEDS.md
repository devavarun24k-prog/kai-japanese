# Legitimate Job-Feed Integration Architecture (KAI Job Tracker)

This document specifies the architectural guidelines for integrating automated job feeds into the KAI Job Tracker in future releases.

## Core Principle: Zero Scraping Policy

KAI strictly adheres to legal and ethical compliance:
- **No unauthorized web scraping**: We do not scrape HTML, bypass CAPTCHAs, or violate robots.txt / Terms of Service of job boards (e.g., Wantedly, Daijob, LinkedIn, Indeed).
- **No fabricated listings**: Vacancies must originate from authentic sources with explicit verification timestamps.
- **Privacy by default**: Candidate search queries and tracked applications are stored in user-scoped storage with Supabase Row Level Security (RLS) and never shared.

---

## Permitted Integration Pathways

Future automated or semi-automated job feed integrations may utilize only the following three legitimate methods:

### 1. Official Partner & Job Board REST APIs
- **Mechanism**: Authenticated API integrations using API keys or OAuth 2.0 with licensed job boards that explicitly offer partner APIs (e.g., Green Japan API, Daijob Partner API, or Wantedly for Partners).
- **Requirements**:
  - Valid partner agreement and licensed client credentials stored server-side in Supabase Vault / Edge Functions (never exposed to client).
  - Webhooks for listing deletion / status changes so expired vacancies are immediately updated or archived.
  - Strict mapping to KAI's tri-state sponsorship fields (`overseasApplicantsAccepted`, `visaSponsorship`, `relocationSupport`).

### 2. Government & Public Open Data Feeds
- **Mechanism**: Official Japanese public employment feeds (e.g., Hello Work ハローワーク open data / API interfaces provided by the Ministry of Health, Labour and Welfare).
- **Requirements**:
  - Conformity with official data distribution terms and refresh cadences.
  - Transparent labeling that the vacancy originates from public employment service records.

### 3. Corporate ATS Webhooks & RSS Feeds
- **Mechanism**: Direct ingestion from employer Applicant Tracking Systems (e.g., Greenhouse, Lever, Workday, SmartHR) that provide publicly accessible, opt-in RSS/JSON career feeds.
- **Requirements**:
  - User explicitly adds the employer's official RSS/JSON endpoint to their "Verified Sources" list.
  - Cryptographic hash (SHA-256) of the job URL to prevent duplicate tracking.
  - Periodic freshness checks with automated stale warnings after 60 days of inactivity.

---

## Data Schema & Tri-State Mapping Standard

When mapping external payloads to KAI's `JobApplication` data contract:

```typescript
export interface ExternalJobFeedItem {
  externalId: string;
  sourceProvider: string; // e.g. "Green API", "HelloWork OpenData"
  employer: string;
  title: string;
  locationPrefecture: string;
  sourceUrl: string;
  directApplicationUrl?: string;
  postedDate: string; // ISO 8601
  deadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: 'JPY';
  workArrangement: 'on_site' | 'hybrid' | 'remote';
  japaneseLevel: 'None' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'Not Stated';
  visaSponsorship: 'yes' | 'not_stated' | 'unknown';
  overseasAccepted: 'yes' | 'not_stated' | 'unknown';
}
```

### Tri-State Integrity Rule
If an external API payload does not explicitly specify visa sponsorship or overseas applicant eligibility, the field **MUST default to `"unknown"`**. It is strictly forbidden to infer sponsorship based on language requirements or company size.

---

## Immigration & Legal Disclaimer
KAI provides tracking tools only. Determining actual visa eligibility is exclusively within the jurisdiction of the Immigration Services Agency of Japan (出入国在留管理庁).
Official Reference: [https://www.isa.go.jp/en/](https://www.isa.go.jp/en/)
