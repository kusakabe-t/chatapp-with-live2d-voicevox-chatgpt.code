import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import path from 'path';

export default defineConfig((env: ConfigEnv): UserConfig => {
  let common: UserConfig = {
    root: './',
    base: '/',
    publicDir: './public',
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@libs': path.resolve(__dirname, '/src/libs/'),
        '@utils': path.resolve(__dirname, '/src/utils/'),
      }
    },
    build: {
      target: 'modules',
      assetsDir: 'assets',
      outDir: './dist',
      sourcemap: env.mode == 'development' ? true : false,
    },
  };
  return common;
});
