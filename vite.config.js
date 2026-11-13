import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [
			react(),
			svgr({
				include: [
					'**/assets/icons/back.svg',
					'**/assets/icons/star.svg',
					'**/assets/icons/like.svg',
					'**/assets/icons/trash.svg',
				],
				svgrOptions: {
					exportType: 'named',
					namedExport: 'ReactComponent',
				},
			}),
		],
		publicDir: false,
		define: {
			'process.env.NODE_ENV': JSON.stringify(mode),
			'process.env.API_URL': JSON.stringify(env.API_URL),
		},
		css: {
			modules: {
				generateScopedName: '[name]__[local]__[hash:base64:5]',
			},
		},
		build: {
			outDir: 'dist-vite',
			emptyOutDir: true,
			sourcemap: false,
			target: 'es2015',
		},
		server: {
			port: 3000,
			open: true,
		},
		preview: {
			port: 4173,
			open: true,
		},
	};
});
