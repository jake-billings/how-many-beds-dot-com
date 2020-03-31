import styled from 'styled-components';
import { colors, fontFamily } from './variables';

export default styled.button`
  background-color: ${colors.blue};
  border: none;
  border-radius: 4px;
  color: ${colors.white};
  cursor: pointer;
  font-family: ${fontFamily};
  font-size: 16px;
  font-weight: 500;
  padding: 8px 12px;
  :disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
