// Injects the site's shared Book/Person/Organization JSON-LD entities into every
// HTML page's <head>, so those three entities are defined exactly once (here)
// instead of being duplicated inline on every page — the duplication is what
// caused the schema drift fixed across the site on 2026-08-21.
//
// Page-specific schema (Article, FAQPage, BreadcrumbList, the page's own Book-page
// WebPage entry, etc.) stays inline in each HTML file as before. Those entries
// reference this shared data via bare `{ "@id": "..." }` pointers, which resolve
// correctly because both this injected <script> block and the page's own
// <script> block are read together as one page by JSON-LD consumers.

const SHARED_SCHEMA = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://hopeafterheartfailure.com/#organization",
      "name": "Phoenix Rising Media LLC",
      "url": "https://hopeafterheartfailure.com/"
    },
    {
      "@type": "Person",
      "@id": "https://hopeafterheartfailure.com/#author",
      "name": "Greg R. Traver",
      "description": "Greg R. Traver is a two-time heart failure survivor and the author of Hope After Heart Failure, published through Phoenix Rising Media LLC.",
      "jobTitle": "Author",
      "affiliation": { "@id": "https://hopeafterheartfailure.com/#organization" },
      "image": "https://hopeafterheartfailure.com/images/author.jpg",
      "url": "https://hopeafterheartfailure.com/about"
    },
    {
      "@type": "Book",
      "@id": "https://hopeafterheartfailure.com/#book",
      "name": "Hope After Heart Failure: A Survivor's Guide for Recovery After Cardiac Crisis",
      "alternateName": "A Survivor's Guide for Recovery After Cardiac Crisis",
      "author": { "@id": "https://hopeafterheartfailure.com/#author" },
      "publisher": { "@id": "https://hopeafterheartfailure.com/#organization" },
      "image": "https://hopeafterheartfailure.com/images/book-cover.png",
      "url": "https://hopeafterheartfailure.com/",
      "description": "A two-time heart failure survivor shares what doctors can't tell you — how to truly live again. Discover hope, healing, and the miracles that await you.",
      "genre": ["Health & Recovery", "Inspirational Memoir", "Faith-Based Healing"],
      "isbn": "9798996369836",
      "bookFormat": "https://schema.org/Hardcover",
      "inLanguage": "en"
    }
  ]
}
</script>
`;

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const html = await response.text();
  if (!html.includes("</head>")) {
    return new Response(html, response);
  }

  const injected = html.replace("</head>", `${SHARED_SCHEMA}</head>`);
  return new Response(injected, response);
};

export const config = { path: "/*" };
