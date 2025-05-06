import { parse } from "jsonc-parser";
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths';
import * as path from 'path'
import * as fs from "fs"
import basicSsl from '@vitejs/plugin-basic-ssl'
import eslintPlugin from "@nabla/vite-plugin-eslint"

export default defineConfig({
  plugins: [
    deepIndex( '/src/index.html' ),
    solid(),
    eslintPlugin(),
    tsconfigPaths(),
    basicSsl( {
      /** name of certification */
      name: 'test',
      /** custom trust domains */
      domains: ['localhost', "rayns.local" ],
      /** custom certification directory */
      certDir: './ssl/cert'
    } )
  ],
  server: {
    host: '0.0.0.0',
    https: {
      key: path.resolve(__dirname, 'ssl/key.pem'), // Ruta a tu clave privada
      cert: path.resolve(__dirname, 'ssl/cert.pem'), // Ruta a tu certificado
    },
    port: 1234, // Puerto en el que correrá el servidor de desarrollo
  },
  
  /*resolve: {
    alias: getPathsFromTsConfig()
  }*/
} )

function deepIndex( path ){
  return  {
    name: "deep-index",
    configureServer( server ) {
      server.middlewares.use(
        ( req, res, next ) => {
          if (
            req.url === '/'
            || req.url === '/login'
            || req.url === '/lock'
            || req.url === '/styling'
            || req.url === '/menu'
            || ( req.url as string ).startsWith( '/products/' )
            || ( req.url as string ).startsWith( '/customers/' )
            || ( req.url as string ).startsWith( '/users/' )
            || ( req.url as string ).startsWith( '/docs/' ) ) {
            req.url = path;
          }
          next();
        }
      )
    }
  }
}

function getPathsFromTsConfig() {
  const tsconfig = parse( fs.readFileSync('./tsconfig.app.json', 'utf-8'));
  const aliases = {};
  for (const [key, value] of Object.entries(tsconfig.compilerOptions.paths)) {
    const cleanKey = key.replace('/*', '');
    const cleanValue = value[0].replace('/*', '');
    const resolvedPath = path.resolve(__dirname, cleanValue);
    aliases[cleanKey] = resolvedPath;
  }
  return aliases;
}
