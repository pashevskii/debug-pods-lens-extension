import { Component,K8sApi, Navigation, Store } from "@k8slens/extensions";
import React from "react";
import { observer } from "mobx-react";
import { DebugPodPreferencesStore } from "./debug-pod-preferences-store";
import { AddDebugImageDialog} from "./add-debug-image-dialog"
import {DebugPodUtils} from "./debug-pod-utils"

@observer
export class DebugPodToolsPreferenceInput extends React.Component<{debug: DebugPodPreferencesStore}, {}> {

  render() {
    const { debug } = this.props;
    return (
      <>
      <h5>Debug Image</h5>
      <div className="flex gaps">
        <Component.Select
        themeName="light"
        options={debug.debugImageList}
        value={debug.debugImage}
        onChange={({ value }: Component.SelectOption) => {debug.debugImage = value;}}
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
      <h5>Enable ephemeral containers for the clusters</h5>
      {Store.clusterStore.getByWorkspaceId(Store.workspaceStore.currentWorkspaceId).map((cluster, index) => (
        <><Component.Checkbox
          disabled = {!DebugPodUtils.isClusterSupportEphemeralContainers(cluster)}
          label={cluster.name}
          value={debug.ephemeralContainersEnabled.indexOf(cluster.name) > -1}
          onChange={v => this.toggleEphemeralContainersAccessibility(v, cluster.name)}
          />
          {!DebugPodUtils.isClusterSupportEphemeralContainers(cluster) && (<span> Warning, the cluster doesn't support ephemeral containers or is not available</span>)}
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
    const { debug } = this.props;
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
