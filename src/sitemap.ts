import { create } from "xmlbuilder2";

const CHANGE_FREQUENCY = ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] as const;

/**
 * Valid values for the `<changefreq>` tag in a sitemap.
 */
export type ChangeFrequency = (typeof CHANGE_FREQUENCY)[number];

/**
 * Video information for Google Video sitemaps.
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
 */
export type SitemapVideo = {
	/**
	 * A URL pointing to the video thumbnail image file. Required.
	 */
	thumbnailLoc: string;
	/**
	 * The title of the video. Required. Maximum 100 characters.
	 */
	title: string;
	/**
	 * A description of the video. Required. Maximum 2048 characters.
	 */
	description: string;
	/**
	 * A URL pointing to the actual video media file.
	 * At least one of contentLoc or playerLoc must be present.
	 */
	contentLoc?: string;
	/**
	 * A URL pointing to a player for the video.
	 * At least one of contentLoc or playerLoc must be present.
	 */
	playerLoc?: string;
	/**
	 * The duration of the video in seconds. Value must be from 1 to 28800 (8 hours).
	 */
	duration?: number;
	/**
	 * The date after which the video will no longer be available.
	 * Format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+TZD
	 */
	expirationDate?: string;
	/**
	 * The rating of the video. Values range from 0.0 (low) to 5.0 (high).
	 */
	rating?: number;
	/**
	 * The number of times the video has been viewed.
	 */
	viewCount?: number;
	/**
	 * The date the video was first published.
	 * Format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+TZD
	 */
	publicationDate?: string;
	/**
	 * Whether the video is available with SafeSearch. Defaults to true.
	 */
	familyFriendly?: boolean;
	/**
	 * Whether a subscription is required to view the video.
	 */
	requiresSubscription?: boolean;
	/**
	 * Whether the video is live.
	 */
	live?: boolean;
	/**
	 * Tags associated with the video. Maximum 32 tags.
	 */
	tags?: string[];
	/**
	 * The category of the video. Maximum 256 characters.
	 */
	category?: string;
	/**
	 * Countries where the video may or may not be played.
	 * ISO 3166 country codes.
	 */
	restriction?: {
		relationship: "allow" | "deny";
		countries: string[];
	};
	/**
	 * Platforms where the video may or may not be played.
	 */
	platform?: {
		relationship: "allow" | "deny";
		platforms: ("web" | "mobile" | "tv")[];
	};
	/**
	 * The price to download or view the video.
	 */
	price?: {
		currency: string;
		value: number;
		type?: "rent" | "purchase";
		resolution?: "hd" | "sd";
	};
	/**
	 * Indicates whether to show or hide the video in search results from specific countries.
	 */
	uploader?: {
		name: string;
		info?: string;
	};
};

/**
 * News article information for Google News sitemaps.
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */
export type SitemapNews = {
	/**
	 * Publication information. Required.
	 */
	publication: {
		/**
		 * The name of the news publication. Required.
		 */
		name: string;
		/**
		 * The language of the publication. ISO 639 language code. Required.
		 */
		language: string;
	};
	/**
	 * The date of publication. Required.
	 * Format: YYYY-MM-DD or YYYY-MM-DDThh:mm:ss+TZD
	 */
	publicationDate: string;
	/**
	 * The title of the news article. Required.
	 */
	title: string;
};

/**
 * Image information for Google Image sitemaps.
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
 */
export type SitemapImage = {
	/**
	 * The URL of the image. Required.
	 */
	loc: string;
	/**
	 * The caption of the image.
	 */
	caption?: string;
	/**
	 * The geographic location of the image (e.g., "Limerick, Ireland").
	 */
	geoLocation?: string;
	/**
	 * The title of the image.
	 */
	title?: string;
	/**
	 * A URL to the license of the image.
	 */
	license?: string;
};

/**
 * Alternate language version for xhtml:link elements.
 * @see https://developers.google.com/search/docs/specialty/international/localized-versions
 */
export type SitemapAlternate = {
	/**
	 * The URL of the alternate version. Required.
	 */
	href: string;
	/**
	 * The language code (ISO 639-1) or language-region code.
	 * Use "x-default" for the default version.
	 */
	hreflang: string;
};

/**
 * Parent tag for each URL entry. The remaining tags are children of this tag.
 */
