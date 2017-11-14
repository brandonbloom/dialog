import React from 'react';
import { createPortal } from 'react-dom';
import createReactClass from 'create-react-class';
import Dialog from './Dialog';
import getContainerRenderMixin from 'rc-util/lib/getContainerRenderMixin';
import Portal from 'rc-util/lib/Portal';
import IDialogPropTypes from './IDialogPropTypes';

const IS_REACT_16 = !!createPortal;

const mixins: any[] = [];

if (!IS_REACT_16) {
  mixins.push(
    getContainerRenderMixin({
      isVisible(instance) {
        return instance.props.visible;
      },
      autoDestroy: false,
      getContainer(instance) {
        return instance.getContainer();
      },
    }),
  );
};

const DialogWrap = createReactClass<IDialogPropTypes, any>({
  displayName: 'DialogWrap',

  mixins,

  getDefaultProps() {
    return {
      visible: false,
    };
  },

  shouldComponentUpdate({ visible }) {
    return !!(this.props.visible || visible);
  },

  saveDialog(node) {
    this._component = node;
  },

  getComponent() {
    return (
      <Dialog
        ref={this.saveDialog}
        {...this.props}
        key="dialog"
      />
    );
  },

  getContainer() {
    if (this.props.getContainer) {
      return this.props.getContainer();
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
  },

  render() {
    const { visible } = this.props;

    if (!IS_REACT_16) {
      return (null as any);
    }

    if (visible || this._component) {
      return (
        <Portal getContainer={this.getContainer}>
          {this.getComponent()}
        </Portal>
      );
    }
  },
});

export default DialogWrap;
