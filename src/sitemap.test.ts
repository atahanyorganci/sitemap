import { describe, expect, it } from "vitest";
import { generateSitemap } from "./sitemap.js";

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
