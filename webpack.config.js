// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const axios = require('axios');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

function readFilesInfo(directory) {
  const ejsFilesInfo = [];

  function readDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const fileStats = fs.statSync(filePath);

      if (fileStats.isDirectory()) {
        readDirectory(filePath);
      } else if (fileStats.isFile() && path.extname(file) === '.ejs') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const titleMatch = fileContent.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : '未定义标题';
        ejsFilesInfo.push({
          path: filePath,
          title: title,
        });
      }
    });
  }

  readDirectory(directory);

  return ejsFilesInfo;
}
const targetDirectory = path.join(__dirname, 'public');
const files = readFilesInfo(targetDirectory);
const config = {
  entry: {
    index: './src/index.js',
    fontawesome: './src/fontawesome.js',
    compass: './src/compass.js',
    dialog: './src/dialog.js',
    'seamless-scroll': './src/seamless-scroll.js',
    'demo': './src/demo.js',
    'home-pod': './src/home-pod.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    open: true,
    port: 8080,
    host: 'localhost',
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/apis/fontawesome-v6/queries', async (_, response) => {
        try {
          const res = await axios.post(
            `https://m19dxw5x0q-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.20.0)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.60.0)%3B%20Vue%20(2.7.15)%3B%20Vue%20InstantSearch%20(4.12.1)%3B%20JS%20Helper%20(3.15.0)&x-algolia-api-key=c79b2e61519372a99fa5890db070064c&x-algolia-application-id=M19DXW5X0Q`,
            {
              requests: [
                {
                  indexName: 'fontawesome_com-collections-6.7.0',
                  params:
                    'clickAnalytics=true&distinct=true&facetFilters=%5B%5B%22type%3Aicon%22%5D%5D&facets=%5B%22categories%22%2C%22icon_collections%22%2C%22icon_packs%22%2C%22is_free%22%2C%22is_new_in_v6%22%2C%22is_sponsored%22%2C%22is_staff_favorite%22%2C%22style%22%2C%22visual_tags%22%5D&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&hitsPerPage=1000&maxValuesPerFacet=100&page=0&query=&tagFilters=&userToken=anonymous-2843ca4d-bc9c-4d41-ae0b-8d15f519f03d',
                },
              ],
            },
            {
              headers: {
                Host: 'm19dxw5x0q-3.algolianet.com',
                Referer: 'https://fontawesome.com/',
              },
            },
          );
          console.log(res.statusText);
          response.send(res.data);
        } catch (error) {
          response.send(error);
        }
      });
      return middlewares;
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: './public/fontawesome.ejs',
      filename: 'fontawesome.html',
      chunks: ['fontawesome'],
    }),

    new HtmlWebpackPlugin({
      template: './public/seamless-scroll.ejs',
      filename: 'seamless-scroll.html',
      chunks: ['seamless-scroll'],
    }),
    new HtmlWebpackPlugin({
      template: './public/compass.ejs',
      filename: 'compass.html',
      chunks: ['compass'],
    }),
    new HtmlWebpackPlugin({
      template: './public/dialog.ejs',
      filename: 'dialog.html',
      chunks: ['dialog'],
    }),
    new HtmlWebpackPlugin({
      template: './public/demo.ejs',
      filename: 'demo.html',
      chunks: ['demo'],
    }),
     new HtmlWebpackPlugin({
      template: './public/home-pod.ejs',
      filename: 'home-pod.html',
      chunks: ['home-pod'],
    }),
    new HtmlWebpackPlugin({
      templateParameters: {
        getPages: function () {
          const { host = 'localhost', port = '8080' } = this.webpackConfig.devServer;
          const url = `http://${host}:${port}`;
          return files
            .filter((item) => item.title !== 'index')
            .map((item) => {
              return {
                ...item,
                key: item.path.split('public/')[1].replace('.ejs', ''),
                path: url + item.path.split('public')[1].replace('.ejs', '.html'),
              };
            });
        },
      },
      template: './public/index.ejs',
      filename: 'index.html',
      chunks: ['index'],
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.styl$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader', 'stylus-loader'],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
