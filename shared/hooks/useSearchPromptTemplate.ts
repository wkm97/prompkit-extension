import { useEffect, useState } from "react";
import { IDBPrompkitAPI } from "~shared/indexeddb/prompkit";
import type { IDBPromptTemplate } from "~shared/models/prompt-template";

interface UseSearchPromptTemplateProps {
  query: string
  onQueryChange: () => void
}

export const useSearchPromptTemplate = ({query, onQueryChange}: UseSearchPromptTemplateProps) => {
  const [results, setResults] = useState<IDBPromptTemplate[]>([]);


  const refetchPrompts = async () => {
    const results = await IDBPrompkitAPI.searchPromptTemplate(query)
    setResults(results)
  }

  useEffect(()=>{
    refetchPrompts().then(()=> onQueryChange());
  }, [query])

  const mutate = (action: ()=> void) => {
    action();
    refetchPrompts()
  }

  return {results, mutate}
}