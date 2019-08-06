import React from 'react';
import { NativeModules, Platform } from 'react-native';
const invariant = require('invariant');
const RNCookieManagerIOS = NativeModules.RNCookieManagerIOS;
const RNCookieManagerAndroid = NativeModules.RNCookieManagerAndroid;

let CookieManager;

if (Platform.OS === 'ios') {
    invariant(
        RNCookieManagerIOS,
        'react-native-cookies: Add RNCookieManagerIOS.h and RNCookieManagerIOS.m to your Xcode project'
    );
    CookieManager = RNCookieManagerIOS;
} else if (Platform.OS === 'android') {
    invariant(
        RNCookieManagerAndroid,
        'react-native-cookies: Import libraries to android "react-native link react-native-cookies"'
    );
    CookieManager = {
        getAll: (useWebKit = false) => RNCookieManagerAndroid.getAll(useWebKit),
        clearAll: (useWebKit = false) => RNCookieManagerAndroid.clearAll(useWebKit),
        get: (url, useWebKit = false) => RNCookieManagerAndroid.get(url, useWebKit).then(cookieMap => Object.keys(cookieMap).reduce((acc, key) => {
            acc[key] = {
                name: key,
                value: cookieMap[key],
                domain: null,
                path: null
            };
            return acc;
        }, {})),
        set: (cookie, useWebKit = false) => RNCookieManagerAndroid.set(cookie, useWebKit)
    };
} else {
    invariant(
        CookieManager,
        'react-native-cookies: Invalid platform. This library only supports Android and iOS.'
    );
}

const functions = ['setFromResponse', 'getFromResponse', 'clearByName'];

module.exports = {
    getAll: (useWebKit = false) => CookieManager.getAll(useWebKit),
    clearAll: (useWebKit = false) => CookieManager.clearAll(useWebKit),
    get: (url, useWebKit = false) => CookieManager.get(url, useWebKit),
    set: (cookie, useWebKit = false) => CookieManager.set(cookie, useWebKit)
};

for (let i = 0; i < functions.length; i++) {
    module.exports[functions[i]] = CookieManager[functions[i]];
}
