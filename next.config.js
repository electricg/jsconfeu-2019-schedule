module.exports = {
    webpack: config => {
        config.node = { fs: 'empty' };
        return config;
    },
    exportPathMap: function() {
        return {
            '/': { page: '/' }
        };
    }
};
