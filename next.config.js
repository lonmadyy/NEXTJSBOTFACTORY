/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['three'],
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        cpus: 1,
        workerThreads: true,
        webpackBuildWorker: false,
    },
};

module.exports = nextConfig;
