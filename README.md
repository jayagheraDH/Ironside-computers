# Builder.io & Next.js & BigCommerce

The all-in-one starter kit for high-performance eCommerce sites. Source inspired by [nextjs.org/commerce](https://nextjs.org/commerce)

**Live demo at** [demo](https://nextjs-bigcommerce-starter-one.vercel.app/)

## Features

- Performant by default
- SEO Ready
- Responsive
- UI Components
- Theming
- Standardized Data Hooks
- Integrations - Integrate seamlessly with the most common ecommerce platforms.
- Dark Mode Support


## Goals

* **Next.js Commerce** should have a completely data **agnostic** UI
* **Aware of schema**: should ship with the right data schemas and types.
* All providers should return the right data types and schemas to blend correctly with Next.js Commerce.
* `@framework` will be the alias utilized in commerce and it will map to the ecommerce provider of preference- e.g BigCommerce, Shopify, Swell. All providers should expose the same standardized functions. _Note that the same applies for recipes using a CMS + an ecommerce provider._

There is a `framework` folder in the root folder that will contain multiple ecommerce providers.

Additionally, we need to ensure feature parity (not all providers have e.g. wishlist) we will also have to build a feature API to disable/enable features in the UI.

People actively working on this project: @okbel & @lfades.

## Getting Started

<summary>I already own a BigCommerce store. What should I do?</summary>
<br>
First thing you do is: <b>set your environment variables</b>
<br>
<br>
.env.local

```sh
BIGCOMMERCE_STOREFRONT_API_URL=<>
BIGCOMMERCE_STOREFRONT_API_TOKEN=<>
BIGCOMMERCE_STORE_API_URL=<>
BIGCOMMERCE_STORE_API_TOKEN=<>
BIGCOMMERCE_STORE_API_CLIENT_ID=<>
BIGCOMMERCE_STORE_HASH=<>
```

Next, you're free to customize the starter.

### Getting started with Builder.io :
      - [1: Create an account for Builder.io](#1-create-an-account-for-builderio)
      - [2: Your Builder.io private key](#2-your-builderio-private-key)
      - [3: Clone this repository and initialize a Builder.io space](#3-clone-this-repository-and-initialize-a-builderio-space)

#### 1: Create an account for Builder.io

Before we start, head over to Builder.io and [create an account](https://builder.io/signup).

#### 2: Your Builder.io private key

Head over to your [organization settings page](https://builder.io/account/organization?root=true) and create a
private key, copy the key for the next step.

- Visit the [organization settings page](https://builder.io/account/organization?root=true), or select
  an organization from the list 


- Click "Account" from the left hand sidebar
- Click the edit icon for the "Private keys" row
- Copy the value of the auto-generated key, or create a new one with a name that's meaningful to you


#### 3: Clone this repository and initialize a Builder.io space

Next, we'll create a copy of the starter project, and create a new
[space](https://www.builder.io/c/docs/spaces) for it's content to live
in.

In the example below, replace `<private-key>` with the key you copied
in the previous step, and change `<space-name>` to something that's
meaningful to you -- don't worry, you can change it later!

Note:
if you're only interested in using this starter for a landing page use this command instead:

```
builder create --key "<private-key>" --name "<space-name>" --input builder-landing-page-only --debug
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

|████████████████████████████████████████| pdp-footer writing schema.json | 1/1
|████████████████████████████████████████| page: writing schema.json | 2/2


Your new space "Big Commerce starter" public API Key: 012345abcdef0123456789abcdef0123
```

Copy the public API key ("012345abcdef0123456789abcdef0123" in the example above) for the next step.

This starter project uses dotenv files to configure environment variables.
Open the files [.env.development](./.env.development) and
[.env.production](./.env.production) in your favorite text editor, and
set the value of `BUILDER_PUBLIC_KEY` to the public key you just copied.
You can ignore the other variables for now, we'll set them later.









## Running your application

To serve your application locally, install dependencies, serve, and view your preview.

1. Install dependencies by entering the follw\owing at the command line.

   ```
   npm install
   ```

1. Serve your application by running the following at the command line:

   ```
   npm run dev
   ```

1. In your browser, go to `http://localhost:3000` to see your application.

### Experimenting

Now that you have a configured Builder.io application, you can try different features, such as creating a page.
Create a new page entry, assign any URL, publish and preview.
For more detail and ideas on creating pages, see [Creating a landing page in Builder
](https://www.builder.io/c/docs/creating-a-landing-page).

### Deploy

You can deploy anywhere you like, but for this project we recommend [Vercel](https://nextjs.org/docs/deployment).
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fbuilderio%2Fbuilder%2Ftree%2Fmaster%2Fexamples%2Fnext-js-simple)

## Next steps

- Learn how to [use your react components in our visual editor](https://www.builder.io/c/docs/custom-react-components)
- For more information on previewing your applications, see [Editing and previewing directly on your site](https://www.builder.io/c/docs/guides/preview-url).
- See [Getting started with the visual editor](https://www.builder.io/c/docs/guides/page-building) for an introduction to editing your pages without having to code.
- Check out [Builder best practices](https://www.builder.io/c/docs/best-practices) for guidance on how to approach site development with Builder.