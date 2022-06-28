// state management 

import { useRef } from "react";

class FormStore {
    constructor() {
        this.store = {};
        this.fieldEntities = [];

        this.callbacks = {};
    };

    setCallbacks = (callbacks) => {
        this.callbacks = {...this.callbacks, ...callbacks};
    }

    registerFieldEntities = (entity) => {
        this.fieldEntities.push(entity);

        return () => {
            this.fieldEntities = this.fieldEntities.filter(item => item !== entity);
            delete this.store[entity.props.name];
        };
    }

    // get 
    getFieldsValue = () => {
        return { ...this.store };
    }

    getFieldValue = (name) => {
        return this.store[name];
    }

    // set 
    setFieldsValue = (newStore) => {
        // update store
        this.store = {
            ...this.store,
            ...newStore,
        }
        // update field

        this.fieldEntities.forEach(entity => {
            Object.keys(newStore).forEach(key => {
                if(key === entity.props.name) {
                    entity.onStoreChange();
                }
            });
        });

        console.log('this.store', this.store);
    }

    validate = () => {
        let err = [];
        // validate
        // simplified validation

        this.fieldEntities.forEach((entity) => {
            const { name, rules } = entity.props;
      
            const value = this.getFieldValue(name);
            let rule = rules[0];
      
            if (rule && rule.required && (value === undefined || value === "")) {
              err.push({ [name]: rule.message, value });
            }
          });
          
        return err;
    }

    submit = () => {
        console.log('submit');

        let err = this.validate();

        const {onFinish, onFinishFailed} = this.callbacks;
        if(err.length === 0) {
            // pass
            onFinish(this.getFieldsValue());
        } else {
            // fail
            onFinishFailed(err, this.getFieldsValue());
        }
    }

    getForm = () => {
        return {
            getFieldsValue: this.getFieldsValue,
            getFieldValue: this.getFieldValue,
            setFieldsValue: this.setFieldsValue,
            registerFieldEntities: this.registerFieldEntities,
            submit: this.submit,
            setCallbacks: this.setCallbacks,
        }
    }
}

const useForm = () => { 
    const formRef = useRef();
    if(!formRef.current) {
        const formStore = new FormStore();
        formRef.current = formStore.getForm();
    }

    return [formRef.current];
}

export default useForm;