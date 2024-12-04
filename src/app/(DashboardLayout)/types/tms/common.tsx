export type TableListFieldType = {
  label: string;
  key: string;
  visible: boolean;
  type: string;
  actions?: string[];
  filter?: {
    isDefault: boolean;
    filterType: "string" | "number" | "date";
  };
  choices?: Record<string, string>[];
};