export type SitemapUrl = {
	/**
	 * URL of the page. This URL must begin with the protocol (such as http) and
	 * end with a trailing slash, if your web server requires it. This value must
	 * be less than 2,048 characters.
	 */
	loc: string;
	/**
	 * The date of last modification of the page. This date should be in
	 * [W3C Datetime](http://www.w3.org/TR/NOTE-datetime) format. This format allows you to omit
	 * the time portion, if desired, and use YYYY-MM-DD.
	 *
	 * Note that the date must be set to the date the linked page was last modified, not when the sitemap is generated.
	 *
	 * Note also that this tag is separate from the If-Modified-Since (304) header the server can return,
	 * and search engines may use the information from both sources differently.
	 */
	lastmod?: string;
	/**
	 * How frequently the page is likely to change. This value provides general information to search engines
	 * and may not correlate exactly to how often they crawl the page. Valid values are:
	 *
	 * - always
	 * - hourly
	 * - daily
	 * - weekly
	 * - monthly
	 * - yearly
	 * - never
	 *
	 * The value "always" should be used to describe documents that change each time they are accessed.
	 * The value "never" should be used to describe archived URLs.
	 *
	 * Please note that the value of this tag is considered a hint and not a command. Even though search engine crawlers
	 * may consider this information when making decisions, they may crawl pages marked "hourly" less frequently than that,
	 * and they may crawl pages marked "yearly" more frequently than that. Crawlers may periodically crawl pages marked "never"
	 * so that they can handle unexpected changes to those pages.
	 */
	changefreq?: ChangeFrequency;
	/**
	 * The priority of this URL relative to other URLs on your site. Valid values range from 0.0 to 1.0.
	 * This value does not affect how your pages are compared to pages on other sites—it only
	 * lets the search engines know which pages you deem most important for the crawlers.
	 *
	 * The default priority of a page is 0.5.
	 *
	 * Please note that the priority you assign to a page is not likely to influence the position of your
	 * URLs in a search engine's result pages. Search engines may use this information when selecting between
	 * URLs on the same site, so you can use this tag to increase the likelihood that your most important
	 * pages are present in a search index.
	 *
	 * Also, please note that assigning a high priority to all of the URLs on your site is not likely to help you.
	 * Since the priority is relative, it is only used to select between URLs on your site.
	 */
	priority?: number;
	/**
	 * Images associated with the URL.
	 */
	images?: SitemapImage[];
	/**
	 * Videos associated with the URL.
	 */
	videos?: SitemapVideo[];
	/**
	 * News associated with the URL.
	 */
	news?: SitemapNews;
	/**
	 * Alternate language versions of the page.
	 */
	alternates?: SitemapAlternate[];
};

function getNamespaces(urls: SitemapUrl[]): Record<string, string> {
	const namespaces: Record<string, string> = {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
	};
	for (const url of urls) {
		if (url.images && url.images.length > 0) {
			namespaces["xmlns:image"] = "http://www.google.com/schemas/sitemap-image/1.1";
		}
		if (url.videos && url.videos.length > 0) {
			namespaces["xmlns:video"] = "http://www.google.com/schemas/sitemap-video/1.1";
		}
		if (url.news) {
			namespaces["xmlns:news"] = "http://www.google.com/schemas/sitemap-news/0.9";
		}
		if (url.alternates && url.alternates.length > 0) {
			namespaces["xmlns:xhtml"] = "http://www.w3.org/1999/xhtml";
		}
	}
	return namespaces;
}

type XMLBuilder = ReturnType<typeof create>;

function generateImageElement(builder: XMLBuilder, image: SitemapImage): void {
	const imageElement = builder.ele("image:image");
	imageElement.ele("image:loc").txt(image.loc);
	if (image.caption !== undefined) {
		imageElement.ele("image:caption").txt(image.caption);
	}
	if (image.geoLocation !== undefined) {
		imageElement.ele("image:geo_location").txt(image.geoLocation);
	}
	if (image.title !== undefined) {
		imageElement.ele("image:title").txt(image.title);
	}
	if (image.license !== undefined) {
		imageElement.ele("image:license").txt(image.license);
	}
	imageElement.end();
}

