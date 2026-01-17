import { describe, expect, it } from "vitest";
import {
	generateSitemap,
	generateSitemapIndex,
	generateSitemapCollection,
	generateSitemapStream,
	type SitemapUrl,
} from "./sitemap.js";

describe("generateSitemap", () => {
	describe("validation", () => {
		it("throws error when no URLs provided", () => {
			expect(() => generateSitemap([])).toThrow("No URLs provided");
		});

		it("throws error when URL exceeds 2048 characters", () => {
			const longUrl = `http://www.example.com/${"a".repeat(2048)}`;
			expect(() => generateSitemap([{ loc: longUrl }])).toThrow("URL length must be less than 2048 characters");
		});

		it("throws error for invalid lastmod date format", () => {
			expect(() => generateSitemap([{ loc: "http://www.example.com/", lastmod: "2024/01/15" }])).toThrow(
				"Last modified date must be in YYYY-MM-DD format",
			);
		});

		it("throws error for lastmod with time component", () => {
			expect(() => generateSitemap([{ loc: "http://www.example.com/", lastmod: "2024-01-15T10:30:00Z" }])).toThrow(
				"Last modified date must be in YYYY-MM-DD format",
			);
		});

		it("throws error when priority is below 0", () => {
			expect(() => generateSitemap([{ loc: "http://www.example.com/", priority: -0.1 }])).toThrow(
				"Priority must be between 0 and 1",
			);
		});

		it("throws error when priority is above 1", () => {
			expect(() => generateSitemap([{ loc: "http://www.example.com/", priority: 1.1 }])).toThrow(
				"Priority must be between 0 and 1",
			);
		});

		it("accepts priority of 0", () => {
			const sitemap = generateSitemap([{ loc: "http://www.example.com/", priority: 0 }]);
			expect(sitemap).toContain("<priority>0</priority>");
		});
	});

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

describe("sitemap extensions", () => {
	describe("image sitemap", () => {
		it("generates sitemap with single image", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
					images: [{ loc: "http://www.example.com/image.jpg" }],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with image including all fields", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
					images: [
						{
							loc: "http://www.example.com/photo.jpg",
							caption: "A beautiful sunset over the mountains",
							geoLocation: "Limerick, Ireland",
							title: "Sunset Photo",
							license: "http://www.example.com/license",
						},
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with multiple images", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/gallery",
					images: [
						{ loc: "http://www.example.com/image1.jpg", title: "Image 1" },
						{ loc: "http://www.example.com/image2.jpg", title: "Image 2" },
						{ loc: "http://www.example.com/image3.jpg", title: "Image 3" },
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("throws error when more than 1000 images per URL", () => {
			const images = Array.from({ length: 1001 }, (_, i) => ({
				loc: `http://www.example.com/image${i}.jpg`,
			}));
			expect(() => generateSitemap([{ loc: "http://www.example.com/page", images }])).toThrow(
				"Maximum 1000 images per URL",
			);
		});

		it("includes image namespace only when images are present", () => {
			const sitemapWithImages = generateSitemap([
				{ loc: "http://www.example.com/page", images: [{ loc: "http://www.example.com/img.jpg" }] },
			]);
			const sitemapWithoutImages = generateSitemap([{ loc: "http://www.example.com/page" }]);

			expect(sitemapWithImages).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
			expect(sitemapWithoutImages).not.toContain("xmlns:image");
		});
	});

	describe("video sitemap", () => {
		it("generates sitemap with video using contentLoc", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/videos/video1",
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumbs/video1.jpg",
							title: "Grilling steaks for summer",
							description: "A tutorial on how to grill steaks perfectly",
							contentLoc: "http://www.example.com/videos/video1.mp4",
						},
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with video using playerLoc", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/videos/video1",
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumbs/video1.jpg",
							title: "Grilling steaks for summer",
							description: "A tutorial on how to grill steaks perfectly",
							playerLoc: "http://www.example.com/player?video=video1",
						},
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with video including all optional fields", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/videos/video1",
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumbs/video1.jpg",
							title: "Grilling steaks for summer",
							description: "A comprehensive tutorial on grilling techniques",
							contentLoc: "http://www.example.com/videos/video1.mp4",
							playerLoc: "http://www.example.com/player?video=video1",
							duration: 600,
							expirationDate: "2025-12-31",
							rating: 4.5,
							viewCount: 15000,
							publicationDate: "2024-06-15",
							familyFriendly: true,
							requiresSubscription: false,
							live: false,
							tags: ["grilling", "cooking", "summer", "barbecue"],
							category: "Cooking",
							restriction: { relationship: "allow", countries: ["US", "CA", "GB"] },
							platform: { relationship: "allow", platforms: ["web", "mobile"] },
							price: { currency: "USD", value: 1.99, type: "rent", resolution: "hd" },
							uploader: { name: "GrillingChannel", info: "http://www.example.com/users/grillingchannel" },
						},
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("throws error when video has neither contentLoc nor playerLoc", () => {
			expect(() =>
				generateSitemap([
					{
						loc: "http://www.example.com/page",
						videos: [
							{
								thumbnailLoc: "http://www.example.com/thumb.jpg",
								title: "Test Video",
								description: "Test Description",
							},
						],
					},
				]),
			).toThrow("Video must have either contentLoc or playerLoc");
		});

		it("throws error when video duration is out of range", () => {
			expect(() =>
				generateSitemap([
					{
						loc: "http://www.example.com/page",
						videos: [
							{
								thumbnailLoc: "http://www.example.com/thumb.jpg",
								title: "Test Video",
								description: "Test Description",
								contentLoc: "http://www.example.com/video.mp4",
								duration: 30000,
							},
						],
					},
				]),
			).toThrow("Video duration must be between 1 and 28800 seconds");
		});

		it("throws error when video rating is out of range", () => {
			expect(() =>
				generateSitemap([
					{
						loc: "http://www.example.com/page",
						videos: [
							{
								thumbnailLoc: "http://www.example.com/thumb.jpg",
								title: "Test Video",
								description: "Test Description",
								contentLoc: "http://www.example.com/video.mp4",
								rating: 6.0,
							},
						],
					},
				]),
			).toThrow("Video rating must be between 0.0 and 5.0");
		});

		it("throws error when video has more than 32 tags", () => {
			const tags = Array.from({ length: 33 }, (_, i) => `tag${i}`);
			expect(() =>
				generateSitemap([
					{
						loc: "http://www.example.com/page",
						videos: [
							{
								thumbnailLoc: "http://www.example.com/thumb.jpg",
								title: "Test Video",
								description: "Test Description",
								contentLoc: "http://www.example.com/video.mp4",
								tags,
							},
						],
					},
				]),
			).toThrow("Maximum 32 tags per video");
		});

		it("includes video namespace only when videos are present", () => {
			const sitemapWithVideos = generateSitemap([
				{
					loc: "http://www.example.com/page",
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumb.jpg",
							title: "Test",
							description: "Test",
							contentLoc: "http://www.example.com/video.mp4",
						},
					],
				},
			]);
			const sitemapWithoutVideos = generateSitemap([{ loc: "http://www.example.com/page" }]);

			expect(sitemapWithVideos).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
			expect(sitemapWithoutVideos).not.toContain("xmlns:video");
		});
	});

	describe("news sitemap", () => {
		it("generates sitemap with news article", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/news/article1",
					news: {
						publication: {
							name: "The Example Times",
							language: "en",
						},
						publicationDate: "2024-01-15",
						title: "Breaking News: Something Important Happened",
					},
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with news article using datetime format", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/news/article2",
					news: {
						publication: {
							name: "El Diario Ejemplo",
							language: "es",
						},
						publicationDate: "2024-01-15T14:30:00+00:00",
						title: "Noticias de última hora",
					},
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("includes news namespace only when news is present", () => {
			const sitemapWithNews = generateSitemap([
				{
					loc: "http://www.example.com/page",
					news: {
						publication: { name: "Test News", language: "en" },
						publicationDate: "2024-01-15",
						title: "Test Article",
					},
				},
			]);
			const sitemapWithoutNews = generateSitemap([{ loc: "http://www.example.com/page" }]);

			expect(sitemapWithNews).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
			expect(sitemapWithoutNews).not.toContain("xmlns:news");
		});
	});

	describe("xhtml alternates", () => {
		it("generates sitemap with alternate language versions", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/english/page",
					alternates: [
						{ href: "http://www.example.com/english/page", hreflang: "en" },
						{ href: "http://www.example.com/deutsch/page", hreflang: "de" },
						{ href: "http://www.example.com/espanol/page", hreflang: "es" },
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with x-default alternate", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
					alternates: [
						{ href: "http://www.example.com/page", hreflang: "x-default" },
						{ href: "http://www.example.com/en/page", hreflang: "en" },
						{ href: "http://www.example.com/fr/page", hreflang: "fr" },
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("generates sitemap with region-specific alternates", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
					alternates: [
						{ href: "http://www.example.com/en-us/page", hreflang: "en-US" },
						{ href: "http://www.example.com/en-gb/page", hreflang: "en-GB" },
						{ href: "http://www.example.com/es-es/page", hreflang: "es-ES" },
						{ href: "http://www.example.com/es-mx/page", hreflang: "es-MX" },
					],
				},
			]);
			expect(sitemap).toMatchSnapshot();
		});

		it("includes xhtml namespace only when alternates are present", () => {
			const sitemapWithAlternates = generateSitemap([
				{
					loc: "http://www.example.com/page",
					alternates: [{ href: "http://www.example.com/de/page", hreflang: "de" }],
				},
			]);
			const sitemapWithoutAlternates = generateSitemap([{ loc: "http://www.example.com/page" }]);

			expect(sitemapWithAlternates).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
			expect(sitemapWithoutAlternates).not.toContain("xmlns:xhtml");
		});
	});

	describe("combined extensions", () => {
		it("generates sitemap with multiple extension types", () => {
			const urls: SitemapUrl[] = [
				{
					loc: "http://www.example.com/article",
					lastmod: "2024-01-15",
					changefreq: "daily",
					priority: 0.9,
					images: [
						{ loc: "http://www.example.com/article-hero.jpg", title: "Article Hero Image" },
						{ loc: "http://www.example.com/article-thumb.jpg" },
					],
					news: {
						publication: { name: "The Example Times", language: "en" },
						publicationDate: "2024-01-15",
						title: "Breaking News Article",
					},
					alternates: [
						{ href: "http://www.example.com/article", hreflang: "en" },
						{ href: "http://www.example.com/de/article", hreflang: "de" },
					],
				},
			];
			const sitemap = generateSitemap(urls);
			expect(sitemap).toMatchSnapshot();
		});

		it("includes all required namespaces for multiple extensions", () => {
			const sitemap = generateSitemap([
				{
					loc: "http://www.example.com/page",
					images: [{ loc: "http://www.example.com/img.jpg" }],
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumb.jpg",
							title: "Test",
							description: "Test",
							contentLoc: "http://www.example.com/video.mp4",
						},
					],
					news: {
						publication: { name: "Test", language: "en" },
						publicationDate: "2024-01-15",
						title: "Test",
					},
					alternates: [{ href: "http://www.example.com/de/page", hreflang: "de" }],
				},
			]);

			expect(sitemap).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
			expect(sitemap).toContain('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"');
			expect(sitemap).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
			expect(sitemap).toContain('xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"');
			expect(sitemap).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
		});
	});
});

