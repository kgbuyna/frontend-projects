"use client";

import PageContainer from "@/app/components/container/PageContainer";
// import TableBf from "@/app/components/backoffice/table";
import { TableListFieldType } from "../../types/tms/common";

const MerchantLocationListFields: TableListFieldType[] = [
  { label: "Салбарын нэр", key: "name", type: "text" },
  { label: "Цахим шуудан", key: "email", type: "text" },
  { label: "Дансны дугаар", key: "account_no", type: "text" },
  { label: "Аймаг, нийслэл", key: "city", type: "text" },
  { label: "Сум, дүүрэг", key: "district", type: "text" },
  { label: "Банкны хариуцсан ажилтан", key: "bank_employee", type: "text" },
  { label: "Support Group", key: "support_group", type: "text" },
  { label: "Төлөв", key: "status", type: "text" },
  { label: "Агент код", key: "bank_agent_code", type: "text" },
  { label: "Цаасны цэг эсэх", key: "is_paper_location", type: "text" },
  {
    label: "Хяналт",
    key: "actions",
    type: "actions",
    actions: ["edit", "detail", "delete"]
  }
];

const MerchantLocation = () => {
  return (
    <PageContainer>
      {/* <TableBf
        fields={MerchantLocationListFields}
        url="/tms/merchant_location/list/"
      /> */}
    </PageContainer>
  );
};

export default MerchantLocation;
