import { Store } from "@k8slens/extensions";
import { observable, toJS } from "mobx";

export type DebugPodPreferencesModel = {
  debugImage: string;
  ephemeralContainersEnabled: string[];
  debugImageList: string[];
  showAllImages: boolean;
};

export class DebugPodPreferencesStore extends Store.ExtensionStore<DebugPodPreferencesModel> {
  @observable debugImage = "busybox";
  @observable ephemeralContainersEnabled = new Array();
  @observable debugImageList = ["busybox", "markeijsermans/debug", "praqma/network-multitool"];
  @observable showAllImages = false;

  private constructor() {
    super({
      configName: "preferences-store",
      defaults: {
        debugImage: "busybox",
        ephemeralContainersEnabled: new Array(),
        debugImageList: ["busybox", "markeijsermans/debug", "praqma/network-multitool"],
        showAllImages: false
      }
    });
  }

  protected fromStore( data: DebugPodPreferencesModel): void {
    console.log("From store", data.debugImage, data.ephemeralContainersEnabled)
    this.debugImage = data.debugImage;
    this.ephemeralContainersEnabled = data.ephemeralContainersEnabled;
    this.debugImageList = data.debugImageList;
    this.showAllImages = data.showAllImages;
  }

  toJSON(): DebugPodPreferencesModel {

    const value :DebugPodPreferencesModel  = {
      debugImage: this.debugImage,
      ephemeralContainersEnabled: this.ephemeralContainersEnabled,
      debugImageList: this.debugImageList,
      showAllImages: this.showAllImages,
    }
    return toJS(value , {
      recurseEverything: true
    });
  }
}

export const debugPodPreferencesStore = DebugPodPreferencesStore.getInstance<DebugPodPreferencesStore>();
