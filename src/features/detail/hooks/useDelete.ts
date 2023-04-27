import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "../../../data/queryKeys/keys";
import { HOME_PAGE } from "../../../data/routes/urls";
import user from "../../../lib/api/user";

export const useDelete = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      await user.delete(`/daily/${id}`);
    },
  });

  const deletePostHandler = (id: number) => {
    deletePost.mutate(id, {
      onSuccess: () => {
        navigate(HOME_PAGE);
        queryClient.invalidateQueries({
          queryKey: [keys.GET_BOARD],
        });
      },
    });
  };
  return { deletePostHandler };
};
