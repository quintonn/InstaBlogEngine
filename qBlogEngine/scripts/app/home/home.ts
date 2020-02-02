import * as angular from 'angular';
import { appConstants } from '../../models/appConstants';
import { menuService } from '../../services/menuService';
import { httpService } from '../../services/httpService';
import { blogItem } from '../../models/blogItem';
import { siteInfo } from '../../models/siteInfo';

require("../../appConfig");

class HomeComponentController implements ng.IOnInit
{
    static $inject = ['$scope', '$http', '$location', 'menuService', 'httpService'];

    public items: Array<blogItem>;
    public info: siteInfo;

    constructor(public $scope: ng.IScope, public $http: ng.IHttpService,
        public $location: ng.ILocationService, public menuService: menuService,
        public httpService: httpService)
    {
        this.items = [];
    }

    $onInit(): void
    {
        this.menuService.checkPath();
        this.loadItems();
        this.loadSiteInfo();
    }

    private loadSiteInfo(): void
    {
        let self = this;

        this.httpService.getSiteInfo().then(info =>
        {
            self.info = info;
            document.title = info.title;
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
            url = url.replace(/ /g, '_');
            self.menuService.goto(url);

            self.$scope.$apply();
        }, 10);
    }

    private loadItems(): void
    {
        let self = this;
        self.items = [];
        
        self.httpService.downloadFile("content/items.json")
            .then(self.httpService.createBlogItems)
            .catch(err =>
            {
                console.error("Error downloading items: ", err);
                return Promise.resolve(null);
            }).then(function (items: blogItem[])
            {
                self.items = items.sort((x, y) =>
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


                self.$scope.$apply();
            });
    }
}

class HomeComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;

    constructor()
    {
        this.controller = HomeComponentController;
        this.template = require('./home.html');
    }
}

angular.module(appConstants.appName).component('home', new HomeComponent());