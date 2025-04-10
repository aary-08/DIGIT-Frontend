function beautifyLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/[_\-]/g, " ") // Replace underscores or hyphens with space
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

function GenerateFormConfig(schema, parentLabel = "") {
  if (!schema || typeof schema !== "object" || !schema.properties) {
    console.error("Invalid schema provided");
    return [];
  }

  const fields = Object.entries(schema.properties);
  const sections = [];

  for (const [fieldName, fieldConfig] of fields) {
    if (fieldName === "config") continue; // Skip unwanted field

    const isRequired = schema.required?.includes(fieldName) || false;

    // 🔁 Handle nested object (grouped into its own section)
    if (fieldConfig.type === "object" && fieldConfig.properties) {
      const nestedFields = GenerateFormConfig(fieldConfig, fieldName);
      console.log(nestedFields, "nestedFields");
      sections.push({
        head: beautifyLabel(fieldName),
        body: nestedFields.flatMap((s) => s.body),
      });
      console.log(sections, "sections");
      continue;
    }

    // 🏷️ Custom label logic
    let customLabel = fieldName;
    if (parentLabel === "pictureUpload" && fieldName === "type") {
      customLabel = "Document Type";
    } else {
      customLabel = beautifyLabel(fieldName);
    }

    const fullKey = parentLabel ? `${parentLabel}.${fieldName}` : fieldName;

    const field = {
      label: fieldConfig.title || customLabel,
      isMandatory: isRequired,
      key: fullKey,
      type: inferFieldType(fieldConfig),
      populators: {
        name: fullKey,
        error: `Please enter ${customLabel}`,
        required: isRequired,
        validation: {},
      },
    };

    // ✅ Add validation rules
    if (fieldConfig.minLength !== undefined) {
      field.populators.validation.minlength = fieldConfig.minLength;
      field.populators.error = `Minimum length for ${customLabel} is ${fieldConfig.minLength}`;
    }
    if (fieldConfig.maxLength !== undefined) {
      field.populators.validation.maxlength = fieldConfig.maxLength;
      field.populators.error = `Maximum length for ${customLabel} is ${fieldConfig.maxLength}`;
    }
    if (fieldConfig.pattern !== undefined) {
      field.populators.validation.pattern = fieldConfig.pattern;
      field.populators.error = `Invalid format for ${customLabel}`;
    }
    if (fieldConfig.minItems !== undefined) {
      field.populators.validation.minItems = fieldConfig.minItems;
    }
    if (fieldConfig.maximum !== undefined) {
      field.populators.validation.max = fieldConfig.maximum;
      field.populators.error = `${customLabel} must be less than or equal to ${fieldConfig.maximum}`;
    }
    if (fieldConfig.minimum !== undefined) {
      field.populators.validation.min = fieldConfig.minimum;
      field.populators.error = `${customLabel} must be greater than or equal to ${fieldConfig.minimum}`;
    }
    if (fieldName === "citizenMobileNumber") {
      field.populators.validation.pattern = /^[0-9]{10}$/;
      field.populators.error = "Please enter a valid 10-digit mobile number";
    }

    // 📁 Group field under appropriate section
    const headTitle = parentLabel ? beautifyLabel(parentLabel) : "";
    let section = sections.find((sec) => sec.head === headTitle);
    if (!section) {
      section = { head: headTitle, body: [] };
      sections.push(section);
    }

    // 🔽 Handle enums (dropdowns)
    if (Array.isArray(fieldConfig.enum)) {
      const validEnum = fieldConfig.enum.filter((val) => typeof val === "string");
      field.populators.options = validEnum.map((val) => ({
        name: beautifyLabel(val),
        code: val,
      }));

      field.populators.type = "dropdown";
    }

    section.body.push(field);
  }

  return sections;
}

function inferFieldType(fieldConfig) {
  if (
    fieldConfig.type === "array" &&
    fieldConfig.items?.type === "object" &&
    fieldConfig.items.properties?.code &&
    fieldConfig.items.properties?.name
  ) {
    return "dropdown";
  }

  if (fieldConfig.enum) {
    return "dropdown";
  }

  if (fieldConfig.type === "number" || fieldConfig.type === "integer") {
    return "number";
  }

  if (fieldConfig.type === "boolean") {
    return "checkbox";
  }

  return "text";
}

export default GenerateFormConfig;
