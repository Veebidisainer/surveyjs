﻿/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class ChoicesRestfull extends Base {
        public url: string = "";
        public path: string = "";
        public valueName: string = "";
        public titleName: string = "";
        public getResultCallback: (items: Array<ItemValue>) => void;
        constructor() {
            super();
        }
        public run() {
            if (!this.url || !this.getResultCallback) return;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                var result = JSON.parse(xhr.response);
                if (xhr.status == 200) {
                    self.onLoad(JSON.parse(xhr.response));
                }
            };
            xhr.send();
        }
        public getType(): string { return "choicesByUrl"; }
        public get isEmpty(): boolean {
            return !this.url && !this.path && !this.valueName && !this.titleName;
        }
        public setData(json: any) {
            this.clear();
            if (json.url) this.url = json.url;
            if (json.path) this.path = json.path;
            if (json.valueName) this.valueName = json.valueName;
            if (json.titleName) this.titleName = json.titleName;
        }
        public clear() {
            this.url = "";
            this.path = "";
            this.valueName = "";
            this.titleName = "";
        }
        protected onLoad(result: any) {
            if (!result) return;
            result = this.getResultAfterPath(result);
            if (!result || !result["length"]) return;
            var items = [];
            for (var i = 0; i < result.length; i++) {
                var itemValue = result[i];
                if (!itemValue) continue;
                var value = this.getValue(itemValue);
                var title = this.getTitle(itemValue);
                items.push(new ItemValue(value, title));
            }
            this.getResultCallback(items);
        }
        private getResultAfterPath(result: any) {
            if (!this.path) return result;
            var pathes = this.getPathes();
            for (var i = 0; i < pathes.length; i++) {
                result = result[pathes[i]];
                if (!result) return null;
            }
            return result;
        }
        private getPathes(): Array<string> {
            var pathes = [];
            if (this.path.indexOf(';') > -1) {
                pathes = this.path.split(';');
            } else {
                pathes = this.path.split(',');
            }
            if (pathes.length == 0) pathes.push(this.path);
            return pathes;
        }
        private getValue(item: any): any {
            if (this.valueName) return item[this.valueName];
            var len = Object.keys(item).length;
            if (len < 1) return null;
            return item[Object.keys(item)[0]];
        }
        private getTitle(item: any): any {
            if (!this.titleName) return null;
            return item[this.titleName];
        }
    }
    JsonObject.metaData.addClass("choicesByUrl", ["url", "path", "valueName", "titleName"], function () { return new ChoicesRestfull(); });
}