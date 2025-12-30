import { useState } from 'react';

type useListQueryStatesProps = {
  page?: number;
  perPage?: number;
  query?: string;
};

function useListQueryStates(props?: useListQueryStatesProps) {
  const [page, setPage] = useState<number>(props?.page || 1);
  const [perPage, setPerPage] = useState<number>(props?.perPage || 10);
  const [query, setQuery] = useState(props?.query ?? '');

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    query,
    setQuery,
  };
}

export default useListQueryStates;
