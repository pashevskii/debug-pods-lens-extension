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
import { Common, Renderer } from "@k8slens/extensions";
import React from "react";
import { observer } from "mobx-react";
import { DebugPodPreferencesStore } from "./debug-pod-preferences-store";
import { AddDebugImageDialog} from "./add-debug-image-dialog";
import {DebugPodUtils} from "./debug-pod-utils";

const {Component} = Renderer;

@observer
export class DebugPodToolsPreferenceInput extends React.Component {


  
  render() {
    const debug = DebugPodPreferencesStore.getInstance();

    return (
      <>
        <h5>Debug Image</h5>
        <div className="flex gaps">
          <Component.Select
            themeName="light"
            options={debug.debugImageList}
            value={debug.debugImage}
            onChange={({ value }) => {debug.debugImage = value;}}
          />
          <Component.Button
            primary
            label={"Add Image"}
            onClick={() => AddDebugImageDialog.open()}
          />
          <Component.Button
            label={"Remove image"}
            onClick={()=> {debug.debugImageList = debug.debugImageList.filter(item => item != debug.debugImage); debug.debugImage=debug.debugImageList[0];}}
          />
        </div>
        <Component.Checkbox
          label="Show all debug images in context menu"
          value={debug.showAllImages}
          onChange={v => {debug.showAllImages = v;}}
        />
        <h5>Enable ephemeral containers for the clusters</h5>
        {Array.from(Renderer.Catalog.catalogEntities.entities).filter(( [_,value]) => value instanceof Common.Catalog.KubernetesCluster ).map(([_, value]) => (
          <><Component.Checkbox
            disabled = {!DebugPodUtils.isClusterSupportEphemeralContainers(value as Common.Catalog.KubernetesCluster)}
            label={value.getName()}
            value={debug.ephemeralContainersEnabled.indexOf(value.getName()) > -1}
            onChange={v => this.toggleEphemeralContainersAccessibility(v, value.getName())}
          />
          {!DebugPodUtils.isClusterSupportEphemeralContainers(value as Common.Catalog.KubernetesCluster) && (<span> Warning, the cluster doesn&apos;t support ephemeral containers or is not available</span>)}
          </>
        ))}
        <div><span>Warning! Be sure that Ephemeral Containers are enabled on your cluster before using this function! More information is
          <a href="https://www.shogan.co.uk/kubernetes/enabling-and-using-ephemeral-containers-on-kubernetes-1-16/" target="_blank" rel="noreferrer"> here</a></span></div>
        <AddDebugImageDialog onSuccess={(v) => {debug.debugImageList.push(v); debug.debugImage = v; }}/>
      </>
    );
  }

  /*checkAllClusters() {
    Store.clusterStore.getByWorkspaceId(Store.workspaceStore.currentWorkspaceId)[0].activate().then(() => {console.log("Active")}).catch(()=>{console.log("ERROR")})
  }*/


  toggleEphemeralContainersAccessibility(value:boolean, name: string) {
    const debug = DebugPodPreferencesStore.getInstance();
    const emepheralContainersEnabledSet = new Set<String>(debug.ephemeralContainersEnabled);

    if (value) {
      emepheralContainersEnabledSet.add(name);
    } else {
      emepheralContainersEnabledSet.add(name).delete(name);
    }
    debug.ephemeralContainersEnabled = Array.from(emepheralContainersEnabledSet);
  }
}



export class DebugPodToolsPreferenceHint extends React.Component {
  render() {
    return (
      <>
      </>
    );
  }
}
