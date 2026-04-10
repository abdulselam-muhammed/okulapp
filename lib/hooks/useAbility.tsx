"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createContextualCan } from "@casl/react";
import { defineAbilityFor, type AppAbility } from "@/lib/helpers/ability";
import { useAuthStore } from "@/lib/stores";

const AbilityContext = createContext<AppAbility>(defineAbilityFor(null));

export const Can = createContextualCan(AbilityContext.Consumer);

export function AbilityProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);

  const ability = useMemo(() => {
    return defineAbilityFor(user?.role ?? null);
  }, [user?.role]);

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>;
}

export function useAbility(): AppAbility {
  return useContext(AbilityContext);
}
