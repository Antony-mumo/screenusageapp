const { withDangerousMod, withPlugins } = require('@expo/config-plugins');

const withScreenTime = config => {
    return withPlugins(config, [
        withDangerousMod, [
            'ios',
            async config => {
                // Here you can modify the Info.plist or other iOS-specific configurations
                return config;
            },
        ],
    ]);
};

module.exports = withScreenTime;
