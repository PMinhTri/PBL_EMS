import { RcFile } from "antd/es/upload/interface";
import * as XLSX from "xlsx";
import * as XLSXStyle from "xlsx-js-style";
import { CreateNewUserInformation } from "../types/userTypes";

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const processExcelFile = (file: File) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    // Assuming the first sheet in the Excel file is the one you want to process
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON format
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    }) as string[][];

    const values: CreateNewUserInformation[] = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row: string[] = jsonData[i];
      let col = 1;
      values.push({
        fullName: row[col++],
        gender: row[col++],
        email: row[col++],
        status: row[col++],
        roleId: row[col++],
      });
    }

    return values;
  };

  reader.readAsArrayBuffer(file);
};

export const exportExcelForTimeSheet = (
  data: {
    fullName: string;
    days: (string | number | undefined)[];
    totalWorkload: number | undefined;
    totalLeaveDays: number;
    totalOvertime: number | undefined;
  }[],
  nameSheet: string,
  nameFile: string
) => {
  const days = data.map((d) => d.days);
  const workbook = XLSXStyle.utils.book_new();
  const worksheet = XLSXStyle.utils.json_to_sheet(data);

  XLSXStyle.utils.book_append_sheet(workbook, worksheet, nameSheet);
  XLSXStyle.writeFile(workbook, `${nameFile}.xlsx`);
};
