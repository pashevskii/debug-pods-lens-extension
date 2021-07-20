/*MIT License

Copyright (c) 2020 Pavel Ashevskii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/
import { Common } from "@k8slens/extensions";
import { observable, makeObservable, toJS } from "mobx";

export type DebugPodPreferencesModel = {
  debugImage: string;
  ephemeralContainersEnabled: String[];
  debugImageList: string[];
  showAllImages: boolean;
};

export class DebugPodPreferencesStore extends Common.Store.ExtensionStore<DebugPodPreferencesModel> {
  @observable debugImage = "busybox";
  @observable ephemeralContainersEnabled: String[] = [];
  @observable debugImageList = ["busybox", "markeijsermans/debug", "praqma/network-multitool"];
  @observable showAllImages = false;

  constructor() {
    super({
      configName: "debug-pods-preferences-store",
      defaults: {
        debugImage: "busybox",
        ephemeralContainersEnabled: [],
        debugImageList: ["busybox", "markeijsermans/debug", "praqma/network-multitool"],
        showAllImages: false
      }
    });
    makeObservable(this);
  }

  protected fromStore( data: DebugPodPreferencesModel): void {
    this.debugImage = data.debugImage;
    this.ephemeralContainersEnabled = data.ephemeralContainersEnabled;
    this.debugImageList = data.debugImageList;
    this.showAllImages = data.showAllImages;
  }

  toJSON(): DebugPodPreferencesModel {
    const value: DebugPodPreferencesModel  = {
      debugImage: this.debugImage,
      ephemeralContainersEnabled: this.ephemeralContainersEnabled,
      debugImageList: this.debugImageList,
      showAllImages: this.showAllImages,
    };

    return toJS(value);
  }
}

export const debugPodPreferencesStore = DebugPodPreferencesStore.createInstance();
