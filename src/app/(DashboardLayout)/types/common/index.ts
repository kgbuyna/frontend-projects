export type Entry = {
  key: string;
  value: string;
  fullWidth?: boolean;
};

export type DetailFields = {
  subTitle?: string;
  fields: Entry[];
};

export type DictProps = {
  label: string;
  value: string | boolean;
};
