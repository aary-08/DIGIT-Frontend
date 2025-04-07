import { HRIcon, EmployeeModuleCard, AttendanceIcon, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const SampleCardAaryan = () => {
 
  const { t } = useTranslation();

  const propsForModuleCard = {
    Icon: "BeenHere",
    moduleName: t("Sample"),
    kpis: [

    ],
    links: [
   
     
        {
            label: t("Create by Aaryan"),
            link: `/${window?.contextPath}/employee/sample/aaryan_create`,
          },
          {
            label: t("Search by Aaryan"),
            link: `/${window?.contextPath}/employee/sample/aaryan_search`,
          },
          {
            label: t("View by Aaryan"),
            link: `/${window?.contextPath}/employee/sample/aaryan_view`,
          },
          
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default SampleCardAaryan;