# [`@yorganci/sitemap`][github]

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

[`@yorganci/sitemap`][github] is a simple, runtime-independent library for generating XML sitemaps that conform to the [Sitemaps Protocol](https://www.sitemaps.org/protocol.html).

## Usage

Package is available on [npm][npm] and [JSR][jsr] registeries.

```bash
# npm
npm install @yorganci/sitemap

# pnpm
pnpm add @yorganci/sitemap

# yarn
yarn add @yorganci/sitemap

# deno
deno add jsr:@yorganci/sitemap

# bun
bun add @yorganci/sitemap
```

### Basic Sitemap

```typescript
import { generateSitemap } from "@yorganci/sitemap";

const sitemap = generateSitemap([
	{
		loc: "https://example.com/",
		lastmod: "2024-01-01",
		changefreq: "monthly",
		priority: 0.8,
	},
	{
		loc: "https://example.com/about",
		lastmod: "2024-01-15",
		changefreq: "yearly",
		priority: 0.5,
	},
]);

console.log(sitemap);
```

Output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Sitemap Index

For large sites with many URLs, you can create a sitemap index that references multiple sitemaps:

```typescript
import { generateSitemapIndex } from "@yorganci/sitemap";

const index = generateSitemapIndex([
	{ loc: "https://example.com/sitemap-posts.xml", lastmod: "2024-01-15" },
	{ loc: "https://example.com/sitemap-products.xml", lastmod: "2024-01-10" },
	{ loc: "https://example.com/sitemap-pages.xml" },
]);
```

Output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2024-01-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
  </sitemap>
</sitemapindex>
```

### Sitemap Collection

Automatically split URLs across multiple sitemaps and generate an index:

```typescript
import { generateSitemapCollection } from "@yorganci/sitemap";

const urls = Array.from({ length: 100000 }, (_, i) => ({
	loc: `https://example.com/page-${i}`,
}));

const { sitemapIndex, sitemaps } = generateSitemapCollection("https://example.com", urls, {
	maxUrlsPerSitemap: 50000, // Optional, defaults to 50,000 (protocol maximum)
	prefix: "sitemap", // Results in sitemap-0.xml, sitemap-1.xml, etc.
});
```

Output:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-0.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-1.xml</loc>
  </sitemap>
</sitemapindex>
```

## License

[MIT](./LICENSE)

[github]: https://github.com/atahanyorganci/sitemap
[npm]: https://npmjs.com/package/@yorganci/sitemap
[jsr]: https://jsr.io/package/@yorganci/sitemap
[npm-version-src]: https://img.shields.io/npm/v/@yorganci/sitemap?style=for-the-badge&logo=git&label=release
[npm-version-href]: https://npmjs.com/package/@yorganci/sitemap
[npm-downloads-src]: https://img.shields.io/npm/dm/@yorganci/sitemap?style=for-the-badge&logo=npm
[npm-downloads-href]: https://npmjs.com/package/@yorganci/sitemap
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@yorganci/sitemap?style=for-the-badge
[bundle-href]: https://bundlephobia.com/result?p=%40yorganci/sitemap
[license-src]: https://img.shields.io/github/license/atahanyorganci/sitemap.svg?style=for-the-badge
[license-href]: https://github.com/atahanyorganci/sitemap/blob/main/LICENSE
