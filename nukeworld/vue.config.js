module.exports = {
  transpileDependencies: [/node_modules[\\/]*/],
  chainWebpack: config => {
    const isProduction = process.env.NODE_ENV === 'production';

    config.module
      .rule('mbtiles')
      .test(/\.mbtiles$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: isProduction ? 'assets/maps/[name].[hash:8].[ext]' : 'assets/maps/[name].[ext]',
      });
  },
};
