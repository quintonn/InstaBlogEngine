import * as angular from 'angular';

// Path to appConstants might be different depending on your item's location
import { appConstants } from '../../models/appConstants';
import { httpService } from '../../services/httpService';
import { siteInfo } from '../../models/siteInfo';

require("../../appConfig");

class footerComponentController implements ng.IOnInit
{
    static $inject = ['$scope', 'httpService'];

    public siteInfo: siteInfo;

    constructor(public $scope: ng.IScope, public httpService: httpService)
    {
        
    }

    $onInit(): void
    {
        let self = this;
        this.httpService.getSiteInfo().then(info =>
        {
            self.siteInfo = info;
            document.title = info.title;
            self.$scope.$apply();
        });
    }

    
}

class footerComponent implements ng.IComponentOptions
{
    public controller: any;
    public template: string;

    constructor()
    {
        this.controller = footerComponentController;
        this.template = require('./footer.html');
    }
}

angular.module(appConstants.appName).component('footer', new footerComponent());