import { LensRendererExtension ,Component, K8sApi, Util, Store} from "@k8slens/extensions";
import { action, observable } from "mobx";

export class DebugPodUtils{
  static showWarnings(pod : K8sApi.Pod):K8sApi.KubeObjectStatus {
    const podSpecAsObject = <any>pod.spec; //getting things which are not declared in K8sApi.Pod
    if (pod.getLabels().indexOf("createdBy=lens-debug-extension") > -1) {
      return {level: 2, text: "It is a debug pod, which is created by Debug Pod Extension, do not forget to remove it after debugging"};
    }
    if (podSpecAsObject.ephemeralContainers) {
      return {level: 2, text: "This pod contains emepheral containers. Do not forget to restart container after debugging"};
    }
    else return null
  }

  //Ephemeral containers are supported by k8s 1.16+
  static isClusterSupportEphemeralContainers(cluster: Store.Cluster) : boolean {
    if (!cluster.version) return false;
    const blocks =  cluster.version.split(".").map(x=>parseInt(x))
    return blocks[1] > 15;
  }

  // K8s 1.20 uses kubectl debug instead of kubectl alpha debug
  static getDebugCommand(cluster: Store.Cluster) : string {
    if (!cluster.version) return "kubectl alpha debug";
    const blocks =  cluster.version.split(".").map(x=>parseInt(x));
    if (blocks[1] > 19) return "kubectl debug";
    else return "kubectl alpha debug";
  }

}
