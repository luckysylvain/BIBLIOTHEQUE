import { apiSlice } from "../apiSlice";
import { LIVRE_URL } from "../constants";

const livreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLivres: builder.query({
      query: () => ({
        url: LIVRE_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    createLivre: builder.mutation({
      query: (data) => ({
        url: LIVRE_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteLivre: builder.mutation({
      query: (id) => ({
        url: LIVRE_URL + "/" + id,
        method: "DELETE",
      }),
    }),
    updateLivre: builder.mutation({
      query: (data) => ({
        url: LIVRE_URL + "/" + data.id,
        method: "PUT",
        body: data,
      }),
    }),
    getLivreById: builder.query({
      query: (id) => ({
        url: LIVRE_URL + "/" + id,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetLivresQuery,
  useCreateLivreMutation,
  useDeleteLivreMutation,
  useUpdateLivreMutation,
  useGetLivreByIdQuery
} = livreApiSlice;
