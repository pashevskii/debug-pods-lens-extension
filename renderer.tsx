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
import { Renderer } from "@k8slens/extensions";
import { DebugPodToolsMenu, DebugPodToolsMenuProps } from "./src/debug-pod-menu";
import { DebugPodToolsPreferenceHint, DebugPodToolsPreferenceInput } from "./src/debug-pod-preferences";
import { debugPodPreferencesStore } from "./src/debug-pod-preferences-store";
import { DebugPodUtils } from "./src/debug-pod-utils";
import React from "react";

export default class PodDebugMenuRendererExtension extends Renderer.LensExtension {
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
        Input: () => <DebugPodToolsPreferenceInput/>
      }
    }
  ];

  kubeObjectStatusTexts = [
    {
      kind: "Pod",
      apiVersions: ["v1"],
      resolve: (object : Renderer.K8sApi.Pod) => {return DebugPodUtils.showWarnings(object);},
    }
  ];

  onActivate() {
    console.log("debug pods extension activated");
    debugPodPreferencesStore.loadExtension(this);
  }
}
