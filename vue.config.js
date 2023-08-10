module.exports = {
    // ...other vue-cli plugin options...
    pwa: {
        name: 'HMM POS',
        themeColor: '#6b98f0',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
        "icons": [
            {
                "src": "assets/logo.png",
                "sizes": "72x72",
                "type": "image/png",
                "purpose": "any"
            },
        ]
    },

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "Host Myanmar POS Desktop Online",
                appId: 'https://vuepos.hmmdemo.net',
                win: {
                    "target": [
                        "nsis"
                    ],
                    icon: 'public/logo.png',
                },
                "nsis": {
                    "installerIcon": 'public/favicon.ico',
                    "uninstallerIcon": 'public/favicon.ico',
                    "uninstallDisplayName": "Host Myanmar POS",
                    "oneClick": false,
                    "allowToChangeInstallationDirectory": true
                }
            },
        },
    },
}