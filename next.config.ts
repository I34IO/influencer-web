import type { NextConfig } from "next";

const hostnames = [
	'images.unsplash.com',
	'i.pravatar.cc',
	'ui-avatars.com',
	'api.dicebear.com',
	'via.placeholder.com',
	'placeholder.com',
	'placehold.co',
	'*.supabase.co',
	'avatars.githubusercontent.com',
	'cdn.jsdelivr.net',
	'yt3.googleusercontent.com',

]

const nextConfig: NextConfig = {
	images: {
		remotePatterns: hostnames.map((hostname) => ({
			protocol: 'https',
			hostname,
		})),
	},
	// Suppress the workspace root warning
	outputFileTracingRoot: undefined,
};

export default nextConfig;
