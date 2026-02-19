"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient(
    {
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          // retry: false,
          staleTime: 6*60 * 60 * 1000, // 6 hours
          
        },
      },
    }
  ));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;