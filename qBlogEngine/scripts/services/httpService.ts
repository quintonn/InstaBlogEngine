import * as angular from 'angular';
import { appConstants } from '../models/appConstants';
import { blogItem } from '../models/blogItem';

require("../appConfig");

export class httpService
{
    static $inject = ['$location'];

    constructor()
    {
        
    }

    public downloadFile(file: string): Promise<string>
    {
        return httpService.downloadFileInternal(file);
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
}

angular.module(appConstants.appName).service('httpService', httpService);