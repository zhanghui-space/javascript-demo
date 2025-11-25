// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const axios = require('axios');

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

/**
 * 读取指定目录下的 EJS 文件信息
 */
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
        const name = path.basename(file, '.ejs');
        ejsFilesInfo.push({
          path: filePath,
          title: title,
          name: name,
        });
      }
    });
  }

  readDirectory(directory);
  return ejsFilesInfo;
}

/**
 * 自动生成 entry 配置
 */
function generateEntries() {
  const srcDir = path.join(__dirname, 'src');
  const entries = {};
  
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    const filePath = path.join(srcDir, file);
    const fileStats = fs.statSync(filePath);
    
    if (fileStats.isFile() && path.extname(file) === '.js') {
      const name = path.basename(file, '.js');
      entries[name] = `./src/${file}`;
    }
  });
  
  return entries;
}

const targetDirectory = path.join(__dirname, 'public');
const ejsFiles = readFilesInfo(targetDirectory);

const config = {
  entry: generateEntries(),
  
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Webpack 5+ 自带清理功能
  },
  
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  
  devServer: {
    open: true,
    port: 8080,
    host: 'localhost',
    hot: true,
    static: {
      directory: path.join(__dirname, 'static'),
      publicPath: '/static',
      watch: true, // 监听静态文件变化
    },
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // FontAwesome API 代理
      devServer.app.get('/apis/fontawesome-v6/queries', async (req, response) => {
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
          console.log('FontAwesome API:', res.statusText);
          response.json(res.data);
        } catch (error) {
          console.error('FontAwesome API Error:', error.message);
          response.status(500).json({
            error: 'Failed to fetch FontAwesome data',
            message: error.message,
          });
        }
      });
      
      return middlewares;
    },
  },
  
  plugins: [
    // 清理输出目录（如果你想用插件而不是 output.clean）
    // new CleanWebpackPlugin(),
    
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),

    // 自动生成所有页面的 HtmlWebpackPlugin（除了 index.html）
    ...ejsFiles
      .filter((file) => file.name !== 'index')
      .map((file) => {
        return new HtmlWebpackPlugin({
          template: file.path,
          filename: `${file.name}.html`,
          chunks: [file.name],
          minify: isProduction ? {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
          } : false,
        });
      }),

    // index.html 单独处理，因为它有特殊的 templateParameters
    new HtmlWebpackPlugin({
      templateParameters: {
        getPages: function () {
          const { host = 'localhost', port = 8080 } = this.webpackConfig.devServer;
          const url = `http://${host}:${port}`;
          return ejsFiles
            .filter((item) => item.title !== 'index')
            .map((item) => {
              return {
                ...item,
                key: item.name,
                path: `${url}/${item.name}.html`,
              };
            });
        },
      },
      template: './public/index.ejs',
      filename: 'index.html',
      chunks: ['index'],
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      } : false,
    }),
  ],
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb 以下的文件转为 base64
          },
        },
      },
    ],
  },
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
  
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
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