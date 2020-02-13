import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { configService } from '../../services/configService';

require("../../appConfig");

class initializerComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'configService'];

    public loading: boolean = true;

    constructor(public $scope: ng.IScope, public configService: configService)
    {

    }

    $onInit(): void
    {
        let self = this;
        self.loading = true;
        self.configService.getSiteInfo().then(info =>
        {
            //self.info = info;
            self.loading = false;
            document.title = info.title;
            self.$scope.$apply();

        });
    }
}

class initializerComponent implements ng.IComponentOptions
{
    public controller: any;
    public templateUrl: any;

    constructor()
    {
        this.controller = initializerComponentController;
        this.templateUrl = function ()
        {
            return configService.getThemeFile('initializer');
        }
    }
}

angular.module(appConstants.appName).component('initializer', new initializerComponent());