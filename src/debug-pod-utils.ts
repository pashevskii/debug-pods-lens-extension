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
import { Common, Renderer} from "@k8slens/extensions";

export class DebugPodUtils{
  static showWarnings(pod : Renderer.K8sApi.Pod):Renderer.K8sApi.KubeObjectStatus {
    const podSpecAsObject = <any>pod.spec; //getting things which are not declared in K8sApi.Pod

    if (pod.getLabels().indexOf("createdBy=lens-debug-extension") > -1) {
      return {level: 2, text: "It is a debug pod, which is created by Debug Pod Extension, do not forget to remove it after debugging"};
    }
    if (podSpecAsObject.ephemeralContainers) {
      return {level: 2, text: "This pod contains emepheral containers. Do not forget to restart container after debugging"};
    }
    
    else return null;
  }

  //Ephemeral containers are supported by k8s 1.16+
  static isClusterSupportEphemeralContainers(cluster: Common.Catalog.KubernetesCluster) : boolean {
    if (!cluster.metadata.kubeVersion) return false;
    const blocks =  cluster.metadata.kubeVersion.toString().split(".").map(x=>parseInt(x));

    return blocks[1] > 15;
  }

  // K8s 1.20 uses kubectl debug instead of kubectl alpha debug
  static getDebugCommand(cluster: Common.Catalog.KubernetesCluster) : string {
    if (!cluster.metadata.kubeVersion) return "kubectl alpha debug";
    const blocks =  cluster.metadata.kubeVersion.toString().split(".").map(x=>parseInt(x));

    console.log("Blocks:", blocks[1]);
    if (blocks[1] > 19) return "kubectl debug";
    else return "kubectl alpha debug";
  }

}
