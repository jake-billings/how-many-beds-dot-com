import React from 'react'
import styled from 'styled-components'
import { colors } from './variables'


const StyledBanner = styled.div`
  background-color: ${colors.red};
  text-align: center;
  height: 50px;
  z-index: -1;
`;


type BannerProps = {}
const Banner: React.SFC<BannerProps> = ({}) => (
    <StyledBanner>
        If you have symptoms of COVID-19, start by calling your primary doctor. If Your doctor thinks you need hospital evaluation, estimates of bed availability and instructions for accessing care are below.
    </StyledBanner>
);


export default Banner;
