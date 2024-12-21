/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { InputController } from './form.control/InputController';
import { DateController } from './form.control/DateController';
import { SelectController } from './form.control/SelectController';
import { SwitchButton } from './form.control/SwitchButton';

const DynamicFormComponent = ({ formFields }: { formFields: object }) => {

  const renderField = (key: React.Key | null, field:any) => {
    switch (field.type) {
      case 'String':
      case 'Number':
        return (
          !field.hidden &&
          <React.Fragment key={key}>
            <InputController name={`${key}`} label={field.label} type={field.type} />
          </React.Fragment>
        );
      case 'Date':
        return (
          !field.hidden &&
          <React.Fragment key={key}>
            <DateController name={`${key}`} label={field.label} />
          </React.Fragment>
        );
      case 'Select':
        return (
          !field.hidden &&
          <React.Fragment key={key}>
            <SelectController name={`${key}`} label={field.label} options={field.options} />
          </React.Fragment>
        );
      case 'Boolean':
        return (
          !field.hidden &&
          <React.Fragment key={key}>
            <SwitchButton name={`${key}`} label={field.label} />
          </React.Fragment>
        );
      case 'Object':
        return (
          <React.Fragment key={key}>
            <h3>{field.label}</h3>
            {Object.entries(field.fields).map(([nestedKey, nestedField]) =>
              renderField(`${key}.${nestedKey}`, nestedField)
            )}
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return formFields && Object.entries(formFields).map(([key, field]) => renderField(key, field))
};
export default DynamicFormComponent;