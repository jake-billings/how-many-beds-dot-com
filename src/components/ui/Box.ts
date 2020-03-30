import styled from 'styled-components';

const spacingUnit = 8;

function s(v: number): number {
  return v * spacingUnit;
}

type BoxProps = {
  ma?: number;
  mv?: number;
  mh?: number;
  ml?: number;
  mr?: number;
  mt?: number;
  mb?: number;
  pa?: number;
  pv?: number;
  ph?: number;
  pl?: number;
  pr?: number;
  pt?: number;
  pb?: number;
};

export default styled.div<BoxProps>`
  margin: ${({ ma, mv, mh, ml, mr, mt, mb }) =>
    `${s(mt || mv || ma || 0)}px 
    ${s(mr || mh || ma || 0)}px 
    ${s(mb || mv || ma || 0)}px 
    ${s(ml || mh || ma || 0)}px`};
  padding: ${({ pa, pv, ph, pl, pr, pt, pb }) =>
    `${s(pt || pv || pa || 0)}px 
    ${s(pr || ph || pa || 0)}px 
    ${s(pb || pv || pa || 0)}px 
    ${s(pl || ph || pa || 0)}px`};
`;
