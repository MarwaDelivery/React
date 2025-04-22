import { getCurrentModuleType } from "./getCurrentModuleType";

export const getCartListModuleWise = (cartList) => {
  console.log(getCurrentModuleType(), "cartList");
  let newArray = [];
  if (cartList && cartList?.length > 0) {
    cartList?.forEach(
      (cart) =>
        cart?.module?.module_type === getCurrentModuleType() &&
        newArray.push(cart)
    );
    return newArray;
  } else {
    return newArray;
  }
};
