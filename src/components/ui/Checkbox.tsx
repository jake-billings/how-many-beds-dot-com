import React from 'react';
import styled from 'styled-components';
import { colors } from './variables';

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

type CheckboxProps = {
  checked: boolean;
};

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckbox = styled.div<CheckboxProps>`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: ${({ checked }): string => (checked ? colors.blue : colors.lightBlue)};
  border-radius: 3px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 3px ${colors.blue};
  }

  ${Icon} {
    visibility: ${({ checked }): string => (checked ? 'visible' : 'hidden')};
  }
`;

export default function Checkbox({ checked, onChange }: CheckboxProps & { onChange: () => void }): JSX.Element {
  return (
    <CheckboxContainer>
      <HiddenCheckbox checked={checked} onChange={onChange} />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );
}
