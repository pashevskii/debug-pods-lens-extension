import { Component } from "@k8slens/extensions";
import React from "react";
import { observer } from "mobx-react";
import { DebugPodPreferencesStore } from "./debug-pod-preferences-store";

@observer
export class DebugPodToolsPreferenceInput extends React.Component<{debug: DebugPodPreferencesStore}, {}> {
  render() {
    const { debug } = this.props;
    return (
      <>
      <h5>Debug Image</h5>
      <Component.Select
        themeName="light"
        options={["markeijsermans/debug", "busybox"]}
        value={debug.debugImage}
        onChange={({ value }: Component.SelectOption) => {debug.debugImage = value;}}
      />
      <h5>Ephemeral containers</h5>
      <Component.Checkbox
        label="Use ephemeral containers"
        value={debug.ephemeralContainersEnabled}
        onChange={v => { debug.ephemeralContainersEnabled = v; }}
      />
      <span>Warning! Be sure that Ephemeral Containers are enabled on your cluster before using this function! More information is
      <a href="https://www.shogan.co.uk/kubernetes/enabling-and-using-ephemeral-containers-on-kubernetes-1-16/" target="_blank" rel="noreferrer"> here</a></span>
      </>
    );
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
