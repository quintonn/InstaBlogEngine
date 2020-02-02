import * as angular from 'angular';
import { appConstants } from '../models/appConstants';

require("../appConfig");


export interface ILoader
{
    show(label: string): void;
    close(): void;
}

export type SearchParam = [string, string];

export class menuService
{
    static $inject = ['$location'];

    private changeHeading: (heading: string) => void = null;
    private history: Array<string> = [];
    private busyLoader: ILoader = null

    constructor(
        // Add the parameter and type definition.
        public $location: ng.ILocationService
    )
    {
        var path = $location.path();

        if (path != null && path.length > 0)
        {
            path = path.substring(1).toLowerCase();;
        }
        if (path != null && path.length > 0 && path != "login" && path != "sign-up" && path != "logout")
        {
            this.history.push(path);
        }

        this.checkPath();
    }

    public checkPath(heading: string = null): void
    {
        //let heading :string = this.$location.search().name;
        if (heading != null && heading.length > 0)
        {
            this.setHeading(heading);
        }
        else
        {
            //let path = this.$location.path();
            //if (path != null && path.trim().length > 0)
            //{
            //    this.setHeading(path.substring(1));
            //}
            //else
            {
                this.setHeading("Home");
            }
        }
    }

    public setLoader(loader: ILoader)
    {
        this.busyLoader = loader;
    }

    public showLoader(label: string): void
    {
        this.busyLoader.show(label);
    }

    public closeLoader(): void
    {
        this.busyLoader.close();
    }

    public goHome(): void
    {
        this.goto('');
    }

    public goto(path: string)
    {
        if (path == null || path.length == 0)
        {
            this.history = [];
        }
        else
        {
            this.history.push(path);
        }

        this.$location.path(path);

        this.checkPath();
    }

    public goBack()
    {
        this.history.pop(); // remove current item
        var prev = this.history[this.history.length - 1];

        if (prev == null)
        {
            prev = "";
            this.history = [];
            this.$location.search("");
        }

        //service.goto(prev); // add the path back onto the stack
        this.$location.path(prev);
    }

    public setHeading(heading: string)
    {
        if (heading == null || heading.length == 0)
        {
            heading = "Home";
        }
        if (this.changeHeading != null)
        {
            this.changeHeading(heading);
        }
    }

    public onChange(method: (heading: string) => void)
    {
        this.changeHeading = method;
    }
}

angular.module(appConstants.appName).service('menuService', menuService);