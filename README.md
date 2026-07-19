# URL Shortener

### [Project README.md](/docs/README.md)

## Overview

A URL shortener for use with web links.

### Problem Space

I want to shorten URL addresses so that they are easier to integrate into QR codes and other utilities such as analytics tools.

### User Profile

This web app is used for use in personal projects that want the use of shorter URLs that are easier to consume in other applications

#### Target Audience

the primary audience is developers that want to have a stand alone web shortener as an MVP before weighing the pros and cons of using a third party solution.

### Features

A user can:

- Enter a long URL
- Receive a short URL
- Visit the short URL
- Get redirected to the original URL

example:

`https://www.google.com/search?q=nextjs+prisma`

becomes:

`https://your-domain.com/Ab3xK9`

### Tech Stack

#### Frontend

- NextJS
- Typescript
- Tailwind

#### Backend (database tools)

- Prisma
- PostgreSQL (Neon)

4. Wireframes and Architecture

- UX Design: Sketches
    - https://excalidraw.com/#json=BNMhgX3nA0_5edgqB4h9d,z_oLW7Q6IFUakfpiHbPlOg
- Data Flow: System architecture diagrams.

    #### url-shortener-db

```
    Links
    ⮑ id
    ⮑ slug
    ⮑ originalUrl
    ⮑ createdAt
    ⮑ updatedAt
```

## Links

| id     |   slug   | originalUrl | createdAt  |  updatedAt |
| :----- | :------: | :---------: | :--------: | ---------: |
| `CUID` | `String` |  `String`   | `DateTime` | `DateTime` |

##
