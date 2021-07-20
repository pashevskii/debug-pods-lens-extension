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
import { Renderer } from "@k8slens/extensions";
import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";

const {Component} = Renderer;

interface Props {
  onSuccess?(image: string): void;
  onError?(error: any): void;
}

const dialogState = observable.object({
  isOpen: false,
  image: "",
});

@observer
export class AddDebugImageDialog extends React.Component<Props> {

  static open() {
    dialogState.isOpen = true;
  }

  static close() {
    dialogState.isOpen = false;
  }

  reset = () => {
    dialogState.image = "";
  };

  close = () => {
    AddDebugImageDialog.close();
  };

  addImage = async () => {
    
    const { onSuccess, onError } = this.props;

    try {
      onSuccess(dialogState.image);
      this.close();
    } catch (err) {
      Component.Notifications.error(err);
      onError && onError(err);
    }
  };

  render() {
    const { ...dialogProps } = this.props;
    const header = <h5>Add new debug image</h5>;

    console.log("Render dialog");

    return(
      <Component.Dialog
        {...dialogProps}
        className="AddImageDialog"
        isOpen={dialogState.isOpen}
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
              value={dialogState.image} onChange={v => dialogState.image = v}
            />
          </Component.WizardStep>
        </Component.Wizard>
      </Component.Dialog>
    );
  }
}
