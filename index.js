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
        ...RNCookieManagerAndroid,
        get: (url, useWebKit = false) => RNCookieManagerAndroid.get(url, useWebKit).then(cookieMap => Object.keys(cookieMap).reduce((acc, key) => {
            acc[key] = {
                name: key,
                value: cookieMap[key],
                domain: null,
                path: null
            };
            return acc;
        }, {})),
    };
} else {
    invariant(
        CookieManager,
        'react-native-cookies: Invalid platform. This library only supports Android and iOS.'
    );
}

module.exports = {
    ...CookieManager,
    getAll: (useWebKit = false) => CookieManager.getAll(useWebKit),
    clearAll: (useWebKit = false) => CookieManager.clearAll(useWebKit),
    get: (url, useWebKit = false) => CookieManager.get(url, useWebKit),
    set: (cookie, useWebKit = false) => CookieManager.set(cookie, useWebKit)
};
