import { LensMainExtension } from "@k8slens/extensions";
import { debugPodPreferencesStore } from "./src/debug-pod-preferences-store";

export default class DebugPodMainExtension extends LensMainExtension {

  async onActivate() {
    console.log("debug pod main extension activated");
    await debugPodPreferencesStore.loadExtension(this);
  }

  onDeactivate() {
    console.log("debug pod main extension deactivated");
  }
}
