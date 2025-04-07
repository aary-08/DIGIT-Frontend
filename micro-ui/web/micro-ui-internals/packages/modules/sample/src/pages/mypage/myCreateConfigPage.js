import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposerV2, HeaderComponent, Toast } from "@egovernments/digit-ui-components";
import {MyCreateConfig} from "../../configs/myconfig/myCreateConfig";

const MyCreateConfigPage = () => {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(null);
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // API configuration
  const reqCreate = {
    url: `/egov-hrms/employees/_create`,
    config: { enable: true }
  };
  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  // Form submission handler
  const onSubmit = async (data) => {
    await mutation.mutate(
      {
        url: `/egov-hrms/employees/_create`,
        params: { tenantId },
        body: data, 
        config: { enable: true }
      },
      {
        onSuccess: () => setShowToast({ key: "success", label: "Employee created successfully!" }),
        onError: () => setShowToast({ key: "error", label: "Creation failed. Please try again." })
      }
    );
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <HeaderComponent>{t("CREATE_EMPLOYEE")}</HeaderComponent>
      
      <FormComposerV2
             label={t("SUBMIT_BUTTON")}
             config={MyCreateConfig.map((config) => ({
               ...config,
             }))}
             defaultValues={{}} 
             onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
               console.log(formData, "formData"); // Debug log when form values change
             }}
             onSubmit={(data) => onSubmit(data)} // Handle form submission
             fieldStyle={{ marginRight: 0 }}
           />
      {showToast && (
        <Toast
          label={showToast.label}
          type={showToast.key}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default MyCreateConfigPage;