import styled from 'styled-components';

type FlexProps = {
  center?: boolean;
  column?: boolean;
  space?: boolean;
};

export const Flex = styled.div<FlexProps>`
  align-items: ${({ center }): string => (center ? 'center' : 'flex-start')};
  display: flex;
  flex-direction: ${({ column }): string => (column ? 'column' : 'row')};
  justify-content: ${({ space }): string => (space ? 'space-between' : 'flex-start')};
`;

export const Grow = styled.div`
  flex-grow: 1;
`;
