import { describe, expect, it } from "vitest";
import { generateSitemap, generateSitemapIndex, generateSitemapCollection } from "./sitemap.js";

describe("generateSitemap", () => {
	describe("Sitemaps Protocol examples", () => {
		it("generates basic single URL with all fields", () => {
			// Example from https://www.sitemaps.org/protocol.html
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/",
					lastmod: "2005-01-01",
					changefreq: "monthly",
					priority: 0.8,
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates multiple URLs with various optional fields", () => {
			// Multiple URLs example from https://www.sitemaps.org/protocol.html
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/",
					lastmod: "2005-01-01",
					changefreq: "monthly",
					priority: 0.8,
				},
				{
					loc: "http://www.example.com/catalog?item=12&desc=vacation_hawaii",
					changefreq: "weekly",
				},
				{
					loc: "http://www.example.com/catalog?item=73&desc=vacation_new_zealand",
					lastmod: "2004-12-23",
					changefreq: "weekly",
				},
				{
					loc: "http://www.example.com/catalog?item=74&desc=vacation_newfoundland",
					lastmod: "2004-12-23",
					priority: 0.3,
				},
				{
					loc: "http://www.example.com/catalog?item=83&desc=vacation_usa",
					lastmod: "2004-11-23",
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates URL with only required loc field", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with all changefreq values", () => {
			const sitemap = generateSitemap([
				{ loc: "http://www.example.com/always", changefreq: "always" },
				{ loc: "http://www.example.com/hourly", changefreq: "hourly" },
				{ loc: "http://www.example.com/daily", changefreq: "daily" },
				{ loc: "http://www.example.com/weekly", changefreq: "weekly" },
				{ loc: "http://www.example.com/monthly", changefreq: "monthly" },
				{ loc: "http://www.example.com/yearly", changefreq: "yearly" },
				{ loc: "http://www.example.com/never", changefreq: "never" },
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with priority boundary values", () => {
			const sitemap = generateSitemap([
				{ loc: "http://www.example.com/low", priority: 0.0 },
				{ loc: "http://www.example.com/default", priority: 0.5 },
				{ loc: "http://www.example.com/high", priority: 1.0 },
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap without pretty print", () => {
			const sitemap = generateSitemap(
				[
					{
						loc: "http://www.example.com/",
						lastmod: "2005-01-01",
						changefreq: "monthly",
						priority: 0.8,
					},
				],
				{ prettyPrint: false },
			);
			expect(sitemap).toMatchSnapshot();
		});
	});
});

describe("generateSitemapIndex", () => {
	describe("Sitemaps Protocol examples", () => {
		it("generates sitemap index with multiple sitemaps", () => {
			// Example from https://www.sitemaps.org/protocol.html#index
			const index = generateSitemapIndex([
				{
					loc: "http://www.example.com/sitemap1.xml.gz",
					lastmod: "2004-10-01",
				},
				{
					loc: "http://www.example.com/sitemap2.xml.gz",
					lastmod: "2005-01-01",
				},
			]);
			expect(index).toMatchSnapshot();
		});

		it("generates sitemap index with only required loc field", () => {
			const index = generateSitemapIndex([
				{ loc: "http://www.example.com/sitemap1.xml" },
				{ loc: "http://www.example.com/sitemap2.xml" },
				{ loc: "http://www.example.com/sitemap3.xml" },
			]);
			expect(index).toMatchSnapshot();
		});

		it("generates sitemap index with mixed optional fields", () => {
			const index = generateSitemapIndex([
				{ loc: "http://www.example.com/sitemap-posts.xml", lastmod: "2026-01-15" },
				{ loc: "http://www.example.com/sitemap-products.xml" },
				{ loc: "http://www.example.com/sitemap-pages.xml", lastmod: "2026-01-10" },
			]);
			expect(index).toMatchSnapshot();
		});

		it("generates sitemap index without pretty print", () => {
			const index = generateSitemapIndex(
				[
					{ loc: "http://www.example.com/sitemap1.xml.gz", lastmod: "2004-10-01" },
					{ loc: "http://www.example.com/sitemap2.xml.gz", lastmod: "2005-01-01" },
				],
				{ prettyPrint: false },
			);
			expect(index).toMatchSnapshot();
		});
	});

	describe("validation", () => {
		it("throws error when no sitemaps provided", () => {
			expect(() => generateSitemapIndex([])).toThrow("No sitemaps provided");
		});

		it("throws error when sitemap count exceeds 50,000", () => {
			const sitemaps = Array.from({ length: 50001 }, (_, i) => ({
				loc: `http://www.example.com/sitemap${i}.xml`,
			}));
			expect(() => generateSitemapIndex(sitemaps)).toThrow("Sitemap index can contain up to 50,000 sitemaps");
		});

		it("throws error for invalid lastmod date format", () => {
			expect(() =>
				generateSitemapIndex([{ loc: "http://www.example.com/sitemap.xml", lastmod: "2024/01/15" }]),
			).toThrow("Last modified date must be in YYYY-MM-DD format");
		});

		it("throws error for lastmod with time component", () => {
			expect(() =>
				generateSitemapIndex([{ loc: "http://www.example.com/sitemap.xml", lastmod: "2024-01-15T10:30:00Z" }]),
			).toThrow("Last modified date must be in YYYY-MM-DD format");
		});

		it("throws error when sitemap loc exceeds 2048 characters", () => {
			const longLoc = `http://www.example.com/${"a".repeat(2048)}.xml`;
			expect(() => generateSitemapIndex([{ loc: longLoc }])).toThrow(
				"Sitemap location length must be less than 2048 characters",
			);
		});
	});

	describe("boundary cases", () => {
		it("generates sitemap index with single sitemap", () => {
			const index = generateSitemapIndex([{ loc: "http://www.example.com/sitemap.xml" }]);
			expect(index).toMatchSnapshot();
		});

		it("generates sitemap index at maximum allowed count (50,000)", () => {
			const sitemaps = Array.from({ length: 50000 }, (_, i) => ({
				loc: `http://www.example.com/sitemap${i}.xml`,
			}));
			// Should not throw
			expect(() => generateSitemapIndex(sitemaps, { prettyPrint: false })).not.toThrow();
		});
	});
});

describe("generateSitemapCollection", () => {
	describe("basic functionality", () => {
		it("generates collection with single sitemap when URLs fit", () => {
			const { sitemapIndex, sitemaps } = generateSitemapCollection("http://www.example.com", [
				{ loc: "http://www.example.com/page1" },
				{ loc: "http://www.example.com/page2" },
				{ loc: "http://www.example.com/page3" },
			]);
			expect(sitemaps).toHaveLength(1);
			expect(sitemapIndex).toMatchSnapshot();
			expect(sitemaps[0]).toMatchSnapshot();
		});

		it("generates collection with all URL fields", () => {
			const { sitemapIndex, sitemaps } = generateSitemapCollection("http://www.example.com", [
				{
					loc: "http://www.example.com/",
					lastmod: "2005-01-01",
					changefreq: "monthly",
					priority: 0.8,
				},
				{
					loc: "http://www.example.com/about",
					lastmod: "2005-06-15",
					changefreq: "yearly",
					priority: 0.5,
				},
			]);
			expect(sitemaps).toHaveLength(1);
			expect(sitemapIndex).toMatchSnapshot();
			expect(sitemaps[0]).toMatchSnapshot();
		});
	});

	describe("URL splitting", () => {
		it("splits URLs across multiple sitemaps based on maxUrlsPerSitemap", () => {
			const urls = Array.from({ length: 10 }, (_, i) => ({
				loc: `http://www.example.com/page${i}`,
			}));
			const { sitemaps } = generateSitemapCollection("http://www.example.com", urls, {
				maxUrlsPerSitemap: 3,
			});
			// 10 URLs / 3 per sitemap = 4 sitemaps (3 + 3 + 3 + 1)
			expect(sitemaps).toHaveLength(4);
		});

		it("creates correct number of sitemaps for exact division", () => {
			const urls = Array.from({ length: 9 }, (_, i) => ({
				loc: `http://www.example.com/page${i}`,
			}));
			const { sitemaps } = generateSitemapCollection("http://www.example.com", urls, {
				maxUrlsPerSitemap: 3,
			});
			// 9 URLs / 3 per sitemap = 3 sitemaps
			expect(sitemaps).toHaveLength(3);
		});

		it("generates sitemap index referencing all sitemaps", () => {
			const urls = Array.from({ length: 5 }, (_, i) => ({
				loc: `http://www.example.com/page${i}`,
			}));
			const { sitemapIndex, sitemaps } = generateSitemapCollection("http://www.example.com", urls, {
				maxUrlsPerSitemap: 2,
			});
			expect(sitemaps).toHaveLength(3);
			// Verify index contains references to all sitemaps
			expect(sitemapIndex).toContain("sitemap-0.xml");
			expect(sitemapIndex).toContain("sitemap-1.xml");
			expect(sitemapIndex).toContain("sitemap-2.xml");
		});

		it("distributes URLs correctly across sitemaps", () => {
			const urls = Array.from({ length: 5 }, (_, i) => ({
				loc: `http://www.example.com/page${i}`,
			}));
			const { sitemaps } = generateSitemapCollection("http://www.example.com", urls, {
				maxUrlsPerSitemap: 2,
			});
			// First sitemap: page0, page1
			expect(sitemaps[0]).toContain("page0");
			expect(sitemaps[0]).toContain("page1");
			expect(sitemaps[0]).not.toContain("page2");
			// Second sitemap: page2, page3
			expect(sitemaps[1]).toContain("page2");
			expect(sitemaps[1]).toContain("page3");
			// Third sitemap: page4
			expect(sitemaps[2]).toContain("page4");
		});
	});

	describe("options", () => {
		it("uses custom prefix string", () => {
			const { sitemapIndex } = generateSitemapCollection(
				"http://www.example.com",
				[{ loc: "http://www.example.com/page1" }],
				{ prefix: "my-sitemap" },
			);
			expect(sitemapIndex).toContain("my-sitemap-0.xml");
		});

		it("uses custom prefix function", () => {
			const { sitemapIndex } = generateSitemapCollection(
				"http://www.example.com",
				Array.from({ length: 3 }, (_, i) => ({ loc: `http://www.example.com/page${i}` })),
				{
					maxUrlsPerSitemap: 1,
					prefix: index => `http://www.example.com/sitemaps/sitemap-part-${index + 1}.xml`,
				},
			);
			expect(sitemapIndex).toContain("sitemap-part-1.xml");
			expect(sitemapIndex).toContain("sitemap-part-2.xml");
			expect(sitemapIndex).toContain("sitemap-part-3.xml");
		});

		it("generates without pretty print", () => {
			const { sitemapIndex, sitemaps } = generateSitemapCollection(
				"http://www.example.com",
				[{ loc: "http://www.example.com/page1" }],
				{ prettyPrint: false },
			);
			// No newlines in output (except possibly at the end)
			expect(sitemapIndex.trim().split("\n")).toHaveLength(1);
			expect(sitemaps[0].trim().split("\n")).toHaveLength(1);
		});
	});

	describe("validation", () => {
		it("throws error when no URLs provided", () => {
			expect(() => generateSitemapCollection("http://www.example.com", [])).toThrow("No URLs provided");
		});

		it("throws error when maxUrlsPerSitemap is 0", () => {
			expect(() =>
				generateSitemapCollection("http://www.example.com", [{ loc: "http://www.example.com/" }], {
					maxUrlsPerSitemap: 0,
				}),
			).toThrow("Max URLs per sitemap must be between 1 and 50,000");
		});

		it("throws error when maxUrlsPerSitemap exceeds 50,000", () => {
			expect(() =>
				generateSitemapCollection("http://www.example.com", [{ loc: "http://www.example.com/" }], {
					maxUrlsPerSitemap: 50001,
				}),
			).toThrow("Max URLs per sitemap must be between 1 and 50,000");
		});

		it("throws error when prefix is too long", () => {
			expect(() =>
				generateSitemapCollection("http://www.example.com", [{ loc: "http://www.example.com/" }], {
					prefix: "a".repeat(2049),
				}),
			).toThrow("Prefix must be less than 2048 characters");
		});
	});

	describe("boundary cases", () => {
		it("handles single URL", () => {
			const { sitemapIndex, sitemaps } = generateSitemapCollection("http://www.example.com", [
				{ loc: "http://www.example.com/" },
			]);
			expect(sitemaps).toHaveLength(1);
			expect(sitemapIndex).toContain("sitemap-0.xml");
		});

		it("handles maxUrlsPerSitemap of 1", () => {
			const urls = Array.from({ length: 3 }, (_, i) => ({
				loc: `http://www.example.com/page${i}`,
			}));
			const { sitemaps } = generateSitemapCollection("http://www.example.com", urls, {
				maxUrlsPerSitemap: 1,
			});
			expect(sitemaps).toHaveLength(3);
		});

		it("handles maxUrlsPerSitemap at maximum (50,000)", () => {
			// Just verify it doesn't throw with max value
			expect(() =>
				generateSitemapCollection("http://www.example.com", [{ loc: "http://www.example.com/" }], {
					maxUrlsPerSitemap: 50000,
				}),
			).not.toThrow();
		});
	});
});
