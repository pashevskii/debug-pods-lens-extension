

import React from "react";
import { Component, K8sApi, Util, Navigation } from "@k8slens/extensions";
import { debugPodPreferencesStore } from "./debug-pod-preferences-store";

export interface DebugPodToolsMenuProps extends Component.KubeObjectMenuProps<K8sApi.Pod> {
}

export class DebugPodToolsMenu extends React.Component<DebugPodToolsMenuProps> {
  static label = "createdBy=lens-debug-extension"
  static removeOnComplete = true

  async attachAndRunDebugContainer(container?: string) {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = `kubectl alpha debug -i -t -n ${pod.getNs()} ${pod.getName()} --image=${debugPodPreferencesStore.debugImage} --target ${container} --attach`;
    if (window.navigator.platform !== "Win32") {
      command = `exec ${command}`;
    }

    const shell = Component.createTerminalTab({
      title: `Pod: ${pod.getName()} (namespace: ${pod.getNs()})`
    });

    Component.terminalStore.sendCommand(command, {
      enter: true,
      tabId: shell.id
    });
  }

  async createDebugPodAndRun() {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = `kubectl run ${pod.getName()}-debug -n ${pod.getNs()} -it --image=${debugPodPreferencesStore.debugImage} --restart=Never  --attach `;
    if (window.navigator.platform !== "Win32") {
      command = `exec ${command}`;
    }
    if (pod.getNodeName()) {
      command = `${command} --overrides='{ "spec": { "nodeName": "${pod.getNodeName()}" } }'`
    }

    if (DebugPodToolsMenu.label) {
      command = `${command} --labels=${DebugPodToolsMenu.label}`
    }

    if (DebugPodToolsMenu.removeOnComplete) {
      command = `${command} --rm`
    }

    const shell = Component.createTerminalTab({
      title: `Pod: ${pod.getName()}-debug (namespace: ${pod.getNs()})`
    });

    Component.terminalStore.sendCommand(command, {
      enter: true,
      tabId: shell.id
    });

  }

  render() {
    const { object, toolbar } = this.props;
    const containers = object.getRunningContainers();

    return (
      <Component.MenuItem>
        <Component.Icon material="library_add" interactive={toolbar} title="Debug Pods Extension"/>
        <span className="title" title="Debug Pods Extension">Debug</span>
          <>
            <Component.Icon className="arrow" material="keyboard_arrow_right"/>
            <Component.SubMenu>
              <Component.MenuItem key={"deployAndRunDebugPod"} onClick={Util.prevDefault(() => this.createDebugPodAndRun())} className="flex align-center">
              <span>Run as debug pod</span>
              </Component.MenuItem>
              {containers.length > 0 && debugPodPreferencesStore.ephemeralContainersEnabled &&(
              <Component.MenuItem key={"attachAndRunDebugContainer"} onClick={Util.prevDefault(() => this.attachAndRunDebugContainer(containers[0].name))} className="flex align-center">
              <span>Run as emepheral container</span>
              {containers.length > 1 && (
                <>
                  <Component.Icon className="arrow" material="keyboard_arrow_right"/>
                  <Component.SubMenu>
                  {containers.map(container => {
                    const { name } = container;
                      return (
                        <Component.MenuItem key={name} onClick={Util.prevDefault(() => this.attachAndRunDebugContainer(name))} className="flex align-center">
                          <Component.StatusBrick/>
                          <span> {name} </span>
                          </Component.MenuItem>
                        );
                    })}
                  </Component.SubMenu>
                </>
              )}
              </Component.MenuItem>
            )}
            </Component.SubMenu>
          </>

      </Component.MenuItem>
    );
  }
}
