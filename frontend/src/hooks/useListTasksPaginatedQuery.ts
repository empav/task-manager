import { useQuery } from "@tanstack/react-query";

import { listTasksPaginated } from "../api/tasks";
import type {
  PaginatedTaskListRequest,
  PaginatedTaskListResponse,
} from "../types";

export function useListTasksPaginatedQuery(params: PaginatedTaskListRequest) {
  return useQuery({
    queryKey: ["tasks", params.page, params.pageSize],
    queryFn: () =>
      listTasksPaginated(params) as Promise<PaginatedTaskListResponse>,
  });
}
