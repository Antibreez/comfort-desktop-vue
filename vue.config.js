module.exports = {
  configureWebpack: {
    devtool:
      process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  },
  css: {
    sourceMap: process.env.NODE_ENV === 'development',
  },
}
