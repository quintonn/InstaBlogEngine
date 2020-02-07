import * as angular from 'angular';
import { appConstants } from '../models/appConstants';
import { blogItem } from '../models/blogItem';
import { siteInfo } from '../models/siteInfo';

require("../appConfig");

export class httpService
{
    static $inject = ['$location'];

    private static siteInfo: siteInfo = null;
    private static siteInfoPromise: Promise<siteInfo> = httpService.getSiteInfoPromise();

    constructor()
    {
    }

    private static getSiteInfoPromise(): Promise<siteInfo>
    {
        if (httpService.siteInfo != null)
        {
            return Promise.resolve(httpService.siteInfo);
        }

        let url = 'info/site.json';
        return httpService.downloadFileInternal(url).catch(err =>
        {
            console.error('unable to download ' + url + ': ' + err);
            return Promise.resolve(null);
        }).then(function (data: string)
        {
            let info = JSON.parse(data) as siteInfo;
            httpService.siteInfo = info;
            return Promise.resolve(info);
        });
    }

    public downloadFile(file: string): Promise<string>
    {
        return httpService.downloadFileInternal(file);
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

    public splitData(data: string): string[]
    {
        let lines = data.replace(/\r\n/g, '\r').replace(/\n/g, '\r').split("\r");
        lines = lines.filter(x => x != null && x.trim().length > 0);
        return lines;
    }

    public createBlogItems(data: string): blogItem[]
    {
        var items = JSON.parse(data) as blogItem[];
        var result: blogItem[] = [];
        for (let i = 0; i < items.length; i++)
        {
            var item = items[i];
            if (item == null)
            {
                continue;
            }
            result.push(item);
        }
        return result;
    }

    public getSiteInfo(): Promise<siteInfo>
    {
        return httpService.siteInfoPromise;
    }
}

angular.module(appConstants.appName).service('httpService', httpService);