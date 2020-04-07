import styled from 'styled-components';

import { colors, fontFamily } from './variables';

export const Input = styled.input`
  border: solid 1px ${colors.snow};
  border-radius: 4px;
  font-family: ${fontFamily};
  font-size: 16px;
  padding: 8px 12px;
  width: calc(100% - 24px);
  &:focus {
    outline: none;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${colors.gray};
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${colors.gray};
  }
  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${colors.gray};
  }
`;

export const InputLabel = styled.label`
  color: ${colors.darkGray};
  display: block;
  margin-bottom: 8px;
  user-select: none;
`;
