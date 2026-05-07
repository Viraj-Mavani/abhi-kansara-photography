import { getR2Url } from "./r2-config";

// Centralized Data Layer

export interface Service {
	id: string;
	title: string;
	image: string;
}

// Pre-Wedding | Wedding | Baby Shower | Product | Portrait | Editorial | Event
export const servicesData: Service[] = [
	{ id: "s0", title: "Wedding", image: getR2Url("/images/work/work0.webp") },
	{ id: "s1", title: "Event", image: getR2Url("/images/work/work1.webp") },
	{ id: "s2", title: "Portrait", image: getR2Url("/images/work/work2.webp") },
	{ id: "s3", title: "Portrait", image: getR2Url("/images/work/work3.webp") },
	{ id: "s4", title: "Pre-Wedding", image: getR2Url("/images/work/work4.webp") },
	{ id: "s5", title: "Portrait", image: getR2Url("/images/work/work5.webp") },
	{ id: "s6", title: "Event", image: getR2Url("/images/work/work6.webp") },
	{ id: "s7", title: "Event", image: getR2Url("/images/work/work7.webp") },
	{ id: "s8", title: "Event", image: getR2Url("/images/work/work8.webp") },
	{ id: "s9", title: "Portrait", image: getR2Url("/images/work/work9.webp") },
	{ id: "s10", title: "Pre-Wedding", image: getR2Url("/images/work/work10.webp") },
	{ id: "s11", title: "Pre-Wedding", image: getR2Url("/images/work/work11.webp") },
	{ id: "s12", title: "Portrait", image: getR2Url("/images/work/work12.webp") },
	{ id: "s13", title: "Baby Shower", image: getR2Url("/images/work/work13.webp") },
];


/**
 * Legacy Fallback Backgrounds
 * These are used only if the database is unseeded or the API is unreachable.
 * The primary backgrounds are now managed in the Admin CMS under "Hero Manager".
 */
export const fallbackBackgroundImages = [
	getR2Url("/images/bg/bg4.webp"),
	getR2Url("/images/bg/bg1.webp"),
	getR2Url("/images/bg/bg0.webp"),
	getR2Url("/images/bg/bg2.webp"),
	getR2Url("/images/bg/bg3.webp"),
	getR2Url("/images/bg/bg5.webp"),
	getR2Url("/images/bg/bg6.webp"),
	// getR2Url("/images/bg/bg7.webp"),
];

export const videoSources = {
	portrait0Poster: getR2Url("/images/thumbnail/t-portrait-0.webp"),
	portrait0: getR2Url("/videos/portrait-0/portrait0.m3u8"),
	portrait1Poster: getR2Url("/images/thumbnail/t-portrait-1.webp"),
	portrait1: getR2Url("/videos/portrait-1/portrait1.m3u8"),
	landscape0Poster: getR2Url("/images/thumbnail/t-landscape-0.webp"),
	landscape0: getR2Url("/videos/landscape-0/landscape0.m3u8"),
	landscape1Poster: getR2Url("/images/thumbnail/t-landscape-1.webp"),
	landscape1: getR2Url("/videos/landscape-1/landscape1.m3u8"),
};

