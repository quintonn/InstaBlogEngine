import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { menuService } from '../../services/menuService';
import { httpService } from '../../services/httpService';
import { blogItem } from '../../models/blogItem';
import { siteInfo } from '../../models/siteInfo';
import { configService } from '../../services/configService';

require("../../appConfig");

class HomeComponentController implements ng.IOnInit
{
    static $inject = ['$scope', '$http', '$location', 'menuService', 'httpService', 'configService'];

    public items: Array<blogItem>;
    public allItems: Array<blogItem>;
    public info: siteInfo;
    public filterValue: string;

    constructor(public $scope: ng.IScope, public $http: ng.IHttpService,
        public $location: ng.ILocationService, public menuService: menuService,
        public httpService: httpService, public configService: configService)
    {
        this.items = [];
        this.allItems = [];
        this.filterValue = ""
    }

    $onInit(): void
    {
        let self = this;
        this.menuService.checkPath();
        this.loadItems();

        this.configService.getSiteInfo().then(info =>
        {
            self.info = info;
            self.$scope.$apply();
        });
    }

    public selectItem(item: blogItem): void
    {
        let self = this;
        setTimeout(function ()
        {
            let itemName = item.name;//.toLowerCase();//.replace(/ /g, '_');

            let url = "entry/" + item.category.toLowerCase() + "/" + itemName;// + "/" + item.title;
            url = url.replace(/ /g, '_').toLowerCase();
            self.menuService.goto(url);

            self.$scope.$apply();
        }, 10);
    }

    public clearFilter()
    {
        this.filterValue = "";
        this.items = this.allItems;
    }

    public filter(value: string, type: string): void
    {
        let self = this;
        self.filterValue = value;//type + " = " + value;
        
        self.items = self.allItems.filter((item, index) =>
        {
            if (type == "tag")
            {
                return item.tags.indexOf(value) > -1;
            }
            else if (type == "category")
            {
                return item.category.indexOf(value) > -1;
            }
            return false;
        });
        //setTimeout(function ()
        //{
        //    history.replaceState('', '', '?filter=' + value);
        //}, 10);
    }

    private loadItems(): void
    {
        let self = this;
        self.items = [];
        self.allItems = [];
        
        self.httpService.downloadFile("content/items.json")
            .then(self.httpService.createBlogItems)
            .catch(err =>
            {
                console.error("Error downloading items: ", err);
                return Promise.resolve(null);
            }).then(function (items: blogItem[])
            {
                self.allItems = items.sort((x, y) =>
                {
                    var xDate = new Date(x.date);
                    var yDate = new Date(y.date);
                    
                    if (xDate > yDate)
                    {
                        return -1;
                    }
                    else if (xDate < yDate)
                    {
                        return 1;
                    }
                    return 0;
                });
                //.slice(0, 10); //TODO: can limit the number so it doesn't load all on screen at once

                self.items = self.allItems;

                self.$scope.$apply();
            });
    }
}

class HomeComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;

    constructor()
    {
        this.controller = HomeComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('home');
        };
    }
}

angular.module(appConstants.appName).component('home', new HomeComponent());