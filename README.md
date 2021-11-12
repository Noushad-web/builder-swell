
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fswellstores%2Fnextjs-builder&env=BUILDER_PUBLIC_KEY,SWELL_STORE_ID,SWELL_PUBLIC_KEY&envDescription=API%20keys%20needed%20to%20connect%20to%20your%20Swell%20store%20and%20Builder%20dashboard&envLink=https%3A%2F%2Fgithub.com%2Fswellstores%2Fnextjs-builder%2Fblob%2Fmaster%2FREADME.md)

# Next.js + Swell + Builder.io starter kit

The ultimate starter for headless Swell stores. 

Demo live at [Nextjs-builder](https://builder-demo-theta.vercel.app/about-us)

## Goals and Features

- Ultra high performance
- SEO optimized
- Themable
- Personalizable (internationalization, a/b testing, etc)
- Builder.io Visual CMS integrated
- Connect to Swell data through Builder's high speed data layer

## Table of contents

  - [Getting Started](#getting-started)
      - [1: Create an account for Builder.io](#1-create-an-account-for-builderio)
      - [2: Your Builder.io private key](#2-your-builderio-private-key)
      - [3: Clone this repository and initialize a Builder.io space](#3-clone-this-repository-and-initialize-a-builderio-space)
      - [4. Connecting Builder to Swell](#4-connecting-builder-to-swell)
      - [5. Configure the project to talk to Swell](#5-configure-the-project-to-talk-to-swell)
      - [6. Up and Running!](#6-up-and-running)
      - [7. Start building!](#7-start-building)
  - [Deploy](#deployment-options)


## Getting Started

**Pre-requisites**

This guide will assume that you have the following software installed:

- nodejs (>=12.0.0)
- npm or yarn
- git

You should already have a [Swell](https://swell.store/signup) account and store created before starting as well. 

**Introduction**

This starter kit is everything you need to get your own self hosted
Next.js project powered by Builder.io for content and Swell as an
e-commerce back office.

After following this guide you will have

- A Next.js app, ready to deploy to a hosting provider of your choice
- Pulling live collection and product information from Swell
- Powered by the Builder.io visual CMS

### 1: Create an account for Builder.io

Before we start, head over to Builder.io and [create an account](https://builder.io/signup).

### 2: Your Builder.io private key

Head over to your [organization settings page](https://builder.io/account/organization?root=true) and create a
private key, copy the key for the next step.

- Visit the [organization settings page](https://builder.io/account/organization?root=true), or select
  an organization from the list 

![organizations drop down list](./docs/images/builder-io-organizations.png)

- Click "Account" from the left hand sidebar
- Click the edit icon for the "Private keys" row
- Copy the value of the auto-generated key, or create a new one with a name that's meaningful to you


![Example of how to get your private key](./docs/images/private-key-flow.png)

### 3: Clone this repository and initialize a Builder.io space

Next, we'll create a copy of the starter project, and create a new
[space](https://www.builder.io/c/docs/spaces) for it's content to live
in.

In the example below, replace `<private-key>` with the key you copied
in the previous step, and change `<space-name>` to something that's
meaningful to you -- don't worry, you can change it later!

```
git clone https://github.com/swellstores/nextjs-builder.git
cd nextjs-builder

npm install --global "@builder.io/cli"

builder create --key "<private-key>" --name "<space-name>" --debug
```

If this was a success you should be greeted with a message that
includes a public API key for your newly minted Builder.io space.

*Note: This command will also publish some starter builder.io cms
content from the ./builder directory to your new space when it's
created.*

``` bash
  ____            _   _       _                     _                    _   _ 
| __ )   _   _  (_) | |   __| |   ___   _ __      (_)   ___       ___  | | (_)
|  _ \  | | | | | | | |  / _` |  / _ \ | '__|     | |  / _ \     / __| | | | |
| |_) | | |_| | | | | | | (_| | |  __/ | |     _  | | | (_) |   | (__  | | | |
|____/   \__,_| |_| |_|  \__,_|  \___| |_|    (_) |_|  \___/     \___| |_| |_|

|████████████████████████████████████████| swell-product | 0/0
|████████████████████████████████████████| product-page: writing generic-template.json | 1/1
|████████████████████████████████████████| swell-collection | 0/0
|████████████████████████████████████████| collection-page: writing generic-collection.json | 1/1
|████████████████████████████████████████| page: writing homepage.json | 2/2


Your new space "next.js Swell starter" public API Key: 012345abcdef0123456789abcdef0123
```

Copy the public API key ("012345abcdef0123456789abcdef0123" in the example above) for the next step.

This starter project uses dotenv files to configure environment variables.
Open the files [.env.development](./.env.development) and
[.env.production](./.env.production) in your favorite text editor, and
set the value of `BUILDER_PUBLIC_KEY` to the public key you just copied.
You can ignore the other variables for now, we'll set them later.

```diff
+ BUILDER_PUBLIC_KEY=012345abcdef0123456789abcdef0123
- BUILDER_PUBLIC_KEY=
SWELL_STORE_ID=
SWELL_PUBLIC_KEY=
```

### 4. Connecting Builder to Swell

Access your newly created space by selecting it from the [list of spaces](https://builder.io/spaces?root=true)
in your organization.

Ensure the Swell plugin is connected, by editing 'Plugins' listed in your space settings. Update the store id and public key if necessary.

### 5. Configure the project to talk to Swell

Open up [.env.development](./.env.development) and [.env.production](./.env.production) again,
but this time set the other two Swell keys.

```diff
BUILDER_PUBLIC_KEY=012345abcdef0123456789abcdef0123
+ SWELL_STORE_ID=my-store
- SWELL_STORE_ID=
+ SWELL_PUBLIC_KEY=c11b4053408085753bd76a45806f80dd
- SWELL_PUBLIC_KEY=
```

### 6. Up and Running!

The hard part is over, all you have to do is start up the project now.

```bash
npm install
npm run dev
```
or
```bash
yarn && yarn dev
```

This will start a server at `http://localhost:3000`.

Go to your [new space settings](https://builder.io/account/space) and change the site url to your localhost `http://localhost:3000` for site editing.


### 7. Start building

Now that we have everything setup, start building and publishing pages on builder.io!

## Deployment Options

You can deploy this code anywhere you like - you can find many deployment options for Next.js [here](https://nextjs.org/docs/deployment).

Don't forget to update the Site URL to point to the production URL when ready.
