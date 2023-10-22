import styled from "@emotion/styled";
import { useEffect } from "react";
import { tokens } from "~shared/theme/tokens";
import { useCommandPalette } from "./hooks";
import { BaseSearchInput } from "../form/input";

export const Container = styled.div(() => ({
  padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
}))

export const CommandPaletteSearch = (
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    defaultPlaceholder?: string;
  }
) => {
  const {query} = useCommandPalette();

  const disableUpDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  }

  useEffect(() => {
    query.setSearch("");
    return () => query.setSearch("");
  }, []);

  const { defaultPlaceholder, ...rest } = props;

  return (
    <Container>
      <BaseSearchInput
        {...rest}
        autoFocus
        autoComplete="off"
        role="combobox"
        spellCheck="false"
        onChange={(event) => {
          props.onChange?.(event);
          query.setSearch(event.target.value);
        }}
        placeholder={defaultPlaceholder}
        onKeyDown={disableUpDown} 
        onKeyUp={disableUpDown}
      />
    </Container>
  )
}