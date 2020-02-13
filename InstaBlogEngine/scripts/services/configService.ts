import * as angular from 'angular';
import { appConstants } from '../models/appConstants';
import { siteInfo } from '../models/siteInfo';

require("../appConfig");

export class configService
{
    //static $inject = [];

    public static siteInfo: siteInfo = null;
    private static siteInfoPromise: Promise<siteInfo> = configService.getSiteInfoPromise();

    private static currentTheme: string = '';

    constructor()
    {
        
    }

    private static getTheme(): string
    {
        if (configService.currentTheme == '')
        {
            var theme = '';

            let tempTheme = localStorage.getItem(appConstants.appName + '_theme');

            if (tempTheme != null && tempTheme.length > 0)
            {
                theme = tempTheme;
                configService.setThemeIfNotSet(tempTheme);
            }

            if (theme == '')
            {
                theme = 'default';
            }

            configService.currentTheme = theme;
        }

        return configService.currentTheme;
    }

    public static getThemeFile(name: string): string
    {
        let theme = configService.getTheme();
        
        //var x = Math.round(Math.random() * 100) + "-" + Math.round(Math.random() * 100);
        //let url = '/themes/' + configService.siteInfo.theme + '/' + name + '.html?v=' + x;
        let url = 'themes/' + theme + '/' + name + '.html';

        return url;
    }

    private static getSiteInfoPromise(): Promise<siteInfo>
    {
        if (configService.siteInfo != null)
        {
            return Promise.resolve(configService.siteInfo);
        }
        
        let url = 'info/site.json';
        return configService.downloadFileInternal(url).catch(err =>
        {
            console.error('unable to download ' + url + ': ' + err);
            return Promise.resolve(null);
        }).then(function (data: string)
        {
            let info = JSON.parse(data) as siteInfo;

            configService.setThemeIfNotSet(info.theme);
            info.theme = configService.getTheme();

            configService.setThemeIfNotSet(info.theme);

            return new Promise(function (res, rej)
            {
                configService.siteInfo = info;
                return res(info);
            });
            
        });
    }

    private static setThemeIfNotSet(theme: string): void
    {
        let tempTheme = localStorage.getItem(appConstants.appName + '_theme');
        if (tempTheme != null && tempTheme != '' && tempTheme != 'null')
        {
            this.updateTheme(tempTheme);
        }
    }

    public static updateTheme(theme: string): void
    {
        localStorage.setItem(appConstants.appName + '_theme', theme);
        configService.currentTheme = theme;
    }

    private static downloadFileInternal(file: string): Promise<string>
    {
        var headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');

        var init = {
            method: 'GET',
            headers: headers,
        };
        return fetch(file, init).then(response =>
        {
            if (response.ok == true)
            {
                return response.text();
            }
            else
            {
                return Promise.reject(response);
            }
        });
    }

    public getSiteInfo(): Promise<siteInfo>
    {
        return configService.siteInfoPromise;
    }
}

angular.module(appConstants.appName).service('configService', configService);