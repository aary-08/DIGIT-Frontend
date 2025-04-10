import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormComposerV2, HeaderComponent, Toast } from "@egovernments/digit-ui-components";
import { ApplyConfig } from "../../configs/myconfig/ApplyConfig";
import { TransformApplyConfigCreateData } from "../../utils/createUtils";
import schema from "../../schema/schema.json";
import GenerateFormConfig from "../../utils/ConfigGenerator";
import complaintTypes from "../../schema/ct";

const ApplyConfigPage = () => {
  const { t } = useTranslation();

  const [showToast, setShowToast] = useState(null);
  const [formResetKey, setFormResetKey] = useState(Date.now()); // 👈 Key to trigger rerender/reset
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const applyConfig = GenerateFormConfig(schema);
  applyConfig.forEach((section) => {
    section.body.forEach((field) => {
      if (field.key === "complaintType") {
        field.populators.options = complaintTypes.map((item) => ({
          name: item.name,
          code: item.code,
        }));
        field.populators.optionsKey = "name";
      }

      if (field.key === "pictureUpload.type") {
        field.populators.options = [{ name: "Document Upload", code: "documentUpload" }];
        field.populators.optionsKey = "name";
      }
    });
  });

  const reqCreate = {
    url: `/egov-mdms-service/v2/_create/Assignment.PGRAPPLY`,
    params: {},
    body: {},
    config: {
      enable: true,
    },
  };

  const mutation = Digit.Hooks.useCustomAPIMutationHook(reqCreate);

  const onSubmit = async (data) => {
    console.log(data, "data");
    await mutation.mutate(
      {
        url: `/egov-mdms-service/v2/_create/Assignment.PGRAPPLY`,
        params: { tenantId },
        body: TransformApplyConfigCreateData(data),
        config: {
          enable: true,
        },
      },
      {
        onSuccess: () => {
          setShowToast({ key: "success", label: "Individual Created Successfully" });
          setFormResetKey(Date.now()); // 🔁 Triggers rerender of form with fresh state
        },
        onError: () => {
          setShowToast({ key: "error", label: "Individual Creation Failed" });
        },
      }
    );
  };

  return (
    <div>
      <HeaderComponent className="digit-inbox-search-composer-header" styles={{ marginBottom: "1.5rem" }}>
        {t("New_Registration")}
      </HeaderComponent>

      <FormComposerV2
        key={formResetKey} // 👈 Reset form when key changes
        label={t("Submit Complaint")}
        config={applyConfig.map((section) => ({
          head: section.head,
          body: section.body.filter((field) => field.key !== "config"),
        }))}
        defaultValues={{
          "pictureUpload.type": "photo",
        }}
        onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {
          console.log(formData, "formData");
        }}
        onSubmit={(data) => onSubmit(data)}
        fieldStyle={{ marginRight: 0 }}
      />

      {showToast && (
        <Toast
          style={{ zIndex: 10001 }}
          label={showToast.label}
          type={showToast.key}
          error={showToast.key === "error"}
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
};

export default ApplyConfigPage;
