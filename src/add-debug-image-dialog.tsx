//import "./add-namespace-dialog.scss";

import { Component } from "@k8slens/extensions";
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

interface Props extends Component.DialogProps {
  onSuccess?(image: string): void;
  onError?(error: any): void;
}

@observer
export class AddDebugImageDialog extends React.Component<Props> {
  @observable static isOpen = false;
  @observable image = "";

  static open() {
    console.log("Here!")
    AddDebugImageDialog.isOpen = true;
  }

  static close() {
    AddDebugImageDialog.isOpen = false;
  }

  reset = () => {
    this.image = "";
  };

  close = () => {
    AddDebugImageDialog.close();
  };

  addImage = async () => {
    const { image } = this;
    const { onSuccess, onError } = this.props;

    try {
      onSuccess(image)
      this.close();
    } catch (err) {
      Component.Notifications.error(err);
      onError && onError(err);
    }
  };

  render() {
    const { ...dialogProps } = this.props;
    const { image } = this;
    const header = <h5>Add new debug image</h5>;

    return(
      <Component.Dialog
        {...dialogProps}
        className="AddImageDialog"
        isOpen={AddDebugImageDialog.isOpen}
        onOpen={this.reset}
        close={this.close}
      >
        <Component.Wizard header={header} done={this.close}>
          <Component.WizardStep
            contentClass="flex gaps column"
            nextLabel={"Add"}
            next={this.addImage}
          >
            <Component.Input
              required autoFocus
              iconLeft="layers"
              placeholder={`Image`}
              value={image} onChange={v => this.image = v}
            />
          </Component.WizardStep>
        </Component.Wizard>
      </Component.Dialog>
    );
  }
}
