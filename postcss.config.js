module.exports = {
    plugins: {
        'postcss-import': {
            path: ['node_modules']
        },
        'postcss-url': {},
        'postcss-cssnext': {
            browsers: ['last 5 versions', 'IE > 9']
        }
    }
};