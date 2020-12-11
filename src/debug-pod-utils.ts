import { LensRendererExtension ,Component, K8sApi, Util, Navigation} from "@k8slens/extensions";
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
}
