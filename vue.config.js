module.exports = {
    chainWebpack: config => {
        const oneOfsMap = config.module.rule('scss').oneOfs.store
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: ['./src/assets/scss/_mixin.scss']
                })
                .end()
        })
    },
    outputDir: './functions/dist/',
}