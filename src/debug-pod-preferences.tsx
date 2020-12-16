import { Component, Store } from "@k8slens/extensions";
import React from "react";
import { observer } from "mobx-react";
import { DebugPodPreferencesStore } from "./debug-pod-preferences-store";

@observer
export class DebugPodToolsPreferenceInput extends React.Component<{debug: DebugPodPreferencesStore}, {}> {
  render() {
    const { debug } = this.props;
    console.log(Store.clusterStore.activeCluster)
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

      </div>
      <h5>Enable ephemeral containers for the clusters</h5>
      {Store.clusterStore.getByWorkspaceId(Store.workspaceStore.currentWorkspaceId).map((cluster, index) => (
        <Component.Checkbox
          label={cluster.name}
          value={debug.ephemeralContainersEnabled.indexOf(cluster.name) > -1}
          onChange={v => this.toggleEphemeralContainersAccessibility(v, cluster.name)}
          />))}
      <span>Warning! Be sure that Ephemeral Containers are enabled on your cluster before using this function! More information is
      <a href="https://www.shogan.co.uk/kubernetes/enabling-and-using-ephemeral-containers-on-kubernetes-1-16/" target="_blank" rel="noreferrer"> here</a></span>
      </>
    );
  }


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
