import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export default function SelectComponent({ readonly, options, userData, onChange }) {
  // const { readonly, options, userData } = props;


  const formattedOptions = [];
  const defaultValues = [];
  if (options?.length > 0) {

    options.forEach((option) => {
      formattedOptions.push({
        id: option.id,
        value: option.name,
        label: option.label
      })
    })


    formattedOptions.forEach((option) => {
      userData.forEach((data) => {
        if (data.name === option.value) {
          defaultValues.push(option)
        }
      })
    })
  }

  return (
    <Select
      isDisabled={readonly}
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={defaultValues || []}
      isMulti
      options={formattedOptions || []}
      onChange={(e) => onChange(e)}
    />
  );
}
