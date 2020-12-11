import { Store } from "@k8slens/extensions";
import { observable, toJS } from "mobx";

export type DebugPodPreferencesModel = {
  debugImage: string;
  ephemeralContainersEnabled: boolean;
};

export class DebugPodPreferencesStore extends Store.ExtensionStore<DebugPodPreferencesModel> {
  @observable debugImage = "busybox";
  @observable ephemeralContainersEnabled = true;

  private constructor() {
    super({
      configName: "preferences-store",
      defaults: {
        debugImage: "busybox",
        ephemeralContainersEnabled: true,
      }
    });
  }

  protected fromStore( data: DebugPodPreferencesModel): void {
    console.log("From store", data.debugImage, data.ephemeralContainersEnabled)
    this.debugImage = data.debugImage;
    this.ephemeralContainersEnabled = data.ephemeralContainersEnabled;
  }

  toJSON(): DebugPodPreferencesModel {
    console.log("toJSON", {
      debugImage: this.debugImage,
      ephemeralContainersEnabled: this.ephemeralContainersEnabled,
    })
    const value :DebugPodPreferencesModel  = {
      debugImage: this.debugImage,
      ephemeralContainersEnabled: this.ephemeralContainersEnabled,
    }
    return toJS(value , {
      recurseEverything: true
    });
  }
}

export const debugPodPreferencesStore = DebugPodPreferencesStore.getInstance<DebugPodPreferencesStore>();