async function collectStream(stream: ReadableStream<Uint8Array>): Promise<string> {
	const decoder = new TextDecoder();
	const reader = stream.getReader();
	const chunks: string[] = [];
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		chunks.push(decoder.decode(value));
	}
	return chunks.join("");
}

describe("generateSitemapStream", () => {
	describe("basic functionality", () => {
		it("generates stream with single URL", async () => {
			const stream = generateSitemapStream([{ loc: "http://www.example.com/page" }]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("generates stream with multiple URLs", async () => {
			const stream = generateSitemapStream([
				{ loc: "http://www.example.com/page1" },
				{ loc: "http://www.example.com/page2" },
				{ loc: "http://www.example.com/page3" },
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("generates stream with all URL fields", async () => {
			const stream = generateSitemapStream([
				{
					loc: "http://www.example.com/",
					lastmod: "2024-01-15",
					changefreq: "weekly",
					priority: 0.8,
				},
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("returns a ReadableStream", () => {
			const stream = generateSitemapStream([{ loc: "http://www.example.com/" }]);
			expect(stream).toBeInstanceOf(ReadableStream);
		});
	});

	describe("URL extensions", () => {
		it("generates stream with image extension", async () => {
			const stream = generateSitemapStream([
				{
					loc: "http://www.example.com/page",
					images: [{ loc: "http://www.example.com/image.jpg", title: "Test Image" }],
				},
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("generates stream with video extension", async () => {
			const stream = generateSitemapStream([
				{
					loc: "http://www.example.com/page",
					videos: [
						{
							thumbnailLoc: "http://www.example.com/thumb.jpg",
							title: "Test Video",
							description: "A test video",
							contentLoc: "http://www.example.com/video.mp4",
						},
					],
				},
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("generates stream with news extension", async () => {
			const stream = generateSitemapStream([
				{
					loc: "http://www.example.com/news/article",
					news: {
						publication: { name: "Test News", language: "en" },
						publicationDate: "2024-01-15",
						title: "Breaking News",
					},
				},
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});

		it("generates stream with alternate links", async () => {
			const stream = generateSitemapStream([
				{
					loc: "http://www.example.com/page",
					alternates: [
						{ href: "http://www.example.com/en/page", hreflang: "en" },
						{ href: "http://www.example.com/de/page", hreflang: "de" },
					],
				},
			]);
			const sitemap = await collectStream(stream);

			expect(sitemap).toMatchSnapshot();
		});
	});

	describe("validation", () => {
		it("throws error when URL exceeds 2048 characters", async () => {
			const longUrl = `http://www.example.com/${"a".repeat(2048)}`;
			expect(() => generateSitemapStream([{ loc: longUrl }])).toThrow("URL length must be less than 2048 characters");
		});

		it("throws error for invalid lastmod date format", async () => {
			expect(() => generateSitemapStream([{ loc: "http://www.example.com/", lastmod: "2024/01/15" }])).toThrow(
				"Last modified date must be in YYYY-MM-DD format",
			);
		});

		it("throws error when priority is out of range", async () => {
			expect(() => generateSitemapStream([{ loc: "http://www.example.com/", priority: 1.5 }])).toThrow(
				"Priority must be between 0 and 1",
			);
		});

		it("throws error when video has neither contentLoc nor playerLoc", async () => {
			expect(() =>
				generateSitemapStream([
					{
						loc: "http://www.example.com/page",
						videos: [
							{
								thumbnailLoc: "http://www.example.com/thumb.jpg",
								title: "Test",
								description: "Test",
							},
						],
					},
				]),
			).toThrow("Video must have either contentLoc or playerLoc");
		});
	});

	describe("empty URLs", () => {
		it("returns empty stream when no URLs provided", async () => {
			expect(() => generateSitemapStream([])).toThrow();
		});
	});
});
