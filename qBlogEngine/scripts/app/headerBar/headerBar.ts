import * as angular from 'angular';
import { menuService } from '../../services/menuService';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';

require("../../appConfig");

class headerBarComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'menuService'];

    public heading: string = "Home";

    constructor(public $scope: ng.IScope, public menuService: menuService)
    {
        
    }

    $onInit(): void
    {
        let self = this;
        var callback = (function (h: string)
        {
            self.changeHeading(h);
        }).bind(this);

        this.menuService.onChange(callback);
        this.menuService.checkPath();
    }

    public goHome(): void
    {
        this.menuService.goHome();
    }

    public menuClick(menu: string): void
    {
        this.toggleMenu();
        this.menuService.goto(menu);
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
    public template: string;

    constructor()
    {
        this.controller = headerBarComponentController;
        this.template = require('./headerBar.html');
    }
}

angular.module(appConstants.appName).component('headerBar', new headerBarComponent());