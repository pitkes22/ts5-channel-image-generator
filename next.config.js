const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    basePath: isProd ? '/ts5-channel-image-generator' : '',
}