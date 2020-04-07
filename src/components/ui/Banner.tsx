import React from 'react';
import styled from 'styled-components';
import { colors } from './variables';

const StyledBanner = styled.div`
  background-color: ${colors.red};
  color: ${colors.white};
  line-height: 1.25;
  padding: 16px 0;
  text-align: center;
  z-index: -1;
`;

const StyledBannerInner = styled.div`
  margin: 0 auto;
  width: 90%;
`;

export default function Banner(): JSX.Element {
  return (
    <StyledBanner>
      <StyledBannerInner>
        If you have symptoms of COVID-19, start by calling your primary doctor. If your doctor thinks you need hospital
        evaluation, estimates of bed availability and instructions for accessing care are below.
      </StyledBannerInner>
    </StyledBanner>
  );
}
