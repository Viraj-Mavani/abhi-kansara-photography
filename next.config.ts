import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "photos.smugmug.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
