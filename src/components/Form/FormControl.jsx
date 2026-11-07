import React from 'react';
import Input from './Input';

const FormControl = (props) => {
    switch (props.control) {
        case 'input':
            return <Input />
        case 'select':
            return <Select/>
        case 'switch':
            return <Switch/>
        case 'textarea':
            return <Textarea/>
        case 'checkbox':
            return <CheckBox/>
        case 'file':
            return <File/>
        case 'multiSelect':
            return <MultiSelect/>
    
        default:
           return null
    }
}

export default FormControl;
