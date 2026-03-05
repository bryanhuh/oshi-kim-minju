# Kim Minju Fansite — Project Plan
Luxury WebGL Fansite Experience

Goal:
Create a premium interactive fansite for Kim Minju that feels like entering a K-drama fantasy world.  
The site should showcase her career, history, images, news, and social content using cinematic visuals, 3D environments, and elegant animations.

Design Theme:
"Entering Minju's Dream World"

Primary Colors
- Soft Pink (#f7c6d9)
- Blush Pink (#f4a7c1)
- White (#ffffff)

Typography
- Primary: Noto Serif KR
- Secondary: Inter (UI text)

Mood
- Elegant
- Cinematic
- Dreamlike
- Soft lighting
- Fantasy K-drama set design
- Minimal but luxurious UI

---

# Tech Stack

Frontend
- Next.js
- React
- Tailwind
- Framer Motion

3D / WebGL
- Three.js
- React Three Fiber
- Drei helpers
- GSAP (for cinematic scroll animations)

Backend
- Hono API
- Bun runtime
- PostgreSQL

Storage
- Cloudflare R2 or Supabase Storage (for images)

Crawler / Data ingestion
- Playwright
- Cheerio

Deployment
- Vercel (frontend)
- Fly.io / Railway (API)
- Cloudflare CDN

---

# Website Sections

## 1. Landing Experience (Hero Scene)

Goal:
Make the user feel like they entered Minju's world.

Scene:
A pink fantasy landscape similar to the reference image.

Features:
- Floating flowers
- Soft fog
- Animated castle in distance
- Slow camera movement
- Scroll triggers transition

Implementation:
Three.js + React Three Fiber

Scrolling should transition into the main website.

---

## 2. Profile Page

Content
- Biography
- Career timeline
- Agencies
- Filmography
- Awards
- Fun facts

Layout
Elegant editorial layout similar to luxury fashion magazines.

Sections
- Hero portrait
- Timeline animation
- Career highlights
- Photo spotlight

---

## 3. Drama & Filmography Section

Show all works Minju has participated in.

Data includes
- Drama name
- Year
- Role
- Poster
- Synopsis
- Trailer

Features
- Horizontal scroll gallery
- Hover reveal animation
- Cinematic card transitions

Data source
MyDramaList scraping

---

## 4. Gallery (Main Attraction)

This is the largest section of the site.

Content
- Photoshoots
- Instagram photos
- Drama stills
- Fan events
- Magazine covers

Sources
- kpopping
- hancinema
- fandom wiki
- instagram

Gallery features
- Masonry grid
- Infinite scroll
- Image zoom viewer
- Lightbox with cinematic transitions

3D Gallery Mode
Optional toggle:
Images float in 3D space like a museum.

---

## 5. Instagram Archive

Automatically store Minju's posts.

Content
- Image
- Caption
- Likes
- Date

Features
- Polaroid style layout
- Hover reveals caption
- Story highlights section

Ingestion
Instagram scraping or Apify actor.

---

## 6. News Section

Aggregate headlines mentioning Minju.

Sources
Google News RSS

Data
- headline
- article url
- source
- date

Display
Elegant news cards with magazine style layout.

---

## 7. IZ*ONE Era Section

Special tribute section to her IZ*ONE history.

Content
- Group photos
- Performances
- Timeline

Optional
Interactive timeline of the group.

---

# Data Collection

## Scraper targets

MyDramaList
Filmography data

kpopping
Image galleries

hancinema
Image galleries

fandom
additional images

Google News RSS
news aggregation

Instagram
post archive

---

## Scraper Implementation

Tools
Playwright
Cheerio

Frequency
Daily cron job

Pipeline
Scrape → Clean → Store → Upload images to storage → Save metadata in DB

---

# Database Schema

Tables

minju_profile
- id
- name
- birthdate
- agency
- bio

works
- id
- title
- year
- role
- poster
- synopsis

images
- id
- url
- category
- source
- uploaded_at

instagram_posts
- id
- image
- caption
- posted_at
- likes

news
- id
- title
- source
- url
- published_at

---

# Animations

Use cinematic scroll storytelling.

Tools
GSAP
Framer Motion

Examples
- parallax layers
- fade reveals
- floating UI
- scroll camera movement

---

# Visual Design Guidelines

Spacing
Large whitespace

UI Style
Glassmorphism panels
Soft shadows
Rounded edges

Motion
Slow and elegant
No aggressive motion

Lighting
Soft glow
Pink gradients
Subtle bloom effects

---

# Performance

Because WebGL can be heavy:

Strategies
- lazy load 3D scenes
- compress images
- progressive loading
- CDN image delivery

---

# SEO

Pages
- Profile
- Dramas
- Gallery
- News

Meta
- OpenGraph
- Twitter cards

---

# Optional Future Features

Fan guestbook

Fan art gallery

Minju AI chatbot

Virtual fan museum

Interactive timeline of her career

---

# Milestones

Phase 1
Basic website structure

Phase 2
Data scraping pipeline

Phase 3
Gallery system

Phase 4
WebGL landing experience

Phase 5
Animations polish

Phase 6
Performance optimization

---

# Success Criteria

Site should feel like:
- a luxury K-drama website
- an interactive art piece
- a high-end portfolio experience

The user should feel like they are exploring Minju's world rather than browsing a normal fansite.
