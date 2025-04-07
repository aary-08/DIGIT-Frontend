export const MyCreateConfig = [
  {
    head: "Employee Basic Details",
    body: [
      {
        label: "Full Name",
        isMandatory: true,
        key: "fullName",
        type: "text",
        populators: {
          name: "fullName",
          error: "Only alphabets allowed (3-30 chars)",
          validation: {
            required: true,
            pattern: /^[A-Za-z\s]{3,30}$/,
          },
        },
      },
      {
        label: "Employee ID",
        isMandatory: true,
        key: "employeeId",
        type: "text",
        populators: {
          name: "employeeId",
          error: "Must be alphanumeric (6-12 chars)",
          validation: {
            required: true,
            pattern: /^[A-Za-z0-9]{6,12}$/,
          },
        },
      },
      {
        label: "Email",
        isMandatory: true,
        key: "email",
        type: "text",
        populators: {
          name: "email",
          error: "Invalid email format",
          validation: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          },
        },
      },
      {
        label: "Phone Number",
        isMandatory: true,
        key: "phone",
        type: "number",
        populators: {
          name: "phone",
          error: "Must be 10 digits",
          validation: {
            required: true,
            min: 1000000000,
            max: 9999999999,
          },
        },
      },
    ],
  },
  {
    head: "Employment Details",
    body: [
      {
        label: "Department",
        isMandatory: true,
        key: "department",
        type: "dropdown",
        populators: {
          name: "department",
          error: "Select department",
          // mdmsConfig: {
          //   masterName: "Department",
          //   moduleName: "common-masters"
          // },
          optionsKey: "name",
          options: [
            {
              code: "1",
              name: "Option1",
              //   icon: "Article",
            },
            {
              code: "2",
              name: "Option2",
              //   icon: "Article",
            },
            {
              code: "3",
              name: "Option3",
              //   icon: "Article",
            },
          ],
        },
      },
      {
        label: "Joining Date",
        isMandatory: true,
        key: "joiningDate",
        type: "date",
        populators: {
          name: "joiningDate",
          error: "Required",
          validation: { required: true },
        },
      },
      {
        label: "Salary (₹)",
        isMandatory: false,
        key: "salary",
        type: "number",
        populators: {
          name: "salary",
          error: "Must be positive",
          validation: { min: 0 },
        },
      },
    ],
  },
];
