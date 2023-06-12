export const moneyFormat = (money: number) => {
  return `${money.toLocaleString("vn-VN", {
    style: "currency",
    currency: "VND",
  })}`;
};
