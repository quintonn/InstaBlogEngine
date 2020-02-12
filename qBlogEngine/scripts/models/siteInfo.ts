import { disqusInfo } from "./disqusInfo";
import { feedBurner } from "./feedBurner";

export class siteInfo
{
    title: string;
    menus: Array<string>;
    menuStyle: string;
    themes: Array<string>;
    theme: string;
    disqus: disqusInfo;
    feedBurner: feedBurner;

    constructor()
    {
    }
}