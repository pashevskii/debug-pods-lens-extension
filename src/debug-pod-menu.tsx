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
import React from "react";
import { Renderer, Common } from "@k8slens/extensions";
import { DebugPodPreferencesStore } from "./debug-pod-preferences-store";
import { DebugPodUtils } from "./debug-pod-utils";


const {
  Component: {
    
    createTerminalTab,
    terminalStore,
    MenuItem,
    Icon,
    SubMenu,
    StatusBrick, 
  },

  Navigation,
  K8sApi:{
    
  },
  
} = Renderer;
const {
  Util, 
  
} = Common;

export interface DebugPodToolsMenuProps extends Renderer.Component.KubeObjectMenuProps<Renderer.K8sApi.Pod> {

}

export class DebugPodToolsMenu extends React.Component<DebugPodToolsMenuProps> {
  static label = "createdBy=lens-debug-extension";
  static removeOnComplete = true;
    
  async attachAndRunDebugContainer(container: string, debugImage = DebugPodPreferencesStore.getInstance().debugImage) {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = DebugPodUtils.getDebugCommand(Renderer.Catalog.catalogEntities.activeEntity as Common.Catalog.KubernetesCluster );

    command = `${command} -i -t -n ${pod.getNs()} ${pod.getName()} --image=${debugImage} --target ${container} --attach`;

    const shell = createTerminalTab({
      title: `Pod: ${pod.getName()} (namespace: ${pod.getNs()})`
    });

    terminalStore.sendCommand(this.formatCommand(command), {
      enter: true,
      tabId: shell.id
    });
  }

  async createDebugPodAndRun(debugImage = DebugPodPreferencesStore.getInstance().debugImage) {
    Navigation.hideDetails();
    const { object: pod } = this.props;
    let command = `kubectl run ${pod.getName()}-debug -n ${pod.getNs()} -it --image=${debugImage} --restart=Never  --attach `;

    if (pod.getNodeName()) {
      command = `${command} --overrides='{ "spec": { "nodeName": "${pod.getNodeName()}" } }'`;
    }

    if (DebugPodToolsMenu.label) {
      command = `${command} --labels=${DebugPodToolsMenu.label}`;
    }

    if (DebugPodToolsMenu.removeOnComplete) {
      command = `${command} --rm`;
    }

    const shell = createTerminalTab({
      title: `Pod: ${pod.getName()}-debug (namespace: ${pod.getNs()})`
    });

    terminalStore.sendCommand(this.formatCommand(command), {
      enter: true,
      tabId: shell.id
    });

  }

  formatCommand(command: string):string {
    if (window.navigator.platform !== "Win32") return `exec ${command}`;
    else return command.replace(/"/g, '\\"');
  }

  renderAllImagesAttach(container: string) {
    if (DebugPodPreferencesStore.getInstance().showAllImages && DebugPodPreferencesStore.getInstance().debugImageList.length > 1) {
      return (
        <SubMenu>
          <MenuItem active={false} disabled={true} className="flex align-center">
            <span>Select debug image...</span>
          </MenuItem>
          {DebugPodPreferencesStore.getInstance().debugImageList.map(v => {
            return (
              <MenuItem key={v} className="flex align-center" onClick={Util.prevDefault(() =>this.attachAndRunDebugContainer(container,v))}>
                <span>{v}</span>
              </MenuItem>
            );
          })}
        </SubMenu>
      );
    }
  }

  renderAllImagesDebug() {
    if (DebugPodPreferencesStore.getInstance().showAllImages && DebugPodPreferencesStore.getInstance().debugImageList.length > 1) {
      return (
        <SubMenu>
          <MenuItem active={false} disabled={true} className="flex align-center">
            <span>Select debug image...</span>
          </MenuItem>
          {DebugPodPreferencesStore.getInstance().debugImageList.map(v => {
            return (
              <MenuItem key={v} className="flex align-center" onClick={Util.prevDefault(() =>this.createDebugPodAndRun(v))}>
                <span>{v}</span>
              </MenuItem>
            );
          })}
        </SubMenu>
      );
    }
  }

  render() {
    const { object, toolbar } = this.props;
    const { object: pod } = this.props;
    const containers = object.getRunningContainers();

    return (
      <MenuItem>
        <Icon material="library_add" interactive={toolbar} title="Debug Pods Extension"/>
        <span className="title" title="Debug Pods Extension">Debug</span>
        <>
          <Icon className="arrow" material="keyboard_arrow_right"/>
          <SubMenu>
            <MenuItem key={"deployAndRunDebugPod"} onClick={Util.prevDefault(() => this.createDebugPodAndRun())} className="flex align-center">
              <span>Run as debug pod</span>
              {this.renderAllImagesDebug()}
            </MenuItem>
            {containers.length > 0 && Renderer.Catalog.catalogEntities.activeEntity && DebugPodPreferencesStore.getInstance().ephemeralContainersEnabled.indexOf(Renderer.Catalog.catalogEntities.activeEntity.getName()) > -1 && (
              <MenuItem key={"attachAndRunDebugContainer"} onClick={Util.prevDefault(() => this.attachAndRunDebugContainer(containers[0].name))} className="flex align-center">
                <span>Run as emepheral container</span>
                {containers.length == 1 && this.renderAllImagesAttach(containers[0].name)}
                {containers.length > 1 && (
                  <>
                    <Icon className="arrow" material="keyboard_arrow_right"/>
                    <SubMenu>
                      {containers.map(container => {
                        const { name } = container;

                        return (
                          <MenuItem key={name} onClick={Util.prevDefault(() => this.attachAndRunDebugContainer(name))} className="flex align-center">
                            <StatusBrick/>
                            <span> {name} </span>
                            {this.renderAllImagesAttach(name)}
                          </MenuItem>
                        );
                      })}
                    </SubMenu>
                  </>
                )}
              </MenuItem>
            )}
          </SubMenu>
        </>

      </MenuItem>
    );
  }
}
