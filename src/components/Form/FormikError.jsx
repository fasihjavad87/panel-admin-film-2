import React from 'react';

const FormikError = ({children}) => {
    return (
        <small className='block text-danger mb-4 error_message'>{children}</small>
    );
}

export default FormikError;