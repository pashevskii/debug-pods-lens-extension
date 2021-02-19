import { LensRendererExtension ,Component, K8sApi, Util, Navigation} from "@k8slens/extensions";
import { DebugPodToolsMenu, DebugPodToolsMenuProps } from "./src/debug-pod-menu";
import { DebugPodToolsPreferenceHint, DebugPodToolsPreferenceInput } from "./src/debug-pod-preferences";
import { debugPodPreferencesStore } from "./src/debug-pod-preferences-store";
import { DebugPodUtils } from "./src/debug-pod-utils";
import React from "react";

export default class PodDebugMenuRendererExtension extends LensRendererExtension {
  kubeObjectMenuItems = [
    {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: DebugPodToolsMenuProps) => <DebugPodToolsMenu {...props} />
      }
    },
  ];

  appPreferences = [
    {
      title: "Debug pod tools",
      components: {
        Hint: () => <DebugPodToolsPreferenceHint/>,
        Input: () => <DebugPodToolsPreferenceInput debug={debugPodPreferencesStore}/>
      }
    }
  ];

  kubeObjectStatusTexts = [
    {
      kind: "Pod",
      apiVersions: ["v1"],
      resolve: (object : K8sApi.Pod) => {return DebugPodUtils.showWarnings(object)},
    }
  ];

  async onActivate() {
    console.log("debug pods extension activated");
    await debugPodPreferencesStore.loadExtension(this);
  }
}
