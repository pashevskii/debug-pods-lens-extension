# debug-pods-lens-extension
Lens extension, which helps to debug pods

# what is the extension for?
This extension is useful for interactive troubleshooting when ```kubectl exec``` is insufficient because a container has crashed or a container image doesn't include debugging utilities, such as with distroless images.

# how is the extension help to debug?

### new menu items
This extension adds new menu items to Pods in Workload -> Pods table
The menu includes the next subitems:

| SubItem | Description |
| ------ | ------ |
| Run as debug pod | Creates and runs new Pod based on <debug image> with <current_pod>_debug name and placed on the same node/namespace. The Pod is deleted automatically after session closing
| Run as ephemeral image | Attaches and runs ephemeral image to the selected Pod. If the Pod contains 2+ containers you can select which will be linked with an ephemeral container. Warning! Be sure that the current cluster supports this feature

### configuration
The extension adds 3 parameters in File -> Preferences
Debug Image: default image, which will be used for ephemeral containers and debug pods, possible values:
| Name | Description | Link |
| ------ | ------ | ------|
| busybox | Default value | https://hub.docker.com/_/busybox |
| markeijsermans/debug |  | https://hub.docker.com/r/markeijsermans/debug |
| praqma/network-multitool |  | https://hub.docker.com/r/praqma/network-multitool |

Show all debug images in context menu: shows all debug images as context menu for operation

Use ephemeral containers: Just hides/shows subitems related to ephemeral containers for each cluster

# Installation

```bash
$ git clone https://github.com/pashevskii/debug-pods-lens-extension.git /your/src/path
$ mkdir -p ~/.k8slens/extensions
$ ln -s /your/src/path ~/.k8slens/extensions/debug-pods-lens-extension
$ cd /your/src/path
$ npm install
$ npm run build
```
or 
Press CTRL+SHIFT+E on Lens, paste the url and click on Install button: https://github.com/pashevskii/debug-pods-lens-extension/releases/download/0.1.1/lens-debug-tools-0.1.1.tgz
