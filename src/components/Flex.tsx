import styled from 'styled-components';

type FlexProps = {
  center?: boolean;
};

export const Flex = styled.div<FlexProps>`
  align-items: ${({ center }): string => (center ? 'center' : 'flex-start')};
  display: flex;
`;

export const Grow = styled.div`
  flex-grow: 1;
`;
