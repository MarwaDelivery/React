import { useQuery } from "react-query";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import MainApi from "api-manage/MainApi";
import {
  specialCategoryListOneApi,
  specialCategoryListTwoApi,
  specialCategoryListThreeApi,
} from "api-manage/ApiRoutes";

const getSpecialCategoryListOne = async () => {
  const { data } = await MainApi.get(specialCategoryListOneApi);
  return data;
};

export function useGetSpecialCategoryListOne() {
  return useQuery("special-category-list-one", getSpecialCategoryListOne, {
    onError: onSingleErrorResponse,
  });
}

const getSpecialCategoryListTwo = async () => {
  const { data } = await MainApi.get(specialCategoryListTwoApi);
  return data;
};

export function useGetSpecialCategoryListTwo() {
  return useQuery("special-category-list-two", getSpecialCategoryListTwo, {
    onError: onSingleErrorResponse,
  });
}

const getSpecialCategoryListThree = async () => {
  const { data } = await MainApi.get(specialCategoryListThreeApi);
  return data;
};

export function useGetSpecialCategoryListThree() {
  return useQuery("special-category-list-three", getSpecialCategoryListThree, {
    onError: onSingleErrorResponse,
  });
}