function generateVideoElement(builder: XMLBuilder, video: SitemapVideo): void {
	if (!video.contentLoc && !video.playerLoc) {
		throw new Error("Video must have either contentLoc or playerLoc");
	}
	const videoElement = builder.ele("video:video");
	videoElement.ele("video:thumbnail_loc").txt(video.thumbnailLoc);
	videoElement.ele("video:title").txt(video.title);
	videoElement.ele("video:description").txt(video.description);
	if (video.contentLoc !== undefined) {
		videoElement.ele("video:content_loc").txt(video.contentLoc);
	}
	if (video.playerLoc !== undefined) {
		videoElement.ele("video:player_loc").txt(video.playerLoc);
	}
	if (video.duration !== undefined) {
		if (video.duration < 1 || video.duration > 28800) {
			throw new Error("Video duration must be between 1 and 28800 seconds");
		}
		videoElement.ele("video:duration").txt(video.duration.toString());
	}
	if (video.expirationDate !== undefined) {
		videoElement.ele("video:expiration_date").txt(video.expirationDate);
	}
	if (video.rating !== undefined) {
		if (video.rating < 0 || video.rating > 5) {
			throw new Error("Video rating must be between 0.0 and 5.0");
		}
		videoElement.ele("video:rating").txt(video.rating.toString());
	}
	if (video.viewCount !== undefined) {
		videoElement.ele("video:view_count").txt(video.viewCount.toString());
	}
	if (video.publicationDate !== undefined) {
		videoElement.ele("video:publication_date").txt(video.publicationDate);
	}
	if (video.familyFriendly !== undefined) {
		videoElement.ele("video:family_friendly").txt(video.familyFriendly ? "yes" : "no");
	}
	if (video.requiresSubscription !== undefined) {
		videoElement.ele("video:requires_subscription").txt(video.requiresSubscription ? "yes" : "no");
	}
	if (video.live !== undefined) {
		videoElement.ele("video:live").txt(video.live ? "yes" : "no");
	}
	if (video.tags !== undefined) {
		if (video.tags.length > 32) {
			throw new Error("Maximum 32 tags per video");
		}
		for (const tag of video.tags) {
			videoElement.ele("video:tag").txt(tag);
		}
	}
	if (video.category !== undefined) {
		videoElement.ele("video:category").txt(video.category);
	}
	if (video.restriction !== undefined) {
		videoElement
			.ele("video:restriction", { relationship: video.restriction.relationship })
			.txt(video.restriction.countries.join(" "));
	}
	if (video.platform !== undefined) {
		videoElement
			.ele("video:platform", { relationship: video.platform.relationship })
			.txt(video.platform.platforms.join(" "));
	}
	if (video.price !== undefined) {
		const priceAttrs: Record<string, string> = { currency: video.price.currency };
		if (video.price.type !== undefined) {
			priceAttrs.type = video.price.type;
		}
		if (video.price.resolution !== undefined) {
			priceAttrs.resolution = video.price.resolution;
		}
		videoElement.ele("video:price", priceAttrs).txt(video.price.value.toString());
	}
	if (video.uploader !== undefined) {
		const uploaderAttrs: Record<string, string> = {};
		if (video.uploader.info !== undefined) {
			uploaderAttrs.info = video.uploader.info;
		}
		videoElement.ele("video:uploader", uploaderAttrs).txt(video.uploader.name);
	}
	videoElement.end();
}

function generateNewsElement(builder: XMLBuilder, news: SitemapNews): void {
	const newsElement = builder.ele("news:news");
	const publicationElement = newsElement.ele("news:publication");
	publicationElement.ele("news:name").txt(news.publication.name);
	publicationElement.ele("news:language").txt(news.publication.language);
	newsElement.ele("news:publication_date").txt(news.publicationDate);
	newsElement.ele("news:title").txt(news.title);
}

export function generateSitemap(urls: SitemapUrl[], { prettyPrint = true }: { prettyPrint?: boolean } = {}): string {
	if (urls.length === 0) {
		throw new Error("No URLs provided");
	}
	const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("urlset", getNamespaces(urls));
	for (const { loc, lastmod, changefreq, priority, images, videos, news, alternates } of urls) {
		if (loc.length > 2048) {
			throw new Error("URL length must be less than 2048 characters");
		}
		if (lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
			throw new Error("Last modified date must be in YYYY-MM-DD format");
		}
		if (changefreq !== undefined && !CHANGE_FREQUENCY.includes(changefreq)) {
			throw new Error("Invalid change frequency");
		}
		if (priority !== undefined && (priority < 0 || priority > 1)) {
			throw new Error("Priority must be between 0 and 1");
		}
		const urlElement = xml.ele("url");
		urlElement.ele("loc").txt(loc);
		if (lastmod !== undefined) {
			urlElement.ele("lastmod").txt(lastmod);
		}
		if (changefreq !== undefined) {
			urlElement.ele("changefreq").txt(changefreq);
		}
		if (priority !== undefined) {
			urlElement.ele("priority").txt(priority.toString());
		}
		if (images && images.length > 0) {
			if (images.length > 1000) {
				throw new Error("Maximum 1000 images per URL");
			}
			for (const image of images) {
				generateImageElement(urlElement, image);
			}
		}
		if (videos && videos.length > 0) {
			for (const video of videos) {
				generateVideoElement(urlElement, video);
			}
		}
		if (news) {
			generateNewsElement(urlElement, news);
		}
		if (alternates && alternates.length > 0) {
			for (const alternate of alternates) {
				urlElement.ele("xhtml:link", {
					rel: "alternate",
					hreflang: alternate.hreflang,
					href: alternate.href,
				});
			}
		}
		urlElement.end();
	}
	return xml.end({ prettyPrint });
}

