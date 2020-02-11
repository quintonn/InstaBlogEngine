import * as angular from 'angular';
import { appConstants } from '../models/appConstants';
import { siteInfo } from '../models/siteInfo';

require("../appConfig");

export class configService
{
    //static $inject = [];

    public static siteInfo: siteInfo = null;
    private static siteInfoPromise: Promise<siteInfo> = configService.getSiteInfoPromise();

    constructor()
    {
        
    }

    public static getThemeFile(name: string): string
    {
        //var x = Math.round(Math.random() * 100) + "-" + Math.round(Math.random() * 100);
        //let url = '/themes/' + configService.siteInfo.theme + '/' + name + '.html?v=' + x;
        let url = 'themes/' + configService.siteInfo.theme + '/' + name + '.html';

        return url;
    }

    private static getSiteInfoPromise(): Promise<siteInfo>
    {
        if (configService.siteInfo != null)
        {
            return Promise.resolve(configService.siteInfo);
        }

        //var x = Math.round(Math.random() * 100);
        //let url = 'info/site.json?v='+x;
        let url = 'info/site.json';
        return configService.downloadFileInternal(url).catch(err =>
        {
            console.error('unable to download ' + url + ': ' + err);
            return Promise.resolve(null);
        }).then(function (data: string)
        {
            let info = JSON.parse(data) as siteInfo;

            if (info.theme == null || info.theme.length == 0)
            {
                info.theme = "default";
            }

            configService.siteInfo = info;
            return Promise.resolve(info);
        });
    }

    private static downloadFileInternal(file: string): Promise<string>
    {
        var headers = new Headers();
        //headers.append('pragma', 'no-cache');
        //headers.append('cache-control', 'no-cache');

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