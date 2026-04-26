export const APP_NAME = "CISM Admin";
export const APP_DESCRIPTION = "CISM Admin";

export const VALUES = {
  DASHBOARD: "dashboard",
  MANAGE_STALLS: "manage-stalls",
  STALL_OVERVIEW: "stall-overview",
} as const;

export const API_ENDPOINTS = {
  CREATE_STALL: "/api/admin/create-stall",
  GET_STALLS: "/api/admin/get-stalls",
  GET_STALL: "/api/admin/get-stall",
  UPDATE_STALL: "/api/admin/update-stall",
  DELETE_STALL: "/api/admin/delete-stall",
  CREATE_MEAL: "/api/admin/create-meal",
  GET_MEALS: "/api/admin/get-meals",
  GET_MEAL: "/api/admin/get-meal",
  UPDATE_MEAL: "/api/admin/update-meal",
  DELETE_MEAL: "/api/admin/delete-meal",
  CREATE_DRINK: "/api/admin/create-drink",
  GET_DRINKS: "/api/admin/get-drinks",
  GET_DRINK: "/api/admin/get-drink",
  UPDATE_DRINK: "/api/admin/update-drink",
  DELETE_DRINK: "/api/admin/delete-drink",
  CREATE_SNACK: "/api/admin/create-snack",
  GET_SNACKS: "/api/admin/get-snacks",
  GET_SNACK: "/api/admin/get-snack",
  UPDATE_SNACK: "/api/admin/update-snack",
  DELETE_SNACK: "/api/admin/delete-snack",
  CREATE_INCOME: "/api/admin/create-income",
  GET_INCOMES: "/api/admin/get-incomes",
  GET_INCOME: "/api/admin/get-income",
  UPDATE_INCOME: "/api/admin/update-income",
  DELETE_INCOME: "/api/admin/delete-income",
} as const;
