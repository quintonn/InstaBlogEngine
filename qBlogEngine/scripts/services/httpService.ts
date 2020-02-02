import * as angular from 'angular';
import { appConstants } from '../models/appConstants';
import { blogItem } from '../models/blogItem';
import { siteInfo } from '../models/siteInfo';

require("../appConfig");

export class httpService
{
    static $inject = ['$location'];

    constructor()
    {
        
    }

    public downloadFile(file: string): Promise<string>
    {
        var headers = new Headers();
        headers.append('pragma', 'no-cache');
        headers.append('cache-control', 'no-cache');

        var init = {
            method: 'GET',
            headers: headers,
        };
        return fetch(file, init).then(response => response.text());
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
        let url = 'info/site.json';

        return this.downloadFile(url).catch(err =>
        {
            console.error('unable to download ' + url + ': ' + err);
            return Promise.resolve(null);
        }).then(function (data: string)
        {
            let info = JSON.parse(data) as siteInfo;
            return Promise.resolve(info);
        });
    }
}

angular.module(appConstants.appName).service('httpService', httpService);