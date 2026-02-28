export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

// user routes
export const USER_DASHBOARD = "/my-account";
export const USER_PROFILE = "/profile";
export const USER_ORDERS = "/orders";

export const WEBSITE_SHOP = "/shop";

export const WEBSITE_PRODUCT_DETAILS = (slug) =>
  slug ? `/product/${slug}` : "/product";

export const WEBSITE_CART = "/cart";
export const WEBSITE_CHECKOUT = "/checkout";

export const WEBSITE_POLICY = "/policy";
export const WEBSITE_CONDITION = "/condition";
export const WEBSITE_ABOUT = "/about";

export const WEBSITE_ORDER_DETAILS = (order_id) => `/order-details/${order_id}`;