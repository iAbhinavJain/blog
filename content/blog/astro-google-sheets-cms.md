---
external: false
title: "How to Build a Serverless Astro.js + Google Sheets = Auto-Updating CMS!"
description: "Learn how to use Google Sheets as a CMS for Astro JS Project and deploy it for free with cloudflare pages. Auto update cms.  "
date: 2025-02-24
---

So about a year ago, I wrote a guide on [**How to Create a blog using Astro JS and host it for free using Cloudflare Pages**](https://blog.iabhinavj.com/blog/create-free-blog/) and since then I have been loving Astro myself for a lot of personal projects, whether it’s a static business website or a [web dev blog](https://blog.iabhinavj.com/), I have used it a lot. 

![How to Build a Serverless Astro.js + Google Sheets = Auto-Updating CMS](https://cdn-images-1.medium.com/max/800/1*M3r1GmaNYsl13XLgosVWRg.png)

In this guide, we’ll build a **serverless website** powered by **Astro JS and Google Sheets** — a perfect way to store structured data like books, events, or product listings **without setting up a traditional database**! 🎉

## 🔥 Why Use Google Sheets as a Database?

- ✅**Free & Easy** — No backend setup, just a Google Sheet!
- 🌍 **Real-time updates** — Update the sheet, and your site updates too.
- 🛠️ **NoSQL-like flexibility** — Store structured data effortlessly.
- 🚀 **Great for small to medium datasets** — Ideal for up to **5,000 rows**.

## 🚀What are we building?

We are creating a **fully serverless Astro.js website** that fetches data from Google Sheets and displays it dynamically. This example will use a **book collection** to demonstrate how structured data from a Google Sheet can be transformed into a functional, paginated website.

[Watch Video](https://www.youtube.com/watch?v=haGB5XBDacs)

[View the Live Demo Site](https://sheet-book.pages.dev/)

[View the Github Repository](https://github.com/iAbhinavJain/astro-book)

#### 🔗 Features:

- Fetch data from Google Sheets using **OpenSheet API**.
- **Paginated Index Page** with book listings.
- **Dynamic Routing** for each book’s detailed page.
- **SEO-optimized pages** with meta titles & descriptions.
- **Sitemap generation** for better search engine indexing.

## ⚠️ Limitations & Performance Considerations

Before diving in, let’s talk about **performance issues** when dealing with **large datasets (10,000+ rows)**:
### ⚡ Problem: Large Datasets Can Slow Down Your Site

Fetching **90,000+ rows** from a Google Sheet **on every request** would be **extremely slow** and could hit Google’s rate limits.

#### ✅ How to Overcome This:

1. **Static Site Generation (SSG) (Recommended for Beginners)**

- Fetch data **at build time** (using Astro’s `getStaticPaths`).
- Works best for **small-to-medium datasets (<5,000 rows)**.
- 💡 [Learn more about SSG in Astro](https://docs.astro.build/en/core-concepts/static-site-generation/)

1. **Pagination & Lazy Loading (For Large Datasets, >10,000 Rows)**

- Instead of loading everything at once, fetch **only a few rows per page**.
- Example: Load **20 items per page** using query parameters like `?page=2`.
- 💡 [Check out Astro’s API Routes](https://docs.astro.build/en/guides/endpoints/)

**3. Use a Serverless Function (Advanced, for 50,000+ Rows)**

- Deploy a tiny API on **Vercel, Netlify, or Cloudflare Workers** to process & cache data.
- Your website fetches **only what’s needed when needed**.
- 💡 [Learn about serverless functions](https://vercel.com/docs/functions/serverless-functions)

### ⚠️ OpenSheet API & Public Data Warning

Since this guide uses **OpenSheet API**, your Google Sheet must be **publicly accessible**. ❗ **Do not use this method for sensitive or private data!** ❗

If you need authentication and security, consider using a backend API or Google Sheets API with proper authentication.

For **this guide**, we’ll use the **Static Site Generation (SSG) approach along with Opensheet API**, as it’s the easiest to set up. However, feel free to optimize it further using the above methods!

## 🪜Pre-requisites:

Before we get started, make sure you have:

- 🖥️ Node.js installed — Download here
- 🏗️ Basic knowledge of JavaScript & Astro
- 🌐 A Google account to create a Google Sheet
- 📂 A GitHub account (optional, but why not?)

We are not going to cover how to set up a GitHub project or deploy it for free because, for those you can check out the steps from another guide, it would exactly be the same. 

---

## Part 1: Setting up Astro Project and Google Sheets

Once you have all the prerequisites mentioned above, you are all set to move on with the first part of this guide where we will be setting up the Astro project and Google Sheets.

- (Optional) Create a GitHub repository with the name of your project. I am gonna call it astro-book-tutorial. (Couldn’t come up with a better name, I know). 

![](https://cdn-images-1.medium.com/max/800/1*QKAwuv1V8fn-ia7C-tA53g.png)

- Once the repo is created, I am gonna clone it and open it in vscode. 
- Let’s open the terminal and set up the Astro Project. Let’s use the following command:

```javascript 
npm create astro@latest
```

- Since I am already in the folder where I want this project to exist, I am gonna type . (dot) and enter to create the project in the root directory. 

![](https://cdn-images-1.medium.com/max/800/1*_Ql07y4ZJ16l_0H5ZUadxg.png)

- We are gonna go with A basic, minimal starter as recommended. 
- We are gonna say Yes when prompted to install dependencies. 
- Now, let’s just wait for the dependencies to get installed and the project to be set up. 

![](https://cdn-images-1.medium.com/max/800/1*yYoQv25NBsZ4lScHqQ-mxQ.png)

- Awesome, so now Astro Project is set up, let’s get our database ready. 
- Go to [Google Sheets](https://sheets.google.com/) and create a new spreadsheet. Name it whatever you like, I am gonna call it Books. 

![](https://cdn-images-1.medium.com/max/800/1*PhotuldSnpgBJQop0BgAxA.png)

- Here, it’s important to have our data organised really well. We need a field which should be unique and can be used as the slug. In my case, I am using ISBN as a slug since it’s unique to every book. 
- I also like naming my sheet, so in my case, I called it booklist. You don’t have to if you don’t want to. 
- Make sure you have all the columns that you wanna use on the website, for this project, we have:  
     — **slug:** This is the ISBN for the book, unique to each book.   
     — **title:** Title of the book  
     — **author:** Author of the book  
     — **year:** Year when the book was published  
     — **pub:** Publisher of the book  
     — **image:** I also have an image link for each book provided in the dataset.

Here’s a link to the sheet I used in this example project:  
[https://docs.google.com/spreadsheets/d/1Arkmef5FPHhfBuwC8_1jyfQyMW1za8lxcASQhrkauy8/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1Arkmef5FPHhfBuwC8_1jyfQyMW1za8lxcASQhrkauy8/edit?usp=sharing)

- Once you have the columns for the sheet ready — **Make it public** — this is crucial. To do this, simply, click on the share button, change the access to everyone and copy the link. 

![](https://cdn-images-1.medium.com/max/800/1*MLUzuXF4L3EzzwlvmqwBEQ.png)

Awesome, that was good, and don’t worry, you can add, remove modify data on the go and it will reflect on your website, how cool is that? let’s now move on to the next part which is fetching the sheet as JSON and creating routing files. 

---

## Part 2: Fetching Data and Routing 

Alright, so since we now have our Astro project set up and we also have our database as Google Sheets with some data in it, let’s now fetch the data from Google Sheets and create our routing files:

- We will be making use of Opensheet API to fetch our data as JSON.
- Let’s create a new folder inside ‘src’ and call it utilities.
- Inside this utilities folder, we will create a file called fetchBooks.js, so your folder structure should look something like this:

![](https://cdn-images-1.medium.com/max/800/1*dl6cAmdtCjj7NNzYDNMBrA.png)

- Now, paste the following code into the newly created fetchBook.js:  

    **Important:** Make sure you replace {YOUR-SHEETS-ID} with your sheets id and {SHEET-NAME} with sheet name.   
    **Sheets ID:** Your sheet ID is the one in the shareable URL, https://docs.google.com/spreadsheets/d/{SHEET-ID}/edit?usp=sharing  
    **Sheet name**: You can find it in the left bottom corner. By default, it’s called Sheet 1

```javascript 
export async function fetchBooks() {  
    const res = await fetch("https://opensheet.elk.sh/{YOUR-SHEETS-ID}/{SHEET_NAME}");  
    return res.json();  
  }
```

As you might have guessed, we are fetching the data from the sheet using the open sheet as a JSON object. 

- Now, let’s create our routes, we need to create these inside src/pages:

pages/  
  -book/  
    -[slug].astro  
  -page/  
    -[page].astro    

the directory should now look like this:

![](https://cdn-images-1.medium.com/max/800/1*z0XvX6b6nlWpHYVr87TftQ.png)

Awesome, let’s now add some code just to get the data in those pages and get the whole thing working: 

**pages/index.astro:**

---  
```javascript 
import { fetchBooks } from "../utils/fetchBooks";  
  
const books = await fetchBooks();  
const perPage = 10; // Number of items per page  
const page = 1; // Always Page 1 since it's homepage  
const paginatedBooks = books.slice((page - 1) * perPage, page * perPage);  
const totalPages = Math.ceil(books.length / perPage);  
---  
  
<html>  
  <head>  
    <title>Book Collection</title>  
  </head>  
  <body>  
    <h1>Book Collection</h1>  
    <ul>  
      {paginatedBooks.map(book => (  
        <li><a href={`/book/${book.slug}`}>{book.title}</a></li>  
      ))}  
    </ul>  
  
    <div>  
      {page < totalPages && <a href={`/page/${page + 1}/`}>Next</a>}  
    </div>  
  </body>  
</html>
```

**pages/page/[page].astro:**

---  
```javascript 
import { fetchBooks } from "../../utils/fetchBooks";  
  
export async function getStaticPaths() {  
  const books = await fetchBooks();  
  const perPage = 10; // Number of items per page  
  const totalPages = Math.ceil(books.length / perPage);  
  
  return Array.from({ length: totalPages }, (_, i) => ({  
    params: { page: (i + 1).toString() },  
  }));  
}  
  
const books = await fetchBooks();  
const perPage = 10;  
const page = Number(Astro.params.page);  
const paginatedBooks = books.slice((page - 1) * perPage, page * perPage);  
const totalPages = Math.ceil(books.length / perPage);  
---  
  
<html>  
  <head>  
    <title>Book Collection - Page {page}</title>  
  </head>  
  <body>  
    <h1>Book Collection</h1>  
    <ul>  
      {paginatedBooks.map(book => (  
        <li><a href={`/book/${book.slug}`}>{book.title}</a></li>  
      ))}  
    </ul>  
  
    <div>  
      {page > 1 && <a href={`/page/${page - 1}/`}>Previous</a>}  
      {page < totalPages && <a href={`/page/${page + 1}/`}>Next</a>}  
    </div>  
  </body>  
</html>
```

**Disclaimer:** Ah yeah! Why not use search parameters? Well, since we are following a SSG approach, we can’t access the search parameters, that’s why we gotta take this permalink approach. Feel free to use search params if you are using SSR. 

**pages/book/[slug].astro**

```javascript 
import { fetchBooks } from "../../utils/fetchBooks";  
  
export async function getStaticPaths() {  
  const books = await fetchBooks();  
  return books.map(book => ({ params: { slug: book.slug } }));  
}  
  
const books = await fetchBooks();  
const book = books.find(b => b.slug === Astro.params.slug);  
---  
  
<html>  
  <head>  
    <title>{book.meta_title}</title>  
    <meta name="description" content={book.meta_desc} />  
  </head>  
  <body>  
    <h1>{book.title}</h1>  
    <p>by {book.author} ({book.year}) | Published by {book.pub}</p>  
    <img src={book.image} alt={book.title} />  
  </body>  
</html>
```
### What are we doing:

**For Pagination:**

- Importing the fetchBooks function we created.
- We are making use of getStaticPaths() function to get the books and then return the required number of results based on perPage value. 
- We are storing the filtered books json in paginatedBooks, then simply mapping it to show the list with the URL and title. 

**For Single book:** 

- When the user visits a single book page, we are fetching the json again, finding the book we need by matching the slug value with the slug value in the URL. 
- Then, we are just displaying the Book Info on the page. 

#### There you have it…

#### … Oh wait where are the styles?

---

## Part 3: Styling the Pages with Tailwind CSS

Since this is just a tutorial and the chances are you wanna create a real site with some different data, feel free to style it your way. But just for the sake of this tutorial, I am gonna add some styles. I would use tailwind UI to style the website. I was really close to installing react and shadcn but I would keep it light just in case if someone wanna fork and don't wanna use react:

- Let’s install tailwind, open terminal and enter the following command:

```javascript 
npm install tailwindcss @tailwindcss/vite
```

- Change the content of your **astro.config.js** file to following:

```javascript
// @ts-check  
import { defineConfig } from "astro/config";  
import tailwindcss from "@tailwindcss/vite";  
// https://astro.build/config  
export default defineConfig({  
  vite: {  
    plugins: [tailwindcss()],  
  },  
});
```

- Create ./src/styles/global.css file and add the following:

```javascript
@import "tailwindcss";
```

- Now, let’s start the build process, enter the following command in the terminal:

```javascript
npm run dev
```

Awesome, let’s now add some magic and components, I am lazy, so I am gonna use components from [Tailwind’s official website](https://tailwindui.com/components) to make the process super quick. 

Here are the updated files with code:

**/src/components/header.astro**:

```javascript
<header class="z-99 relative">

  <div class="relative flex items-center justify-center mx-auto overflow-hidden bg-slate-950 px-6 py-2.5 sm:px-3.5">

      <div class="flex justify-center items-center gap-x-4 gap-y-2">

          <p class="text-sm/6 text-slate-50">

              Website build for tutorial purposes - <a href="https://blog.iabhinavj.com"

                  class="z-99 relative hover:opacity[0.7]" target="_blank">Read Post</a>

      </div>

  </div>

  <nav class="relative isolate">

      <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"

          aria-hidden="true">

          <div class="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"

              style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">

          </div>

      </div>

      <div class="container mx-auto px-6 py-6">

          <div class="flex justify-between items-center">

              <a href="/"

                  class="font-semibold tracking-tight text-balance text-gray-900 text-2xl font-bold">SheetBook</a>

              <div class="flex items-center">

                  <a href="https://github.com/iAbhinavJain/astro-book" target="_blank"

                      class="text-slate-950 text-sm px-3 py-1 hover:opacity-[0.8]">View on Github</a>

              </div>

          </div>

      </div>

  </nav>

</header>
```

**/src/components/footer.astro:**

```javascript 
<footer>

  <div class="bg-slate-950 text-slate-50 text-center py-4">

    <p>

      <a href="https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset" target="_blank" class="hover:opacity-[0.8]">Dataset Source</a> | A website by <a href="https://iabhinavj.com" target="_blank" class="hover:opacity-[0.8]">Abhinav Jain</a>

    </p>

  </div>

</footer>
```


**/src/pages/index.astro**:

---  
```javascript
import { fetchBooks } from "../utils/fetchBooks";  
import "../styles/global.css";  
import Layout from "../layouts/Layout.astro";  
---  
  
<Layout title="SheetBook - Astro JS and Google Sheets">  
  <div class="relative isolate px-6 lg:px-8 h-[81vh] overflow-hidden">  
    <div class="flex items-center">  
      <div class="mx-auto max-w-2xl py-20 sm:py-30 lg:py-34">  
        <div class="hidden sm:mb-8 sm:flex sm:justify-center">  
          <div class="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">  
            Read how to create this website <a href="https://blog.iabhinavj.com" class="font-semibold text-indigo-600"><span class="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>  
          </div>  
        </div>  
        <div class="text-center">  
          <h1 class="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">Books are amazing so are you</h1>  
          <p class="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.</p>  
          <div class="mt-10 flex items-center justify-center gap-x-6">  
            <a href="/page/1" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Browse Books</a>  
            <a href="https://github.com/iAbhinavJain/astro-book" class="text-sm/6 font-semibold text-gray-900">Star on Github <span aria-hidden="true">→</span></a>  
          </div>  
        </div>  
      </div>  
    </div>  
    <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">  
      <div class="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>  
    </div>  
  </div>  
</Layout>
```

**/src/pages/page/[page].astro**

```javascript
---  
import { fetchBooks } from "../../utils/fetchBooks";  
import "../../styles/global.css";  
import Layout from "../../layouts/Layout.astro";  
  
export async function getStaticPaths() {  
  const books = await fetchBooks();  
  const perPage = 12; // Number of items per page  
  const totalPages = Math.ceil(books.length / perPage);  
  
  return Array.from({ length: totalPages }, (_, i) => ({  
    params: { page: (i + 1).toString() },  
  }));  
}  
  
const books = await fetchBooks();  
const perPage = 12;  
const page = Number(Astro.params.page);  
const paginatedBooks = books.slice((page - 1) * perPage, page * perPage);  
const totalPages = Math.ceil(books.length / perPage);  
---  
  
<Layout title=`SheetBook - Page ${page}`>  
    <div class="bg-white">  
        <div class="mx-auto px-[10%] py-6">  
          <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">  
            {paginatedBooks.map(book => (  
            <div class="group relative">  
              <img src={book.image} alt={book.title}  
                class="w-full bg-gray-200 object-cover group-hover:opacity-75 h-[46vh]">  
              <div class="mt-4 flex justify-between">  
                <div>  
                  <h3 class="text-sm text-gray-700 overflow-hidden text-ellipsis">  
                    <a href=`/book/${book.slug}`>  
                      <span aria-hidden="true" class="absolute inset-0"></span>  
                      {book.title.length > 50 ? book.title.substring(0, 50) + "..." : book.title}  
                    </a>  
                  </h3>  
                  <p class="mt-1 text-sm text-gray-500">{book.author}</p>  
                </div>  
                <p class="text-sm font-medium text-gray-900">{book.year}</p>  
              </div>  
            </div>  
            ))}  
          </div>  
        </div>  
      </div>  
      <!-- Navigation -->  
      <div class="flex items-center justify-between border-t border-gray-200 bg-white px-[10%] py-3">  
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">  
          <div>  
            <p class="text-sm text-gray-700">  
              Showing  
              <span class="font-medium">{((page * perPage) - perPage) + 1}</span>  
              to  
              <span class="font-medium">{page * perPage}</span>  
              of  
              <span class="font-medium">{totalPages}</span>  
              results  
            </p>  
          </div>  
          <div>  
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">  
              {page > 1 && <a href={`/page/${page - 1}/`}  
      class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">  
      <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">  
        <path fill-rule="evenodd"  
          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"  
          clip-rule="evenodd" />  
      </svg>  
      <span>Previous</span>  
    </a>}  
      {page < totalPages && <a href={`/page/${page + 1}/`}  
      class="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">  
      <span>Next</span>  
      <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">  
        <path fill-rule="evenodd"  
          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"  
          clip-rule="evenodd" />  
      </svg>  
    </a>}  
            </nav>  
          </div>  
        </div>  
      </div>  
</Layout>
```

**/src/pages/book/[slug].astro**

---  
```javascript
import { fetchBooks } from "../../utils/fetchBooks";  
import "../../styles/global.css";  
import Layout from "../../layouts/Layout.astro";  
  
export async function getStaticPaths() {  
  const books = await fetchBooks();  
  return books.map(book => ({ params: { slug: book.slug } }));  
}  
  
const books = await fetchBooks();  
const book = books.find(b => b.slug === Astro.params.slug);  
---  
  
<Layout title={book.title}>  
      
    <section>  
        <div class="bg-white z-99 relative pb-5 min-h-[80.5vh] flex md:items-center">  
          <div class="mx-auto px-[10%] py-6">  
            <div class="mt-6 md:flex gap-10 items-center">  
              <div class="w-full md:max-w-[30%]">  
                <img  
                  src={book.image}  
                  alt={book.title}  
                  class="w-full bg-gray-200 object-cover group-hover:opacity-75"  
                />  
              </div>  
              <div class="md:max-w-[50%] mt-6 md:mt-0">  
                <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{book.title}</h1>  
                <div class="py-10 lg:col-span-2 lg:col-start-1 lg:pt-6 lg:pr-8 lg:pb-16">  
                  <!-- Description and details -->  
                  <div>  
                    <h3 class="sr-only">Description</h3>  
          
                    <div class="space-y-6">  
                      <p class="text-base text-gray-900"><i>The book, "{book.title}"</i> was written by {book.author} in {book.year}. This book is published by {book.pub}. Feel free to click the button below to learn more about this book on google. </p>  
                    </div>  
                  </div>  
          
                  <div class="mt-10">  
                    <h3 class="text-sm font-medium text-gray-900">Highlights</h3>  
          
                    <div class="mt-4">  
                      <ul role="list" class="list-disc space-y-2 pl-4 text-sm">  
                        <li class="text-gray-400"><span class="text-gray-600"><b>Author:</b> {book.author}</span></li>  
                        <li class="text-gray-400"><span class="text-gray-600"><b>Publisher: </b>{book.pub}</span></li>  
                        <li class="text-gray-400"><span class="text-gray-600"><b>Year: </b> {book.year}</span></li>  
                          
                      </ul>  
                    </div>  
                      
                <a target="_blank" href=`https://www.google.com/search?q=${book.title}` class="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-slate-950 px-8 py-3 text-base font-medium text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 focus:outline-hidden">Search for book on Google</a>  
                
                  </div>  
                </div>  
              </div>  
            </div>  
          </div>  
        </div>  
      </section>  
</Layout>
```

There you have it a decently designed, fully working website with just google sheets and Astro JS. You can also fork (and possibly star) the github repository:

[**GitHub - iAbhinavJain/astro-book: A Project build for Tutorial on How to Build a Serverless…**  
_A Project build for Tutorial on How to Build a Serverless Astro.js Website with Google Sheets as a Database (Free &…_github.com](https://github.com/iAbhinavJain/astro-book "https://github.com/iAbhinavJain/astro-book")[](https://github.com/iAbhinavJain/astro-book)

---

## Part 4: Sitemap

If you do plan to make a website like this and make it public, you probably want to make it seo friendly and one of the ways to make sure the pages are being indexed by search engines is by having a sitemap page, let’s quickly add it. 

Create a file called **sitemap.xml.js** in /src/pages/ directory and add the following code:

```javascript
import { fetchBooks } from "../utils/fetchBooks";  
  
export async function GET() {  
  const books = await fetchBooks();  
  return new Response(  
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  
      <url><loc>https://yourdomain.com/</loc></url>  
      ${books.map(book => `<url><loc>https://yourdomain.com/book/${book.slug}</loc></url>`).join('')}  
    </urlset>`,  
    { headers: { "Content-Type": "application/xml" } }  
  );  
}

```

There you have it, replace yourdomain.com with your site address and you have a fully working sitemap page. 

---

## Part 5: Deploy it for free on Cloudflare Pages and add write AppScript to rebuild after changes in Google Sheets

You can deploy the project on services like cloudflare pages for completely free, if you are looking for steps on the same, you can follow Part 3 of this blog post:  
[https://blog.iabhinavj.com/blog/create-free-blog/](https://blog.iabhinavj.com/blog/create-free-blog/)

But now, since the website is statically generated, we need to rebuild it every time the data in Google Sheets is updated. To do this, 

### Create a Deploy Hook in Cloudflare Pages

Whatever you are using to host the site should have some sort of deploy hook, I am using cloudflare, you can easily create a deploy hook by going to project settings and add a deploy hook:

![](https://cdn-images-1.medium.com/max/800/1*KX3bOJjbtPrwr58VN9Z6qg.png)

Now, edit your Google Sheets, go to Extensions > App Script.

![](https://cdn-images-1.medium.com/max/800/1*JSw54w_7cLhofmc4OugqWQ.png)

Paste the following code in there, be sure to replace the webhook url with one you just got.

```javascript
const CLOUDFLARE_WEBHOOK_URL = "YOUR_CLOUDFLARE_PAGES_WEBHOOK_URL";  
  
function onEdit(e) {  
  const cache = CacheService.getScriptCache();  
  cache.put("lastEdit", new Date().toString(), 600); // Store last edit time for 10 mins  
  
  // Clear previous triggers (prevents stacking)  
  ScriptApp.getProjectTriggers().forEach(trigger => {  
    if (trigger.getHandlerFunction() === "triggerCloudflareBuild") {  
      ScriptApp.deleteTrigger(trigger);  
    }  
  });  
  
  // Set a delayed trigger to run 10 mins after the last edit  
  ScriptApp.newTrigger("triggerCloudflareBuild")  
    .timeBased()  
    .after(10 * 60 * 1000) // 10 minutes  
    .create();  
}  
  
function triggerCloudflareBuild() {  
  const cache = CacheService.getScriptCache();  
  const lastEditTime = new Date(cache.get("lastEdit"));  
  const now = new Date();  
  
  // Ensure no further edits have happened in the last 10 mins  
  if (now - lastEditTime >= 10 * 60 * 1000) {  
    UrlFetchApp.fetch(CLOUDFLARE_WEBHOOK_URL, { method: "POST" });  
  }  
}
```

- Go to triggers and Click “Add Trigger”.  
    Choose:  
    Function to run: **onEdit**  
    Event source: **From spreadsheet**  
    Event type: **On edit**  
    Click **Save**.

![](https://cdn-images-1.medium.com/max/800/1*5U9G-HfgljI5xmHBafaCmA.png)

- You may need to authorize the function to run by giving permissions

### ✅ How This Works

- Every time a user **edits the sheet**, it updates the last edit time in the **cache**.
- If no further edits happen within **10 minutes**, the **Cloudflare deploy webhook** is triggered.
- If a user **keeps editing**, the timer resets, preventing unnecessary builds.

There you have it, a fully static Astro website using Google Sheets as CMS with dynamic routing and automatic updates. 

That was my guide on How to Build a Serverless Astro.js Website with Google Sheets as a CMS & Dynamic Routing (Free & Easy!). I tried to make it simple, I do realize that it can be a lot for people who are not familiar with web development or programming in general but again this post is meant for those who have a basic understanding of code and web development in general.

If you have any questions, feel free to drop them in the comments section and I would definitely reply to them.