/**
 * Entry for a sitemap in a sitemap index file.
 */
export type SitemapEntry = {
	/**
	 * Identifies the location of the sitemap.
	 * Must be in the same directory or subdirectory as the sitemap index.
	 */
	loc: string;
	/**
	 * Identifies the time that the corresponding sitemap file was modified.
	 * Should be in W3C Datetime format (YYYY-MM-DD).
	 */
	lastmod?: string;
};

/**
 * Generates a sitemap index XML file that references multiple sitemaps.
 * Per the protocol, a sitemap index can contain up to 50,000 sitemaps.
 */
export function generateSitemapIndex(
	sitemaps: SitemapEntry[],
	{ prettyPrint = true }: { prettyPrint?: boolean } = {},
): string {
	if (sitemaps.length === 0) {
		throw new Error("No sitemaps provided");
	}
	if (sitemaps.length > 50000) {
		throw new Error("Sitemap index can contain up to 50,000 sitemaps");
	}
	const xml = create({ version: "1.0", encoding: "UTF-8" }).ele("sitemapindex", {
		xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
	});
	for (const { loc, lastmod } of sitemaps) {
		if (loc.length > 2048) {
			throw new Error("Sitemap location length must be less than 2048 characters");
		}
		if (lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) {
			throw new Error("Last modified date must be in YYYY-MM-DD format");
		}
		const sitemapElement = xml.ele("sitemap");
		sitemapElement.ele("loc").txt(loc);
		if (lastmod !== undefined) {
			sitemapElement.ele("lastmod").txt(lastmod);
		}
	}
	return xml.end({ prettyPrint });
}

export function generateSitemapName(
	baseUrl: string,
	{ index, prefix = "sitemap" }: { index: number; prefix?: string },
): string {
	return `${baseUrl}/${prefix}-${index}.xml`;
}

/**
 * A collection of sitemap files and their index.
 */
export type SitemapCollection = {
	/**
	 * The sitemap index file.
	 */
	sitemapIndex: string;
	/**
	 * The sitemap files.
	 */
	sitemaps: string[];
};

export type SitemapCollectionOptions = {
	/**
	 * The maximum number of URLs per sitemap, defaults to 50,000.
	 */
	maxUrlsPerSitemap?: number;
	/**
	 * The prefix for the sitemap files, defaults to `"sitemap"`.
	 */
	prefix?: string | ((index: number) => string);
	/**
	 * Whether to pretty print the XML, defaults to true.
	 */
	prettyPrint?: boolean;
};

/**
 * Generates a complete sitemap collection with index.
 * Automatically splits URLs across multiple sitemaps if needed.
 */
export function generateSitemapCollection(
	baseUrl: string,
	urls: SitemapUrl[],
	{ maxUrlsPerSitemap = 50000, prefix = "sitemap", prettyPrint = true }: SitemapCollectionOptions = {},
): SitemapCollection {
	if (urls.length === 0) {
		throw new Error("No URLs provided");
	}
	if (maxUrlsPerSitemap < 1 || maxUrlsPerSitemap > 50000) {
		throw new Error("Max URLs per sitemap must be between 1 and 50,000");
	}
	if (typeof prefix === "string" && prefix.length > 2048) {
		throw new Error("Prefix must be less than 2048 characters");
	}
	const sitemaps: string[] = [];
	for (let i = 0; i < urls.length; i += maxUrlsPerSitemap) {
		const sitemap = generateSitemap(urls.slice(i, i + maxUrlsPerSitemap), { prettyPrint });
		sitemaps.push(sitemap);
	}

	const generateSitemapEntry =
		typeof prefix === "string" ? (index: number) => generateSitemapName(baseUrl, { index, prefix }) : prefix;

	const sitemapIndex = generateSitemapIndex(
		sitemaps.map((_, index) => ({
			loc: generateSitemapEntry(index),
			lastmod: new Date().toISOString().split("T")[0],
		})),
		{ prettyPrint },
	);
	return { sitemapIndex, sitemaps };
}
