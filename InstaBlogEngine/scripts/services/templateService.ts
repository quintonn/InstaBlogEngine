﻿import * as angular from 'angular';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-csharp'; // to load C-Sharp language
import 'prismjs/components/prism-json'; // to load C-Sharp language
import 'prismjs/themes/prism-okaidia.css';
import { appConstants } from '../models/appConstants';
import { httpService } from './httpService';


require("../appConfig");

export class templateService
{
    static $inject = ['httpService'];

    constructor(public httpService: httpService)
    {
        
    }

    public applyTemplate(contentPath: string): Promise<void>
    {
        let self = this;

        console.log('updating images');
        var images = document.getElementsByClassName('image');
        console.log("found " + images.length + " images in the document");
        console.log(images);
        let updateImages = self.findAndUpdateImageLinks('image', 'x-src', 'src', contentPath).then(_ =>
        {
            //"content/" + category + "/" + name
            console.log('updating images 2');
            return self.findAndUpdateImageLinks('imageRef', 'href', 'href', contentPath);
        });

        return updateImages.then(_ =>
        {
            console.log('updating code samples');
            return self.updateCodeSamples(contentPath);
        });
    }

    private updateCodeSamples(contentPath: string, count: number = 0): Promise<void>
    {
        let self = this;
        let codeSamples = document.getElementsByClassName('code-sample');

        if (codeSamples == null || codeSamples.length == 0)
        {
            return Promise.resolve();
        }

        let promises: Array<Promise<void>> = []

        for (let i = 0; i < codeSamples.length; i++)
        {
            let div = codeSamples[i];
            let fileName = div.getAttribute('name').trim().toLowerCase().replace(/ /g, '_');
            let classList = div.classList;
            let lang = "";

            for (let i = 0; i < classList.length; i++)
            {
                let language = classList[i];
                if (language.startsWith('language'))
                {
                    lang = language.substring(9);
                }
            }
            
            //let url = "content/" + category + "/" + name + "/" + fileName;
            let url = contentPath + "/" + fileName;

            let prom = self.httpService.downloadFile(url).then(content =>
            {
                if (lang != null && lang.trim().length > 0)
                {
                    let code = self.formatCode(content, lang);
                    div.innerHTML = code;
                    Prism.highlightAll();
                }
                else
                {
                    div.innerHTML = content;
                }
            });

            promises.push(prom);
        }

        let p: any = Promise;

        return p.all(promises).then(() =>
        {
            return Promise.resolve();
        });
    }

    public formatCode(code: string, language: string): string
    {
        let pLang = Prism.languages[language];
        let formattedCode = Prism.highlight(code, pLang, language);
        return formattedCode;
    }

    private findAndUpdateImageLinks(className: string, srcAttributeName: string, targetAttributeName: string, imagePath: string, count: number = 0): Promise<void>
    {
        let self = this;
        let items = document.getElementsByClassName(className);
        if (items == null || items.length == 0)
        {
            if (count < 10)
            {
                return new Promise((res, rej) =>
                {
                    setTimeout(function ()
                    {
                        self.findAndUpdateImageLinks(className, srcAttributeName, targetAttributeName, imagePath, count+1).then(res);
                    }, 10);
                });
            }
            return Promise.resolve();
        }

        for (let i = 0; i < items.length; i++)
        {
            let item = items[i];

            let source = item.getAttribute(srcAttributeName);
            let fullUrl = window.location.origin + window.location.pathname + imagePath + "/" + source;
            item.setAttribute(targetAttributeName, fullUrl);
        }

        return Promise.resolve();
    }
}

angular.module(appConstants.appName).service('templateService', templateService);