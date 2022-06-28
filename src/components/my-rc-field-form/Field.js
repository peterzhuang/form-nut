import React, { Component } from 'react';
import FieldContext from './FieldContext';

export default class Field extends Component {
  static contextType = FieldContext;

  componentDidMount() {
    this.unregister = this.context.registerFieldEntities(this);
  }

  componentWillUnmount() {
    this.unregister();
  }

  onStoreChange = () => {
    this.forceUpdate();
  }

  getControlled = () => {
    const { getFieldsValue, getFieldValue, setFieldsValue } = this.context;
    const { name } = this.props;
    return {
      value: getFieldValue(name),  // get state
      onChange: (e) => {
        const newValue = e.target.value;
        // set state 
        setFieldsValue({ [name]: newValue });
        // console.log(`newValue ${newValue}`);
      }
    }
  }
  render() {
    const { children } = this.props;

    const returnChildNode = React.cloneElement(children, this.getControlled())
    return returnChildNode;
  }
}
