import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';
import { menuService } from '../../services/menuService';



require("../../appConfig");

class headerBarComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'menuService'];

    public heading: string = "Home";
    public menus: Array<string>;
    public siteInfo: siteInfo;

    constructor(public $scope: ng.IScope, public menuService: menuService)
    {

    }

    $onInit(): void
    {
        let self = this;
        this.siteInfo = configService.siteInfo;
        this.menus = this.siteInfo.menus;
        var callback = (function (h: string)
        {
            self.changeHeading(h);
        }).bind(this);

        this.menuService.onChange(callback);
        this.menuService.checkPath();
    }

    public getMenuClass(index: number): string
    {
        if (index < (this.menus.length - 1))
        {
            return "border-r-2 ";
        }
        else
        {
            return "border-r-0";
        }
    }

    public getSizeClasses(all: string, small: string, large: string)
    {
        if (this.siteInfo != null && this.menus != null)
        {
            if (this.siteInfo.menuStyle == "collapse" || (this.siteInfo.menuStyle == "default" && this.menus.length > 3))
            {
                return all + " " + small;
            }
        }
        return all + " " + small + " " + large;
    }

    public goHome(): void
    {
        this.menuService.goHome();
    }

    public menuClick(menu: string): void
    {
        this.toggleMenu();

        let url = "x/" + menu.toLowerCase();
        url = url.replace(/ /g, '_');
        this.menuService.goto(url);

        //this.menuService.goto(menu);
        this.menuService.setHeading(menu);
    }

    private changeHeading(heading: string): void
    {
        let self = this;
        self.heading = heading;
    }

    public toggleMenu(): void
    {
        this.toggleItems(document.getElementsByClassName('menu-close'));
        this.toggleItems(document.getElementsByClassName('menu-open'));
        this.toggleItems(document.getElementsByClassName('sm:menu-close'));
    }

    private toggleItems(collection: HTMLCollection): void
    {
        for (var i = 0; i < collection.length; i++)
        {
            collection[i].classList.toggle('hidden');
        }
    }
}

class headerBarComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;

    constructor()
    {
        this.controller = headerBarComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('headerBar');
        };
    }
}

angular.module(appConstants.appName).component('headerBar', new headerBarComponent());