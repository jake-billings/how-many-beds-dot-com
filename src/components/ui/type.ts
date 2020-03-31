import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { colors } from './variables';

export const Header1 = styled.h1`
  color: ${colors.black};
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -1.8px;
`;

export const Header3 = styled.h3`
  color: ${colors.black};
  font-size: 20px;
  font-weight: 500;
`;

export const Text = styled.p`
  color: ${colors.darkGray};
  font-size: 16px;
  line-height: 1.5;
`;

export const StyledNavLink = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
`;

export const StyledNavButton = styled.button`
  background: none;
  border: none;
  color: ${colors.white};
  cursor: pointer;
  font-size: 16px;
`;
