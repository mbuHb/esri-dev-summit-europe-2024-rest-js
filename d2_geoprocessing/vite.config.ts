import { ViteUserConfig, defineConfig,  } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  return ({
    server: {
      host: '0.0.0.0',
      'proxy': {
        '/sharing': {
          target: 'https://proxy-url-for-cors.com',
          changeOrigin: true,
          secure: false
        }
      },
    },
    
    publicDir: `public/${mode}`,
    plugins: [react()] as ViteUserConfig["plugins"]
  });
});
