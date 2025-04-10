function GenerateFormConfig(schema, parentKey = "") {
  if (!schema || typeof schema !== "object" || !schema.properties) {
    console.error("Invalid schema provided");
    return [];
  }

  const fields = Object.entries(schema.properties);
  const formConfigMap = new Map(); // key: head, value: array of fields

  fields.forEach(([fieldName, fieldConfig]) => {
    const isRequired = schema.required?.includes(fieldName) || false;

    // Handle nested object fields
    if (fieldConfig.type === "object" && fieldConfig.properties) {
      // Skip unwanted fields
      if (fieldName === "config") return;

      const nestedFields = GenerateFormConfig(fieldConfig, fieldName);
      nestedFields.forEach((section) => {
        formConfigMap.set(
          section.head,
          (formConfigMap.get(section.head) || []).concat(section.body)
        );
      });

      return;
    }

    // Construct individual field config
    const field = {
      label: fieldConfig.title || fieldName,
      isMandatory: isRequired,
      key: parentKey ? `${parentKey}.${fieldName}` : fieldName,
      type: "text", // default
      populators: {
        name: parentKey ? `${parentKey}.${fieldName}` : fieldName,
        error: `Please enter ${fieldName}`,
        required: isRequired,
      },
      validators: {},
    };

    // Field type inference
    if (fieldConfig.type === "number" || fieldConfig.type === "integer") {
      field.type = "number";
    } else if (fieldConfig.type === "boolean") {
      field.type = "checkbox";
    }

    if (
      fieldConfig.type === "array" &&
      fieldConfig.items?.type === "object" &&
      fieldConfig.items.properties?.code &&
      fieldConfig.items.properties?.name
    ) {
      field.type = "dropdown";
      field.populators.type = "dropdown";
      field.populators.optionsKey = "name";
      field.populators.optionsValue = "code";
      field.populators.options = [];
    }

    if (fieldConfig.enum) {
      field.type = "dropdown";
      field.populators.type = "dropdown";
      field.populators.optionsKey = "name";
      field.populators.options = [];
    }

    // Validators
    if (fieldConfig.minLength !== undefined) field.validators.minLength = fieldConfig.minLength;
    if (fieldConfig.maxLength !== undefined) field.validators.maxLength = fieldConfig.maxLength;
    if (fieldConfig.pattern !== undefined) field.validators.pattern = fieldConfig.pattern;
    if (fieldConfig.minItems !== undefined) field.validators.minItems = fieldConfig.minItems;
    if (fieldConfig.maximum !== undefined) field.validators.maximum = fieldConfig.maximum;
    if (fieldConfig.minimum !== undefined) field.validators.minimum = fieldConfig.minimum;

    // Assign to correct group (head)
    const head = parentKey ? parentKey : "";
    formConfigMap.set(head, (formConfigMap.get(head) || []).concat(field));
  });

  // Convert Map to Array
  const formConfig = [];
  for (const [head, body] of formConfigMap.entries()) {
    formConfig.push({ head, body });
  }

  return formConfig;
}
