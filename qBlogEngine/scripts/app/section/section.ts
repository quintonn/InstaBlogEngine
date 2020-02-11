import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class sectionComponentController implements ng.IOnInit
{
    static $inject = ['$scope'];

    public headingId: string;
    public heading: string;
    public sectionUrl: string;

    constructor(public $scope: ng.IScope)
    {
        
    }

    $onInit(): void
    {
        this.headingId = this.heading.toLowerCase().replace(/ /g, '_');
        var url = window.location.hash.split("?")[0];
        this.sectionUrl = url + "?scrollTo=" + this.headingId;
    }
}

class sectionComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;
    public transclude: boolean = true;
    public bindings: any;

    constructor()
    {
        this.controller = sectionComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('section');
        }
        this.bindings =
        {
            heading: "@"
        };
    }
}

angular.module(appConstants.appName).component('section', new sectionComponent());