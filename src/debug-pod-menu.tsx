

import React from "react";
import { Component, K8sApi, Util, Navigation, Store } from "@k8slens/extensions";
import { debugPodPreferencesStore } from "./debug-pod-preferences-store";
import { DebugPodUtils } from "./debug-pod-utils"

export interface DebugPodToolsMenuProps extends Component.KubeObjectMenuProps<K8sApi.Pod> {
}

export class DebugPodToolsMenu extends React.Component<DebugPodToolsMenuProps> {
  static label = "createdBy=lens-debug-extension"
  static removeOnComplete = true

  async attachAndRunDebugContainer(container: string, debugImage = debugPodPreferencesStore.debugImage) {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = DebugPodUtils.getDebugCommand(Store.clusterStore.activeCluster);
    command = `${command} -i -t -n ${pod.getNs()} ${pod.getName()} --image=${debugImage} --target ${container} --attach`;
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

  async createDebugPodAndRun(debugImage = debugPodPreferencesStore.debugImage) {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = `kubectl run ${pod.getName()}-debug -n ${pod.getNs()} -it --image=${debugImage} --restart=Never  --attach `;
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

  renderAllImagesAttach(container: string) {
    if (debugPodPreferencesStore.showAllImages && debugPodPreferencesStore.debugImageList.length > 1) {
      return (
          <Component.SubMenu>
            <Component.MenuItem active={false} disabled={true} className="flex align-center">
              <span>Select debug image...</span>
            </Component.MenuItem>
            {debugPodPreferencesStore.debugImageList.map(v => {
              return (
                <Component.MenuItem key={v} className="flex align-center" onClick={Util.prevDefault(() =>this.attachAndRunDebugContainer(container,v))}>
                  <span>{v}</span>
                </Component.MenuItem>
              )
            })}
          </Component.SubMenu>
      )
    }
  }

  renderAllImagesDebug() {
    if (debugPodPreferencesStore.showAllImages && debugPodPreferencesStore.debugImageList.length > 1) {
      return (
          <Component.SubMenu>
            <Component.MenuItem active={false} disabled={true} className="flex align-center">
              <span>Select debug image...</span>
            </Component.MenuItem>
            {debugPodPreferencesStore.debugImageList.map(v => {
              return (
                <Component.MenuItem key={v} className="flex align-center" onClick={Util.prevDefault(() =>this.createDebugPodAndRun(v))}>
                  <span>{v}</span>
                </Component.MenuItem>
              )
            })}
          </Component.SubMenu>
      )
    }
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
              {this.renderAllImagesDebug()}
              </Component.MenuItem>
              {containers.length > 0 && debugPodPreferencesStore.ephemeralContainersEnabled.indexOf(Store.clusterStore.activeCluster.name) > -1 && (
              <Component.MenuItem key={"attachAndRunDebugContainer"} onClick={Util.prevDefault(() => this.attachAndRunDebugContainer(containers[0].name))} className="flex align-center">
              <span>Run as emepheral container</span>
              {containers.length == 1 && this.renderAllImagesAttach(containers[0].name)}
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
                          {this.renderAllImagesAttach(name)}
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
