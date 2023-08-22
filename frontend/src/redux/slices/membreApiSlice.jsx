import { apiSlice } from "../apiSlice";
import { MEMBRE_URL } from "../constants";

const membreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: MEMBRE_URL + "/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: MEMBRE_URL,
        method: "POST",
        body: data,
      }),
    }),
    getMembres: builder.query({
      query: (data) => ({
        url: MEMBRE_URL,
      }),
    }),
  }),
});

export const { useGetMembresQuery, useLoginMutation, useRegisterMutation } =
  membreApiSlice;
